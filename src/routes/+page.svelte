<script lang="ts">
	import SkeletonHome from '$lib/components/SkeletonHome.svelte';
	import VideoCard from '$lib/components/videoCard.svelte';
	import { inview } from 'svelte-inview';

	let { data } = $props();
	let videos = $state<any[]>([]);
	let nextPageToken: string | undefined = $state(undefined);
	let isLoaded = $state(false);
	let error = $state<string | null>(null);

	async function loadMoreVideos() {
		if (!nextPageToken) return;

		const response = await fetch(`/api/videos?pageToken=${nextPageToken}`);
		const newVideosData = await response.json();

		videos = [...videos, ...newVideosData.videos];
		nextPageToken = newVideosData.nextPageToken;
	}

	// Initialize data when promises resolve
	$effect(() => {
		data.videos
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

<main class="bg-background w-full md:p-4">
	{#if error}
		<p>
			<strong class="text-primary">Errore nel caricamento dei video: {error}</strong>
		</p>
	{:else if !isLoaded}
		<SkeletonHome />
	{:else}
		<div class="mt-3 grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each videos as video (video.id)}
				<VideoCard {video} />
			{/each}
		</div>
		{#if nextPageToken}
			<div use:inview={{ threshold: 0.1 }} oninview_enter={() => loadMoreVideos()}>
				<SkeletonHome />
			</div>
		{/if}
	{/if}
</main>
