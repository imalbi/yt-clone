import { describe, it, expect } from 'vitest';
import { formatDuration, linkify, parseIsoDuration } from './scripts';

// La durata arriva in ISO 8601 dalla Data API. Era gia' richiesta con
// part=contentDetails e scartata: questi test coprono il parsing ora che si usa.
describe('parseIsoDuration', () => {
	it.each([
		['PT4M13S', 253],
		['PT1H2M13S', 3733],
		['PT45S', 45],
		['PT2H', 7200],
		['P1DT2H', 93600]
	])('%s -> %i secondi', (iso, expected) => {
		expect(parseIsoDuration(iso)).toBe(expected);
	});

	it.each([undefined, '', 'quattro minuti', 'P'])('non inventa nulla su %s', (input) => {
		expect(parseIsoDuration(input)).toBeUndefined();
	});
});

describe('formatDuration', () => {
	it.each([
		[253, '4:13'],
		[3733, '1:02:13'],
		[45, '0:45'],
		[3600, '1:00:00']
	])('%i -> %s', (seconds, expected) => {
		expect(formatDuration(seconds)).toBe(expected);
	});

	// Senza durata il badge non deve comparire, non stampare "NaN".
	it.each([undefined, 0, -5])('nessuna etichetta per %s', (input) => {
		expect(formatDuration(input)).toBeUndefined();
	});
});

// Il testo dei commenti lo scrive un estraneo: qui si decide cosa diventa un
// href, e uno schema che non sia http/https non deve diventarlo mai.
describe('linkify', () => {
	it('lascia intatto un testo senza indirizzi', () => {
		expect(linkify('nessun link qui')).toEqual([{ text: 'nessun link qui' }]);
	});

	it('separa il link dal testo intorno', () => {
		expect(linkify('guarda https://esempio.test/a e poi torna')).toEqual([
			{ text: 'guarda ' },
			{ text: 'https://esempio.test/a', href: 'https://esempio.test/a' },
			{ text: ' e poi torna' }
		]);
	});

	it('lascia il punto finale alla frase', () => {
		expect(linkify('vai su https://esempio.test.')).toEqual([
			{ text: 'vai su ' },
			{ text: 'https://esempio.test', href: 'https://esempio.test' },
			{ text: '.' }
		]);
	});

	it('trova due link nella stessa riga', () => {
		const parts = linkify('http://a.test x https://b.test');
		expect(parts.filter((part) => part.href).map((part) => part.href)).toEqual([
			'http://a.test',
			'https://b.test'
		]);
	});

	it.each(['javascript:alert(1)', 'data:text/html,<script>', 'ftp://esempio.test'])(
		'non fa un href di %s',
		(input) => {
			expect(linkify(input).some((part) => part.href)).toBe(false);
		}
	);
});
