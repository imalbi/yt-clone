import { describe, it, expect, vi, afterEach } from 'vitest';
import { isRedirect } from '@sveltejs/kit';
import type { CookieJar } from '#lib/cookies.js';
import { handleCallback } from '#lib/auth.js';

afterEach(() => {
	vi.unstubAllGlobals();
});

/** Barattolo minimale: combacia con `CookieJar` senza bisogno di forzare il tipo. */
function fakeCookies(initial: Record<string, string> = {}) {
	const jar = new Map(Object.entries(initial));
	const cookies: CookieJar = {
		get: (name) => jar.get(name),
		set: (name, value) => void jar.set(name, value),
		delete: (name) => void jar.delete(name)
	};
	return { cookies, jar };
}

const callbackUrl = (params: Record<string, string>) =>
	new URL(`http://localhost/api/auth/callback?${new URLSearchParams(params)}`);

/**
 * Senza verifica dello state, un attaccante puo' far arrivare alla vittima un
 * authorization code proprio e legare la sessione della vittima al suo account.
 * Questi test falliscono se il controllo viene rimosso.
 */
describe('callback OAuth', () => {
	it('rifiuta uno state che non combacia col cookie, senza scambiare il code', async () => {
		const fetchMock = vi.fn();
		vi.stubGlobal('fetch', fetchMock);
		const { cookies, jar } = fakeCookies({ oauth_state: 'atteso' });

		const result = await handleCallback({
			url: callbackUrl({ code: 'code-iniettato', state: 'contraffatto' }),
			cookies
		}).catch((e: unknown) => e);

		expect(isRedirect(result)).toBe(true);
		expect(fetchMock).not.toHaveBeenCalled();
		expect(jar.has('access_token')).toBe(false);
	});

	it('rifiuta una richiesta senza cookie di state', async () => {
		const fetchMock = vi.fn();
		vi.stubGlobal('fetch', fetchMock);
		const { cookies } = fakeCookies();

		const result = await handleCallback({
			url: callbackUrl({ code: 'un-code', state: 'uno-state' }),
			cookies
		}).catch((e: unknown) => e);

		expect(isRedirect(result)).toBe(true);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('consuma il cookie di state cosi non e’ riutilizzabile', async () => {
		vi.stubGlobal('fetch', vi.fn());
		const { cookies, jar } = fakeCookies({ oauth_state: 'atteso' });

		await handleCallback({
			url: callbackUrl({ code: 'un-code', state: 'contraffatto' }),
			cookies
		}).catch(() => undefined);

		expect(jar.has('oauth_state')).toBe(false);
	});
});
