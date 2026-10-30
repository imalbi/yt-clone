import type { ApiThumbnails } from '#lib/types/youtube-api.js';

// Colori fissi invece che generati: sei tinte scelte per reggere il testo
// bianco sopra, che un hue casuale non garantisce.
const TINTE = ['#8b5a2b', '#3f6ad8', '#2e8b57', '#a13d63', '#6a4fb6', '#b5651d'];

/**
 * Le iniziali di un nome, al massimo due. Tiene solo lettere e cifre: il nome
 * lo sceglie chi commenta e finisce dentro un SVG, dove un '<' romperebbe il
 * documento. Scartare invece di scappare e' piu' corto e non lascia buchi.
 */
function iniziali(name: string): string {
	const parole = name
		.replace(/^@/, '')
		.split(/[\s._-]+/)
		.filter(Boolean);

	return parole
		.slice(0, 2)
		.map((parola) => [...parola][0] ?? '')
		.join('')
		.replace(/[^\p{L}\p{N}]/gu, '')
		.toUpperCase();
}

/**
 * Cerchio con le iniziali, come fa Google quando un account non ha foto.
 * Senza nome resta il cerchio grigio e basta.
 *
 * E' un data URI e non un servizio esterno: il fallback precedente puntava a
 * via.placeholder.com, che non risponde piu'.
 */
export function initialsAvatar(name?: string): string {
	const testo = name?.trim() ? iniziali(name) : '';

	// Somma dei code point invece di un indice casuale: la stessa persona deve
	// avere lo stesso colore a ogni render, anche fra server e client.
	const tinta = testo
		? TINTE[[...testo].reduce((somma, c) => somma + (c.codePointAt(0) ?? 0), 0) % TINTE.length]
		: '#606060';

	const lettere = testo
		? `<text x="44" y="44" dy=".35em" text-anchor="middle" font-family="sans-serif" font-size="${testo.length > 1 ? 34 : 42}" fill="#fff">${testo}</text>`
		: '';

	return (
		'data:image/svg+xml,' +
		// Il cancelletto va scritto tale e quale: encodeURIComponent lo trasforma
		// gia' lui in %23. Scrivendo %23 a mano usciva %2523, cioe' un colore che
		// non esiste, e il cerchio veniva nero invece che grigio.
		encodeURIComponent(
			`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 88"><circle cx="44" cy="44" r="44" fill="${tinta}"/>${lettere}</svg>`
		)
	);
}

/** Il cerchio senza iniziali, per quando un nome non c'e' proprio. */
export const FALLBACK_AVATAR = initialsAvatar();

/**
 * L'API non garantisce nessuna delle dimensioni, quindi si prende la prima
 * disponibile. Il tipo lo dice — prima un cast lo nascondeva e chi leggeva
 * `.default.url` direttamente sarebbe esploso su un canale senza thumbnail.
 */
export function avatarUrl(thumbnails: ApiThumbnails | undefined, name?: string): string {
	const url = thumbnails?.medium?.url ?? thumbnails?.default?.url ?? thumbnails?.high?.url;
	if (!url) return initialsAvatar(name);

	// Normalizza la dimensione richiesta a Google, che altrimenti serve
	// l'immagine alla risoluzione con cui e' stata indicizzata.
	return url.replace(/=s\d+-c-k-c0x00ffffff-no-rj/, '=s240-c-k-c0x00ffffff-no-rj');
}

/**
 * Rimpiazza un avatar che non si carica. Serve dove l'indirizzo arriva da
 * Google cosi' com'e' (chi commenta, chi e' loggato) invece che da
 * `avatarUrl`, che un fallback ce l'ha gia' dentro.
 */
export function onAvatarError(event: Event, fallback: string = FALLBACK_AVATAR) {
	// Svelte tipa il gestore su Element generico: il controllo e' quello che
	// tiene il repo senza cast.
	const image = event.currentTarget;
	if (!(image instanceof HTMLImageElement)) return;

	// Azzerato prima di riassegnare: se anche il fallback fallisse si
	// rientrerebbe qui a ogni giro.
	image.onerror = null;
	image.src = fallback;
}
