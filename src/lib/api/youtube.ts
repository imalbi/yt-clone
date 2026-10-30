import type { z } from 'zod';
import { parseIsoDuration } from '#lib/scripts/scripts.js';
import type { Video } from '#lib/types/video.js';
import type { Channel } from '#lib/types/channel.js';
import type { CommentThread } from '#lib/types/commentThread.js';
import type { VideoCategory } from '#lib/types/category.js';
import type { Playlist } from '#lib/types/playlist.js';
import { defaultChannelOrder, type ChannelOrder } from '#lib/types/channelOrder.js';
import { defaultSearchFilters, type SearchFilters } from '#lib/types/searchFilters.js';
import {
	channelIdSchema,
	channelItemSchema,
	commentThreadItemSchema,
	errorBodySchema,
	listEnvelopeSchema,
	playlistItemSchema,
	playlistSchema,
	ratingItemSchema,
	searchItemSchema,
	subscriptionIdSchema,
	subscriptionItemSchema,
	videoCategoryItemSchema,
	videoItemSchema,
	type ApiChannelItem,
	type ApiComment,
	type ApiPlaylist,
	type ApiVideoItem
} from '#lib/types/youtube-api.js';

import { YOUTUBE_API_KEY } from '$app/env/private';

const BASE_URL = 'https://www.googleapis.com/youtube/v3';

/**
 * Errore di rete o di API. `reason` e' il motivo che Google scrive nel corpo:
 * un 403 puo' essere `quotaExceeded` come `commentsDisabled`, e lo stato da solo
 * non li distingue.
 */
export class YouTubeApiError extends Error {
	constructor(
		message: string,
		readonly status: number,
		readonly reason?: string
	) {
		super(message);
		this.name = 'YouTubeApiError';
	}
}

/**
 * Lo stato HTTP con cui riferire un errore di Google. Un rifiuto 4xx si inoltra
 * com'e': modificare il commento di un altro risponde 403, e presentarlo come
 * 502 farebbe sembrare rotto il server. Solo i 5xx e gli errori sconosciuti
 * diventano 502.
 */
export function upstreamStatus(cause: unknown): number {
	return cause instanceof YouTubeApiError && cause.status < 500 ? cause.status : 502;
}

// --- Cache -----------------------------------------------------------------

const TTL_MS = 5 * 60 * 1000;
const MAX_ENTRIES = 200;

/**
 * La quota giornaliera e' 10.000 unita' e una sola visita alla home ne consuma
 * gia' diverse. Senza questa cache un pomeriggio di ricariche esaurisce la
 * giornata, e la pagina che l'utente vede a quel punto e' quella di errore.
 *
 * ponytail: Map in-process con TTL fisso. Su piu' istanze ognuna ha la sua
 * copia; se un giorno servisse coerenza fra istanze, qui va un Redis.
 */
const cache = new Map<string, { at: number; data: unknown }>();

function readCache(key: string): unknown {
	const hit = cache.get(key);
	if (!hit) return undefined;
	if (Date.now() - hit.at > TTL_MS) {
		cache.delete(key);
		return undefined;
	}
	return hit.data;
}

function writeCache(key: string, data: unknown) {
	// Il primo elemento di una Map e' il piu' vecchio inserito: basta quello
	// per tenere la dimensione sotto controllo senza una LRU vera.
	if (cache.size >= MAX_ENTRIES) {
		const oldest = cache.keys().next().value;
		if (oldest !== undefined) cache.delete(oldest);
	}
	cache.set(key, { at: Date.now(), data });
}

// --- Fetch e validazione ---------------------------------------------------

function endpointOf(path: string) {
	return path.split('?')[0];
}

async function fail(response: Response, path: string): Promise<never> {
	// Il corpo di errore di Google contiene il motivo, mai la richiesta:
	// nessun rischio di registrare la chiave.
	const body = await response.text().catch(() => '');
	throw new YouTubeApiError(
		`Richiesta a ${endpointOf(path)} fallita (${response.status}) ${body.slice(0, 200)}`,
		response.status,
		reasonOf(body)
	);
}

/** Il messaggio sta troncato a 200 caratteri: il motivo va letto dal corpo intero. */
function reasonOf(body: string): string | undefined {
	try {
		return errorBodySchema.parse(JSON.parse(body)).error.errors[0]?.reason;
	} catch {
		return undefined;
	}
}

