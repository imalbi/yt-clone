import { getChannelById, getSubscriptions } from '#lib/api/youtube.js';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, locals }) => {
	const { channelId } = params;
	const accessToken = locals.accessToken;

	// Gli errori dell'API salgono a `handleError`, che li traduce in stato e testo.
	const [channel, subscriptions] = await Promise.all([
		getChannelById(channelId),
		accessToken ? getSubscriptions(accessToken) : Promise.resolve([])
	]);

	if (!channel) {
		error(404, 'Canale non trovato');
	}

	return { channelId, channel, subscriptions };
};
