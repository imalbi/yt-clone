// src/routes/+page.server.ts
import * as apis from '$lib/api/youtube';

export async function load({}) {
	try {
		const videosPromise = apis.getVideos();
		return {
			videos: videosPromise.then((data) => data.videos),
			nextPageToken: videosPromise.then((data) => data.nextPageToken),
			error: null
		};
	} catch (error) {
		return {
			videos: Promise.resolve([]),
			nextPageToken: Promise.resolve(undefined),
			error: error instanceof Error ? error.message : 'Errore sconosciuto'
		};
	}
}
