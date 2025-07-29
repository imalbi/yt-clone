import { derived, writable } from 'svelte/store';

// Lo store conterrà i dati dell'utente o null
export const userStore = writable<{ name: string; picture: string } | null>(null);

//Funzione che ritorna true se l'utente è loggato, altrimenti false
export const isLogged = derived(userStore, ($userStore) => {
	return $userStore !== null;
});
