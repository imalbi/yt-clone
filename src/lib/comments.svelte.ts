import { useQueryClient } from '@tanstack/svelte-query';
import { queryKeys } from '#lib/queries.js';
import { deleteComment, postReply, updateComment } from '#lib/youtube.remote.js';

/**
 * Modifica, eliminazione e risposta, condivise fra il commento in cima e
 * le sue risposte: per la Data API sono la stessa risorsa, quindi lo stesso
 * codice le tratta entrambe.
 *
 * Nessun aggiornamento ottimistico come per il like: qui il rifiuto di Google
 * e' un caso normale (il commento di un altro) e mostrare la modifica prima di
 * sapere che e' andata a buon fine sarebbe una bugia sullo schermo.
 *
 * Un comando non porta con se' l'esito come faceva `mutation.error`, e il
 * messaggio va mostrato accanto al campo: sta qui invece che ripetuto nei tre
 * punti che possono fallire.
 */
export function commentActions(videoId: () => string) {
	const client = useQueryClient();

	let failure = $state<string | undefined>();

	async function run(action: () => Promise<unknown>, onSuccess?: () => void) {
		failure = undefined;
		try {
			await action();
			// La lista dei commenti e' paginata, quindi resta su TanStack: a
			// ricaricarla e' questa invalidazione, non il comando.
			await client.invalidateQueries({ queryKey: queryKeys.comments(videoId()) });
			onSuccess?.();
		} catch (cause) {
			failure = cause instanceof Error ? cause.message : 'Operazione fallita';
		}
	}

	return {
		/** Il modulo e' in attesa: vale sia per la modifica sia per la risposta. */
		get busy() {
			return updateComment.pending > 0 || postReply.pending > 0;
		},
		get removing() {
			return deleteComment.pending > 0;
		},
		get failure() {
			return failure;
		},
		reset: () => (failure = undefined),
		edit: (commentId: string, text: string, onSuccess: () => void) =>
			run(() => updateComment({ commentId, text }), onSuccess),
		reply: (parentId: string, text: string, onSuccess: () => void) =>
			run(() => postReply({ parentId, text }), onSuccess),
		remove: (commentId: string) => run(() => deleteComment(commentId))
	};
}
