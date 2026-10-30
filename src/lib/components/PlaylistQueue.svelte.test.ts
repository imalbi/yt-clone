import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import PlaylistQueue from './PlaylistQueue.svelte';
import type { Video } from '#lib/types/video.js';

const first: Video = {
	id: 'one',
	publishedAt: '2026-08-01T10:00:00Z',
	channelId: 'channel-one',
	title: 'Primo video',
	desc: '',
	thumbnails: {
		default: 'one-default.jpg',
		medium: 'one-medium.jpg',
		high: 'one-high.jpg',
		maxres: 'one-maxres.jpg'
	},
	channelTitle: 'Primo canale',
	statistics: { viewCount: '10', favoriteCount: '0' },
	avatarUrl: '',
	durationSeconds: 90
};

const second: Video = {
	...first,
	id: 'two',
	channelId: 'channel-two',
	title: 'Secondo video',
	channelTitle: 'Secondo canale',
	thumbnails: {
		default: 'two-default.jpg',
		medium: 'two-medium.jpg',
		high: 'two-high.jpg'
	}
};

describe('PlaylistQueue', () => {
	it('rende una coda con thumbnail e stato corrente senza emoji', () => {
		const { container } = render(PlaylistQueue, {
			videos: [first, second],
			currentVideoId: 'one'
		});

		expect(screen.getAllByRole('listitem')).toHaveLength(2);
		expect(screen.getAllByRole('img')[0].getAttribute('src')).toBe('one-maxres.jpg');
		expect(screen.getByRole('link', { name: /Primo video/ }).getAttribute('aria-current')).toBe(
			'page'
		);
		expect(screen.getByText('In riproduzione')).toBeTruthy();
		expect(container.textContent).not.toContain('▶');
	});

	it('mostra il titolo della playlist e ne conserva l id nei link', () => {
		render(PlaylistQueue, {
			videos: [first, second],
			currentVideoId: 'one',
			list: 'PL123',
			title: 'La mia playlist'
		});

		expect(screen.getByRole('heading', { name: 'La mia playlist' })).toBeTruthy();
		expect(screen.getByRole('link', { name: /Secondo video/ }).getAttribute('href')).toMatch(
			/\/two\?list=PL123$/
		);
	});
});
