import type { Video } from '#lib/types/video.js';
import type { CommentThread } from '#lib/types/commentThread.js';
import type { Channel } from '#lib/types/channel.js';
import { searchFiltersToParams, type SearchFilters } from '#lib/types/searchFilters.js';

/**
 * Chiavi e fetcher delle liste paginate.
 *
 * Qui resta solo cio' che si sfoglia: `getNextPageParam` di TanStack non ha un
 * equivalente fra le remote functions, che si sono prese tutto il resto e
 * vivono in youtube.remote.ts.
 *
 * Nessuna di queste chiamate parla con Google: passano tutte dai nostri
 * endpoint, cosi la API key resta lato server e i cookie restano httpOnly.
 */
export const queryKeys = {
	likedVideos: () => ['liked-videos'] as const,
	playlists: () => ['playlists'] as const,
	playlistVideos: (playlistId: string) => ['playlist-videos', playlistId] as const,
	popularVideos: (categoryId?: string) => ['popular-videos', categoryId ?? 'all'] as const,
	relatedVideos: (videoId: string) => ['related-videos', videoId] as const,
	comments: (videoId: string) => ['comments', videoId] as const,
	search: (query: string, filters: SearchFilters) => ['search', query, filters] as const
};

async function getJson<T>(url: string): Promise<T> {
	const response = await fetch(url);
	if (!response.ok) {
		const body = await response.json().catch(() => ({}));
		// Il corpo e' quello di `error()` / `handleError`: { status, message }.
		throw new Error(body.message ?? `Richiesta fallita (${response.status})`);
	}
	return response.json();
}

type Page = { videos: Video[]; nextPageToken?: string };
/** La ricerca restituisce sempre entrambi gli elenchi: uno dei due e' vuoto. */
type SearchPage = { videos: Video[]; channels: Channel[]; nextPageToken?: string };
type CommentPage = { comments: CommentThread[]; nextPageToken?: string; disabled?: boolean };

// --- Query -----------------------------------------------------------------

/**
 * Prima questo dato veniva chiesto passando l'access token da `document.cookie`,
 * che e' httpOnly: quel ramo non e' mai stato eseguito. L'endpoint legge il
 * token da `locals`, quindi al client non serve conoscerlo.
 */
export const likedVideosOptions = (enabled: boolean) => ({
	queryKey: queryKeys.likedVideos(),
	queryFn: () => getJson<Page>('/api/user/playlist-videos?playlistId=LL'),
	enabled
});

/**
 * Prima pagina di una playlist, per la coda di riproduzione. I piaciuti ('LL')
 * restano sulla chiave di `likedVideosOptions`, cosi la lista gia' in cache
 * dalla loro pagina non viene richiesta di nuovo. Le altre hanno una chiave
 * propria: la pagina di una playlist e' una query infinita con un'altra forma.
 */
export const playlistPageOptions = (playlistId: string) => ({
	queryKey:
		playlistId === 'LL' ? queryKeys.likedVideos() : (['playlist-page', playlistId] as const),
	queryFn: () =>
		getJson<Page>(`/api/user/playlist-videos?playlistId=${encodeURIComponent(playlistId)}`)
});

// --- Query infinite --------------------------------------------------------

type Paged = { nextPageToken?: string };

type InfiniteOptions<T extends Paged> = {
	queryKey: readonly unknown[];
	queryFn: (ctx: { pageParam?: string }) => Promise<T>;
	initialPageParam: string | undefined;
	getNextPageParam: (last: T) => string | undefined;
};

/**
 * Le quattro query paginate differivano solo per chiave e URL. Il tipo di
 * ritorno esplicito serve a dichiarare `initialPageParam` come
 * `string | undefined`: lasciandolo inferire diventa il letterale `undefined`,
 * ed e' il motivo per cui prima ogni factory portava un cast.
 *
 * La prima pagina arriva come promise dal `load`, che continua a inviarla in
 * streaming: Query la aspetta invece di rifetcharla, quindi la paginazione
 * passa qui senza rinunciare all'SSR.
 */
/**
 * Le promesse del `load` gia' consumate. La prima pagina arriva dal server ed
 * e' gia' risolta: restituirla anche ai refetch significa che invalidare la
 * query non aggiorna mai la prima pagina, e un commento appena scritto,
 * modificato o eliminato resta com'era finche' non si ricarica a mano.
 *
 * Sta fuori dalla funzione perche' le opzioni vengono ricostruite a ogni giro
 * reattivo: un flag locale si azzererebbe ogni volta. La chiave e' la promessa
 * stessa, che invece resta la stessa finche' resta la stessa pagina.
 */
const primePagineUsate = new WeakSet<Promise<unknown>>();

function infinite<T extends Paged>(
	queryKey: readonly unknown[],
	firstPage: Promise<T>,
	nextPageUrl: (pageToken: string) => string
): InfiniteOptions<T> {
	return {
		queryKey,
		queryFn: ({ pageParam }) => {
			if (pageParam) return getJson<T>(nextPageUrl(pageParam));

			if (!primePagineUsate.has(firstPage)) {
				primePagineUsate.add(firstPage);
				return firstPage;
			}

			// Refetch: la prima pagina va richiesta davvero, con il token vuoto.
			return getJson<T>(nextPageUrl(''));
		},
		initialPageParam: undefined,
		getNextPageParam: (last) => last.nextPageToken
	};
}

export const popularVideosOptions = (firstPage: Promise<Page>, categoryId?: string) =>
	infinite(
		queryKeys.popularVideos(categoryId),
		firstPage,
		(t) => `/api/videos?pageToken=${t}` + (categoryId ? `&categoryId=${categoryId}` : '')
	);

export const relatedVideosOptions = (videoId: string, firstPage: Promise<Page>) =>
	infinite(queryKeys.relatedVideos(videoId), firstPage, (t) => `/api/videos?pageToken=${t}`);

export const commentsOptions = (videoId: string, firstPage: Promise<CommentPage>) =>
	infinite(
		queryKeys.comments(videoId),
		firstPage,
		(t) => `/api/comments?videoId=${videoId}&pageToken=${t}`
	);

/**
 * I filtri entrano nella chiave e nell'URL: due filtri diversi sono due liste
 * diverse, e devono restare due voci di cache separate.
 */
function searchUrl(query: string, filters: SearchFilters, pageToken: string) {
	const params = searchFiltersToParams(filters);
	params.set('q', query);
	params.set('pageToken', pageToken);
	return `/api/videos/search?${params}`;
}

export const searchOptions = (
	query: string,
	filters: SearchFilters,
	firstPage: Promise<SearchPage>
) => infinite(queryKeys.search(query, filters), firstPage, (t) => searchUrl(query, filters, t));

export const playlistVideosOptions = (playlistId: string, firstPage: Promise<Page>) =>
	infinite(
		queryKeys.playlistVideos(playlistId),
		firstPage,
		(t) => `/api/user/playlist-videos?playlistId=${playlistId}&pageToken=${t}`
	);
