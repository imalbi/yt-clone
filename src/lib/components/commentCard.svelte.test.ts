import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import Harness from './commentCard.harness.svelte';
import type { Comment } from '#lib/types/commentThread.js';

/**
 * Il seam non e' piu' `fetch` ma il modulo remote: non c'e' piu' un URL da
 * intercettare, quindi si guarda con quali argomenti parte il comando.
 * `vi.hoisted` perche' la factory di `vi.mock` viene issata sopra gli import.
 */
const remote = vi.hoisted(() => {
	const done = () => Object.assign(Promise.resolve(), { updates: () => Promise.resolve() });
	return {
		updateComment: Object.assign(vi.fn(done), { pending: 0 }),
		postReply: Object.assign(vi.fn(done), { pending: 0 }),
		deleteComment: Object.assign(vi.fn(done), { pending: 0 })
	};
});

vi.mock('#lib/youtube.remote.js', () => remote);

const MY_CHANNEL = 'UCmio';

const comment: Comment = {
	id: 'comment1',
	authorDisplayName: '@tizio',
	authorChannelId: MY_CHANNEL,
	authorChannelUrl: 'https://example.test/tizio',
	authorProfileImageUrl: 'https://example.test/avatar.jpg',
	textDisplay: 'Testo originale',
	publishedAt: '2026-08-19T10:00:00Z',
	likeCount: 3
};

afterEach(() => {
	vi.unstubAllGlobals();
	remote.updateComment.mockClear();
	remote.postReply.mockClear();
	remote.deleteComment.mockClear();
});

const button = (name: string) => screen.queryByRole('button', { name });

describe('commentCard', () => {
	it('mostra Modifica ed Elimina solo sul proprio commento', () => {
		render(Harness, { commentData: comment, myChannelId: MY_CHANNEL });

		expect(button('Modifica')).toBeTruthy();
		expect(button('Elimina')).toBeTruthy();
	});

	it('non li mostra sul commento di un altro', () => {
		render(Harness, { commentData: comment, myChannelId: 'UCaltro' });

		expect(button('Modifica')).toBeNull();
		expect(button('Elimina')).toBeNull();
	});

	it('non li mostra a chi non e’ loggato', () => {
		render(Harness, { commentData: comment, myChannelId: null });

		expect(button('Modifica')).toBeNull();
	});

	it('manda il testo modificato al comando di modifica', async () => {
		render(Harness, { commentData: comment, myChannelId: MY_CHANNEL });

		button('Modifica')?.click();
		const box = await screen.findByLabelText('Modifica il commento');
		if (!(box instanceof HTMLTextAreaElement)) throw new Error('textarea non trovata');
		box.value = 'Testo corretto';
		box.dispatchEvent(new Event('input', { bubbles: true }));

		button('Salva')?.click();
		await vi.waitFor(() =>
			expect(remote.updateComment).toHaveBeenCalledWith({
				commentId: 'comment1',
				text: 'Testo corretto'
			})
		);
	});

	it('manda la risposta al capofila del thread, non al commento cliccato', async () => {
		// Una risposta a una risposta: il parentId resta quello del thread,
		// perche' YouTube non ha un terzo livello dove metterla.
		render(Harness, {
			commentData: { ...comment, id: 'risposta9', authorChannelId: 'UCaltro' },
			parentId: 'capofila1',
			myChannelId: MY_CHANNEL,
			isReply: true
		});

		button('Rispondi')?.click();
		const box = await screen.findByLabelText('Rispondi al commento');
		if (!(box instanceof HTMLTextAreaElement)) throw new Error('textarea non trovata');
		box.value = 'Sono d’accordo';
		box.dispatchEvent(new Event('input', { bubbles: true }));
		// Il bottone e' disabilitato finche' il campo e' vuoto: senza aspettare
		// il giro di Svelte il click arriva su un bottone ancora spento.
		await tick();

		button('Rispondi')?.click();
		await vi.waitFor(() =>
			expect(remote.postReply).toHaveBeenCalledWith({
				parentId: 'capofila1',
				text: 'Sono d’accordo'
			})
		);
	});

	it('rende il link senza aggiungere spazi al testo intorno', () => {
		const testo = 'guarda https://esempio.test/a e poi torna';
		render(Harness, { commentData: { ...comment, textDisplay: testo } });

		const link = screen.getByRole('link', { name: 'https://esempio.test/a' });
		expect(link.parentElement?.textContent).toBe(testo);
	});

	it('non mostra Rispondi a chi non ha un canale', () => {
		render(Harness, { commentData: comment, myChannelId: null });

		expect(button('Rispondi')).toBeNull();
	});

	it('non elimina al primo click: prima chiede conferma', async () => {
		render(Harness, { commentData: comment, myChannelId: MY_CHANNEL });

		button('Elimina')?.click();
		await vi.waitFor(() => expect(button('Sì')).toBeTruthy());
		expect(remote.deleteComment).not.toHaveBeenCalled();

		button('Sì')?.click();
		await vi.waitFor(() => expect(remote.deleteComment).toHaveBeenCalledWith('comment1'));
	});
});
