export type Video = {
	id: string;
	publishedAt: string;
	channelId: string;
	title: string;
	desc: string;
	thumbnails: {
		default: string;
		medium: string;
		high: string;
		standard?: string;
		maxres?: string;
	};
	channelTitle: string;
	/** Metadata del canale già ottenuta durante l'idratazione del video. */
	channelSubscriberCount?: string;
	channelSubscriberCountHidden?: boolean;
	statistics: {
		viewCount: string;
		likeCount?: string;
		favoriteCount: string;
		commentCount?: string;
	};
	avatarUrl: string;
	/** Secondi. Assente se l'endpoint non ha restituito contentDetails. */
	durationSeconds?: number;
};
