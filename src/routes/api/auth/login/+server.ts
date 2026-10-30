import { error, redirect } from '@sveltejs/kit';
import { PUBLIC_YOUTUBE_CLIENT_ID, PUBLIC_REDIRECT_URL } from '$app/env/public';
import { dev } from '$app/env';

// Il minimo che copre cio' che l'app fa davvero:
// force-ssl abilita videos.rate e subscriptions insert/delete oltre alla lettura,
// profile serve solo per nome e avatar. Niente upload, niente youtubepartner.
const SCOPES = [
	'https://www.googleapis.com/auth/youtube.force-ssl',
	'https://www.googleapis.com/auth/userinfo.profile'
];

export function GET({ cookies }) {
	const clientId = PUBLIC_YOUTUBE_CLIENT_ID;
	const redirectUrl = PUBLIC_REDIRECT_URL;

	// OAuth e' opzionale: senza credenziali l'app resta navigabile in sola lettura.
	if (!clientId || !redirectUrl) {
		error(503, 'Login non disponibile: credenziali OAuth non configurate.');
	}

	// Protezione CSRF: il valore viaggia con la richiesta e viene riverificato
	// nel callback, cosi un authorization code iniettato da terzi viene rifiutato.
	const state = crypto.randomUUID();
	cookies.set('oauth_state', state, {
		path: '/',
		httpOnly: true,
		secure: !dev,
		sameSite: 'lax',
		maxAge: 60 * 10
	});

	const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
	authUrl.searchParams.set('client_id', clientId);
	authUrl.searchParams.set('redirect_uri', redirectUrl);
	authUrl.searchParams.set('response_type', 'code');
	authUrl.searchParams.set('scope', SCOPES.join(' '));
	authUrl.searchParams.set('state', state);
	authUrl.searchParams.set('access_type', 'offline');
	authUrl.searchParams.set('prompt', 'consent');

	// SvelteKit 3 vieta i redirect esterni se non li dichiari. Allowlist invece
	// di `external: true`: l'unica destinazione legittima qui e' il consenso Google.
	redirect(302, authUrl.toString(), { external: ['https://accounts.google.com'] });
}
