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
