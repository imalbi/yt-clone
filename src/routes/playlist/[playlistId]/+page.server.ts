import { error, redirect } from '@sveltejs/kit';
import * as apis from '#lib/api/youtube.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.accessToken) {
		redirect(302, '/api/auth/login');
	}

	// Il titolo viene atteso: e' l'intestazione della pagina, e senza playlist
	// non c'e' pagina. I video invece viaggiano in streaming come altrove.
	const playlist = await apis.getPlaylistById(params.playlistId, locals.accessToken);
	if (!playlist) {
		error(404, 'Playlist non trovata');
	}

	const videos = apis.getPlaylistVideos(params.playlistId, locals.accessToken);

	return {
		playlist,
		firstPage: videos.then((data) => ({
			videos: data.videos,
			nextPageToken: data.nextPageToken
		}))
	};
};
