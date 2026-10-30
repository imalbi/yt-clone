<script lang="ts">
	import { createInfiniteQuery } from '@tanstack/svelte-query';
	import SkeletonHome from '#lib/components/SkeletonHome.svelte';
	import CategoryChips from '#lib/components/CategoryChips.svelte';
	import VideoCard from '#lib/components/videoCard.svelte';
	import { inview } from 'svelte-inview';
	import { popularVideosOptions } from '#lib/queries.js';

	let { data } = $props();

	// La chiave include la categoria: cambiando chip la lista riparte da sola e
	// la precedente resta in cache per il tasto indietro.
	const feed = createInfiniteQuery(() => popularVideosOptions(data.firstPage, data.categoryId));

	const videos = $derived(feed.data?.pages.flatMap((p) => p.videos) ?? []);
</script>

<main class="bg-background w-full md:p-4">
	{#await data.categories then categories}
		{#if categories.length > 0}
			<CategoryChips {categories} selected={data.categoryId} />
		{/if}
	{/await}

	{#if feed.isError}
		<p>
			<strong class="text-primary">
				Errore nel caricamento dei video: {feed.error.message}
			</strong>
		</p>
	{:else if feed.isPending}
		<SkeletonHome />
	{:else if videos.length === 0}
		<!-- Alcune categorie assegnabili non hanno una classifica: e' un caso
		     normale, non un errore. -->
		<p class="text-secondary p-8 text-center">Nessun video popolare in questa categoria.</p>
	{:else}
		<div class="mt-3 grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each videos as video (video.id)}
				<VideoCard {video} />
			{/each}
		</div>
		{#if feed.hasNextPage}
			<div use:inview={{ threshold: 0.1 }} oninview_enter={() => feed.fetchNextPage()}>
				<SkeletonHome />
			</div>
		{/if}
	{/if}
</main>
