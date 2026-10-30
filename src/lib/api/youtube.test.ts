import { describe, it, expect, vi, afterEach } from 'vitest';
import {
	getComments,
	getMyPlaylists,
	getMyRating,
	getMySubscriptionId,
	getVideoById,
	getVideoCategories,
	getVideos,
	getVideosByChannelId,
	search,
	upstreamStatus,
	YouTubeApiError
} from './youtube';
import { defaultSearchFilters } from '#lib/types/searchFilters.js';

afterEach(() => {
	vi.unstubAllGlobals();
});

function stubFetch(payload: unknown) {
	const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => payload });
	vi.stubGlobal('fetch', fetchMock);
	return fetchMock;
}

const commentPayload = (likeCount: number) => ({
	items: [
		{
			id: 'thread1',
			snippet: {
				topLevelComment: {
					id: 'comment1',
					snippet: {
						authorDisplayName: 'Tizio',
						authorChannelId: { value: 'channel1' },
						authorChannelUrl: 'https://example.test/channel1',
						authorProfileImageUrl: 'https://example.test/avatar.jpg',
						textDisplay: 'Bel video',
						publishedAt: '2026-08-11T10:00:00Z',
						likeCount
					}
				}
			}
		}
	]
});

// La cache e' condivisa e per URL, quindi ogni test usa un videoId diverso:
// riusare lo stesso id qui significherebbe misurare la cache invece del mapper.
describe('getComments', () => {
	it('chiede il testo dei commenti in plainText', async () => {
		const fetchMock = stubFetch({ items: [] });

		await getComments('video-plaintext');

		const url = fetchMock.mock.calls[0][0];
		expect(url).toContain('textFormat=plainText');
		// Conferma che la suite gira su `.env.test` e non su credenziali vere.
		expect(url).toContain('key=test-key');
	});

	it('mappa il likeCount, non un campo inesistente', async () => {
		stubFetch(commentPayload(7));

		const { comments } = await getComments('video-likecount');

		expect(comments[0].topLevelComment.likeCount).toBe(7);
		expect(comments[0].replies).toEqual([]);
	});

	it('rifiuta un videoId vuoto senza chiamare la rete', async () => {
		const fetchMock = stubFetch({ items: [] });

		await expect(getComments('')).rejects.toThrow('Video ID is required');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('getVideoById', () => {
	it('riusa il canale idratato per esporre il numero di iscritti', async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					items: [
						{
							id: 'video-subscriber-metadata',
							snippet: {
								title: 'Video',
								description: 'Descrizione',
								publishedAt: '2026-08-20T00:00:00Z',
								channelId: 'channel-subscriber-metadata',
								channelTitle: 'Canale',
								thumbnails: { default: { url: 'video.jpg' } }
							},
							statistics: { viewCount: '10', favoriteCount: '0' },
							contentDetails: { duration: 'PT1M' }
						}
					]
				})
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					items: [
						{
							id: 'channel-subscriber-metadata',
							snippet: {
								title: 'Canale',
								description: '',
								publishedAt: '2020-01-01T00:00:00Z',
								thumbnails: { default: { url: 'avatar.jpg' } }
							},
							statistics: {
								viewCount: '100',
								subscriberCount: '1234567',
								hiddenSubscriberCount: false,
								videoCount: '12'
							}
						}
					]
				})
			});
		vi.stubGlobal('fetch', fetchMock);

		const video = await getVideoById('video-subscriber-metadata');

		expect(fetchMock).toHaveBeenCalledTimes(2);
		expect(video).toMatchObject({
			avatarUrl: 'avatar.jpg',
			channelSubscriberCount: '1234567',
			channelSubscriberCountHidden: false
		});
	});
});

