import {PUBLIC_YOUTUBE_API_KEY} from "$env/static/public";
import { error } from "@sveltejs/kit";

const BASE_URL = 'https://www.googleapis.com/youtube/v3';


/**
 * Ottiene una lista di video in base a un parametro di ricerca testuale
 * @param {*} query
 * @returns {Promise<Object>} La risposta dell'api 
 */
export async function searchVideos(query) {
    if(!PUBLIC_YOUTUBE_API_KEY){
        throw new Error("Api Key non è stata configurata.");
    }
    const response = await fetch(
        `${BASE_URL}/search?
        part=snippet
        &q=${encodeURIComponent(query)}
        &maxResults=25&key=
        ${PUBLIC_YOUTUBE_API_KEY}`
    );
    if(!response.ok){
        throw new Error('Errore durante la ricerca dei video');
    }
    
    return await response.json();
}

/**
 * Ottiene i dettagli di un video specifico
 * @param {string} videoId L'ID del video
 * @returns {Promise<Object>} La risposta dell'API
 */
export async function getVideoDetails(videoId) {
    const id=String(videoId);
    if (!PUBLIC_YOUTUBE_API_KEY) {
        throw new Error("La chiave API di YouTube non è stata configurata nel file .env");
    }
    
    const response = await fetch(
        `${BASE_URL}/videos?part=snippet,statistics&id=${videoId}&key=${PUBLIC_YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
        throw new Error('Errore nel recuperare i dettagli del video');
    }

    return await response.json();
}

/**
 * Ottiene una lista di video popolari nella regione, per la homepage
 * @returns {Promise<Object>} La risposta dell'api
 */

export async function popularVideos() {
    if(!PUBLIC_YOUTUBE_API_KEY){
        throw new Error("Api Key non è stata configurata");
    }
    const response= await fetch(
        `${BASE_URL}/videos?part=snippet,contentDetails,statistics
        &chart=mostPopular
        &regionCode=IT`
    );

    if(!response.ok){
        throw new Error("Errore nel recuperare i video popolari");
    }
    return await response.json();
    
}