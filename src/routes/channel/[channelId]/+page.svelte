<script lang="ts">
	import VideoCard from '$lib/components/videoCard.svelte';
	import SkeletonHome from '$lib/components/SkeletonHome.svelte';
	import { inview } from 'svelte-inview';
	import { fly } from 'svelte/transition';
	import type { Video } from '$lib/api/mock';
	import { page } from '$app/stores';

	let { data } = $props();
	let videos = $state<Video[]>([]);
	let nextPageToken = $state<string | undefined>(undefined);
	let isLoaded = $state(false);
	let error = $state<string | null>(null);

	async function loadMoreVideos() {
		if (!nextPageToken) return;
		const channelId = $page.params.channelId;
		const response = await fetch(`/api/videos/channel/${channelId}?pageToken=${nextPageToken}`);
		const newVideosData = await response.json();

		videos = [...videos, ...newVideosData.videos];
		nextPageToken = newVideosData.nextPageToken;
	}

	$effect(() => {
		isLoaded = false;
		videos = [];
		nextPageToken = undefined;
		error = null;

		data.videos
			.then((awaitedVideos) => {
				videos = awaitedVideos;
				isLoaded = true;
			})
			.catch((err) => {
				error = err?.message || err;
				isLoaded = true;
			});

		data.nextPageToken
			.then((token) => {
				nextPageToken = token;
			})
			.catch(() => {
				// Handle token error silently
			});
	});
</script>

<div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
	{#if error}
		<p>
			<strong class="text-primary">Errore nel caricamento dei video: {error}</strong>
		</p>
	{:else if !isLoaded}
		{#each Array(8) as _}
			<SkeletonHome />
		{/each}
	{:else}
		{#each videos as video (video.id)}
			<div in:fly|local={{ y: 50, duration: 200 }}>
				<VideoCard {video} />
			</div>
		{/each}
		{#if nextPageToken}
			<div use:inview={{ threshold: 0.1 }} oninview_enter={loadMoreVideos}>
				<SkeletonHome />
			</div>
		{/if}
	{/if}
</div>
