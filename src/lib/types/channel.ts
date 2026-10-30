import type { ApiThumbnails } from '#lib/types/youtube-api.js';

export interface Channel {
	id: string;
	/** Presente solo per i canali a cui l'utente e' iscritto. */
	subscriptionId?: string;
	title: string;
	description: string;
	customUrl: string;
	publishedAt: string;
	/**
	 * Stesso tipo dello schema che valida la risposta: erano due dichiarazioni
	 * separate tenute insieme da un cast, e divergevano — lo schema segnava le
	 * thumbnail come opzionali, questo tipo le pretendeva, e chi le leggeva senza
	 * guardia sarebbe esploso su un canale che non le espone.
	 */
	thumbnails: ApiThumbnails;
	statistics: {
		viewCount: string;
		subscriberCount: string;
		hiddenSubscriberCount: boolean;
		videoCount: string;
	};
	brandingSettings?: {
		image?: {
			bannerExternalUrl: string;
		};
	};
}
