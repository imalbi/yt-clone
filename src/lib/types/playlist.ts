/** Playlist dell'utente, ridotta a cio' che la lista mostra. */
export type Playlist = {
	id: string;
	title: string;
	description: string;
	publishedAt: string;
	thumbnail: string;
	/** Assente se l'API non ha restituito contentDetails. */
	itemCount?: number;
};
