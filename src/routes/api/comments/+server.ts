import { json } from '@sveltejs/kit';
import * as apis from '$lib/api/youtube';

export async function GET({ url }) {
	const pageToken = url.searchParams.get('pageToken') ?? undefined;
	const videoId = url.searchParams.get('videoId');

	if (!videoId) {
		return json({ error: 'Video ID is required' }, { status: 400 });
	}

	try {
		const comments = await apis.getComments(videoId, pageToken);
		return json(comments);
	} catch (error) {
		return json({ error: 'Failed to fetch comments' }, { status: 500 });
	}
}
