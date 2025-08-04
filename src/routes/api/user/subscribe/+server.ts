import { subscribeToChannel } from '$lib/api/youtube';
import { json } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		return json({ error: 'User not authenticated' }, { status: 401 });
	}

	const { channelId } = await request.json();
	if (!channelId) {
		return json({ error: 'channelId is required' }, { status: 400 });
	}

	try {
		const subscriptionId = await subscribeToChannel(channelId, accessToken);
		return json({ success: true, subscriptionId }, { status: 200 });
	} catch (error) {
		console.error('Failed to subscribe:', error);
		return json({ error: 'Failed to subscribe' }, { status: 500 });
	}
}
