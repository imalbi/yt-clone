import { describe, it, expect } from 'vitest';
import { defaultSearchFilters, parseSearchFilters, searchFiltersToParams } from './searchFilters';

describe('parseSearchFilters', () => {
	it('legge i filtri riconosciuti', () => {
		const filters = parseSearchFilters(
			new URLSearchParams('type=channel&order=date&duration=short&uploaded=week')
		);

		expect(filters).toEqual({
			type: 'channel',
			order: 'date',
			duration: 'short',
			uploaded: 'week'
		});
	});

	it('sostituisce col default un valore inventato invece di inoltrarlo', () => {
		const filters = parseSearchFilters(new URLSearchParams('order=DROP%20TABLE&type=qualcosa'));

		expect(filters).toEqual(defaultSearchFilters);
	});

	it('non mette in URL i filtri lasciati al default', () => {
		const params = searchFiltersToParams({ ...defaultSearchFilters, order: 'viewCount' });

		expect(params.toString()).toBe('order=viewCount');
	});
});
