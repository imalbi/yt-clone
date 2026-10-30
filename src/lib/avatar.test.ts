import { describe, it, expect } from 'vitest';
import { avatarUrl, FALLBACK_AVATAR, initialsAvatar } from './avatar';

describe('FALLBACK_AVATAR', () => {
	// Il data URI viene decodificato una volta dal browser: se il colore e'
	// gia' codificato nel sorgente ne resta uno inesistente e il cerchio esce
	// nero. Sul tema scuro non si vede la differenza fra rotto e giusto.
	it('arriva al browser con un colore valido', () => {
		const svg = decodeURIComponent(FALLBACK_AVATAR.replace('data:image/svg+xml,', ''));

		expect(svg).toContain('fill="#606060"');
	});
});

describe('avatarUrl', () => {
	it('ripiega sul segnaposto quando non c’e’ nessuna miniatura', () => {
		expect(avatarUrl(undefined)).toBe(FALLBACK_AVATAR);
		expect(avatarUrl({})).toBe(FALLBACK_AVATAR);
	});

	it('prende la prima misura disponibile', () => {
		expect(avatarUrl({ default: { url: 'https://esempio.test/d.jpg' } })).toBe(
			'https://esempio.test/d.jpg'
		);
	});
});

const svgDi = (uri: string) => decodeURIComponent(uri.replace('data:image/svg+xml,', ''));

describe('initialsAvatar', () => {
	it.each([
		['Mario Rossi', 'MR'],
		['@uncut_studio', 'US'],
		['@pierpozzebon4641', 'P'],
		['alberto.cerqua', 'AC']
	])('%s -> %s', (nome, atteso) => {
		expect(svgDi(initialsAvatar(nome))).toContain(`>${atteso}</text>`);
	});

	it('resta il cerchio nudo senza nome', () => {
		expect(svgDi(initialsAvatar())).not.toContain('<text');
		expect(svgDi(initialsAvatar('   '))).not.toContain('<text');
	});

	// Il nome lo sceglie chi commenta e finisce dentro un SVG: un '<' lo
	// romperebbe, quindi non deve arrivarci proprio.
	it.each(['<script>', '"><circle r="99"', '🙂'])('non lascia passare %s', (nome) => {
		const svg = svgDi(initialsAvatar(nome));

		expect(svg.match(/</g)?.length).toBe(svg.match(/<[a-z/]/g)?.length);
		expect(svg).not.toContain('script');
	});

	it('da’ lo stesso colore alla stessa persona', () => {
		expect(initialsAvatar('Mario Rossi')).toBe(initialsAvatar('Mario Rossi'));
	});
});

describe('avatarUrl con nome', () => {
	it('ripiega sulle iniziali quando manca la miniatura', () => {
		expect(avatarUrl(undefined, 'Mario Rossi')).toBe(initialsAvatar('Mario Rossi'));
	});
});
