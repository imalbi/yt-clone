import { error } from '@sveltejs/kit';
import * as apis from '#lib/api/youtube.js';

export async function GET({ url }) {
	const pageToken = url.searchParams.get('pageToken') ?? undefined;
	const videoId = url.searchParams.get('videoId');

	if (!videoId) error(400, 'Video ID is required');

	return Response.json(await apis.getComments(videoId, pageToken));
}