type ParsedList<T> = { items: T[]; nextPageToken?: string; prevPageToken?: string };

/**
 * Valida la risposta contro lo schema dell'endpoint.
 *
 * Gli elementi sono validati uno per uno e quelli malformati vengono scartati:
 * in un feed di venti video, uno con un campo mancante non deve far sparire gli
 * altri diciannove. Se pero' cadono tutti, non e' un elemento difettoso ma lo
 * schema che non combacia piu', e quello va fatto emergere invece di
 * restituire una lista vuota che sembra "nessun risultato".
 */
function parseList<T>(raw: unknown, itemSchema: z.ZodType<T>, path: string): ParsedList<T> {
	const envelope = listEnvelopeSchema.safeParse(raw);
	if (!envelope.success) {
		throw new YouTubeApiError(`Risposta inattesa da ${endpointOf(path)}`, 502);
	}

	const rawItems = envelope.data.items ?? [];
	const items: T[] = [];
	for (const item of rawItems) {
		const parsed = itemSchema.safeParse(item);
		if (parsed.success) items.push(parsed.data);
	}

	const dropped = rawItems.length - items.length;
	if (dropped > 0 && items.length === 0) {
		throw new YouTubeApiError(
			`Schema non combaciante per ${endpointOf(path)}: scartati tutti i ${dropped} elementi`,
			502
		);
	}
	if (dropped > 0) {
		console.warn(`${endpointOf(path)}: ${dropped} elementi scartati dalla validazione`);
	}

	return {
		items,
		nextPageToken: envelope.data.nextPageToken,
		prevPageToken: envelope.data.prevPageToken
	};
}

function requireKey() {
	if (!YOUTUBE_API_KEY) {
		throw new YouTubeApiError('YOUTUBE_API_KEY non configurata', 500);
	}
	return YOUTUBE_API_KEY;
}

/** Chiamata pubblica, autenticata dalla API key. Cacheabile: uguale per tutti. */
async function getPublic<T>(
	path: string,
	itemSchema: z.ZodType<T>,
	cacheable = true
): Promise<ParsedList<T>> {
	// La chiave non entra nella cache key: e' costante e non deve finire in memoria.
	const cached = cacheable ? readCache(path) : undefined;
	if (cached !== undefined) return parseList(cached, itemSchema, path);

	const response = await fetch(`${BASE_URL}${path}&key=${requireKey()}`);
	if (!response.ok) await fail(response, path);

	const raw = await response.json();
	const parsed = parseList(raw, itemSchema, path);
	if (cacheable) writeCache(path, raw);
	return parsed;
}

/** Chiamata per conto di un utente. Mai cacheata: la risposta e' personale. */
async function getAuthed<T>(
	path: string,
	accessToken: string,
	itemSchema: z.ZodType<T>
): Promise<ParsedList<T>> {
	const response = await fetch(`${BASE_URL}${path}`, {
		headers: { Authorization: `Bearer ${accessToken}` }
	});
	if (!response.ok) await fail(response, path);
	return parseList(await response.json(), itemSchema, path);
}

async function sendAuthed(
	path: string,
	accessToken: string,
	init: { method: string; body?: string }
): Promise<Response> {
	const response = await fetch(`${BASE_URL}${path}`, {
		method: init.method,
		headers: {
			Authorization: `Bearer ${accessToken}`,
			...(init.body ? { 'Content-Type': 'application/json' } : {})
		},
		body: init.body
	});
	if (!response.ok) await fail(response, path);
	return response;
}

// --- Mapper ----------------------------------------------------------------

/**
 * Questa traduzione esisteva in quattro copie identiche, una per ogni funzione
 * che restituisce video. Ora e' una sola: un campo che cambia si corregge qui.
 */
