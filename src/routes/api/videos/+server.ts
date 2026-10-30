import { error } from '@sveltejs/kit';
import * as apis from '#lib/api/youtube.js';

export async function GET({ url }) {
	const pageToken = url.searchParams.get('pageToken') ?? undefined;
	const categoryId = url.searchParams.get('categoryId') ?? undefined;
	const videoId = url.searchParams.get('id');

	if (videoId) {
		const video = await apis.getVideoById(videoId);
		if (!video) error(404, 'Video not found');
		return Response.json({ video });
	}

	return Response.json(await apis.getVideos(10, pageToken, categoryId));
}
