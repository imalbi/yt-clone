import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Harness from './videoPlayer.harness.svelte';
import { ratings, reset, setVideoLiked } from './videoPlayer.fake.svelte.js';
import type { Video } from '#lib/types/video.js';

// Il seam non e' piu' `fetch` ma il modulo remote: le chiamate non passano piu'
// da un URL, quindi non c'e' piu' un URL da intercettare.
vi.mock('#lib/youtube.remote.js', () => import('./videoPlayer.fake.svelte.js'));

const video: Video = {
	id: 'video1',
	publishedAt: '2026-08-01T10:00:00Z',
	channelId: 'UCcanale',
	title: 'Un titolo',
	desc: 'Una descrizione',
	thumbnails: { default: 'd.jpg', medium: 'm.jpg', high: 'h.jpg' },
	channelTitle: 'Il canale',
	statistics: { viewCount: '1000', likeCount: '10', favoriteCount: '0', commentCount: '2' },
	avatarUrl: 'a.jpg',
	durationSeconds: 120
};

afterEach(() => {
	vi.unstubAllGlobals();
	reset();
});

describe('videoPlayer', () => {
	it('dice che il video non c’e’ invece di dereferenziare null', () => {
		render(Harness, { video: null });

		expect(screen.getByText('Questo video non è disponibile.')).toBeTruthy();
	});

	it('manda al login invece di valutare, se non si e’ loggati', async () => {
		render(Harness, { video });

		// Il login e' una navigazione del browser, non del router: si osserva
		// l'assegnazione a location.href.
		vi.stubGlobal('location', { href: '' });

		screen.getByLabelText('like').click();

		await vi.waitFor(() => expect(location.href).toBe('/api/auth/login'));
		// Il comando non parte: valutare senza sessione risponderebbe 401.
		expect(ratings).toEqual([]);
	});

	it('manda rating=like al primo click e rating=none al secondo', async () => {
		render(Harness, { video, user: { name: 'Tester', picture: '' } });

		screen.getByLabelText('like').click();
		await vi.waitFor(() => expect(ratings).toEqual(['like']));

		// Il bottone si accende quando lo stato rientra: solo allora il secondo
		// click ha davanti un video gia' piaciuto.
		await vi.waitFor(() =>
			expect(screen.getByLabelText('like').className.split(/\s+/)).toContain(
				'bg-background-tertiary!'
			)
		);

		// Secondo click sullo stesso pollice: toglie il like, non lo rimette.
		screen.getByLabelText('like').click();
		await vi.waitFor(() => expect(ratings).toEqual(['like', 'none']));
	});

	it('rende pieno il pollice quando il server dice che il video è liked', () => {
		setVideoLiked(true);
		render(Harness, { video, user: { name: 'Tester', picture: '' } });

		const button = screen.getByLabelText('like');
		expect(button.getAttribute('aria-pressed')).toBe('true');
		expect(button.querySelector('[data-icon-variant="filled"]')).not.toBeNull();
	});

	it('mostra il numero reale di iscritti ottenuto col canale', () => {
		render(Harness, {
			video: {
				...video,
				channelSubscriberCount: '1234567',
				channelSubscriberCountHidden: false
			}
		});

		expect(screen.getByText('1,23 Mln di iscritti')).toBeTruthy();
	});

	it('non inventa un conteggio quando il canale lo nasconde', () => {
		render(Harness, {
			video: {
				...video,
				channelSubscriberCount: '1234567',
				channelSubscriberCountHidden: true
			}
		});

		expect(screen.queryByText(/di iscritti/)).toBeNull();
	});
});
