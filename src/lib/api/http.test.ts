import { describe, expect, it } from 'vitest';
import { YouTubeApiError } from './youtube.js';
import { describeUpstreamError } from './http.js';

describe('describeUpstreamError', () => {
	it('inoltra lo stato 4xx di Google e trasforma i guasti in 502', () => {
		expect(describeUpstreamError(new YouTubeApiError('x', 403)).status).toBe(403);
		expect(describeUpstreamError(new YouTubeApiError('x', 404)).status).toBe(404);
		expect(describeUpstreamError(new YouTubeApiError('x', 500)).status).toBe(502);
	});

	// Il corpo di Google contiene JSON e a volte il testo di una richiesta: resta nel log.
	it('non espone il messaggio dell’API all’utente', () => {
		const raw = 'Richiesta a /commentThreads fallita (403) {"error":{"message":"segreto"}}';

		const { message } = describeUpstreamError(new YouTubeApiError(raw, 403));

		expect(message).not.toContain('segreto');
		expect(message).not.toContain('{');
	});

	it('distingue la quota esaurita da un altro 403', () => {
		const quota = describeUpstreamError(new YouTubeApiError('x', 403, 'quotaExceeded'));
		const other = describeUpstreamError(new YouTubeApiError('x', 403, 'forbidden'));

		expect(quota.message).toContain('Quota');
		expect(other.message).not.toContain('Quota');
		expect(quota.status).toBe(403);
	});

	it('da un messaggio a ogni stato che l’app mostra', () => {
		for (const status of [400, 401, 403, 404, 500]) {
			expect(
				describeUpstreamError(new YouTubeApiError('x', status)).message.length
			).toBeGreaterThan(5);
		}
	});
});
