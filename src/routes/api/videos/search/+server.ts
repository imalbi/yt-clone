import { json } from '@sveltejs/kit';
import * as apis from '$lib/api/youtube';

export async function GET({ url }) {
	const pageToken = url.searchParams.get('pageToken') ?? undefined;
	const query = url.searchParams.get('q');

	if (!query) {
		return json({ error: 'Query is required' }, { status: 400 });
	}

	try {
		const searchResults = await apis.searchVideos(query, pageToken);
		return json(searchResults);
	} catch (error) {
		return json({ error: 'Failed to fetch videos' }, { status: 500 });
	}
}
