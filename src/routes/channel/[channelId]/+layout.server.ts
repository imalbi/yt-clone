import { getChannelById } from '$lib/api/youtube';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const { channelId } = params;

	console.log('Layout loading channel:', channelId);

	if (!channelId) {
		console.log('No channelId provided');
		throw error(404, 'Channel not found');
	}

	try {
		console.log('Fetching channel data for:', channelId);
		const channel = await getChannelById(channelId);

		if (!channel) {
			console.log('Channel not found in API response');
			throw error(404, 'Channel not found');
		}

		console.log('Channel loaded successfully:', channel.title);
		return {
			channel
		};
	} catch (err) {
		console.error('Error in layout.server.ts:', err);
		const message = err instanceof Error ? err.message : 'Unknown error';
		throw error(500, `Failed to fetch channel data: ${message}`);
	}
}
