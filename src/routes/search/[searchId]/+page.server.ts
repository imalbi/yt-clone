import { PUBLIC_YOUTUBE_API_KEY } from '$env/static/public';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';
const cache = new Map();

export async function load({ fetch, params }) {
	console.log(`Searching for ${params.searchId}`);
	if (cache.has(params.searchId)) {
		console.log(`✅ Risultato trovato in cache per: "${params.searchId}"`);
		return { searchResults: cache.get(params.searchId) }; // Restituisce i dati salvati, non fa nessuna chiamata API!
	}
	console.log(`🔍 Nessun risultato in cache per: "${params.searchId}". Eseguo chiamata API...`);
	// --- FINE LOGICA DI CACHING ---

	if (!PUBLIC_YOUTUBE_API_KEY) {
		throw new Error('No api key found');
	}
	try {
		const dataVideoId = await fetch(
			`${BASE_URL}/search?part=snippet&maxResults=10&q=${params.searchId}&key=${PUBLIC_YOUTUBE_API_KEY}`
		);
		if (!dataVideoId.ok) {
			const errorDetails = await dataVideoId.json();
			throw new Error(`Errore API SEARCH :  ${errorDetails.error.message}`);
		}
		const responseSearch = await dataVideoId.json();
		// Fix implicit 'any' type for 'item'
		const videoIds = responseSearch.items.map((item: any) => item.id.videoId).join(',');
		const videoDataRaw = await fetch(
			`${BASE_URL}/videos?part=snippet,statistics&id=${videoIds}&key=${PUBLIC_YOUTUBE_API_KEY}`
		);
		if (!videoDataRaw.ok) {
			const errorDetails = await videoDataRaw.json();
			throw new Error(`Errore API Video LIST :  ${errorDetails.error.message}`);
		}
		const videoData = await videoDataRaw.json();
		const finalResults = videoData.items.map(
			(video: {
				id: string;
				snippet: {
					title: string;
					thumbnails: {
						[x: string]: any;
						maxres: { url: string };
					};
					publishedAt: string;
					channelTitle: string;
					channelId: string;
					description: string;
				};
				statistics: {
					viewCount: string;
					likeCount: string;
				};
			}) => ({
				videoId: video.id,
				title: video.snippet.title,
				thumbnail: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.medium.url,
				publishedAt: video.snippet.publishedAt,
				viewCount: video.statistics.viewCount,
				likeCount: video.statistics.likeCount,
				channelTitle: video.snippet.channelTitle,
				channelId: video.snippet.channelId,
				description: video.snippet.description
			})
		);

		cache.set(params.searchId, finalResults);

		return {
			searchResults: finalResults
		};
	} catch (e) {
		console.error('❌ Errore durante il caricamento dati:', e);
		return {
			searchResults: null
		};
	}
}
