<script lang="ts">
	import { createInfiniteQuery } from '@tanstack/svelte-query';
	import IconPlayCircle from '~icons/mdi/play-circle';
	import PlaylistCard from '#lib/components/PlaylistCard.svelte';
	import { inview } from 'svelte-inview';
	import { playlistVideosOptions } from '#lib/queries.js';
	import { watchHref } from '#lib/utils/watchHref.js';

	let { data } = $props();

	const items = createInfiniteQuery(() => playlistVideosOptions(data.playlist.id, data.firstPage));

	const videos = $derived(items.data?.pages.flatMap((p) => p.videos) ?? []);
</script>

<main class="text-primary mx-auto w-full max-w-5xl p-4">
	<div
		class="mb-6 flex min-w-0 flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between"
	>
		<div class="max-w-full min-w-0">
			<h1 class="text-2xl font-bold [overflow-wrap:anywhere]">{data.playlist.title}</h1>
			<p class="text-secondary text-sm">
				{data.playlist.itemCount ?? videos.length} video
			</p>
		</div>

		{#if videos.length > 0}
			<a
				href={watchHref(videos[0].id, data.playlist.id)}
				class="bg-background-secondary text-primary hover:bg-background-tertiary flex flex-shrink-0 items-center gap-2 rounded-lg px-6 py-3 font-medium transition-colors"
			>
				<IconPlayCircle class="h-5 w-5" />
				Riproduci tutto
			</a>
		{/if}
	</div>

	{#if items.isError}
		<p class="text-red-500">Errore nel caricamento: {items.error.message}</p>
	{:else if items.isPending}
		<p class="text-secondary py-12 text-center">Caricamento della playlist...</p>
	{:else if videos.length === 0}
		<p class="text-secondary py-12 text-center">Questa playlist è vuota.</p>
	{:else}
		<ul class="flex flex-col gap-3">
			{#each videos as video (video.id)}
				<li><PlaylistCard {video} list={data.playlist.id} /></li>
			{/each}
		</ul>
		{#if items.hasNextPage}
			<div
				class="py-6"
				use:inview={{ threshold: 0.1 }}
				oninview_enter={() => items.fetchNextPage()}
			>
				<p class="text-secondary text-center">Caricamento altri video...</p>
			</div>
		{/if}
	{/if}
</main>
