const KEY = 'likedVideosOrder';

/**
 * Ordine personalizzato della playlist "Liked", trascinabile dall'utente.
 *
 * Tiene solo gli id, e solo il loro ordine: quali video siano piaciuti lo dice
 * YouTube e lo chiede una query. Lo store precedente conservava invece la lista
 * stessa in localStorage e la riconciliava a mano con l'API a ogni caricamento,
 * il che significava che una lista salvata poteva restare disallineata da quella
 * vera senza che nulla lo segnalasse.
 *
 * ponytail: sincronizzazione a mano, una decina di righe. `runed` ha
 * PersistedState per lo stesso scopo, e in piu' sincronizza fra schede. Ma
 * questo e' rimasto l'unico modulo che tocca localStorage — `localComments` e'
 * sparito quando i commenti sono diventati veri — quindi sarebbe una dipendenza
 * nuova per una dozzina di righe e una funzione che nessuno ha chiesto.
 * Da rivalutare se nasce un secondo uso, non prima.
 */
function read(): string[] {
	if (typeof localStorage === 'undefined') return [];
	try {
		const parsed = JSON.parse(localStorage.getItem(KEY) ?? '[]');
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

let order = $state<string[]>(read());

function persist() {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(KEY, JSON.stringify(order));
	}
}

export const playlistOrder = {
	/**
	 * Dispone i video secondo l'ordine scelto dall'utente. Quelli mai visti
	 * finiscono in fondo; gli id spariti da YouTube semplicemente non compaiono,
	 * perche' l'elenco parte da cio' che l'API ha restituito adesso.
	 */
	sort<T extends { id: string }>(videos: T[]): T[] {
		// Temporaneo locale di un calcolo puro, non stato reattivo.
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const rank = new Map(order.map((id, i) => [id, i]));
		return [...videos].sort((a, b) => (rank.get(a.id) ?? Infinity) - (rank.get(b.id) ?? Infinity));
	},

	move(ids: string[], fromIndex: number, toIndex: number) {
		const next = [...ids];
		const [moved] = next.splice(fromIndex, 1);
		next.splice(toIndex, 0, moved);
		order = next;
		persist();
	}
};