function toVideo(item: ApiVideoItem, channel?: Channel): Video {
	const { snippet, statistics } = item;
	return {
		id: item.id,
		title: snippet.title,
		desc: snippet.description,
		thumbnails: {
			default: snippet.thumbnails.default?.url ?? '',
			medium: snippet.thumbnails.medium?.url ?? '',
			high: snippet.thumbnails.high?.url ?? '',
			standard: snippet.thumbnails.standard?.url,
			maxres: snippet.thumbnails.maxres?.url
		},
		publishedAt: snippet.publishedAt,
		channelId: snippet.channelId,
		channelTitle: snippet.channelTitle,
		channelSubscriberCount: channel?.statistics.subscriberCount,
		channelSubscriberCountHidden: channel?.statistics.hiddenSubscriberCount,
		avatarUrl: channel?.thumbnails.default?.url ?? '',
		durationSeconds: parseIsoDuration(item.contentDetails?.duration),
		statistics: {
			viewCount: statistics?.viewCount ?? '0',
			likeCount: statistics?.likeCount ?? '0',
			commentCount: statistics?.commentCount ?? '0',
			favoriteCount: statistics?.favoriteCount ?? '0'
		}
	};
}

function toChannel(item: ApiChannelItem): Channel {
	return {
		id: item.id,
		title: item.snippet.title,
		description: item.snippet.description,
		customUrl: item.snippet.customUrl ?? '',
		publishedAt: item.snippet.publishedAt,
		thumbnails: item.snippet.thumbnails,
		statistics: item.statistics,
		...(item.brandingSettings?.image?.bannerExternalUrl
			? {
					brandingSettings: {
						image: {
							bannerExternalUrl: item.brandingSettings.image.bannerExternalUrl
						}
					}
				}
			: {})
	};
}

function toPlaylist(item: ApiPlaylist): Playlist {
	const { snippet } = item;
	return {
		id: item.id,
		title: snippet.title,
		description: snippet.description,
		publishedAt: snippet.publishedAt,
		thumbnail:
			snippet.thumbnails.medium?.url ??
			snippet.thumbnails.high?.url ??
			snippet.thumbnails.default?.url ??
			'',
		itemCount: item.contentDetails?.itemCount
	};
}

function toComment(comment: ApiComment) {
	const { snippet } = comment;
	return {
		id: comment.id,
		authorDisplayName: snippet.authorDisplayName,
		authorChannelId: snippet.authorChannelId?.value ?? '',
		authorChannelUrl: snippet.authorChannelUrl,
		authorProfileImageUrl: snippet.authorProfileImageUrl,
		textDisplay: snippet.textDisplay,
		publishedAt: snippet.publishedAt,
		likeCount: snippet.likeCount ?? 0
	};
}

/** Prende i dettagli di piu' video in una sola richiesta, con i canali annessi. */
async function hydrateVideos(videoIds: string[]): Promise<Video[]> {
	if (videoIds.length === 0) return [];

	const { items } = await getPublic(
		`/videos?part=snippet,statistics,contentDetails&id=${videoIds.join(',')}`,
		videoItemSchema
	);
	const channels = await getChannelsByIds([...new Set(items.map((i) => i.snippet.channelId))]);

	return items.map((item) =>
		toVideo(
			item,
			channels.find((c) => c.id === item.snippet.channelId)
		)
	);
}

// --- API pubblica ----------------------------------------------------------

/** Video popolari (chart mostPopular, regione IT), eventualmente di una categoria. */
export async function getVideos(
	maxResults: number = 20,
	pageToken?: string,
	categoryId?: string
): Promise<{ videos: Video[]; nextPageToken?: string; prevPageToken?: string }> {
	const list = await getPublic(
		`/videos?part=snippet,statistics,contentDetails&chart=mostPopular&regionCode=IT&maxResults=${maxResults}` +
			(categoryId ? `&videoCategoryId=${categoryId}` : '') +
			(pageToken ? `&pageToken=${pageToken}` : ''),
		videoItemSchema
	).catch((error: unknown) => {
		// Non tutte le categorie assegnabili hanno una classifica: in Italia
		// 'Viaggi ed eventi' e 'Istruzione' rispondono 404 invece di restituire
		// una lista vuota. Per chi guarda la chip e' comunque "nessun video".
		if (categoryId && error instanceof YouTubeApiError && error.status === 404) return null;
		throw error;
	});

	if (!list) return { videos: [] };
	const { items, nextPageToken, prevPageToken } = list;

	const channels = await getChannelsByIds([...new Set(items.map((i) => i.snippet.channelId))]);

	return {
		videos: items.map((item) =>
			toVideo(
				item,
				channels.find((c) => c.id === item.snippet.channelId)
			)
		),
		nextPageToken,
		prevPageToken
	};
}

