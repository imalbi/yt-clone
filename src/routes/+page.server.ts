import * as apis from '#lib/api/youtube.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	// La categoria sta nell'URL e non in uno stato del componente: cosi' la
	// pagina filtrata e' condivisibile, sopravvive al ricaricamento ed e'
	// renderizzata dal server come la home senza filtro.
	const categoryId = url.searchParams.get('category') ?? undefined;

	// `getVideos` e' async: non lancia mai in modo sincrono. Il rifiuto viene
	// gestito dove la promise viene attesa, cioe' da createInfiniteQuery.
	const videos = apis.getVideos(20, undefined, categoryId);

	return {
		categoryId,
		// Le chip sono decorazione: se l'elenco non arriva, il feed resta.
		categories: apis.getVideoCategories().catch((error) => {
			console.warn('Categorie non caricate:', error instanceof Error ? error.message : error);
			return [];
		}),
		firstPage: videos.then((data) => ({
			videos: data.videos,
			nextPageToken: data.nextPageToken
		}))
	};
};
