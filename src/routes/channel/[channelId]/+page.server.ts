import { getVideosByChannelId } from '#lib/api/youtube.js';
import { parseChannelOrder } from '#lib/types/channelOrder.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	const order = parseChannelOrder(url.searchParams.get('order'));

	// L'esistenza del canale la verifica gia' il layout; qui serve solo la lista.
	// `getVideosByChannelId` e' async e non lancia in modo sincrono, quindi il
	// try/catch che avvolgeva questa chiamata era irraggiungibile.
	return {
		order,
		videos: getVideosByChannelId(params.channelId, order).then((data) => data.videos)
	};
};
