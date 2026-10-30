import { z } from 'zod';

/**
 * Schemi delle risposte della YouTube Data API v3.
 *
 * Sono schemi e non solo tipi perche' questo e' un confine di fiducia: i JSON
 * arrivano da un servizio esterno che puo' cambiare forma senza avvisare, e un
 * tipo TypeScript e' una promessa a compile time, non un controllo a runtime.
 * I tipi restano disponibili via `z.infer`, quindi la fonte di verita' e' una
 * sola: cambiare lo schema cambia il tipo.
 *
 * Descrivono solo i campi che l'app legge. Le chiavi sconosciute vengono
 * scartate, non rifiutate: Google aggiunge campi di continuo e non e' un motivo
 * per rompere la pagina.
 */

const thumbnail = z.object({
	url: z.string(),
	width: z.number().optional(),
	height: z.number().optional()
});

const thumbnails = z.object({
	default: thumbnail.optional(),
	medium: thumbnail.optional(),
	high: thumbnail.optional(),
	standard: thumbnail.optional(),
	maxres: thumbnail.optional()
});

export const videoItemSchema = z.object({
	id: z.string(),
	snippet: z.object({
		title: z.string(),
		description: z.string(),
		publishedAt: z.string(),
		channelId: z.string(),
		channelTitle: z.string(),
		thumbnails
	}),
	statistics: z
		.object({
			viewCount: z.string().optional(),
			likeCount: z.string().optional(),
			commentCount: z.string().optional(),
			favoriteCount: z.string().optional()
		})
		.optional(),
	// Richiesto con `part=contentDetails` da tre chiamate. La durata arriva in
	// ISO 8601 (`PT4M13S`); veniva pagata in quota e scartata.
	contentDetails: z.object({ duration: z.string().optional() }).optional()
});

/**
 * `search.list` restituisce solo gli id: i dettagli vanno chiesti a
 * `videos.list` o `channels.list`. Quale dei due campi sia valorizzato dipende
 * dal `type` richiesto, quindi sono entrambi opzionali.
 */
export const searchItemSchema = z.object({
	id: z.object({ videoId: z.string().optional(), channelId: z.string().optional() })
});

/**
 * Le categorie non assegnabili esistono ancora nell'elenco ma nessun video
 * nuovo puo' finirci: `assignable` e' il filtro che separa le chip vive dai
 * residui storici ('Film', 'Trailer', 'Shorts').
 */
export const videoCategoryItemSchema = z.object({
	id: z.string(),
	snippet: z.object({ title: z.string(), assignable: z.boolean() })
});

/** `channels.list?mine=true`: serve solo l'id del canale di chi e' loggato. */
export const channelIdSchema = z.object({ id: z.string() });

/** Corpo di un errore di Google: serve solo il motivo (`commentsDisabled`, `quotaExceeded`). */
export const errorBodySchema = z.object({
	error: z.object({ errors: z.array(z.object({ reason: z.string() })) })
});

/** `videos.getRating`: il voto di chi e' loggato a un video. */
export const ratingItemSchema = z.object({ rating: z.string() });

/** `subscriptions.list?mine=true`: serve solo l'id dell'iscrizione. */
export const subscriptionIdSchema = z.object({ id: z.string() });

/** Risorsa `playlist` (la playlist stessa), non i suoi elementi. */
export const playlistSchema = z.object({
	id: z.string(),
	snippet: z.object({
		title: z.string(),
		description: z.string(),
		publishedAt: z.string(),
		thumbnails
	}),
	contentDetails: z.object({ itemCount: z.number() }).optional()
});

export const channelItemSchema = z.object({
	id: z.string(),
	snippet: z.object({
		title: z.string(),
		description: z.string(),
		customUrl: z.string().optional(),
		publishedAt: z.string(),
		thumbnails
	}),
	statistics: z.object({
		viewCount: z.string(),
		subscriberCount: z.string(),
		hiddenSubscriberCount: z.boolean(),
		videoCount: z.string()
	}),
	brandingSettings: z
		.object({
			image: z.object({ bannerExternalUrl: z.string().optional() }).optional()
		})
		.optional()
});

const commentSchema = z.object({
	id: z.string(),
	snippet: z.object({
		authorDisplayName: z.string(),
		authorChannelId: z.object({ value: z.string() }).optional(),
		authorChannelUrl: z.string(),
		authorProfileImageUrl: z.string(),
		textDisplay: z.string(),
		publishedAt: z.string(),
		likeCount: z.number().optional()
	})
});

export const commentThreadItemSchema = z.object({
	id: z.string(),
	snippet: z.object({ topLevelComment: commentSchema }),
	replies: z.object({ comments: z.array(commentSchema) }).optional()
});

export const subscriptionItemSchema = z.object({
	id: z.string(),
	snippet: z.object({ resourceId: z.object({ channelId: z.string() }) })
});

export const playlistItemSchema = z.object({
	contentDetails: z.object({ videoId: z.string() })
});

/** Busta comune a tutti gli endpoint di lista. */
export const listEnvelopeSchema = z.object({
	items: z.array(z.unknown()).optional(),
	nextPageToken: z.string().optional(),
	prevPageToken: z.string().optional()
});

export type ApiThumbnails = z.infer<typeof thumbnails>;
export type ApiVideoItem = z.infer<typeof videoItemSchema>;
export type ApiSearchItem = z.infer<typeof searchItemSchema>;
export type ApiChannelItem = z.infer<typeof channelItemSchema>;
export type ApiComment = z.infer<typeof commentSchema>;
export type ApiCommentThreadItem = z.infer<typeof commentThreadItemSchema>;
export type ApiSubscriptionItem = z.infer<typeof subscriptionItemSchema>;
export type ApiPlaylistItem = z.infer<typeof playlistItemSchema>;
export type ApiVideoCategoryItem = z.infer<typeof videoCategoryItemSchema>;
export type ApiPlaylist = z.infer<typeof playlistSchema>;
