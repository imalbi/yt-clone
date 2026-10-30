import { command, getRequestEvent, query } from '$app/server';
import { error } from '@sveltejs/kit';
import { z } from 'zod';
import * as api from '#lib/api/youtube.js';

/**
 * Le chiamate autenticate che non sono paginate. Prima erano sei endpoint sotto
 * /api/user piu' i verbi di scrittura di /api/comments, e ogni chiamata andava
 * scritta due volte: una nell'handler e una nel wrapper fetch di queries.ts.
 * Qui la firma e' una sola e vale da entrambe le parti.
 *
 * Le liste paginate (home, ricerca, commenti in lettura, playlist) restano sugli
 * endpoint e su TanStack Query: `getNextPageParam` non ha un equivalente qui.
 *
 * Gli errori di Google non si catturano qui: salgono fino a `handleError` in
 * hooks.server.ts, che e' l'unico punto che li traduce in stato e messaggio.
 */

type LikeStatus = { videoLiked: boolean | null };
type SubscriptionStatus = { isSubscribed: boolean; subscriptionId?: string };

/** Le scritture pretendono una sessione. Le letture no: vedi sotto. */
function requireToken(): string {
	const { locals } = getRequestEvent();
	if (!locals.accessToken) error(401, 'Non autenticato');
	return locals.accessToken;
}

// --- Letture ---------------------------------------------------------------

/**
 * Fuori sessione queste tre non sono un errore ma uno stato noto: senza login
 * non c'e' like, non c'e' iscrizione, non c'e' canale. Rispondere 401 vorrebbe
 * dire un errore per ogni pagina aperta da chi non e' loggato. Prima la
 * chiamata la tratteneva `enabled` di TanStack, lato client; ora e' una riga qui.
 */
const toLikeStatus = (rating: 'like' | 'dislike' | 'none'): LikeStatus => ({
	videoLiked: rating === 'like' ? true : rating === 'dislike' ? false : null
});

export const likeStatus = query(z.string(), async (videoId): Promise<LikeStatus> => {
	const { locals } = getRequestEvent();
	if (!locals.accessToken) return { videoLiked: null };

	return toLikeStatus(await api.getMyRating(videoId, locals.accessToken));
});

export const subscriptionStatus = query(
	z.string(),
	async (channelId): Promise<SubscriptionStatus> => {
		const { locals } = getRequestEvent();
		if (!locals.accessToken) return { isSubscribed: false };

		const subscriptionId = await api.getMySubscriptionId(channelId, locals.accessToken);
		return subscriptionId ? { isSubscribed: true, subscriptionId } : { isSubscribed: false };
	}
);

/** Serve a sapere quali commenti sono propri, e quindi modificabili. */
export const myChannelId = query(async (): Promise<string | null> => {
	const { locals } = getRequestEvent();
	if (!locals.accessToken) return null;

	return api.getMyChannelId(locals.accessToken);
});

// --- Scritture -------------------------------------------------------------

/**
 * Ogni comando aggiorna da se' la lettura che lo riguarda. `set()` chiamata qui
 * sul server manda il valore insieme alla risposta del comando, quindi il
 * bottone si assesta senza un secondo giro di rete e senza rileggere da Google.
 */
export const rateVideo = command(
	z.object({ videoId: z.string().min(1), rating: z.enum(['like', 'dislike', 'none']) }),
	async ({ videoId, rating }) => {
		await api.rateVideo(videoId, rating, requireToken());

		// Non si rilegge da Google: subito dopo la scrittura `getRating` risponde a
		// volte col voto precedente (misurato: 2 volte su 15), e quel valore
		// vecchio tornerebbe al client riportando il pollice com'era.
		likeStatus(videoId).set(toLikeStatus(rating));
	}
);

export const subscribe = command(z.string().min(1), async (channelId) => {
	const subscriptionId = await api.subscribeToChannel(channelId, requireToken());

	// L'id arriva con la risposta: rileggerlo da Google subito dopo la scrittura
	// puo' restituire lo stato di prima, come succedeva al like.
	subscriptionStatus(channelId).set({ isSubscribed: true, subscriptionId });
});

/** Il channelId non serve a Google, serve a sapere quale lettura aggiornare. */
export const unsubscribe = command(
	z.object({ channelId: z.string().min(1), subscriptionId: z.string().min(1) }),
	async ({ channelId, subscriptionId }) => {
		await api.unsubscribeFromChannel(subscriptionId, requireToken());

		subscriptionStatus(channelId).set({ isSubscribed: false });
	}
);

export const postComment = command(
	z.object({ videoId: z.string().min(1), text: z.string().trim().min(1) }),
	async ({ videoId, text }) => {
		const accessToken = requireToken();

		// L'API vuole il canale che ha caricato il video. Lo risolve il server, che
		// ce l'ha gia' in cache: al client non serve conoscerlo per commentare.
		const video = await api.getVideoById(videoId);
		if (!video) error(404, 'Video non trovato');

		await api.postComment(videoId, video.channelId, text, accessToken);
	}
);

/** Una risposta e' lo stesso verbo su un'altra risorsa: ha un genitore invece
 * di un video, e non serve risolvere chi ha caricato il video. */
export const postReply = command(
	z.object({ parentId: z.string().min(1), text: z.string().trim().min(1) }),
	async ({ parentId, text }) => {
		await api.replyToComment(parentId, text, requireToken());
	}
);

export const updateComment = command(
	z.object({ commentId: z.string().min(1), text: z.string().trim().min(1) }),
	async ({ commentId, text }) => {
		await api.updateComment(commentId, text, requireToken());
	}
);

export const deleteComment = command(z.string().min(1), async (commentId) => {
	await api.deleteComment(commentId, requireToken());
});
