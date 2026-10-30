import * as apis from '#lib/api/youtube.js';
import { parseSearchFilters } from '#lib/types/searchFilters.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	// Come per le categorie della home, i filtri stanno nell'URL: una ricerca
	// filtrata e' un indirizzo, quindi condivisibile e renderizzata dal server.
	const filters = parseSearchFilters(url.searchParams);
	const results = apis.search(params.searchId, filters);

	return {
		query: params.searchId,
		filters,
		firstPage: results.then((data) => ({
			videos: data.videos,
			channels: data.channels,
			nextPageToken: data.nextPageToken
		}))
	};
};