/**
 * Categorie per le chip della home. Costa 1 unita' e cambia una volta all'anno:
 * la cache condivisa la rende gratis dopo la prima visita.
 */
export async function getVideoCategories(): Promise<VideoCategory[]> {
	const { items } = await getPublic(
		'/videoCategories?part=snippet&regionCode=IT&hl=it',
		videoCategoryItemSchema
	);

	return items
		.filter((item) => item.snippet.assignable)
		.map((item) => ({ id: item.id, title: item.snippet.title }));
}

export async function getChannelsByIds(channelIds: string[] | string): Promise<Channel[]> {
	const ids = Array.isArray(channelIds) ? channelIds : channelIds.split(',').filter(Boolean);
	if (ids.length === 0) return [];

	const { items } = await getPublic(
		`/channels?part=snippet,statistics&id=${ids.join(',')}`,
		channelItemSchema
	);
	return items.map(toChannel);
}

export async function getVideoById(videoId: string): Promise<Video | null> {
	if (!videoId) throw new YouTubeApiError('Video ID is required', 400);

	const [video] = await hydrateVideos([videoId]);
	return video ?? null;
}

/**
 * `textFormat=plainText` e' una misura di sicurezza, non una preferenza: senza,
 * l'API restituisce HTML e i commenti finirebbero in un `{@html}`.
 */
export async function getComments(
	videoId: string,
	pageToken?: string
): Promise<{ comments: CommentThread[]; nextPageToken?: string; disabled?: boolean }> {
	if (!videoId) throw new YouTubeApiError('Video ID is required', 400);

	let page;
	try {
		page = await getPublic(
			`/commentThreads?part=snippet,replies&textFormat=plainText&videoId=${videoId}` +
				(pageToken ? `&pageToken=${pageToken}` : ''),
			commentThreadItemSchema,
			// L'unica lista che l'utente puo' cambiare. Una copia in cache gli
			// mostrerebbe il proprio commento appena scritto, modificato o
			// eliminato come se non fosse successo niente, per cinque minuti.
			// Costa 1 unita' di quota a visita: la stessa pagina ne spende gia' di
			// piu' per il video e i correlati.
			false
		);
	} catch (cause) {
		// Un video con i commenti disattivati risponde 403: e' uno stato del video,
		// non un guasto, e la pagina lo dice invece di mostrare il JSON dell'errore.
		if (cause instanceof YouTubeApiError && cause.reason === 'commentsDisabled') {
			return { comments: [], disabled: true };
		}
		throw cause;
	}
	const { items, nextPageToken } = page;

	return {
		comments: items.map((item) => ({
			id: item.id,
			topLevelComment: toComment(item.snippet.topLevelComment),
			replies: (item.replies?.comments ?? []).map(toComment)
		})),
		nextPageToken
	};
}

/**
 * `videoDuration` e' accettato solo insieme a `type=video`: senza, l'API
 * risponde 400. Per questo i filtri sono validati alla porta e non lasciati
 * passare cosi' come arrivano dalla query string.
 */
function searchParams(query: string, filters: SearchFilters, pageToken?: string) {
	const params = new URLSearchParams({
		part: 'snippet',
		q: query,
		type: filters.type,
		maxResults: '20'
	});
	if (filters.order !== 'relevance') params.set('order', filters.order);
	if (filters.type === 'video' && filters.duration !== 'any') {
		params.set('videoDuration', filters.duration);
	}
	const publishedAfter = publishedAfterOf(filters.uploaded);
	if (publishedAfter) params.set('publishedAfter', publishedAfter);
	if (pageToken) params.set('pageToken', pageToken);
	return params.toString();
}

const PERIOD_DAYS = { hour: 1 / 24, today: 1, week: 7, month: 30, year: 365 };

/** L'API vuole un istante RFC 3339, l'interfaccia parla di 'questa settimana'. */
function publishedAfterOf(uploaded: SearchFilters['uploaded']): string | undefined {
	if (uploaded === 'any') return undefined;
	return new Date(Date.now() - PERIOD_DAYS[uploaded] * 86400_000).toISOString();
}

