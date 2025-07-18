// src/routes/+page.server.ts
import * as apis from '$lib/api/youtube';
//TODO: add a store for videos to avoid fetching them multiple times
export async function load({}) {
	const videosPromise = apis.getVideos();
	return { videos: videosPromise, error: null };
}
