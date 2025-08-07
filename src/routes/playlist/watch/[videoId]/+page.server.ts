// src/routes/playlist/watch/[videoId]/+page.server.ts
import * as apis from '$lib/api/youtube';

export async function load({ params }) {
	try {
		const videoId = params.videoId;
		const videoPromise = apis.getVideoById(videoId);
		const commentsPromise = apis.getComments(videoId);

		return {
			video: videoPromise,
			comments: commentsPromise.then((data) => data.comments),
			commentsNextPageToken: commentsPromise.then((data) => data.nextPageToken),
			error: null
		};
	} catch (error) {
		return {
			video: Promise.resolve(null),
			comments: Promise.resolve([]),
			commentsNextPageToken: Promise.resolve(undefined),
			error: error instanceof Error ? error.message : 'Errore sconosciuto'
		};
	}
}
