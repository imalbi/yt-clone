import { error } from '@sveltejs/kit';
import * as apis from '#lib/api/youtube.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { videoId } = params;

	// Il video si attende qui: una volta iniziato lo streaming lo stato HTTP non
	// si cambia piu', e un id inesistente deve rispondere 404, non 200.
	const video = await apis.getVideoById(videoId);
	if (!video) error(404, 'Video non trovato');

	// Commenti e correlati viaggiano in streaming e li attende la query che li usa.
	const comments = apis.getComments(videoId);
	const related = apis.getVideos(10);

	return {
		videoId,
		video,
		commentsFirstPage: comments,
		relatedFirstPage: related.then((data) => ({
			videos: data.videos,
			nextPageToken: data.nextPageToken
		}))
	};
};
