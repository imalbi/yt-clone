import { getVideosByChannelId } from '$lib/api/youtube';
import { json, error } from '@sveltejs/kit';

export async function GET({ params, url }) {
	const { channelId } = params;
	const pageToken = url.searchParams.get('pageToken') ?? undefined;

	if (!channelId) {
		throw error(400, 'Channel ID is required');
	}

	try {
		const data = await getVideosByChannelId(channelId, pageToken);
		return json(data);
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Unknown error';
		throw error(500, `Failed to fetch videos for channel: ${message}`);
	}
}
