import { redirect } from '@sveltejs/kit';
import { PUBLIC_YOUTUBE_CLIENT_ID, PUBLIC_REDIRECT_URL } from '$app/env/public';
import { YOUTUBE_CLIENT_SECRET } from '$app/env/private';
import { dev } from '$app/env';
import type { CookieJar } from '#lib/cookies.js';

const cookieBase = { path: '/' as const, httpOnly: true, secure: !dev, sameSite: 'lax' as const };

/**
 * Estratta da GET per la stessa ragione di resolveSession: prende url e cookie,
 * non l'intero RequestEvent, cosi il test dello state puo' passare oggetti veri
 * invece di forzare il tipo.
 */
export async function handleCallback({
	url,
	cookies
}: {
	url: URL;
	cookies: CookieJar;
}): Promise<never> {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const expectedState = cookies.get('oauth_state');

	// Consumato in ogni caso: uno state e' valido una volta sola.
	cookies.delete('oauth_state', { path: '/' });

	// Senza code l'utente ha negato l'accesso. Senza state combaciante la
	// richiesta non e' partita da noi: in entrambi i casi non si scambia nulla.
	if (!code || !state || !expectedState || state !== expectedState) {
		redirect(302, '/');
	}

	const clientId = PUBLIC_YOUTUBE_CLIENT_ID;
	const clientSecret = YOUTUBE_CLIENT_SECRET;
	const redirectUrl = PUBLIC_REDIRECT_URL;

	if (!clientId || !clientSecret || !redirectUrl) {
		redirect(302, '/');
	}

	const response = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			code,
			client_id: clientId,
			client_secret: clientSecret,
			redirect_uri: redirectUrl,
			grant_type: 'authorization_code'
		})
	});

	const tokens = await response.json();

	if (!response.ok || tokens.error) {
		// tokens.error e' un codice OAuth ('invalid_grant'), non contiene segreti.
		console.error('Scambio del token fallito:', tokens.error ?? response.status);
		redirect(302, '/');
	}

	cookies.set('access_token', tokens.access_token, {
		...cookieBase,
		maxAge: tokens.expires_in
	});

	if (tokens.refresh_token) {
		cookies.set('refresh_token', tokens.refresh_token, {
			...cookieBase,
			maxAge: 60 * 60 * 24 * 30
		});
	}

	const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
		headers: { Authorization: `Bearer ${tokens.access_token}` }
	});

	if (userResponse.ok) {
		const { name, picture } = await userResponse.json();
		cookies.set('user_data', JSON.stringify({ name, picture }), {
			...cookieBase,
			maxAge: 60 * 60 * 24 * 30
		});
	} else {
		console.error('Recupero del profilo fallito:', userResponse.status);
	}

	redirect(302, '/');
}
