import { redirect } from '@sveltejs/kit';
import { clearSession } from '#lib/cookies.js';

/**
 * La sessione vive nei cookie, quindi cancellarli e' tutto il logout.
 *
 * Qui c'era anche `userStore.set(null)`: una scrittura lato server su uno store
 * di modulo, cioe' su un valore condiviso da tutte le richieste del processo.
 * Non serviva (dopo il redirect il client rilegge `data.user` dal load) ed e' la
 * strada piu' corta per far comparire i dati di un utente nella pagina di un
 * altro. Spariva anche un cookie 'session' che nessuno ha mai creato.
 */
export function POST({ cookies }) {
	clearSession(cookies);

	redirect(302, '/');
}
