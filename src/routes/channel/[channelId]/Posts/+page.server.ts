import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { channelId } = params;

	try {
		const response = await fetch('https://dummyjson.com/posts');

		if (!response.ok) {
			throw new Error('Failed to fetch posts');
		}

		const data = await response.json();

		return {
			posts: data.posts || [],
			channelId
		};
	} catch (err) {
		console.error('Error fetching posts:', err);
		throw error(500, 'Failed to load posts');
	}
};
