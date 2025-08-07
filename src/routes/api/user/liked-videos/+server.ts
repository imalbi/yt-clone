import * as apis from '$lib/api/youtube';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies }) => {
	try {
		const accessToken = cookies.get('access_token') || '';
		const videosInfos = await apis.getLikedVideos(accessToken);
		return new Response(JSON.stringify({ videos: videosInfos.videos, error: null }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		return new Response(
			JSON.stringify({
				videos: [],
				error: error instanceof Error ? error.message : 'Errore sconosciuto'
			}),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}
};
