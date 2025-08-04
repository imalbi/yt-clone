// src/routes/api/user/unsubscribe/+server.ts
import { unsubscribeFromChannel } from '$lib/api/youtube';
import { json } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		return json({ error: 'User not authenticated' }, { status: 401 });
	}

	const { subscriptionId } = await request.json();
	if (!subscriptionId) {
		return json({ error: 'subscriptionId is required' }, { status: 400 });
	}

	try {
		await unsubscribeFromChannel(subscriptionId, accessToken);
		return json({ success: true }, { status: 200 });
	} catch (error) {
		console.error('Failed to unsubscribe:', error);
		return json({ error: 'Failed to unsubscribe' }, { status: 500 });
	}
}
