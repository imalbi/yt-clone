import { redirect } from '@sveltejs/kit';
import * as apis from '#lib/api/youtube.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.accessToken) {
		redirect(302, '/api/auth/login');
	}

	// Le playlist dell'utente sono al massimo 50 in una richiesta e non hanno
	// scroll infinito: niente query lato client, basta il load.
	return { playlists: apis.getMyPlaylists(locals.accessToken) };
};
