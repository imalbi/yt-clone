<script lang="ts">
	import SearchVideoCard from '$lib/components/searchVideoCard.svelte';
	import { page } from '$app/state';
	import { inview } from 'svelte-inview';
	import SkeletonSearch from '$lib/components/SkeletonSearch.svelte';
	import type { Video } from '$lib/api/mock';

	let { data } = $props();

	let videos = $state<Video[]>([]);
	let nextPageToken: string | undefined = $state(undefined);
	let isLoaded = $state(false);
	let error = $state<string | null>(null);

	async function loadMoreVideos() {
		if (!nextPageToken) return;

		try {
			const response = await fetch(
				`/api/videos/search?q=${page.params.searchId}&pageToken=${nextPageToken}`
			);
			const newVideosData = await response.json();

			// Filtra i video duplicati basandosi sull'ID
			const existingIds = new Set(videos.map((v) => v.id));
			const newUniqueVideos = newVideosData.videos.filter(
				(video: Video) => !existingIds.has(video.id)
			);

			videos = [...videos, ...newUniqueVideos];
			nextPageToken = newVideosData.nextPageToken;
		} catch (error) {
			console.error('Error loading more videos:', error);
		}
	}

	$effect(() => {
		data.searchResults
			.then((awaitedVideos) => {
				if (!isLoaded) {
					videos = awaitedVideos;
					isLoaded = true;
				}
			})
			.catch((err) => {
				error = err?.message || err;
				isLoaded = true;
			});
		data.nextPageToken.then((token) => {
			nextPageToken = token;
		});
	});
</script>

<main class="mx-auto mt-3 flex w-full max-w-5xl flex-col gap-5 p-2 px-4">
	{#if error}
		<p>
			<strong class="text-primary">Errore nel caricamento dei video: {error}</strong>
		</p>
	{:else if !isLoaded}
		{#each Array(9)}
			<SkeletonSearch />
		{/each}
	{:else if videos.length > 0}
		{#each videos as video (video.id)}
			<SearchVideoCard {video}></SearchVideoCard>
		{/each}
		{#if nextPageToken}
			<div use:inview={{ threshold: 0.1 }} oninview_enter={() => loadMoreVideos()}>
				<SkeletonSearch />
			</div>
		{/if}
	{:else}
		<p>Nessun risultato per {page.params.searchId}</p>
	{/if}
</main>
