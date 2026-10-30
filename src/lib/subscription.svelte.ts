import { subscribe, subscriptionStatus, unsubscribe } from '#lib/youtube.remote.js';

/**
 * Stato di iscrizione a un canale, condiviso fra ChannelHeader e videoPlayer.
 *
 * I due componenti avevano la stessa logica copiata: query dello stato, toggle,
 * gestione dell'errore. Una copia sola evita di ripetere quello che era gia'
 * successo ai quattro mapper video in youtube.ts.
 *
 * La query e' la stessa funzione con lo stesso argomento, quindi montati insieme
 * i due componenti fanno una richiesta sola, come prima faceva la query key.
 *
 * L'aggiornamento ottimistico e il rollback erano tre callback
 * (onMutate/onError/onSettled) piu' una copia manuale del valore precedente.
 * Ora sono `withOverride`: se il comando fallisce, l'override viene scartato da
 * se'; se riesce, il valore vero torna insieme alla risposta perche' e' il
 * comando stesso a rinfrescare la lettura, lato server.
 */
export function subscriptionState(channelId: () => string, enabled: () => boolean) {
	// Fuori sessione la lettura risponderebbe comunque `false`, ma senza query
	// non parte proprio la richiesta. L'id e' vuoto finche' il video non e' li'.
	const status = $derived(enabled() && channelId() ? subscriptionStatus(channelId()) : undefined);

	return {
		get isSubscribed() {
			return status?.current?.isSubscribed ?? false;
		},
		/**
		 * ponytail: `pending` conta le esecuzioni del comando ovunque, non per
		 * canale. Di bottoni "Iscriviti" ce n'e' uno per schermata; se ne
		 * servissero due indipendenti, qui va uno `$state` locale.
		 */
		get isPending() {
			return subscribe.pending > 0 || unsubscribe.pending > 0;
		},
		async toggle() {
			const current = status;
			if (!current?.ready) return;

			try {
				if (current.current.isSubscribed && current.current.subscriptionId) {
					await unsubscribe({
						channelId: channelId(),
						subscriptionId: current.current.subscriptionId
					}).updates(current.withOverride((it) => ({ ...it, isSubscribed: false })));
				} else {
					await subscribe(channelId()).updates(
						current.withOverride((it) => ({ ...it, isSubscribed: true }))
					);
				}
			} catch (cause) {
				// L'override viene scartato da se', quindi il bottone torna com'era.
				console.error('Iscrizione fallita:', cause);
			}
		}
	};
}
