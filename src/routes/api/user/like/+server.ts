import { rateVideo } from '$lib/api/youtube';
import { json } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		return json({ error: 'User not authenticated' }, { status: 401 });
	}

	const { videoId, rating } = await request.json();
	if (!videoId) {
		return json({ error: 'videoId is required' }, { status: 400 });
	}

	try {
		const success = await rateVideo(videoId, rating, accessToken);
		return json({ success }, { status: 200 });
	} catch (error) {
		console.error('Failed to rate video:', error);
		return json({ error: 'Failed to rate video' }, { status: 500 });
	}
}
