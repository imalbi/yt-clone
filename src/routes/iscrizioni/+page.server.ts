//src/routes/iscrizioni/+page.server.ts
import { getSubscriptions } from '$lib/api/youtube';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		throw redirect(302, '/api/auth/login');
	}
	try {
		const subscriptions = await getSubscriptions(accessToken);
		return {
			subscriptions
		};
	} catch (error) {
		console.error('Error fetching subscriptions:', error);
		return {
			error: 'Failed to load subscriptions'
		};
	}
}
