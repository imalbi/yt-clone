import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies, url }) => {
	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		return json({ error: 'Not authenticated' }, { status: 401 });
	}

	const videoId = url.searchParams.get('videoId');
	if (!videoId) {
		return json({ error: 'Video ID is required' }, { status: 400 });
	}

	try {
		// Controlla se l'utente ha messo "mi piace" al video
		const response = await fetch(
			`https://www.googleapis.com/youtube/v3/videos/getRating?id=${videoId}`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			}
		);

		if (!response.ok) {
			console.error('YouTube API error:', await response.text());
			return json({ error: 'Failed to check like status' }, { status: 500 });
		}

		const data = await response.json();

		let videoLiked = null;
		if (data.items && data.items.length > 0) {
			const rating = data.items[0].rating;

			if (rating === 'like') {
				videoLiked = true;
			} else if (rating === 'dislike') {
				videoLiked = false;
			} else {
				videoLiked = null; // 'none' or any other value
			}
		}

		return json({
			videoLiked
		});
	} catch (error) {
		console.error('Error checking like status:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
