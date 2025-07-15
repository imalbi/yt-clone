import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

function getSystemTheme(): Theme {
	if (!browser) return 'light';
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function createThemeStore() {
	let initialValue: Theme = 'light';

	if (browser) {
		const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
		initialValue = saved || getSystemTheme();
	}

	const { subscribe, set, update } = writable<Theme>(initialValue);

	if (browser) {
		// Listen for system theme changes
		const media = window.matchMedia('(prefers-color-scheme: dark)');
		const systemThemeListener = (e: MediaQueryListEvent) => {
			const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
			if (!saved) {
				set(e.matches ? 'dark' : 'light');
				document.body.classList.toggle('dark-theme', e.matches);
			}
		};
		media.addEventListener('change', systemThemeListener);
	}

	return {
		subscribe,
		set: (theme: Theme) => {
			if (browser) {
				document.body.classList.toggle('dark-theme', theme === 'dark');
				localStorage.setItem(STORAGE_KEY, theme);
			}
			set(theme);
		},
		toggle: () => {
			update((currentTheme) => {
				const newTheme = currentTheme === 'light' ? 'dark' : 'light';
				if (browser) {
					document.body.classList.toggle('dark-theme', newTheme === 'dark');
					localStorage.setItem(STORAGE_KEY, newTheme);
				}
				return newTheme;
			});
		}
	};
}

export const theme = createThemeStore();
