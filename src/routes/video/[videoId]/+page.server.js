import { PUBLIC_YOUTUBE_API_KEY } from '$env/static/public';

const BASE_URL = 'https://www.googleapis.com/youtube/v3';

// La firma corretta: riceviamo l'oggetto `params`
export async function load({ fetch, params }) {
    if (!PUBLIC_YOUTUBE_API_KEY) {
        throw new Error("Api Key non è stata configurata");
    }

    // Estraiamo l'ID del video DENTRO la funzione, da `params`
    const videoId = params.videoId;

    console.log(`Caricamento dati per il video con ID: ${videoId}`);

    try {
        // --- CHIAMATA 1: OTTENERE I DETTAGLI DEL VIDEO ---
        const videoResponse = await fetch(
            `${BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${PUBLIC_YOUTUBE_API_KEY}`
        );
        if (!videoResponse.ok) {
            const errorDetails = await videoResponse.json();
            throw new Error(`Errore API (video): ${errorDetails.error.message}`);
        }
        
        const videoData = await videoResponse.json();
        if (!videoData.items || videoData.items.length === 0) {
            throw new Error(`Video con ID ${videoId} non trovato.`);
        }
        const videoDetails = videoData.items[0];

        // --- CHIAMATA 2: OTTENERE I DETTAGLI DEL CANALE ---
        const channelId = videoDetails.snippet.channelId;
        const channelResponse = await fetch(
            `${BASE_URL}/channels?part=snippet,statistics&id=${channelId}&key=${PUBLIC_YOUTUBE_API_KEY}`
        );
        if (!channelResponse.ok) {
            const errorDetails = await channelResponse.json();
            throw new Error(`Errore API (canale): ${errorDetails.error.message}`);
        }
        
        const channelData = await channelResponse.json();
        if (!channelData.items || channelData.items.length === 0) {
            throw new Error(`Canale con ID ${channelId} non trovato.`);
        }
        const channelDetails = channelData.items[0];

        // --- OGGETTO DI RITORNO PULITO ---
        return {
            video: videoDetails,
            channel: channelDetails
        };

    } catch (e) {
        console.error("❌ Errore durante il caricamento dati:", e);
        return { 
            video: null,
            channel: null,
            error: e instanceof Error ? e.message : String(e)
        };
    }
}