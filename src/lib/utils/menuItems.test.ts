import { describe, it, expect } from 'vitest';
import { isNavActive } from './menuItems.js';

const at = (path: string) => new URL(path, 'http://localhost');

describe('isNavActive', () => {
	it('attiva Home solo sulla root esatta', () => {
		expect(isNavActive('/', at('/'))).toBe(true);
		expect(isNavActive('/', at('/playlist'))).toBe(false);
		expect(isNavActive('/', at('/playlist/liked'))).toBe(false);
	});

	it('attiva Liked solo su /playlist/liked', () => {
		expect(isNavActive('/playlist/liked', at('/playlist/liked'))).toBe(true);
		expect(isNavActive('/playlist/liked', at('/playlist'))).toBe(false);
		expect(isNavActive('/playlist/liked', at('/'))).toBe(false);
	});

	it('attiva Playlist su /playlist e sulle sue sottopagine, non su /playlist/liked', () => {
		expect(isNavActive('/playlist', at('/playlist'))).toBe(true);
		expect(isNavActive('/playlist', at('/playlist/PL12345'))).toBe(true);
		expect(isNavActive('/playlist', at('/playlist/liked'))).toBe(false);
	});

	it('la riproduzione appartiene alla playlist che sta suonando', () => {
		const liked = at('/playlist/watch/abc');
		expect(isNavActive('/playlist/liked', liked)).toBe(true);
		expect(isNavActive('/playlist', liked)).toBe(false);

		const custom = at('/playlist/watch/abc?list=PL123');
		expect(isNavActive('/playlist', custom)).toBe(true);
		expect(isNavActive('/playlist/liked', custom)).toBe(false);

		// Un `?list=LL` scritto a mano e' comunque la playlist dei piaciuti.
		expect(isNavActive('/playlist/liked', at('/playlist/watch/abc?list=LL'))).toBe(true);
	});

	it('attiva Iscrizioni su /iscrizioni', () => {
		expect(isNavActive('/iscrizioni', at('/iscrizioni'))).toBe(true);
		expect(isNavActive('/iscrizioni', at('/playlist'))).toBe(false);
	});
});
