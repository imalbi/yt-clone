import type { Handle, HandleServerError } from '@sveltejs/kit/hooks';
import { clearSession, type CookieJar } from '#lib/cookies.js';
import { YouTubeApiError } from '#lib/api/youtube.js';
import { describeUpstreamError } from '#lib/api/http.js';
import { PUBLIC_YOUTUBE_CLIENT_ID } from '$app/env/public';
import { YOUTUBE_CLIENT_SECRET } from '$app/env/private';
import { dev } from '$app/env';

const cookieBase = { path: '/' as const, httpOnly: true, secure: !dev, sameSite: 'lax' as const };

/**
 * Il cookie access_token scade insieme al token (maxAge = expires_in), quindi la
 * sua assenza e' il segnale di scadenza: se manca ma il refresh token c'e'
 * ancora, si rinnova. Senza questo il refresh token veniva salvato e mai usato,
 * e la sessione moriva dopo un'ora.
 *
 * ponytail: nessun lock. Due richieste concorrenti dopo la scadenza fanno due
 * refresh; Google li accetta entrambi. Serve un lock solo se diventa rumoroso.
 */
async function refreshAccessToken(cookies: CookieJar): Promise<string | undefined> {
	const refreshToken = cookies.get('refresh_token');
	const clientId = PUBLIC_YOUTUBE_CLIENT_ID;
	const clientSecret = YOUTUBE_CLIENT_SECRET;

	if (!refreshToken || !clientId || !clientSecret) return undefined;

	let response: Response;
	try {
		response = await fetch('https://oauth2.googleapis.com/token', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({
				client_id: clientId,
				client_secret: clientSecret,
				refresh_token: refreshToken,
				grant_type: 'refresh_token'
			})
		});
	} catch (cause) {
		// Google irraggiungibile: la sessione non e' persa, il prossimo giro riprova.
		// Senza questo catch ogni pagina di chi e' loggato risponderebbe 500.
		console.error(
			'Refresh del token non raggiunto:',
			cause instanceof Error ? cause.message : cause
		);
		return undefined;
	}

	const tokens = await response.json().catch(() => null);

	if (!response.ok || !tokens?.access_token) {
		console.error('Refresh del token fallito:', tokens?.error ?? response.status);
		// Un rifiuto (4xx: revocato, scaduto) chiude la sessione. Un guasto 5xx di
		// Google no: il refresh token e' ancora buono e cancellarlo slogga chi non
		// ha fatto nulla.
		if (response.status < 500) clearSession(cookies);
		return undefined;
	}

	cookies.set('access_token', tokens.access_token, {
		...cookieBase,
		maxAge: tokens.expires_in
	});

	return tokens.access_token;
}

function readUser(cookies: CookieJar): App.Locals['user'] {
	const raw = cookies.get('user_data');
	if (!raw) return null;
	try {
		const { name, picture } = JSON.parse(raw);
		return typeof name === 'string' ? { name, picture } : null;
	} catch {
		// Un cookie manomesso non deve far saltare ogni pagina del sito.
		cookies.delete('user_data', { path: '/' });
		return null;
	}
}

/**
 * Estratta da `handle` per poter essere testata con un barattolo di cookie
 * finto: prende solo cio' che le serve invece dell'intero RequestEvent.
 */
export async function resolveSession(cookies: CookieJar): Promise<App.Locals> {
	const accessToken = cookies.get('access_token') ?? (await refreshAccessToken(cookies));
	return { accessToken, user: accessToken ? readUser(cookies) : null };
}

export const handle: Handle = async ({ event, resolve }) => {
	Object.assign(event.locals, await resolveSession(event.cookies));
	return resolve(event);
};

/**
 * L'unico punto in cui un errore di Google diventa una risposta HTTP, per `load`,
 * endpoint e remote functions: chi chiama il layer API lascia salire l'eccezione.
 *
 * Con un hook proprio Kit non usa piu' quello di default, che stampava gli errori
 * sconosciuti e le validazioni fallite: lo rifacciamo qui. 404 e simili (`app`,
 * `framework`) sono routine e restano fuori dal log.
 */
export const handleError: HandleServerError = ({ kind, error, event, issues }) => {
	if (kind === 'validation') {
		console.error('Remote function schema validation failed:', issues);
		return;
	}
	if (kind !== 'unknown') return;

	console.error(`[${event.request.method} ${event.url.pathname}]`, error);
	if (error instanceof YouTubeApiError) return describeUpstreamError(error);
};
