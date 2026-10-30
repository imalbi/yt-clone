import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import DescriptionBox from './DescriptionBox.svelte';

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

function makeDescriptionExpandable() {
	vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(120);
	vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(48);
	vi.stubGlobal(
		'matchMedia',
		vi.fn().mockReturnValue({
			matches: true,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn()
		})
	);
}

describe('DescriptionBox', () => {
	it('espone stato e copy corretti durante apertura e chiusura', async () => {
		makeDescriptionExpandable();
		render(DescriptionBox, {
			description: 'Una descrizione abbastanza lunga da occupare più di due righe nel player.'
		});

		const open = screen.getByRole('button', { name: 'Mostra altro' });
		expect(open.getAttribute('aria-expanded')).toBe('false');

		await fireEvent.click(open);
		const close = screen.getByRole('button', { name: 'Mostra meno' });
		expect(close.getAttribute('aria-expanded')).toBe('true');

		await fireEvent.click(close);
		expect(screen.getByRole('button', { name: 'Mostra altro' }).getAttribute('aria-expanded')).toBe(
			'false'
		);
	});
});
