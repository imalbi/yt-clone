/**
 * Filtri della ricerca: valori ammessi, etichette e parsing della query string.
 *
 * Stanno insieme perche' sono la stessa cosa vista da due lati. Le `<option>`
 * della barra e il controllo sul parametro in arrivo devono elencare gli stessi
 * valori: tenerli in due punti significa che prima o poi l'interfaccia offre un
 * ordinamento che il server rifiuta.
 *
 * La query string e' un confine di fiducia — chiunque puo' scrivere
 * `?order=drop-table` — quindi un valore non riconosciuto non viene inoltrato
 * alla API ma sostituito dal default.
 */
export const SEARCH_TYPES = [
	{ value: 'video', label: 'Video' },
	{ value: 'channel', label: 'Canali' }
] as const;

export const SEARCH_ORDERS = [
	{ value: 'relevance', label: 'Pertinenza' },
	{ value: 'date', label: 'Data di caricamento' },
	{ value: 'viewCount', label: 'Numero di visualizzazioni' },
	{ value: 'rating', label: 'Valutazione' }
] as const;

export const SEARCH_DURATIONS = [
	{ value: 'any', label: 'Qualsiasi durata' },
	{ value: 'short', label: 'Meno di 4 minuti' },
	{ value: 'medium', label: 'Da 4 a 20 minuti' },
	{ value: 'long', label: 'Oltre 20 minuti' }
] as const;

export const SEARCH_PERIODS = [
	{ value: 'any', label: 'Qualsiasi data' },
	{ value: 'hour', label: "Ultim'ora" },
	{ value: 'today', label: 'Oggi' },
	{ value: 'week', label: 'Questa settimana' },
	{ value: 'month', label: 'Questo mese' },
	{ value: 'year', label: "Quest'anno" }
] as const;

export type SearchFilters = {
	type: (typeof SEARCH_TYPES)[number]['value'];
	order: (typeof SEARCH_ORDERS)[number]['value'];
	duration: (typeof SEARCH_DURATIONS)[number]['value'];
	uploaded: (typeof SEARCH_PERIODS)[number]['value'];
};

export const defaultSearchFilters: SearchFilters = {
	type: 'video',
	order: 'relevance',
	duration: 'any',
	uploaded: 'any'
};

/** Il valore richiesto se e' fra quelli previsti, altrimenti il default. */
function pick<T extends string>(
	options: readonly { value: T }[],
	raw: string | null,
	fallback: T
): T {
	return options.find((option) => option.value === raw)?.value ?? fallback;
}

export function parseSearchFilters(params: URLSearchParams): SearchFilters {
	return {
		type: pick(SEARCH_TYPES, params.get('type'), defaultSearchFilters.type),
		order: pick(SEARCH_ORDERS, params.get('order'), defaultSearchFilters.order),
		duration: pick(SEARCH_DURATIONS, params.get('duration'), defaultSearchFilters.duration),
		uploaded: pick(SEARCH_PERIODS, params.get('uploaded'), defaultSearchFilters.uploaded)
	};
}

/** I filtri diversi dal default, per costruire URL senza parametri inutili. */
export function searchFiltersToParams(filters: SearchFilters): URLSearchParams {
	const params = new URLSearchParams();
	if (filters.type !== defaultSearchFilters.type) params.set('type', filters.type);
	if (filters.order !== defaultSearchFilters.order) params.set('order', filters.order);
	if (filters.duration !== defaultSearchFilters.duration) params.set('duration', filters.duration);
	if (filters.uploaded !== defaultSearchFilters.uploaded) params.set('uploaded', filters.uploaded);
	return params;
}
