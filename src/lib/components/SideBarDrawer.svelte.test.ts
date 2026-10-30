import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import Harness from './SideBarDrawer.harness.svelte';

describe('SideBarDrawer', () => {
	it('apre dal burger e chiude con Escape', async () => {
		render(Harness);

		const trigger = screen.getByRole('button', { name: 'Apri menu' });
		expect(trigger.getAttribute('aria-expanded')).toBe('false');
		await fireEvent.click(trigger);
		expect(screen.getByRole('dialog', { name: 'Navigazione principale' })).toBeTruthy();

		await fireEvent.keyDown(document, { key: 'Escape' });
		await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
	});

	it('chiude il drawer quando si sceglie una destinazione', async () => {
		render(Harness);
		await fireEvent.click(screen.getByRole('button', { name: 'Apri menu' }));
		await fireEvent.click(screen.getByRole('link', { name: 'Playlist' }));

		await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
	});
});
