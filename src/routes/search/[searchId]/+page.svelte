<script lang="ts">
	import { createInfiniteQuery } from '@tanstack/svelte-query';
	import ChannelResultCard from '#lib/components/ChannelResultCard.svelte';
	import SearchFilterBar from '#lib/components/SearchFilterBar.svelte';
	import SearchVideoCard from '#lib/components/searchVideoCard.svelte';
	import SkeletonSearch from '#lib/components/SkeletonSearch.svelte';
	import { inview } from 'svelte-inview';
	import { searchOptions } from '#lib/queries.js';

	let { data } = $props();

	// I filtri fanno parte della chiave: cambiandoli la lista riparte, e la
	// combinazione precedente resta in cache per il tasto indietro.
	const results = createInfiniteQuery(() =>
		searchOptions(data.query, data.filters, data.firstPage)
	);

	// La deduplica per id, che prima era a mano a ogni pagina, serve ancora:
	// l'API di ricerca puo' restituire lo stesso video su pagine diverse.
	function dedupe<T extends { id: string }>(items: T[]): T[] {
		// Temporaneo locale di un calcolo puro, non stato reattivo: SvelteSet sarebbe overhead.
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const seen = new Set<string>();
		return items.filter((item) => (seen.has(item.id) ? false : (seen.add(item.id), true)));
	}

	const pages = $derived(results.data?.pages ?? []);
	const videos = $derived(dedupe(pages.flatMap((p) => p.videos)));
	const channels = $derived(dedupe(pages.flatMap((p) => p.channels)));
	const isEmpty = $derived(videos.length === 0 && channels.length === 0);
</script>

<main class="mx-auto mt-3 flex w-full max-w-5xl flex-col gap-5 p-2">
	<SearchFilterBar filters={data.filters} />

	{#if results.isError}
		<p>
			<strong class="text-primary">
				Errore nel caricamento dei risultati: {results.error.message}
			</strong>
		</p>
	{:else if results.isPending}
		{#each Array(9), i (i)}
			<SkeletonSearch />
		{/each}
	{:else if isEmpty}
		<p class="text-secondary">Nessun risultato per {data.query}</p>
	{:else}
		{#each channels as channel (channel.id)}
			<ChannelResultCard {channel} />
		{/each}
		{#each videos as video (video.id)}
			<SearchVideoCard {video} />
		{/each}
		{#if results.hasNextPage}
			<div use:inview={{ threshold: 0.1 }} oninview_enter={() => results.fetchNextPage()}>
				<SkeletonSearch />
			</div>
		{/if}
	{/if}
</main>
