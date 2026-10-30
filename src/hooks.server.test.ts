import { describe, it, expect, vi, afterEach } from 'vitest';
import type { CookieJar } from '#lib/cookies.js';
import { resolveSession } from './hooks.server';

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

describe('hook di sessione', () => {
	it('non rinnova nulla se il token e’ ancora valido', async () => {
		const fetchMock = vi.fn();
		vi.stubGlobal('fetch', fetchMock);
		const { cookies } = fakeCookies({ access_token: 'ancora-buono' });

		const locals = await resolveSession(cookies);

		expect(fetchMock).not.toHaveBeenCalled();
		expect(locals.accessToken).toBe('ancora-buono');
	});

	// Il cookie access_token scade col token, quindi la sua assenza e' il segnale.
	// Prima di questo hook il refresh token veniva salvato e mai usato.
	it('rinnova quando il token e’ scaduto ma il refresh token c’e’', async () => {
		const fetchMock = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({ access_token: 'appena-emesso', expires_in: 3600 })
		});
		vi.stubGlobal('fetch', fetchMock);
		const { cookies, jar } = fakeCookies({ refresh_token: 'refresh-valido' });

		const locals = await resolveSession(cookies);

		expect(fetchMock).toHaveBeenCalledOnce();
		expect(locals.accessToken).toBe('appena-emesso');
		expect(jar.get('access_token')).toBe('appena-emesso');
	});

	it('svuota la sessione se il refresh token e’ stato revocato', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: false,
				status: 400,
				json: async () => ({ error: 'invalid_grant' })
			})
		);
		vi.spyOn(console, 'error').mockImplementation(() => {});
		const { cookies, jar } = fakeCookies({
			refresh_token: 'revocato',
			user_data: '{"name":"Tizio"}'
		});

		const locals = await resolveSession(cookies);

		expect(locals.accessToken).toBeUndefined();
		expect(locals.user).toBeNull();
		expect(jar.has('refresh_token')).toBe(false);
		expect(jar.has('user_data')).toBe(false);
	});

	// Un guasto di Google non e' una revoca: la sessione e' ancora buona e il
	// prossimo giro puo' rinnovarla. Cancellarla slogga chi non ha fatto nulla.
	it('tiene la sessione se Google risponde con un guasto 5xx', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({ ok: false, status: 503, json: async () => ({}) })
		);
		vi.spyOn(console, 'error').mockImplementation(() => {});
		const { cookies, jar } = fakeCookies({
			refresh_token: 'valido',
			user_data: '{"name":"Tizio"}'
		});

		const locals = await resolveSession(cookies);

		expect(locals.accessToken).toBeUndefined();
		expect(jar.get('refresh_token')).toBe('valido');
		expect(jar.has('user_data')).toBe(true);
	});

	it('tiene la sessione e non fa saltare la pagina se Google non e’ raggiungibile', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('fetch failed')));
		vi.spyOn(console, 'error').mockImplementation(() => {});
		const { cookies, jar } = fakeCookies({ refresh_token: 'valido' });

		const locals = await resolveSession(cookies);

		expect(locals.accessToken).toBeUndefined();
		expect(jar.get('refresh_token')).toBe('valido');
	});

	it('sopravvive a un cookie utente manomesso invece di far saltare la pagina', async () => {
		vi.stubGlobal('fetch', vi.fn());
		const { cookies, jar } = fakeCookies({ access_token: 'buono', user_data: 'non-e-json{{{' });

		const locals = await resolveSession(cookies);

		expect(locals.user).toBeNull();
		expect(jar.has('user_data')).toBe(false);
	});
});
