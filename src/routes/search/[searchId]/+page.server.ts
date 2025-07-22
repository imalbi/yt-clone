// src/routes/search/[searchId]/+page.server.ts
import * as apis from '$lib/api/youtube';

export async function load({ params }) {
	try {
		const searchId = params.searchId;
		const searchResultsPromise = apis.searchVideos(searchId);

		return { searchResults: searchResultsPromise, error: null };
	} catch (error) {
		return {
			searchResults: Promise.resolve([]),
			error: error instanceof Error ? error.message : 'Errore sconosciuto'
		};
	}
}
