import { json } from '@sveltejs/kit';
import * as apis from '$lib/api/youtube';

export async function GET({ url }) {
	const pageToken = url.searchParams.get('pageToken');
	try {
		const videosData = await apis.getVideos(20, pageToken ?? undefined);
		return json(videosData);
	} catch (error) {
		return json({
			videos: [],
			error: error instanceof Error ? error.message : 'Errore sconosciuto'
		});
	}
}
