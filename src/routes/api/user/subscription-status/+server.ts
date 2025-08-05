import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies, url }) => {
	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		return json({ error: 'Not authenticated' }, { status: 401 });
	}

	const channelId = url.searchParams.get('channelId');
	if (!channelId) {
		return json({ error: 'Channel ID is required' }, { status: 400 });
	}

	try {
		// Controlla se l'utente è iscritto al canale
		const response = await fetch(
			`https://www.googleapis.com/youtube/v3/subscriptions?part=id&forChannelId=${channelId}&mine=true`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			}
		);

		if (!response.ok) {
			console.error('YouTube API error:', await response.text());
			return json({ error: 'Failed to check subscription status' }, { status: 500 });
		}

		const data = await response.json();
		const isSubscribed = data.items && data.items.length > 0;
		const subscriptionId = isSubscribed ? data.items[0].id : undefined;

		return json({
			isSubscribed,
			subscriptionId
		});
	} catch (error) {
		console.error('Error checking subscription status:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