export async function searchVideos(
	query: string,
	pageToken?: string,
	filters: SearchFilters = defaultSearchFilters
): Promise<{ videos: Video[]; nextPageToken?: string }> {
	if (!query) throw new YouTubeApiError('Query is required', 400);

	const { items, nextPageToken } = await getPublic(
		`/search?${searchParams(query, { ...filters, type: 'video' }, pageToken)}`,
		searchItemSchema
	);

	const ids = items.map((i) => i.id.videoId).filter((id): id is string => !!id);
	return { videos: await hydrateVideos(ids), nextPageToken };
}

/**
 * La ricerca per canali: `search.list` restituisce solo gli id, i dati veri
 * (iscritti, banner) stanno su `channels.list` e vanno chiesti a parte, come
 * gia' succede per i video.
 */
export async function searchChannels(
	query: string,
	pageToken?: string,
	filters: SearchFilters = defaultSearchFilters
): Promise<{ channels: Channel[]; nextPageToken?: string }> {
	if (!query) throw new YouTubeApiError('Query is required', 400);

	const { items, nextPageToken } = await getPublic(
		`/search?${searchParams(query, { ...filters, type: 'channel' }, pageToken)}`,
		searchItemSchema
	);

	const ids = items.map((i) => i.id.channelId).filter((id): id is string => !!id);
	return { channels: await getChannelsByIds(ids), nextPageToken };
}

/**
 * Una ricerca sola per chi la consuma: video e canali arrivano nella stessa
 * forma, con l'array che non c'entra vuoto. Senza questo, ogni chiamante
 * dovrebbe ramificare sul tipo e la pagina avrebbe due query invece di una.
 */
export async function search(
	query: string,
	filters: SearchFilters,
	pageToken?: string
): Promise<{ videos: Video[]; channels: Channel[]; nextPageToken?: string }> {
	if (filters.type === 'channel') {
		const { channels, nextPageToken } = await searchChannels(query, pageToken, filters);
		return { videos: [], channels, nextPageToken };
	}

	const { videos, nextPageToken } = await searchVideos(query, pageToken, filters);
	return { videos, channels: [], nextPageToken };
}

export async function getChannelById(channelId: string): Promise<Channel | null> {
	if (!channelId) throw new YouTubeApiError('Channel ID is required', 400);

	const { items } = await getPublic(
		`/channels?part=snippet,statistics,brandingSettings&id=${channelId}`,
		channelItemSchema
	);
	return items[0] ? toChannel(items[0]) : null;
}

export async function getVideosByChannelId(
	channelId: string,
	order: ChannelOrder = defaultChannelOrder,
	pageToken?: string
): Promise<{ videos: Video[]; nextPageToken?: string }> {
	if (!channelId) throw new YouTubeApiError('Channel ID is required', 400);

	const { items, nextPageToken } = await getPublic(
		`/search?part=snippet&channelId=${channelId}&type=video&maxResults=20&order=${order}` +
			(pageToken ? `&pageToken=${pageToken}` : ''),
		searchItemSchema
	);

	const ids = items.map((i) => i.id.videoId).filter((id): id is string => !!id);
	return { videos: await hydrateVideos(ids), nextPageToken };
}

// --- Operazioni per conto dell'utente --------------------------------------

export async function getSubscriptions(accessToken: string): Promise<Channel[]> {
	if (!accessToken) throw new YouTubeApiError('Access token is required', 401);

	const { items } = await getAuthed(
		'/subscriptions?part=snippet&mine=true&maxResults=50',
		accessToken,
		subscriptionItemSchema
	);
	if (items.length === 0) return [];

	const channels = await getChannelsByIds(items.map((i) => i.snippet.resourceId.channelId));

	return items
		.map((item): Channel | undefined => {
			const channel = channels.find((c) => c.id === item.snippet.resourceId.channelId);
			return channel ? { ...channel, subscriptionId: item.id } : undefined;
		})
		.filter((c): c is Channel => !!c);
}

