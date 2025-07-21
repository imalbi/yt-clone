// src/routes/+page.server.ts
import * as apis from '$lib/api/youtube';
//TODO: add a store for videos to avoid fetching them multiple times
export async function load({}) {
	try {
		const videosPromise = apis.getVideos();
		return { videos: videosPromise, error: null };
	} catch (error) {
		return {
			videos: Promise.resolve([]),
			error: error instanceof Error ? error.message : 'Errore sconosciuto'
		};
	}
}
