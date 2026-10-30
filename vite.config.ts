import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import icons from 'unplugin-icons/vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	server: {
		watch: {
			// Vitest carica `.env.test` e Kit ne scrive i valori in questo file, che il
			// dev server importa: senza l'ignore, un `npm test` a server acceso gli
			// sostituisce al volo la chiave API con `test-key` (502 su ogni chiamata).
			// Il dev server lo riscrive da se' a ogni avvio, con l'env vero.
			ignored: ['**/.svelte-kit/generated/dev/env/**']
		}
	},
	plugins: [
		tailwindcss(),
		sveltekit({
			preprocess: vitePreprocess(),
			compilerOptions: { runes: true, experimental: { async: true } },
			adapter: adapter(),
			experimental: { remoteFunctions: true }
		}),

		// Compila in componenti Svelte solo le icone effettivamente importate.
		// @iconify/svelte le scaricherebbe invece dalla API a runtime, il che
		// significa nessuna icona nell'HTML server e un lampo senza icone al
		// primo paint: per la topbar si vede.
		icons({ compiler: 'svelte' }),
		// Serve /.well-known/appspecific/com.chrome.devtools.json, che altrimenti
		// riempie il log di dev di 404.
		devtoolsJson()
	],
	test: {
		/**
		 * Due ambienti, perche' i test sono di due specie: quelli sul layer API e
		 * sulla sessione girano su Node, quelli sui componenti hanno bisogno di un
		 * DOM. Il plugin di @testing-library/svelte aggiunge da se' la condizione
		 * `browser` e la pulizia dopo ogni test, che altrimenti andrebbero
		 * scritte a mano qui.
		 */
		projects: [
			{
				extends: true,
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.test.ts'],
					exclude: ['src/**/*.svelte.test.ts']
				}
			},
			{
				extends: true,
				plugins: [svelteTesting()],
				test: {
					name: 'client',
					environment: 'jsdom',
					include: ['src/**/*.svelte.test.ts']
				}
			}
		]
	}
});
