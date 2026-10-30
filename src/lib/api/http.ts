import { upstreamStatus, type YouTubeApiError } from './youtube.js';

const QUOTA_REASONS = ['quotaExceeded', 'dailyLimitExceeded', 'rateLimitExceeded'];

/**
 * Lo stato e il testo con cui un errore di Google arriva all'utente. E' l'unico
 * punto in cui avviene: lo chiama `handleError` e vale per `load`, endpoint e
 * remote functions, che per questo non hanno piu' un try/catch ciascuna.
 *
 * Il messaggio dell'API non esce dal server: contiene il corpo JSON della
 * risposta di Google, e la scheda dei commenti arrivava a mostrarlo cosi' com'era.
 */
export function describeUpstreamError(error: YouTubeApiError): { status: number; message: string } {
	const status = upstreamStatus(error);

	if (error.reason && QUOTA_REASONS.includes(error.reason)) {
		return { status, message: 'Quota di YouTube esaurita, riprova più tardi.' };
	}

	switch (status) {
		case 401:
			return { status, message: 'Sessione scaduta, accedi di nuovo.' };
		case 403:
			return { status, message: 'Operazione non consentita da YouTube.' };
		case 404:
			return { status, message: 'Contenuto non trovato.' };
		case 502:
			return { status, message: 'YouTube non risponde, riprova più tardi.' };
		default:
			return { status, message: 'Richiesta rifiutata da YouTube.' };
	}
}
