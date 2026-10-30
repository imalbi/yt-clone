import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import PlaylistCard from './PlaylistCard.svelte';
import type { Video } from '#lib/types/video.js';

const video: Video = {
	id: 'video1',
	publishedAt: '2026-08-01T10:00:00Z',
	channelId: 'UCcanale',
	title: 'Un titolo abbastanza lungo da occupare la riga della playlist',
	desc: 'Una descrizione',
	thumbnails: {
		default: 'default.jpg',
		medium: 'medium.jpg',
		high: 'high.jpg',
		standard: 'standard.jpg',
		maxres: 'maxres.jpg'
	},
	channelTitle: 'Il canale',
	statistics: { viewCount: '1000', favoriteCount: '0' },
	avatarUrl: 'avatar.jpg',
	durationSeconds: 120
};

describe('PlaylistCard', () => {
	it('usa la miniatura migliore invece del ritaglio default a bassa risoluzione', () => {
		render(PlaylistCard, { video });

		expect(screen.getByRole('img').getAttribute('src')).toBe('maxres.jpg');
	});

	const watchLinks = () =>
		screen
			.getAllByRole('link')
			.map((a) => a.getAttribute('href') ?? '')
			.filter((href) => href.includes('/playlist/watch/'));

	it('porta con se la playlist da cui si arriva', () => {
		render(PlaylistCard, { video, list: 'PL123' });

		expect(watchLinks()).toHaveLength(2);
		for (const href of watchLinks()) expect(href).toMatch(/\/video1\?list=PL123$/);
	});

	it('senza playlist indicata resta il link dei piaciuti', () => {
		render(PlaylistCard, { video });

		for (const href of watchLinks()) expect(href).not.toContain('list=');
	});
});
