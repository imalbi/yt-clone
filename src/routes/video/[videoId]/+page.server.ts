// src/routes/video/[videoId]/+page.server.ts
import * as apis from '$lib/api/youtube';

export async function load({ params }) {
	try {
		const videoId = params.videoId;
		const videoPromise = apis.getVideoById(videoId);
		const commentsPromise = apis.getComments(videoId);
		const relatedVideosPromise = apis.getVideos(10);

		return {
			video: videoPromise,
			comments: commentsPromise,
			relatedVideos: relatedVideosPromise.then((data) => data.videos),
			nextPageToken: relatedVideosPromise.then((data) => data.nextPageToken),
			error: null
		};
	} catch (error) {
		return {
			video: Promise.resolve(null),
			comments: Promise.resolve([]),
			relatedVideos: Promise.resolve([]),
			nextPageToken: Promise.resolve(undefined),
			error: error instanceof Error ? error.message : 'Errore sconosciuto'
		};
	}
}
