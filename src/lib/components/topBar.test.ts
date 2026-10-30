import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import TopBar from './topBar.svelte';

describe('TopBar SSR', () => {
	it('rende subito i controlli dell’utente quando il load contiene la sessione', () => {
		const { body } = render(TopBar, {
			props: {
				inputSearch: '',
				user: { name: 'SSR Tester' }
			}
		});

		expect(body).toContain('Profilo di SSR Tester');
		expect(body).not.toContain('Accedi');
	});
});
