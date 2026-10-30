import { describe, expect, it } from 'vitest';
import { parseChannelOrder } from './channelOrder.js';

describe('parseChannelOrder', () => {
	it('accetta i due ordini offerti', () => {
		expect(parseChannelOrder('date')).toBe('date');
		expect(parseChannelOrder('viewCount')).toBe('viewCount');
	});

	// La query string e' un confine di fiducia: un valore sconosciuto non arriva a Google.
	it('sostituisce un valore sconosciuto con i piu recenti', () => {
		expect(parseChannelOrder('drop-table')).toBe('date');
		expect(parseChannelOrder('rating')).toBe('date');
		expect(parseChannelOrder('')).toBe('date');
		expect(parseChannelOrder(null)).toBe('date');
	});
});
