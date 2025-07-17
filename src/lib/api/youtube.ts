import type { Video } from '$lib/api/mock';
import * as mockApi from '$lib/api/mock';

const USE_MOCK_DATA = true; // Parti con 'true', poi passa a 'false'

export async function getVideos(): Promise<Video[]> {
	if (USE_MOCK_DATA) {
		// Simula un ritardo di rete
		await new Promise((res) => setTimeout(res, 500));
		return mockApi.mockApiResponse;
	}
	/**
	 * Ottiene i video dal canale autenticato.
	 */
	// Qui andrà la vera chiamata OAuth e API
	return [];
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
