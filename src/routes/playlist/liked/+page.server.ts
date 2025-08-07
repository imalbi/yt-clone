import { redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
	const accessToken = cookies.get('access_token');

	if (!accessToken) {
		throw redirect(302, '/api/auth/login');
	}

	// No need to fetch videos here anymore, the store handles it
	return { accessToken };
}
