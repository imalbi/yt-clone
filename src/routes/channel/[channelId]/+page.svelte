<script lang="ts">
	import { resolve } from '$app/paths';
	import VideoCard from '#lib/components/videoCard.svelte';
	import SkeletonRecommended from '#lib/components/SkeletonRecommended.svelte';
	import { CHANNEL_ORDERS } from '#lib/types/channelOrder.js';

	let { data } = $props();

	const base = $derived(resolve('/channel/[channelId]', { channelId: data.channelId }));

	// Link e non bottoni, come le chip delle categorie: l'ordine e' un indirizzo,
	// quindi si condivide, si apre in una nuova scheda e torna con il tasto indietro.
	const chipClass =
		'cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors';
</script>

<div class="flex gap-3 px-4 pt-2">
	{#each CHANNEL_ORDERS as order (order.value)}
		<a
			href="{base}?order={order.value}"
			class="{chipClass} {data.order === order.value
				? 'bg-primary text-background'
				: 'bg-background-secondary text-primary hover:bg-background-tertiary'}"
			aria-current={data.order === order.value ? 'page' : undefined}
		>
			{order.label}
		</a>
	{/each}
</div>

<div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
	{#await data.videos}
		{#each Array(12), i (i)}
			<SkeletonRecommended />
		{/each}
	{:then videos}
		{#each videos as video (video.id)}
			<VideoCard {video} />
		{/each}
	{:catch error}
		<p>
			<strong class="text-primary"
				>Errore nel caricamento dei video: {error?.message || error}</strong
			>
		</p>
	{/await}
</div>
