import { resolve } from '$app/paths';

/**
 * Indirizzo di riproduzione di un video dentro una playlist. I piaciuti ('LL')
 * sono la playlist di default e non portano `?list=`, cosi i link che esistevano
 * prima restano validi.
 */
export function watchHref(videoId: string, list?: string): string {
	const href = resolve('/playlist/watch/[videoId]', { videoId });
	return list && list !== 'LL' ? `${href}?list=${encodeURIComponent(list)}` : href;
}
