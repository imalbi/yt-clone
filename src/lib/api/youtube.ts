import type { Video } from '$lib/api/mock';
import * as mockApi from '$lib/api/mock';

import { PUBLIC_YOUTUBE_API_KEY } from '$env/static/public';
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
			description: item.snippet.description,
			thumbnails: {
				default: item.snippet.thumbnails.default ? item.snippet.thumbnails.default.url : null,
				medium: item.snippet.thumbnails.medium ? item.snippet.thumbnails.medium.url : null,
				high: item.snippet.thumbnails.high ? item.snippet.thumbnails.high.url : null,
				standard: item.snippet.thumbnails.standard ? item.snippet.thumbnails.standard.url : null,
				maxres: item.snippet.thumbnails.maxres ? item.snippet.thumbnails.maxres.url : null
			},
			publishedAt: item.snippet.publishedAt,
			channelId: item.snippet.channelId,
			channelTitle: item.snippet.channelTitle,
			//TODO: add channel avatar
			// For now, we can use the default thumbnail as a placeholder
			avatarUrl: item.snippet.thumbnails.default ? item.snippet.thumbnails.default.url : null,
			statistics: {
				likeCount: item.statistics.likeCount,
				viewCount: item.statistics.viewCount,
				duration: item.contentDetails.duration
			}
		}));

		return data.items;
	} catch (error) {
		console.error(error);
		return [];
	}
}

//TODO: getVideoById
// Ottiene un video specifico per ID as mock data it will be ya-1R6BEN30
export async function getVideoById(videoId: string): Promise<mockApi.PlayerResponse | null> {
	if (USE_MOCK_DATA) {
		// Simula un ritardo di rete
		await new Promise((res) => setTimeout(res, 500));
		return mockApi.mockPlayerResponse;
	}
	// Qui andrà la vera chiamata API per ottenere il video
	return null;
}

//TODO: getChannelById

//TODO: getCommentsByVideoId

//TODO: getRelatedVideosByVideoId

//TODO: searchVideosByQuery

//TODO: getVideos to use actual YouTube API
