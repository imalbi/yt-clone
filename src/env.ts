import { defineEnvVars } from '@sveltejs/kit/env';

/**
 * YOUTUBE_API_KEY non ha schema, quindi Kit pretende che sia presente all'avvio:
 * senza, l'app non ha niente da mostrare, e fallire subito e' meglio che
 * scoprirlo a ogni richiesta. Con `$env/dynamic/private` una chiave mancante
 * arrivava come `undefined` e nessuno se ne accorgeva.
 *
 * Le tre credenziali OAuth restano opzionali di proposito: senza, il sito resta
 * navigabile in sola lettura (vedi api/auth/login). `(value) => value` le
 * tipizza `string | undefined`, cosi le guardie che gia' esistono restano vere
 * anche per il compilatore, invece di controllare una stringa che il tipo
 * dichiara sempre piena.
 */
export const variables = defineEnvVars({
	// Deve restare dinamica: Vitest carica `.env.test` nello stesso `.svelte-kit`
	// del dev server. Se fosse statica, quel valore verrebbe scritto come literal
	// nel modulo dev generato e resterebbe li' anche dopo la fine dei test.
	YOUTUBE_API_KEY: {},
	PUBLIC_YOUTUBE_CLIENT_ID: { public: true, schema: (value) => value },
	YOUTUBE_CLIENT_SECRET: { schema: (value) => value },
	PUBLIC_REDIRECT_URL: { public: true, schema: (value) => value }
});
