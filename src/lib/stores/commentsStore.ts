// src/lib/stores/commentsStore.js

import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import type { Comment, CommentThread } from '$lib/types/commentThread';
import { subscribe } from 'diagnostics_channel';

// Chiave per il localStorage dove verranno salvati i commenti dei video.
const STORAGE_KEY = 'video-comments';

export const commentStoreData = writable<{ [videoId: string]: CommentThread[] }>({});

/**
 * Store per gestire i commenti dei video.
 * Lo store si sincronizza automaticamente con il localStorage del browser.
 */
function createCommentsStore() {
	const initialData = browser ? JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') : {};
	console.log('[commentsStore] Initial data from localStorage:', initialData);
	commentStoreData.set(initialData);
	console.log('[commentsStore] Store initialized with:', initialData);
	if (browser) {
		commentStoreData.subscribe((currentValue) => {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(currentValue));
		});
	}

	return {
		subscribe: commentStoreData.subscribe,

		addApiComments: (videoId: string, apiComments: CommentThread[]) => {
			commentStoreData.update((store) => {
				// Get existing comments for this video
				const existingComments = store[videoId] || [];
				const existingIds = new Set(existingComments.map((c) => c.id));

				// Filter out comments that already exist in the store
				const newComments = apiComments.filter((c) => !existingIds.has(c.id));

				// Merge API comments with existing ones
				const updatedComments = [...existingComments, ...newComments];

				// Update store
				const newStore = { ...store, [videoId]: updatedComments };

				// Save to localStorage
				if (typeof localStorage !== 'undefined') {
					localStorage.setItem('youtube_comments', JSON.stringify(newStore));
				}

				return newStore;
			});
		},

		/**
		 * Aggiunge un nuovo commento a un video specifico.
		 * @param {string} videoId - L'ID del video.
		 * @param {Comment} newComment - Il nuovo commento da aggiungere.
		 */
		addComment: (videoId: string, newComment: CommentThread) => {
			commentStoreData.update((allComments) => {
				// Recupera i commenti esistenti per questo video o crea un array vuoto.
				const videoComments = allComments[videoId] || [];
				console.log(`[commentsStore] Adding comment to videoId=`, videoId, 'comment:', newComment);
				console.log(commentStoreData);
				console.log('All comments before update:', allComments);
				return {
					...allComments,
					[videoId]: [...videoComments, newComment]
				};
			});
		},
		/**
		 * Recupera i commenti per un video specifico.
		 * @param {string} videoId - L'ID del video.
		 * @returns {CommentThread[]} - Un array di commenti per il video.
		 * */
		getComments: (videoId: string): CommentThread[] => {
			const allComments = get(commentStoreData);
			console.log(
				`[commentsStore] Getting comments for videoId=`,
				videoId,
				'comments:',
				allComments[videoId] || []
			);
			const videoComments = allComments[videoId] || [];
			console.log(
				`[commentsStore] Returning comments for videoId=`,
				videoId,
				'comments:',
				videoComments
			);
			return videoComments;
		},
		/**
		 * Modifica un commento specifico di un video.
		 * @param {string} videoId - L'ID del video.
		 * @param {string} commentId - L'ID del commento da modificare.
		 * @param {string} newText - Il commento aggiornato.
		 */
		editComment: (videoId: string, commentId: string, newText: string) => {
			const allComments = get(commentStoreData) || [];
			const videoComments = allComments[videoId] || [];
			const commentToEdit = videoComments.find((c: CommentThread) => c.id === commentId);
			console.log(commentToEdit);
			if (commentToEdit) {
				commentToEdit.topLevelComment.textDisplay = newText;
			}
			commentStoreData.set({ ...allComments, [videoId]: videoComments });
		},

		/**
		 * Rimuove un commento specifico da un video.
		 * @param {string} videoId - L'ID del video.
		 * @param {string} commentId - L'ID del commento da rimuovere.
		 */
		removeComment: (videoId: string, commentId: string) => {
			commentStoreData.update((allComments) => {
				const videoComments = allComments[videoId] || [];
				console.log(`[commentsStore] Removing commentId=`, commentId, 'from videoId=', videoId);
				const updatedComments = videoComments.filter((c: CommentThread) => c.id !== commentId);

				return {
					...allComments,
					[videoId]: updatedComments
				};
			});
		}
	};
}

export const comments = createCommentsStore();
