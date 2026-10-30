import type { Cookies } from '@sveltejs/kit';

/**
 * Il sottoinsieme di `Cookies` che questo codice usa davvero.
 *
 * Restringere la firma a get/set/delete significa che un test puo' passare un
 * barattolo finto e farlo verificare dal compilatore, invece di zittirlo con un
 * `as never` perche' il tipo completo ha metodi che nessuno chiama.
 */
export type CookieJar = Pick<Cookies, 'get' | 'set' | 'delete'>;

/**
 * Chiude la sessione. I nomi dei cookie stavano scritti in due posti (l'hook e
 * il logout): il giorno che ne cambia uno, l'altro resta indietro e la sessione
 * si chiude a meta'.
 */
export function clearSession(cookies: CookieJar) {
	cookies.delete('access_token', { path: '/' });
	cookies.delete('refresh_token', { path: '/' });
	cookies.delete('user_data', { path: '/' });
}
