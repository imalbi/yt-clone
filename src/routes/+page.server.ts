import * as apis from '$lib/api/youtube';

export async function load({}) {
	const videosPromise = apis.getVideos();
	return { videos: videosPromise, error: null };
}
