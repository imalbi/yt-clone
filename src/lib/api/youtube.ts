import type { Video } from '$lib/api/mock';
import type { Channel } from '$lib/types/channel';

import { PUBLIC_YOUTUBE_API_KEY } from '$env/static/public';
import type { CommentThread } from '$lib/types/commentThread';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

/**
 * @returns A list of popular videos from the public YouTube API.
 */
export async function getVideos(
	maxResults: number = 20,
	pageToken?: string
): Promise<{ videos: Video[]; nextPageToken?: string; prevPageToken?: string }> {
	if (!PUBLIC_YOUTUBE_API_KEY) {
		throw new Error('YouTube API key is not defined');
	}
	try {
		let url = `${BASE_URL}/videos?part=snippet,statistics,contentDetails&chart=mostPopular&regionCode=IT&maxResults=${maxResults}&key=${PUBLIC_YOUTUBE_API_KEY}`;
		if (pageToken) {
			url += `&pageToken=${pageToken}`;
		}
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error('Failed to fetch videos');
		}
		const data = await response.json();

		const channelIds = data.items.map((item: any) => item.snippet.channelId).join(',');
		const channels = await getChannelsByIds(channelIds);

		const videos = data.items.map((item: any) => {
			const channel = channels.find((c) => c.id === item.snippet.channelId);
			return {
				id: item.id,
				title: item.snippet.title,
				desc: item.snippet.description,
				thumbnails: {
					default: item.snippet.thumbnails.default?.url || '',
					medium: item.snippet.thumbnails.medium?.url || '',
					high: item.snippet.thumbnails.high?.url || '',
					standard: item.snippet.thumbnails.standard?.url,
					maxres: item.snippet.thumbnails.maxres?.url
				},
				publishedAt: item.snippet.publishedAt,
				channelId: item.snippet.channelId,
				channelTitle: item.snippet.channelTitle,
				avatarUrl: channel?.thumbnails.default.url,
				statistics: {
					viewCount: item.statistics?.viewCount || '0',
					likeCount: item.statistics?.likeCount || '0',
					commentCount: item.statistics?.commentCount || '0',
					favoriteCount: item.statistics?.favoriteCount || '0'
				}
			};
		});

		return {
			videos: videos,
			nextPageToken: data.nextPageToken,
			prevPageToken: data.prevPageToken
		};
	} catch (error) {
		console.error(error);
		throw error;
	}
}

/**
 * @param channelIds - A comma-separated string of channel IDs.
 * @returns A list of channels.
 */
async function getChannelsByIds(channelIds: string): Promise<Channel[]> {
	if (!PUBLIC_YOUTUBE_API_KEY) {
		throw new Error('YouTube API key is not defined');
	}
	try {
		const response = await fetch(
			`${BASE_URL}/channels?part=snippet,statistics&id=${channelIds}&key=${PUBLIC_YOUTUBE_API_KEY}`
		);
		if (!response.ok) {
			throw new Error('Failed to fetch channels');
		}
		const data = await response.json();
		return data.items.map((item: any) => ({
			id: item.id,
			title: item.snippet.title,
			description: item.snippet.description,
			customUrl: item.snippet.customUrl,
			publishedAt: item.snippet.publishedAt,
			thumbnails: item.snippet.thumbnails,
			statistics: item.statistics
		}));
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
		if (data.items.length === 0) {
			return null;
		}

		const videoItem = data.items[0];
		const channelId = videoItem.snippet.channelId;
		const channels = await getChannelsByIds(channelId);
		const channel = channels[0];

		const video = {
			id: videoItem.id,
			title: videoItem.snippet.title,
			desc: videoItem.snippet.description,
			thumbnails: {
				default: videoItem.snippet.thumbnails.default?.url || '',
				medium: videoItem.snippet.thumbnails.medium?.url || '',
				high: videoItem.snippet.thumbnails.high?.url || '',
				standard: videoItem.snippet.thumbnails.standard?.url,
				maxres: videoItem.snippet.thumbnails.maxres?.url
			},
			publishedAt: videoItem.snippet.publishedAt,
			channelId: videoItem.snippet.channelId,
			channelTitle: videoItem.snippet.channelTitle,
			avatarUrl: channel?.thumbnails.default.url,
			statistics: {
				viewCount: videoItem.statistics?.viewCount || '0',
				likeCount: videoItem.statistics?.likeCount || '0',
				commentCount: videoItem.statistics?.commentCount || '0',
				favoriteCount: videoItem.statistics?.favoriteCount || '0'
			}
		};

		return video;
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
export async function getComments(
	videoId: string,
	pageToken?: string
): Promise<{ comments: CommentThread[]; nextPageToken?: string }> {
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
		return {
			comments: comments,
			nextPageToken: data.nextPageToken
		};
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function searchVideos(
	query: string,
	pageToken?: string
): Promise<{ videos: Video[]; nextPageToken?: string }> {
	if (!query) {
		throw new Error('Query is required');
	}
	if (!PUBLIC_YOUTUBE_API_KEY) {
		throw new Error('YouTube API key is not defined');
	}
	try {
		let url = `${BASE_URL}/search?part=snippet&q=${query}&type=video&maxResults=20&key=${PUBLIC_YOUTUBE_API_KEY}`;
		if (pageToken) {
			url += `&pageToken=${pageToken}`;
		}
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error('Failed to fetch videos');
		}
		const data = await response.json();

		const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
		const videosResponse = await fetch(
			`${BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${PUBLIC_YOUTUBE_API_KEY}`
		);
		if (!videosResponse.ok) {
			throw new Error('Failed to fetch video details');
		}
		const videosData = await videosResponse.json();

		const channelIds = videosData.items.map((item: any) => item.snippet.channelId).join(',');
		const channels = await getChannelsByIds(channelIds);

		const videos = videosData.items.map((item: any) => {
			const channel = channels.find((c) => c.id === item.snippet.channelId);
			return {
				id: item.id,
				title: item.snippet.title,
				desc: item.snippet.description,
				thumbnails: {
					default: item.snippet.thumbnails.default?.url || '',
					medium: item.snippet.thumbnails.medium?.url || '',
					high: item.snippet.thumbnails.high?.url || '',
					standard: item.snippet.thumbnails.standard?.url,
					maxres: item.snippet.thumbnails.maxres?.url
				},
				publishedAt: item.snippet.publishedAt,
				channelId: item.snippet.channelId,
				channelTitle: item.snippet.channelTitle,
				avatarUrl: channel?.thumbnails.default.url,
				statistics: {
					viewCount: item.statistics?.viewCount || '0',
					likeCount: item.statistics?.likeCount || '0',
					commentCount: item.statistics?.commentCount || '0',
					favoriteCount: item.statistics?.favoriteCount || '0'
				}
			};
		});

		return {
			videos: videos,
			nextPageToken: data.nextPageToken
		};
	} catch (error) {
		console.error(error);
		throw error;
	}
}
