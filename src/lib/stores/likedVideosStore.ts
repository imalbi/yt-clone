import { writable } from 'svelte/store';

const STORAGE_KEY = 'likedVideos';

function createLikedVideosStore() {
	const { subscribe, update } = writable<string[]>([]);

	// Load initial state from localStorage
	if (typeof localStorage !== 'undefined') {
		const storedData = localStorage.getItem(STORAGE_KEY);
		if (storedData) {
			try {
				const parsedData = JSON.parse(storedData);
				if (Array.isArray(parsedData)) {
					update(() => parsedData);
				}
			} catch (error) {
				console.error('Failed to parse liked videos from localStorage:', error);
			}
		}
	}

	//Purpose a list of 20 liked videos that i can order with drag and drop
	// logic:
	// 1. Add from API nVideos (20) if already in store, skip. if not, add to the end, if store contains videoId not in API, remove it
	return {
		subscribe,
		addFromApi: (videoIds: string[]) => {
			console.log(`[likedVideosStore] Adding ${videoIds.length} liked videos from API`);
			update((store) => {
				// Create a set for quick lookup
				const existingSet = new Set(store);
				// Add new videos to the end
				const newStore = videoIds.filter((id) => !existingSet.has(id));
				// Remove videos not in the new API list
				const filteredStore = [...store].filter((id) => videoIds.includes(id));

				// Save to localStorage
				if (typeof localStorage !== 'undefined') {
					localStorage.setItem(STORAGE_KEY, JSON.stringify([...filteredStore, ...newStore]));
				}

				return [...filteredStore, ...newStore];
			});
		},
		moveItem: (fromIndex: number, toIndex: number) => {
			update((store) => {
				const newStore = [...store];
				const [movedItem] = newStore.splice(fromIndex, 1);
				newStore.splice(toIndex, 0, movedItem);

				// Save to localStorage
				if (typeof localStorage !== 'undefined') {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(newStore));
				}

				return newStore;
			});
		}
	};
}
export const likedVideosStore = createLikedVideosStore();
