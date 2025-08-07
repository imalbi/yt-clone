import { json } from '@sveltejs/kit';
import * as apis from '$lib/api/youtube';

export async function GET({ url }) {
	const pageToken = url.searchParams.get('pageToken');
	const videoId = url.searchParams.get('id');

	try {
		// If videoId is provided, fetch that specific video
		if (videoId) {
			const video = await apis.getVideoById(videoId);
			if (video) {
				return json({ video });
			} else {
				return json({ error: 'Video not found' }, { status: 404 });
			}
		}

		// Otherwise, fetch popular videos
		const videosData = await apis.getVideos(10, pageToken ?? undefined);
		return json(videosData);
	} catch (error) {
		return json({
			videos: [],
			error: error instanceof Error ? error.message : 'Errore sconosciuto'
		});
	}
}
