//src/routes/iscrizioni/+page.server.ts
import { PUBLIC_YOUTUBE_API_KEY } from '$env/static/public';
import { userStore } from '$lib/stores/userStore';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		throw redirect(302, '/api/auth/login');
	}
	try {
		const response = await fetch('https://dummyjson.com/users');
		const data = await response.json();
		return {
			users: data.users
		};
	} catch (error) {
		console.error('Error fetching users:', error);
		return {
			error: 'Failed to load users'
		};
	}
}