export async function subscribeToChannel(channelId: string, accessToken: string): Promise<string> {
	if (!channelId) throw new YouTubeApiError('Channel ID is required', 400);
	if (!accessToken) throw new YouTubeApiError('Access token is required', 401);

	const response = await sendAuthed('/subscriptions?part=snippet', accessToken, {
		method: 'POST',
		body: JSON.stringify({ snippet: { resourceId: { kind: 'youtube#channel', channelId } } })
	});
	const data = (await response.json()) as { id?: string };
	if (!data.id) throw new YouTubeApiError('Iscrizione creata senza id', 502);
	return data.id;
}

export async function unsubscribeFromChannel(
	subscriptionId: string,
	accessToken: string
): Promise<boolean> {
	if (!subscriptionId) throw new YouTubeApiError('Subscription ID is required', 400);
	if (!accessToken) throw new YouTubeApiError('Access token is required', 401);

	await sendAuthed(`/subscriptions?id=${subscriptionId}`, accessToken, { method: 'DELETE' });
	return true;
}

export async function rateVideo(
	videoId: string,
	rating: 'like' | 'dislike' | 'none',
	accessToken: string
): Promise<boolean> {
	if (!videoId) throw new YouTubeApiError('Video ID is required', 400);
	if (!accessToken) throw new YouTubeApiError('Access token is required', 401);

	await sendAuthed(`/videos/rate?id=${encodeURIComponent(videoId)}&rating=${rating}`, accessToken, {
		method: 'POST'
	});
	return true;
}

/**
 * Pubblica un commento vero sotto il video.
 *
 * `channelId` e' il canale che ha caricato il video, non quello di chi scrive.
 * Costa 50 unita' di quota contro le 1-3 di una lista: sono circa 200 commenti
 * al giorno prima di esaurire il budget, quindi vale la pena saperlo.
 */
export async function postComment(
	videoId: string,
	channelId: string,
	text: string,
	accessToken: string
): Promise<void> {
	if (!videoId || !channelId) throw new YouTubeApiError('Video e canale sono richiesti', 400);
	if (!text.trim()) throw new YouTubeApiError("Il commento e' vuoto", 400);
	if (!accessToken) throw new YouTubeApiError('Access token is required', 401);

	await sendAuthed('/commentThreads?part=snippet', accessToken, {
		method: 'POST',
		body: JSON.stringify({
			snippet: {
				channelId,
				videoId,
				topLevelComment: { snippet: { textOriginal: text } }
			}
		})
	});
}

/**
 * Risponde a un commento. La Data API accetta come `parentId` solo il commento
 * in cima al thread: rispondere a una risposta appende in fondo allo stesso
 * thread e non apre un terzo livello, che YouTube non ha.
 *
 * Costa 50 unita' come la pubblicazione.
 */
export async function replyToComment(
	parentId: string,
	text: string,
	accessToken: string
): Promise<void> {
	if (!parentId) throw new YouTubeApiError('Parent ID is required', 400);
	if (!text.trim()) throw new YouTubeApiError("Il commento e' vuoto", 400);
	if (!accessToken) throw new YouTubeApiError('Access token is required', 401);

	await sendAuthed('/comments?part=snippet', accessToken, {
		method: 'POST',
		body: JSON.stringify({ snippet: { parentId, textOriginal: text } })
	});
}

/**
 * Gli elementi di una playlist arrivano come soli id: i dettagli si prendono in
 * una richiesta sola. Prima questa funzione dichiarava di restituire `Video[]`
 * ma costruiva a mano oggetti con meta' dei campi e `thumbnail` al singolare;
 * l'`any` sul mapper lo rendeva invisibile al compilatore.
 *
 * Passa dal token e non dalla API key perche' le playlist dell'utente possono
 * essere private, e 'LL' (i piaciuti) lo e' sempre.
 */
export async function getPlaylistVideos(
	playlistId: string,
	accessToken: string,
	pageToken?: string
): Promise<{ videos: Video[]; nextPageToken?: string }> {
	if (!playlistId) throw new YouTubeApiError('Playlist ID is required', 400);
	if (!accessToken) throw new YouTubeApiError('Access token is required', 401);

	const { items, nextPageToken } = await getAuthed(
		`/playlistItems?part=contentDetails&maxResults=20&playlistId=${playlistId}` +
			(pageToken ? `&pageToken=${pageToken}` : ''),
		accessToken,
		playlistItemSchema
	);

	return {
		videos: await hydrateVideos(items.map((i) => i.contentDetails.videoId)),
		nextPageToken
	};
}

