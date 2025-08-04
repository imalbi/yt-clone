import { getVideosByChannelId } from '$lib/api/youtube';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const { channelId } = params;

	if (!channelId) {
		throw error(404, 'Channel not found');
	}

	try {
		const videosPromise = getVideosByChannelId(channelId);

		return {
			videos: videosPromise.then((data) => data.videos),
			nextPageToken: videosPromise.then((data) => data.nextPageToken)
		};
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Unknown error';
		throw error(500, `Failed to fetch videos: ${message}`);
	}
}
