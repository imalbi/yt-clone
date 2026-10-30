import { browser } from '$app/env';
import { QueryClient } from '@tanstack/svelte-query';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				// SvelteKit invia l'HTML prima che una query lato server possa
				// risolversi, quindi le query girano solo nel browser. I dati
				// iniziali continuano ad arrivare dai `load`, che restano la fonte
				// dell'SSR: Query si occupa di cio' che accade dopo l'idratazione.
				enabled: browser,
				// Le risposte della YouTube API non cambiano da un secondo all'altro
				// e c'e' una quota da rispettare.
				staleTime: 60_000,
				retry: 1
			}
		}
	});

	return { ...data, queryClient };
};
