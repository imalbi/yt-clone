import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Harness from './CommentsCard.harness.svelte';
import type { CommentThread } from '#lib/types/commentThread.js';

/**
 * Il seam non e' piu' `fetch` ma il modulo remote: non c'e' piu' un URL da
 * intercettare, quindi si guarda con quali argomenti parte il comando.
 * `vi.hoisted` perche' la factory di `vi.mock` viene issata sopra gli import.
 */
const remote = vi.hoisted(() => ({
	postComment: Object.assign(
		vi.fn(() => Object.assign(Promise.resolve(), { updates: () => Promise.resolve() })),
		{ pending: 0 }
	),
	// Chi guarda non ha un canale: i bottoni Modifica ed Elimina restano fuori.
	myChannelId: () => ({ ready: true as const, current: null })
}));

vi.mock('#lib/youtube.remote.js', () => remote);

const thread = (id: string): CommentThread => ({
	id,
	topLevelComment: {
		id: `${id}-top`,
		authorDisplayName: '@tizio',
		authorChannelId: 'UCtizio',
		authorChannelUrl: 'https://example.test/tizio',
		authorProfileImageUrl: 'https://example.test/a.jpg',
		textDisplay: 'Primo',
		publishedAt: '2026-08-19T10:00:00Z',
		likeCount: 0
	},
	replies: []
});

const firstPage = () => Promise.resolve({ comments: [thread('t1'), thread('t2')] });

afterEach(() => {
	vi.unstubAllGlobals();
	remote.postComment.mockClear();
});

describe('CommentsCard', () => {
	it('conta i commenti arrivati dal load', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }));

		render(Harness, { firstPage: firstPage() });

		expect(await screen.findByText('2 commenti')).toBeTruthy();
	});

	it('invita ad accedere invece di far scrivere a vuoto', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }));

		render(Harness, { firstPage: firstPage() });

		const box = await screen.findByPlaceholderText('Accedi per commentare');
		expect(box.hasAttribute('disabled')).toBe(true);
	});

	it('pubblica il commento e svuota la casella', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({ ok: true, json: async () => ({ comments: [] }) })
		);

		render(Harness, {
			firstPage: firstPage(),
			user: { name: 'Tester', picture: '' }
		});

		const box = await screen.findByPlaceholderText('Aggiungi un commento');
		if (!(box instanceof HTMLTextAreaElement)) throw new Error('textarea non trovata');
		box.dispatchEvent(new Event('focus', { bubbles: true }));
		box.value = 'Ottimo video';
		box.dispatchEvent(new Event('input', { bubbles: true }));

		const send = await screen.findByRole('button', { name: 'Commenta' });
		send.click();

		await vi.waitFor(() =>
			expect(remote.postComment).toHaveBeenCalledWith({
				videoId: 'video1',
				text: 'Ottimo video'
			})
		);
		await vi.waitFor(() => expect(box.value).toBe(''));
	});
});
