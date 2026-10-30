/**
 * Ordine dei video nella pagina di un canale. Senza `order`, `search.list` usa
 * la pertinenza, che per un canale vuol dire i video piu visti: i piu recenti
 * non si potevano vedere. Costa uguale (100 unita' a chiamata).
 *
 * La query string e' un confine di fiducia: un valore non riconosciuto non
 * arriva a Google ma viene sostituito dal default.
 */
export const CHANNEL_ORDERS = [
	{ value: 'date', label: 'Più recenti' },
	{ value: 'viewCount', label: 'Più popolari' }
] as const;

export type ChannelOrder = (typeof CHANNEL_ORDERS)[number]['value'];

export const defaultChannelOrder: ChannelOrder = 'date';

export function parseChannelOrder(raw: string | null): ChannelOrder {
	return CHANNEL_ORDERS.find((order) => order.value === raw)?.value ?? defaultChannelOrder;
}
