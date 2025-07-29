// src/routes/api/auth/login/+server.ts

import { redirect } from '@sveltejs/kit';
import { PUBLIC_YOUTUBE_CLIENT_ID, PUBLIC_REDIRECT_URL } from '$env/static/public';

export function GET() {
	const youtubeAuthURL = new URL('https://accounts.google.com/o/oauth2/v2/auth');

	youtubeAuthURL.searchParams.set('client_id', PUBLIC_YOUTUBE_CLIENT_ID);
	youtubeAuthURL.searchParams.set('redirect_uri', PUBLIC_REDIRECT_URL);
	youtubeAuthURL.searchParams.set('response_type', 'code');
	youtubeAuthURL.searchParams.set(
		'scope',
		'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
	);
	youtubeAuthURL.searchParams.set('access_type', 'offline'); // Necessario per ottenere un refresh_token
	youtubeAuthURL.searchParams.set('prompt', 'consent'); // Forza la richiesta di consenso

	// Reindirizza l'utente alla pagina di login di YouTube
	throw redirect(302, youtubeAuthURL.toString());
}
