import * as apis from '$lib/api/youtube';

export async function load({}) {
	const videos = await apis.getVideos();
	return { videos: videos, error: null };
}
