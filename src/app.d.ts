/// <reference types="unplugin-icons/types/svelte" />
import type { User } from '#lib/types/user.js';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			/** Token valido, rinnovato dall'hook se scaduto. Assente se non loggato. */
			accessToken?: string;
			/**
			 * `picture` manca sugli account Google senza foto: il tipo lo diceva
			 * obbligatorio e chi lo mostrava si fidava, finendo con l'immagine
			 * rotta al posto dell'avatar.
			 */
			user: User;
		}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
