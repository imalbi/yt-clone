import { json, redirect } from '@sveltejs/kit';
import { userStore } from '$lib/stores/userStore.js';
//src/routes/api/auth/logout/+server.ts
//TODO: Implement logout functionality
export async function POST({ cookies }) {
	// Remove the authentication cookie (example: 'session')
	cookies.delete('session', { path: '/' });
	// Clear user data from the store
	userStore.set(null);
	// Optionally, you can also clear other cookies related to authentication
	cookies.delete('access_token', { path: '/' });
	cookies.delete('refresh_token', { path: '/' });
	cookies.delete('user_data', { path: '/' });

	throw redirect(302, '/'); // Redirect to the home page after logout
}
