import { writable } from 'svelte/store';
import type { CommentThread } from '$lib/types/commentThread';

let STORAGE_KEY = 'youtube_comments';

// Create a store for comments data
function createCommentsStore() {
	// Initialize from localStorage if available
	const storedData =
		typeof localStorage !== 'undefined'
			? JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
			: {};

	const { subscribe, update } = writable<Record<string, CommentThread[]>>(storedData);

	return {
		subscribe,

		// Add comments from API
		addApiComments: (videoId: string, apiComments: CommentThread[]) => {
			console.log(
				`[commentsStore] Adding ${apiComments.length} API comments to videoId=${videoId}`
			);
			let addedCount = 0;
			update((store) => {
				// Get existing comments for this video
				const existingComments = store[videoId] || [];

				// Creo un set di id già presenti
				const existingIds = new Set(existingComments.map((c) => c.id));

				// Tengo solo i commenti il quale id non è già presente
				const newComments = apiComments.filter((c) => !existingIds.has(c.id));
				addedCount = newComments.length;
				// Merge API comments with existing ones
				const updatedComments = [...existingComments, ...newComments];

				// Update store
				const newStore = { ...store, [videoId]: updatedComments };

				// Save to localStorage
				if (typeof localStorage !== 'undefined') {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(newStore));
				}

				return newStore;
			});
			return addedCount;
		},

		// Add a new user comment
		addComment: (videoId: string, comment: CommentThread) => {
			console.log(`[commentsStore] Adding new comment to videoId=${videoId}`, comment);
			update((store) => {
				const videoComments = store[videoId] || [];
				const updatedComments = [comment, ...videoComments];

				const newStore = { ...store, [videoId]: updatedComments };

				// Save to localStorage
				if (typeof localStorage !== 'undefined') {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(newStore));
				}

				return newStore;
			});
		},

		// Edit an existing comment
		editComment: (videoId: string, threadId: string, updatedText: string) => {
			console.log(`[commentsStore] Editing comment threadId=${threadId} in videoId=${videoId}`);
			update((store) => {
				const videoComments = store[videoId] || [];
				// Find and update the comment with the given threadId
				const updatedComments = videoComments.map((thread) => {
					if (thread.id === threadId) {
						return {
							...thread,
							topLevelComment: {
								...thread.topLevelComment,
								textDisplay: updatedText
							}
						};
					}
					return thread;
				});

				const newStore = { ...store, [videoId]: updatedComments };

				// Save to localStorage
				if (typeof localStorage !== 'undefined') {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(newStore));
				}

				return newStore;
			});
		},

		// Remove a comment
		removeComment: (videoId: string, threadId: string) => {
			console.log(`[commentsStore] Removing comment threadId=${threadId} from videoId=${videoId}`);
			update((store) => {
				const videoComments = store[videoId] || [];
				// Filtro i commenti per rimuovere quello con l'id specificato
				const updatedComments = videoComments.filter((thread) => thread.id !== threadId);

				const newStore = { ...store, [videoId]: updatedComments };

				// Save to localStorage
				if (typeof localStorage !== 'undefined') {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(newStore));
				}

				return newStore;
			});
		},

		// Get comments for a specific video
		getComments: (videoId: string): CommentThread[] => {
			let result: CommentThread[] = [];
			subscribe((store) => {
				result = store[videoId] || [];
			})();

			console.log(
				`[commentsStore] Getting comments for videoId=${videoId}, found ${result.length} comments`
			);
			return result;
		}
	};
}

export const comments = createCommentsStore();
