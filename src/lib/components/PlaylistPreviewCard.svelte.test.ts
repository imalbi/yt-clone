import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import PlaylistPreviewCard from './PlaylistPreviewCard.svelte';
import type { Playlist } from '#lib/types/playlist.js';

const playlist: Playlist = {
	id: 'PL123',
	title: 'Cose da riguardare',
	description: '',
	publishedAt: '2026-01-01T00:00:00Z',
	thumbnail: 'https://example.test/cover.jpg',
	itemCount: 12
};

describe('PlaylistPreviewCard', () => {
	it('porta alla pagina della playlist e mostra quanti video contiene', () => {
		render(PlaylistPreviewCard, { playlist });

		const link = screen.getByRole('link');
		expect(link.getAttribute('href')).toBe('/playlist/PL123');
		expect(screen.getByText('Cose da riguardare')).toBeTruthy();
		expect(screen.getByText('12')).toBeTruthy();
	});

	it('regge una playlist senza copertina e senza conteggio', () => {
		// contentDetails e' opzionale nello schema: se manca, la card deve
		// disegnarsi lo stesso invece di mostrare 'undefined'.
		render(PlaylistPreviewCard, {
			playlist: { ...playlist, thumbnail: '', itemCount: undefined }
		});

		expect(screen.queryByRole('img')).toBeNull();
		expect(screen.queryByText('undefined')).toBeNull();
	});
});