describe('cache', () => {
	// Quota giornaliera 10.000 unita': senza cache una manciata di ricariche
	// della stessa pagina la consuma, e l'app inizia a rispondere 403.
	it('serve la seconda richiesta identica senza toccare la rete', async () => {
		const fetchMock = stubFetch({ items: [] });

		await search('cache-hit', defaultSearchFilters);
		await search('cache-hit', defaultSearchFilters);

		expect(fetchMock).toHaveBeenCalledOnce();
	});

	it('non confonde richieste diverse', async () => {
		const fetchMock = stubFetch({ items: [] });

		await search('cache-a', defaultSearchFilters);
		await search('cache-b', defaultSearchFilters);

		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	// I commenti sono l'unica lista che l'utente puo' cambiare: una copia in
	// cache gli mostrerebbe il proprio commento appena scritto, modificato o
	// eliminato come se non fosse successo niente, fino a cinque minuti dopo.
	it('non tiene in cache i commenti, che l’utente puo’ modificare', async () => {
		const fetchMock = stubFetch(commentPayload(1));

		await getComments('video-non-cacheato');
		await getComments('video-non-cacheato');

		expect(fetchMock).toHaveBeenCalledTimes(2);
	});
});

describe('validazione al confine con l’API', () => {
	const validComment = (id: string) => ({
		id,
		snippet: {
			topLevelComment: {
				id: `c-${id}`,
				snippet: {
					authorDisplayName: 'Tizio',
					authorChannelId: { value: 'ch1' },
					authorChannelUrl: 'https://example.test/ch1',
					authorProfileImageUrl: 'https://example.test/a.jpg',
					textDisplay: 'ok',
					publishedAt: '2026-08-11T10:00:00Z',
					likeCount: 1
				}
			}
		}
	});

	// Un feed di venti elementi non deve sparire perche' uno ha un campo in meno.
	it('scarta l’elemento malformato e tiene gli altri', async () => {
		stubFetch({ items: [validComment('a'), { id: 'rotto' }, validComment('b')] });

		const { comments } = await getComments('video-parziale');

		expect(comments.map((c) => c.id)).toEqual(['a', 'b']);
	});

	// Se cadono tutti non e' un elemento difettoso, e' lo schema che non combacia:
	// restituire [] direbbe "nessun commento", che e' una bugia diversa.
	it('solleva un errore se nessun elemento supera la validazione', async () => {
		stubFetch({ items: [{ id: 'rotto' }, { id: 'pure-questo' }] });

		await expect(getComments('video-tutti-rotti')).rejects.toThrow(/Schema non combaciante/);
	});

	// Google aggiunge campi di continuo: non e' un motivo per rompere la pagina.
	it('ignora i campi sconosciuti invece di rifiutarli', async () => {
		stubFetch({ items: [{ ...validComment('a'), campoNuovoDiGoogle: { qualcosa: true } }] });

		const { comments } = await getComments('video-campi-extra');

		expect(comments).toHaveLength(1);
	});

	it('rifiuta una busta che non e’ nemmeno una lista', async () => {
		stubFetch({ items: 'non-un-array' });

		await expect(getComments('video-busta-rotta')).rejects.toThrow(/Risposta inattesa/);
	});
});

describe('categorie', () => {
	it('tiene solo le categorie assegnabili', async () => {
		stubFetch({
			items: [
				{ id: '10', snippet: { title: 'Musica', assignable: true } },
				{ id: '30', snippet: { title: 'Film', assignable: false } }
			]
		});

		const categories = await getVideoCategories();

		expect(categories).toEqual([{ id: '10', title: 'Musica' }]);
	});

	it('tratta il 404 di una categoria senza classifica come lista vuota', async () => {
		// 'Istruzione' e 'Viaggi ed eventi' rispondono cosi' in Italia: non e' un
		// guasto, e la home deve dire "nessun video" invece di "errore".
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({ ok: false, status: 404, text: async () => 'notFound' })
		);

		await expect(getVideos(20, undefined, '27')).resolves.toEqual({ videos: [] });
	});

	it('lascia passare il 404 quando non e’ stata chiesta una categoria', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({ ok: false, status: 404, text: async () => 'notFound' })
		);

		await expect(getVideos()).rejects.toThrow();
	});
});

describe('ricerca con filtri', () => {
	it('traduce i filtri nei parametri della Data API', async () => {
		const fetchMock = stubFetch({ items: [] });

		await search('gatti', { ...defaultSearchFilters, order: 'date', duration: 'short' });

		const url: string = fetchMock.mock.calls[0][0];
		expect(url).toContain('order=date');
		expect(url).toContain('videoDuration=short');
		expect(url).toContain('type=video');
	});

	it('non invia videoDuration quando si cercano canali', async () => {
		// L'API risponde 400 se videoDuration arriva senza type=video: e' il
		// motivo per cui il filtro viene tolto qui e non solo disabilitato a video.
		const fetchMock = stubFetch({ items: [] });

		const { videos, channels } = await search('gatti', {
			...defaultSearchFilters,
			type: 'channel',
			duration: 'long'
		});

		const url: string = fetchMock.mock.calls[0][0];
		expect(url).toContain('type=channel');
		expect(url).not.toContain('videoDuration');
		expect({ videos, channels }).toEqual({ videos: [], channels: [] });
	});

	it('manda publishedAfter come istante, non come parola', async () => {
		const fetchMock = stubFetch({ items: [] });

		await search('gatti', { ...defaultSearchFilters, uploaded: 'week' });

		const url = new URL(fetchMock.mock.calls[0][0]);
		const publishedAfter = url.searchParams.get('publishedAfter');
		expect(publishedAfter).toBeTruthy();
		const days = (Date.now() - new Date(publishedAfter ?? 0).getTime()) / 86400_000;
		expect(days).toBeGreaterThan(6.9);
		expect(days).toBeLessThan(7.1);
	});
});

