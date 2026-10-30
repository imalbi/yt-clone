import { error } from '@sveltejs/kit';
import * as apis from '#lib/api/youtube.js';
import { parseSearchFilters } from '#lib/types/searchFilters.js';

export async function GET({ url }) {
	const pageToken = url.searchParams.get('pageToken') ?? undefined;
	const query = url.searchParams.get('q');

	if (!query) error(400, 'Query is required');

	// I filtri arrivano dalla query string, quindi vengono riconosciuti qui
	// invece di essere inoltrati alla API cosi' come sono.
	const filters = parseSearchFilters(url.searchParams);
	return Response.json(await apis.search(query, filters, pageToken));
}
