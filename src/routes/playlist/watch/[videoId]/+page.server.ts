// src/routes/playlist/watch/[videoId]/+page.server.ts
import * as apis from '#lib/api/youtube.js';
import { error, redirect } from '@sveltejs/kit';

// La query string e' un confine di fiducia: un valore che non somiglia a un id
// di playlist torna ai piaciuti invece di arrivare a Google.
const PLAYLIST_ID = /^[\w-]{1,64}$/;

export async function load({ params, locals, url }) {
	const accessToken = locals.accessToken;

	if (!accessToken) {
		redirect(302, '/api/auth/login');
	}

	const requested = url.searchParams.get('list');
	const list = requested && PLAYLIST_ID.test(requested) ? requested : 'LL';

	// 'LL' non la nomina `playlists.list`: il titolo si risolve solo per le altre,
	// e una playlist che non esiste e' una pagina che non esiste.
	let listTitle = 'Video piaciuti';
	if (list !== 'LL') {
		const playlist = await apis.getPlaylistById(list, accessToken);
		if (!playlist) error(404, 'Playlist non trovata');
		listTitle = playlist.title;
	}

	const videoId = params.videoId;
	return {
		videoId,
		list,
		listTitle,
		video: apis.getVideoById(videoId),
		commentsFirstPage: apis.getComments(videoId)
	};
}
