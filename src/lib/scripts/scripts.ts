/**
 * Formatta un numero di iscritti secondo regole specifiche (Mila, Mln).
 * @param {string | number} subs Il numero di iscritti, può essere una stringa o un numero.
 * @returns {string} Il numero formattato come stringa.
 */
export function formatSubscriberCount(subs: string) {
	// Per prima cosa, ci assicuriamo di lavorare con un numero intero.
	const num = parseInt(subs, 10);

	// Se l'input non è un numero valido, restituiamo una stringa vuota.
	if (isNaN(num)) {
		return '';
	}

	// Regola 1: Sotto i 100.000, formato standard con il punto delle migliaia.
	// Esempio: 99999 -> "99.999"
	if (num < 100000) {
		// Usiamo l'API Intl.NumberFormat per formattare correttamente in italiano.
		return new Intl.NumberFormat('it-IT').format(num);
	}

	// Regola 2: Tra 100.000 e 1 milione (escluso), formato "nnn mila".
	// Esempio: 123456 -> "123 mila"
	if (num < 1000000) {
		// Dividiamo per 1000 e arrotondiamo per difetto per ottenere solo la parte intera.
		const thousands = Math.floor(num / 1000);
		return `${thousands} mila`;
	}

	// Regola 3: Da 1 milione in su, formato "n,nn Mln".
	if (num < 1000000000) {
		const millions = num / 1000000;
		let formattedMillions;

		// Decidiamo quanti decimali mostrare per un look più pulito
		if (millions < 10) {
			// Sotto i 10 milioni, usiamo due decimali per maggiore precisione.
			formattedMillions = millions.toFixed(2);
		} else {
			// Sopra i 10 milioni, un solo decimale è sufficiente.
			formattedMillions = millions.toFixed(1);
		}

		// Se il risultato è "10.0", rimuoviamo lo ".0" finale.
		if (formattedMillions.endsWith('.0')) {
			formattedMillions = formattedMillions.slice(0, -2);
		}

		// Sostituiamo il punto con la virgola per lo stile italiano e aggiungiamo "Mln".
		return `${formattedMillions.replace('.', ',')} Mln`;
	}

	// Regola 4: Da 1 miliardo in su, formato "n,n Mld".
	if (num >= 1000000000) {
		const billions = num / 1000000000;
		let formattedBillions;

		formattedBillions = billions.toFixed(1);

		// Se il risultato è "10.0", rimuoviamo lo ".0" finale.
		if (formattedBillions.endsWith('.0')) {
			formattedBillions = formattedBillions.slice(0, -2);
		}

		// Sostituiamo il punto con la virgola per lo stile italiano e aggiungiamo "Mln".
		return `${formattedBillions.replace('.', ',')} Mld`;
	}

	// Fallback per qualsiasi caso non previsto (anche se non dovrebbe succedere).
	return new Intl.NumberFormat('it-IT').format(num);
}

export function formatTimeAgo(isoDateString: string) {
	if (!isoDateString) return '';

	const now = new Date();
	const past = new Date(isoDateString);

	// Differenza in secondi
	const secondsAgo = Math.floor((now.getTime() - past.getTime()) / 1000);

	// Meno di un minuto
	if (secondsAgo < 60) {
		return 'pochi secondi fa';
	}

	// Meno di un'ora
	if (secondsAgo < 3600) {
		const minutes = Math.floor(secondsAgo / 60);
		return minutes === 1 ? '1 minuto fa' : `${minutes} minuti fa`;
	}

	// Meno di 24 ore
	if (secondsAgo < 86400) {
		const hours = Math.floor(secondsAgo / 3600);
		return hours === 1 ? '1 ora fa' : `${hours} ore fa`;
	}

	// Meno di un mese (circa 30 giorni)
	if (secondsAgo < 2592000) {
		const days = Math.floor(secondsAgo / 86400);
		return days === 1 ? '1 giorno fa' : `${days} giorni fa`;
	}

	// Meno di un anno (circa 365 giorni)
	if (secondsAgo < 31536000) {
		const months = Math.floor(secondsAgo / 2592000);
		return months === 1 ? '1 mese fa' : `${months} mesi fa`;
	}

	// Più di un anno
	const years = Math.floor(secondsAgo / 31536000);
	return years === 1 ? '1 anno fa' : `${years} anni fa`;
}
// Genera un numero intero casuale tra min (inclusivo) e max (esclusivo).
export function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min)) + min;
}

export function formatData(dataIn: string) {
	const dataPubblicazione = new Date(dataIn);

	const opzioniDiFormattazione = {
		day: '2-digit' as const,
		month: 'short' as const,
		year: 'numeric' as const
	};
	const formattatore = new Intl.DateTimeFormat('it-IT', opzioniDiFormattazione);
	const stringaFormattata = formattatore.format(dataPubblicazione);
	return stringaFormattata;
}
