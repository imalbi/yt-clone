/**
 * Finto server con memoria per il test di videoPlayer: valutare cambia cio' che
 * la lettura risponde dopo. Con una risposta fissa il secondo click non
 * proverebbe niente, perche' lo stato tornerebbe sempre quello iniziale.
 *
 * Sta in un file a parte, e con l'infisso `.svelte.`, perche' `videoLiked` deve
 * essere reattivo: il componente lo legge dentro un `$derived`, e le rune
 * esistono solo qui.
 */

type Like = { videoLiked: boolean | null };

/** I rating passati al comando, nell'ordine in cui sono partiti. */
export const ratings: string[] = [];

let videoLiked = $state<boolean | null>(null);

export function reset() {
	ratings.length = 0;
	videoLiked = null;
}

export function setVideoLiked(value: boolean | null) {
	videoLiked = value;
}

/** `updates()` sul server rinfresca la lettura; qui l'ha gia' fatto chi chiama. */
const settled = () => Object.assign(Promise.resolve(), { updates: () => Promise.resolve() });
const discard = () => {};

export const likeStatus = () => ({
	ready: true as const,
	get current(): Like {
		return { videoLiked };
	},
	withOverride(update: (it: Like) => Like) {
		videoLiked = update({ videoLiked }).videoLiked;
		return discard;
	}
});

export const rateVideo = Object.assign(
	({ rating }: { videoId: string; rating: 'like' | 'dislike' | 'none' }) => {
		ratings.push(rating);
		return settled();
	},
	{ pending: 0 }
);

// Il player monta anche il bottone di iscrizione: senza queste, subscriptionState
// esplode prima che il test arrivi al pollice.
export const subscriptionStatus = () => ({
	ready: true as const,
	current: { isSubscribed: false, subscriptionId: undefined as string | undefined },
	withOverride: () => discard
});

export const subscribe = Object.assign(() => settled(), { pending: 0 });

export const unsubscribe = Object.assign(() => settled(), { pending: 0 });
