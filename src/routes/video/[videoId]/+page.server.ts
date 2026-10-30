import * as apis from '#lib/api/youtube.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { videoId } = params;
	const comments = apis.getComments(videoId);
	const related = apis.getVideos(10);

	// Ogni promise viaggia in streaming e viene attesa dal componente o dalla
	// query che la consuma; nessun try/catch qui, perche' queste funzioni sono
	// async e non lanciano mai in modo sincrono.
	return {
		videoId,
		video: apis.getVideoById(videoId),
		commentsFirstPage: comments,
		relatedFirstPage: related.then((data) => ({
			videos: data.videos,
			nextPageToken: data.nextPageToken
		}))
	};
};
