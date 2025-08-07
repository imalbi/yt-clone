import * as apis from '$lib/api/youtube';

export async function load({ cookies }) {
	try {
		const videosInfos = apis.getLikedVideos(cookies.get('access_token') || '');
		return {
			videos: videosInfos.then((data) => data.videos),
			error: null
		};
	} catch (error) {
		return {
			videos: Promise.resolve([]),
			error: error instanceof Error ? error.message : 'Errore sconosciuto'
		};
	}
}
