// src/routes/video/[videoId]/+page.server.ts
import * as apis from '$lib/api/youtube';
//TODO: add a store for videos to avoid fetching them multiple times
export async function load({ params }) {
	try {
		const videoId = params.videoId;
		const videoPromise = apis.getVideoById(videoId);
		const commentsPromise = apis.getComments(videoId);

		return { video: videoPromise, comments: commentsPromise, error: null };
	} catch (error) {
		return {
			video: Promise.resolve(null),
			comments: Promise.resolve([]),
			error: error instanceof Error ? error.message : 'Errore sconosciuto'
		};
	}
}