describe('playlist dell’utente', () => {
	it('mappa titolo, copertina e conteggio, e chiede solo le proprie', async () => {
		const fetchMock = stubFetch({
			items: [
				{
					id: 'PL1',
					snippet: {
						title: 'Preferiti',
						description: 'roba',
						publishedAt: '2026-01-01T00:00:00Z',
						thumbnails: { medium: { url: 'https://example.test/m.jpg' } }
					},
					contentDetails: { itemCount: 4 }
				}
			]
		});

		const playlists = await getMyPlaylists('token');

		expect(fetchMock.mock.calls[0][0]).toContain('mine=true');
		// La chiamata e' autenticata: la chiave API non deve comparire nell'URL.
		expect(fetchMock.mock.calls[0][0]).not.toContain('key=');
		expect(playlists).toEqual([
			{
				id: 'PL1',
				title: 'Preferiti',
				description: 'roba',
				publishedAt: '2026-01-01T00:00:00Z',
				thumbnail: 'https://example.test/m.jpg',
				itemCount: 4
			}
		]);
	});

	it('rifiuta una richiesta senza token senza toccare la rete', async () => {
		const fetchMock = stubFetch({ items: [] });

		await expect(getMyPlaylists('')).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('voto e iscrizione dell’utente', () => {
	// L'id arriva da un parametro di rotta: un `&` non deve diventare un parametro
	// in piu' di una richiesta fatta col token di chi e' loggato.
	it('codifica l’id del video e traduce il voto', async () => {
		const fetchMock = stubFetch({ items: [{ videoId: 'x', rating: 'dislike' }] });

		expect(await getMyRating('abc&rating=x', 'token')).toBe('dislike');
		expect(fetchMock.mock.calls[0][0]).toContain('id=abc%26rating%3Dx');
		expect(fetchMock.mock.calls[0][0]).not.toContain('key=');
	});

	it('un video senza voto e un voto sconosciuto sono "none"', async () => {
		stubFetch({ items: [{ videoId: 'x', rating: 'unspecified' }] });
		expect(await getMyRating('v', 'token')).toBe('none');

		stubFetch({ items: [] });
		expect(await getMyRating('v', 'token')).toBe('none');
	});

	it('codifica l’id del canale e restituisce l’id dell’iscrizione', async () => {
		const fetchMock = stubFetch({ items: [{ id: 'sub1' }] });

		expect(await getMySubscriptionId('UC&mine=false', 'token')).toBe('sub1');
		expect(fetchMock.mock.calls[0][0]).toContain('forChannelId=UC%26mine%3Dfalse');
	});

	it('senza iscrizione restituisce null', async () => {
		stubFetch({ items: [] });
		expect(await getMySubscriptionId('UC1', 'token')).toBeNull();
	});

	it('rifiutano una richiesta senza token senza toccare la rete', async () => {
		const fetchMock = stubFetch({ items: [] });

		await expect(getMyRating('v', '')).rejects.toThrow();
		await expect(getMySubscriptionId('c', '')).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('upstreamStatus', () => {
	it('inoltra un rifiuto 4xx di Google com’e’', () => {
		expect(upstreamStatus(new YouTubeApiError('no', 403))).toBe(403);
		expect(upstreamStatus(new YouTubeApiError('no', 401))).toBe(401);
	});

	it('trasforma guasti 5xx ed errori sconosciuti in 502', () => {
		expect(upstreamStatus(new YouTubeApiError('rotto', 500))).toBe(502);
		expect(upstreamStatus(new Error('rete'))).toBe(502);
		expect(upstreamStatus('stringa')).toBe(502);
	});
});

describe('video di un canale', () => {
	// La cache e' per URL: ogni test usa un canale diverso.
	it('chiede i piu recenti se non si sceglie un ordine', async () => {
		const fetchMock = stubFetch({ items: [] });

		await getVideosByChannelId('UC-default');

		expect(fetchMock.mock.calls[0][0]).toContain('channelId=UC-default');
		expect(fetchMock.mock.calls[0][0]).toContain('order=date');
	});

	it('inoltra l’ordine scelto', async () => {
		const fetchMock = stubFetch({ items: [] });

		await getVideosByChannelId('UC-popolari', 'viewCount');

		expect(fetchMock.mock.calls[0][0]).toContain('order=viewCount');
	});
});

describe('commenti disattivati', () => {
	const refused = (status: number, reason: string) =>
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: false,
				status,
				text: async () =>
					JSON.stringify({
						error: {
							// Il messaggio di Google e' lungo: il motivo sta dopo i primi 200 caratteri.
							message: 'x'.repeat(300),
							errors: [{ reason, domain: 'youtube.commentThread' }]
						}
					})
			})
		);

	it('un video con i commenti disattivati e uno stato, non un errore', async () => {
		refused(403, 'commentsDisabled');

		expect(await getComments('video-disattivati')).toEqual({ comments: [], disabled: true });
	});

	it('un altro 403 resta un errore, con il motivo a disposizione', async () => {
		refused(403, 'quotaExceeded');

		await expect(getComments('video-quota')).rejects.toMatchObject({
			status: 403,
			reason: 'quotaExceeded'
		});
	});
});