/** 'LL' e' l'id della playlist dei piaciuti, uguale per ogni account. */
export async function getLikedVideos(accessToken: string): Promise<{ videos: Video[] }> {
	return getPlaylistVideos('LL', accessToken);
}

/**
 * Una playlist sola, per intestare la sua pagina. Passa dal token perche' una
 * playlist privata non e' leggibile con la sola API key.
 */
export async function getPlaylistById(
	playlistId: string,
	accessToken: string
): Promise<Playlist | null> {
	if (!playlistId) throw new YouTubeApiError('Playlist ID is required', 400);
	if (!accessToken) throw new YouTubeApiError('Access token is required', 401);

	const { items } = await getAuthed(
		`/playlists?part=snippet,contentDetails&id=${playlistId}`,
		accessToken,
		playlistSchema
	);
	return items[0] ? toPlaylist(items[0]) : null;
}

/** Le playlist create dall'utente, quelle di sistema escluse dall'API stessa. */
export async function getMyPlaylists(accessToken: string): Promise<Playlist[]> {
	if (!accessToken) throw new YouTubeApiError('Access token is required', 401);

	const { items } = await getAuthed(
		'/playlists?part=snippet,contentDetails&mine=true&maxResults=50',
		accessToken,
		playlistSchema
	);
	return items.map(toPlaylist);
}

/**
 * Il canale di chi e' loggato, che serve per sapere quali commenti sono suoi.
 * Un account Google senza canale YouTube non ne ha uno: in quel caso l'API
 * risponde con una lista vuota, non con un errore.
 */
export async function getMyChannelId(accessToken: string): Promise<string | null> {
	if (!accessToken) throw new YouTubeApiError('Access token is required', 401);

	const { items } = await getAuthed('/channels?part=id&mine=true', accessToken, channelIdSchema);
	return items[0]?.id ?? null;
}

/** Il voto di chi e' loggato a un video: un voto assente o sconosciuto e' 'none'. */
export async function getMyRating(
	videoId: string,
	accessToken: string
): Promise<'like' | 'dislike' | 'none'> {
	if (!accessToken) throw new YouTubeApiError('Access token is required', 401);

	const { items } = await getAuthed(
		`/videos/getRating?id=${encodeURIComponent(videoId)}`,
		accessToken,
		ratingItemSchema
	);
	const rating = items[0]?.rating;
	return rating === 'like' || rating === 'dislike' ? rating : 'none';
}

/** L'id dell'iscrizione di chi e' loggato a un canale, o null se non e' iscritto. */
export async function getMySubscriptionId(
	channelId: string,
	accessToken: string
): Promise<string | null> {
	if (!accessToken) throw new YouTubeApiError('Access token is required', 401);

	const { items } = await getAuthed(
		`/subscriptions?part=id&forChannelId=${encodeURIComponent(channelId)}&mine=true`,
		accessToken,
		subscriptionIdSchema
	);
	return items[0]?.id ?? null;
}

/**
 * Modifica e cancellazione valgono solo sui propri commenti: e' YouTube a
 * rifiutare gli altri con un 403, quindi il controllo lato interfaccia serve a
 * non mostrare bottoni che non funzionerebbero, non come misura di sicurezza.
 *
 * Costano 50 unita' l'una, come la pubblicazione.
 */
export async function updateComment(
	commentId: string,
	text: string,
	accessToken: string
): Promise<void> {
	if (!commentId) throw new YouTubeApiError('Comment ID is required', 400);
	if (!text.trim()) throw new YouTubeApiError("Il commento e' vuoto", 400);
	if (!accessToken) throw new YouTubeApiError('Access token is required', 401);

	await sendAuthed('/comments?part=snippet', accessToken, {
		method: 'PUT',
		body: JSON.stringify({ id: commentId, snippet: { textOriginal: text } })
	});
}

export async function deleteComment(commentId: string, accessToken: string): Promise<void> {
	if (!commentId) throw new YouTubeApiError('Comment ID is required', 400);
	if (!accessToken) throw new YouTubeApiError('Access token is required', 401);

	await sendAuthed(`/comments?id=${commentId}`, accessToken, { method: 'DELETE' });
}
