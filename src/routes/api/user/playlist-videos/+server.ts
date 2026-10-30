import { error } from '@sveltejs/kit';
import * as apis from '#lib/api/youtube.js';

/**
 * Gli elementi di una playlist dell'utente, 'LL' (i piaciuti) compresa: prima
 * c'era un endpoint dedicato ai soli piaciuti che faceva esattamente questo con
 * l'id scritto dentro.
 */
export async function GET({ url, locals }) {
	if (!locals.accessToken) error(401, 'Not authenticated');

	const playlistId = url.searchParams.get('playlistId');
	const pageToken = url.searchParams.get('pageToken') ?? undefined;

	if (!playlistId) error(400, 'Playlist ID is required');

	return Response.json(await apis.getPlaylistVideos(playlistId, locals.accessToken, pageToken));
}
