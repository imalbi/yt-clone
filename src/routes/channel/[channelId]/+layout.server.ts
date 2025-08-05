import { getChannelById, getSubscriptions } from '$lib/api/youtube';
import { error } from '@sveltejs/kit';

export async function load({ params, cookies }) {
	const { channelId } = params;
	const accessToken = cookies.get('access_token');

	console.log('Layout loading channel:', channelId);

	if (!channelId) {
		console.log('No channelId provided');
		throw error(404, 'Channel not found');
	}

	try {
		console.log('Fetching channel data for:', channelId);
		const channelPromise = getChannelById(channelId);
		const subscriptionsPromise = accessToken ? getSubscriptions(accessToken) : Promise.resolve([]);

		const [channel, subscriptions] = await Promise.all([channelPromise, subscriptionsPromise]);

		if (!channel) {
			console.log('Channel not found in API response');
			throw error(404, 'Channel not found');
		}

		console.log('Channel loaded successfully:', channel.title);
		console.log('Subscriptions loaded:', subscriptions.length);

		return {
			channel,
			subscriptions
		};
	} catch (err) {
		console.error('Error in layout.server.ts:', err);
		const message = err instanceof Error ? err.message : 'Unknown error';
		throw error(500, `Failed to fetch channel data: ${message}`);
	}
}
