import {PUBLIC_YOUTUBE_API_KEY,PUBLIC_USE_MOCKS} from "$env/static/public";
const BASE_URL = 'https://www.googleapis.com/youtube/v3';
import { mockApiResponse } from "$lib/mocks/popularVideos.js";



export async function load({ fetch }) {
    console.log("La funzione LOAD è stata eseguita!");
    if (PUBLIC_USE_MOCKS === 'true') {
        console.log("Delover Mode, MOCK DATA USED");
        
        // Restituisce i dati finti
        return { 
        videos: mockApiResponse 
        };
    }


  if(!PUBLIC_YOUTUBE_API_KEY){
        throw new Error("Api Key non è stata configurata");
    }

    try {
        const videosResponse = await fetch(
            `${BASE_URL}/videos?part=snippet,statistics,contentDetails&chart=mostPopular&regionCode=IT&maxResults=20&key=${PUBLIC_YOUTUBE_API_KEY}`
        );
        if (!videosResponse.ok) throw new Error('Errore nel caricare i video');
        const videosData = await videosResponse.json();
        const videos = videosData.items;

        if (!videos || videos.length === 0) {
            return { videos: [] }; // Nessun video, nessuna operazione successiva necessaria
        }

        const channelIds = [...new Set(videos.map(video => video.snippet.channelId))];

        
        const channelsResponse = await fetch(
            `${BASE_URL}/channels?part=snippet&id=${channelIds.join(',')}&key=${PUBLIC_YOUTUBE_API_KEY}`
        );
        if (!channelsResponse.ok) throw new Error('Errore nel caricare i dati dei canali');
        const channelsData = await channelsResponse.json();

        
        const channelAvatars = new Map();
        channelsData.items.forEach(channel => {
            channelAvatars.set(channel.id, channel.snippet.thumbnails.default.url);
        });

        const enrichedVideos = videos.map(video => {
            return {
                ...video, 
                channelAvatarUrl: channelAvatars.get(video.snippet.channelId)
            };
        });

        return {
            videos: enrichedVideos
        };

    } catch (e) {
        console.error("❌ Errore durante il caricamento dati:", e);
        return { videos: [], error: e.message };
    }
}