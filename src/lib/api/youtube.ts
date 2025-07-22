import type { Video } from '$lib/api/mock';
import type { Channel } from '$lib/types/channel';

import { PUBLIC_YOUTUBE_API_KEY } from '$env/static/public';
import type { CommentThread } from '$lib/types/commentThread';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

/**
 * @returns Una lista di video popolari dalla api pubblica di YouTube.
 */
export async function getVideos(): Promise<Video[]> {
	// Qui andrà la vera chiamata API per ottenere i video
	if (!PUBLIC_YOUTUBE_API_KEY) {
		throw new Error('YouTube API key is not defined');
	}
	try {
		const response = await fetch(
			`${BASE_URL}/videos?part=snippet,statistics,contentDetails&chart=mostPopular&regionCode=IT&maxResults=20&key=${PUBLIC_YOUTUBE_API_KEY}`
		);
		if (!response.ok) {
			throw new Error('Failed to fetch videos');
		}
		const data = await response.json();

		//I have to modify the data structure to match the mockApi.Video type
		data.items = await Promise.all(
			data.items.map(async (item: any) => {
				const channel = await getChannelById(item.snippet.channelId);
				return {
					id: item.id,
					title: item.snippet.title,
					desc: item.snippet.description,
					thumbnails: {
						default: item.snippet.thumbnails.default ? item.snippet.thumbnails.default.url : '',
						medium: item.snippet.thumbnails.medium ? item.snippet.thumbnails.medium.url : '',
						high: item.snippet.thumbnails.high ? item.snippet.thumbnails.high.url : '',
						standard: item.snippet.thumbnails.standard
							? item.snippet.thumbnails.standard.url
							: undefined,
						maxres: item.snippet.thumbnails.maxres ? item.snippet.thumbnails.maxres.url : undefined
					},
					publishedAt: item.snippet.publishedAt,
					channelId: item.snippet.channelId,
					channelTitle: item.snippet.channelTitle,
					avatarUrl: channel?.thumbnails.default.url,
					statistics: {
						viewCount: item.statistics.viewCount || '0',
						likeCount: item.statistics.likeCount || '0',
						commentCount: item.statistics.commentCount || '0',
						favoriteCount: item.statistics.favoriteCount || '0'
					}
				};
			})
		);
		return data.items;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

/**
 * @param videoId - L'ID del video da recuperare.
 * @returns Un oggetto Video con i dettagli del video o null se non trovato.
 */
export async function getVideoById(videoId: string): Promise<Video | null> {
	if (!videoId) {
		throw new Error('Video ID is required');
	}
	//Chiamata API per ottenere il video
	if (!PUBLIC_YOUTUBE_API_KEY) {
		throw new Error('YouTube API key is not defined');
	}
	try {
		const response = await fetch(
			`${BASE_URL}/videos?part=snippet,statistics&id=${videoId}&key=${PUBLIC_YOUTUBE_API_KEY}`
		);
		if (!response.ok) {
			throw new Error('Failed to fetch video');
		}
		const data = await response.json();

		//I have to modify the data structure to match the mockApi.Video type
		data.items = await Promise.all(
			data.items.map(async (item: any) => {
				const channel = await getChannelById(item.snippet.channelId);
				return {
					id: item.id,
					title: item.snippet.title,
					desc: item.snippet.description,
					thumbnails: {
						default: item.snippet.thumbnails.default ? item.snippet.thumbnails.default.url : '',
						medium: item.snippet.thumbnails.medium ? item.snippet.thumbnails.medium.url : '',
						high: item.snippet.thumbnails.high ? item.snippet.thumbnails.high.url : '',
						standard: item.snippet.thumbnails.standard
							? item.snippet.thumbnails.standard.url
							: undefined,
						maxres: item.snippet.thumbnails.maxres ? item.snippet.thumbnails.maxres.url : undefined
					},
					publishedAt: item.snippet.publishedAt,
					channelId: item.snippet.channelId,
					channelTitle: item.snippet.channelTitle,
					avatarUrl: channel?.thumbnails.default.url,
					statistics: {
						viewCount: item.statistics.viewCount || '0',
						likeCount: item.statistics.likeCount || '0',
						commentCount: item.statistics.commentCount || '0',
						favoriteCount: item.statistics.favoriteCount || '0'
					}
				};
			})
		);

		return data.items[0] || null;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function getChannelById(channelId: string): Promise<Channel | null> {
	if (!PUBLIC_YOUTUBE_API_KEY) {
		throw new Error('YouTube API key is not defined');
	}
	try {
		const response = await fetch(
			`${BASE_URL}/channels?part=snippet,statistics&id=${channelId}&key=${PUBLIC_YOUTUBE_API_KEY}`
		);
		if (!response.ok) {
			throw new Error('Failed to fetch channel');
		}
		const data = await response.json();
		if (data.items.length === 0) {
			return null;
		}
		const item = data.items[0];
		return {
			id: item.id,
			title: item.snippet.title,
			description: item.snippet.description,
			customUrl: item.snippet.customUrl,
			publishedAt: item.snippet.publishedAt,
			thumbnails: item.snippet.thumbnails,
			statistics: item.statistics
		};
	} catch (error) {
		console.error(error);
		throw error;
	}
}

/**
 * Get comments for a specific video.
 * This function retrieves comments for a given video ID, including top-level comments and their replies.
 * @param videoId - L'ID del video per cui recuperare i commenti.
 * @param pageToken - Token di pagina opzionale per la paginazione dei risultati.
 * @returns Una lista di commenti per il video specificato.
 */
export async function getComments(videoId: string, pageToken?: string): Promise<CommentThread[]> {
	if (!videoId) {
		throw new Error('Video ID is required');
	}
	//Chiamata API per ottenere i commenti
	if (!PUBLIC_YOUTUBE_API_KEY) {
		throw new Error('YouTube API key is not defined');
	}
	try {
		const response = await fetch(
			`${BASE_URL}/commentThreads?part=snippet,replies&videoId=${videoId}&key=${PUBLIC_YOUTUBE_API_KEY}${pageToken ? `&pageToken=${pageToken}` : ''}`
		);
		if (!response.ok) {
			throw new Error('Failed to fetch comments');
		}
		const data = await response.json();
		const comments = data.items.map((item: any) => ({
			//Parliamo di thread
			id: item.id,
			topLevelComment: {
				id: item.snippet.topLevelComment.id,
				authorDisplayName: item.snippet.topLevelComment.snippet.authorDisplayName,
				authorChannelId: item.snippet.topLevelComment.snippet.authorChannelId.value,
				authorChannelUrl: item.snippet.topLevelComment.snippet.authorChannelUrl,
				authorProfileImageUrl: item.snippet.topLevelComment.snippet.authorProfileImageUrl,
				textDisplay: item.snippet.topLevelComment.snippet.textDisplay,
				publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
				likeCount: item.snippet.topLevelComment.snippet.likeCount || 0
			},
			replies: item.replies
				? item.replies.comments.map((reply: any) => ({
						id: reply.id,
						authorDisplayName: reply.snippet.authorDisplayName,
						authorChannelId: reply.snippet.authorChannelId.value,
						authorChannelUrl: reply.snippet.authorChannelUrl,
						authorProfileImageUrl: reply.snippet.authorProfileImageUrl,
						textDisplay: reply.snippet.textDisplay,
						publishedAt: reply.snippet.publishedAt,
						likeCount: reply.snippet.likeCount || 0
					}))
				: []
		}));
		return comments;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

//TODO: ? getRelatedVideosByVideoId

export async function searchVideos(query: string): Promise<Video[]> {
	if (!query) {
		throw new Error('Query is required');
	}
	if (!PUBLIC_YOUTUBE_API_KEY) {
		throw new Error('YouTube API key is not defined');
	}
	try {
		const response = await fetch(
			`${BASE_URL}/search?part=snippet&q=${query}&type=video&maxResults=20&key=${PUBLIC_YOUTUBE_API_KEY}`
		);
		if (!response.ok) {
			throw new Error('Failed to fetch videos');
		}
		const data = await response.json();

		data.items = await Promise.all(
			data.items.map(async (item: any) => {
				const video = await getVideoById(item.id.videoId);
				return {
					...video,
					id: item.id.videoId,
					title: item.snippet.title,
					desc: item.snippet.description,
					thumbnails: {
						default: item.snippet.thumbnails.default ? item.snippet.thumbnails.default.url : '',
						medium: item.snippet.thumbnails.medium ? item.snippet.thumbnails.medium.url : '',
						high: item.snippet.thumbnails.high ? item.snippet.thumbnails.high.url : '',
						standard: item.snippet.thumbnails.standard
							? item.snippet.thumbnails.standard.url
							: undefined,
						maxres: item.snippet.thumbnails.maxres ? item.snippet.thumbnails.maxres.url : undefined
					},
					publishedAt: item.snippet.publishedAt,
					channelId: item.snippet.channelId,
					channelTitle: item.snippet.channelTitle
				};
			})
		);
		return data.items;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

//TODO: getVideos to use actual YouTube API
