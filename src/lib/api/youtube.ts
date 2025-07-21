import type { Video } from '$lib/api/mock';
import * as mockApi from '$lib/api/mock';

import { PUBLIC_YOUTUBE_API_KEY } from '$env/static/public';
import type { CommentThread } from '$lib/types/commentThread';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

const USE_MOCK_DATA = false; // Parti con 'true', poi passa a 'false'

/**
 * @returns Una lista di video popolari dalla api pubblica di YouTube.
 */
export async function getVideos(): Promise<Video[]> {
	if (USE_MOCK_DATA) {
		// Simula un ritardo di rete
		await new Promise((res) => setTimeout(res, 500));
		return mockApi.mockApiResponse;
	}
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
		//Debug print on file for json structure, thumbnails
		console.log(data.items[0].snippet.thumbnails);

		//I have to modify the data structure to match the mockApi.Video type
		data.items = data.items.map((item: any) => ({
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
			//TODO: add channel avatar - using placeholder for now
			avatarUrl: 'https://via.placeholder.com/150x150?text=Avatar',
			statistics: {
				viewCount: item.statistics.viewCount || '0',
				likeCount: item.statistics.likeCount || '0',
				commentCount: item.statistics.commentCount || '0',
				favoriteCount: item.statistics.favoriteCount || '0'
			}
		}));

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
	if (USE_MOCK_DATA) {
		// Simula un ritardo di rete
		await new Promise((res) => setTimeout(res, 500));
		console.log(`Fetching video with ID: ${videoId}`);
		return mockApi.mockApiResponse[0] || null;
	}
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
		data.items = data.items.map((item: any) => ({
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
			//TODO: add channel avatar - using placeholder for now
			// You'll need to make a separate call to channels.list to get the real avatar
			avatarUrl: 'https://via.placeholder.com/150x150?text=Avatar',
			statistics: {
				viewCount: item.statistics.viewCount || '0',
				likeCount: item.statistics.likeCount || '0',
				commentCount: item.statistics.commentCount || '0',
				favoriteCount: item.statistics.favoriteCount || '0'
			}
		}));

		return data.items[0] || null;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

//TODO: getChannelById

//TODO: getCommentsByVideoId
/**
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

//TODO: getRelatedVideosByVideoId

//TODO: searchVideosByQuery

//TODO: getVideos to use actual YouTube API
