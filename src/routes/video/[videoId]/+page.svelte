<script lang="ts">
	import VideoPlayer from '$lib/components/videoPlayer.svelte';
	import CommentsCard from '$lib/components/CommentsCard.svelte';
	import RecommendedVideos from '$lib/components/RecommendedVideos.svelte';
	import { fly } from 'svelte/transition';
	import SkeletonRecommended from '$lib/components/SkeletonRecommended.svelte';
	import SkeletonPlayer from '$lib/components/SkeletonPlayer.svelte';
	import type { Video } from '$lib/api/mock.js';
	import { inview } from 'svelte-inview';

	let { data } = $props();
	let videos = $state<Video[]>([]);
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
	//TODO: fix unlike and undislike behavior

	// Initialize data when promises resolve or when video changes
	$effect(() => {
		// Reset state when video changes
		isLoaded = false;
		videos = [];
		nextPageToken = undefined;
		error = null;

		data.relatedVideos
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

<main class="w-full p-4 xl:p-8">
	<div class="xl:grid-rows-auto grid grid-cols-1 gap-8 xl:grid-cols-[1fr_440px]">
		<div class="w-full xl:col-start-1 xl:row-start-1">
			{#await data.video}
				<SkeletonPlayer />
			{:then video}
				<VideoPlayer {video} />
			{:catch error}
				<p>Error loading video: {error.message}</p>
			{/await}
		</div>

		<div
			class="w-full gap-4 sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:col-start-2 xl:row-span-2 xl:row-start-1 xl:flex xl:w-110 xl:flex-col"
		>
			{#if error}
				<p>
					<strong class="text-primary">Errore nel caricamento dei video: {error}</strong>
				</p>
			{:else if !isLoaded}
				{#each Array(9)}
					<SkeletonRecommended />
				{/each}
			{:else}
				{#each videos as video, index (video.id)}
					<div in:fly|local={{ x: 50, duration: 200 }}>
						<RecommendedVideos {video}></RecommendedVideos>
					</div>
				{/each}
				{#if nextPageToken}
					<!-- Infinite scroll per schermi grandi -->
					<div
						class="hidden xl:block"
						use:inview={{ threshold: 0.1 }}
						oninview_enter={loadMoreVideos}
					>
						<SkeletonRecommended />
					</div>
				{/if}
			{/if}
		</div>
		<div class="xl:hidden">
			<button
				class="bg-background-secondary hover:bg-background-tertiary/90 text-primary w-full cursor-pointer rounded-lg px-4 py-3 font-bold transition-colors"
				onclick={loadMoreVideos}
			>
				Carica altri video
			</button>
		</div>

		<div class="w-full xl:col-start-1 xl:row-start-2">
			<CommentsCard
				comments={data.comments}
				video={data.video}
				commentsNextPageToken={data.commentsNextPageToken}
			></CommentsCard>
		</div>
	</div>
</main>
