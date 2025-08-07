<script lang="ts">
	import VideoPlayer from '$lib/components/videoPlayer.svelte';
	import CommentsCard from '$lib/components/CommentsCard.svelte';
	import { fly } from 'svelte/transition';
	import SkeletonPlayer from '$lib/components/SkeletonPlayer.svelte';
	import { likedVideosStore } from '$lib/stores/likedVideosStore';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	let { data } = $props();
	let isLoaded = $state(false);
	let error = $state<string | null>(null);

	// Get current video ID from URL
	let currentVideoId = $derived(page.params.videoId);

	// Get playlist from store
	let likedVideosIds = $derived($likedVideosStore);

	// Find current video index in playlist
	let currentIndex = $derived(likedVideosIds.findIndex((id) => id === currentVideoId));

	// Check if there are previous/next videos
	let hasPrevious = $derived(currentIndex > 0);
	let hasNext = $derived(currentIndex < likedVideosIds.length - 1);

	// Navigation functions
	function goToPrevious() {
		if (hasPrevious) {
			const previousVideoId = likedVideosIds[currentIndex - 1];
			goto(`/playlist/watch/${previousVideoId}`);
		}
	}

	function goToNext() {
		if (hasNext) {
			const nextVideoId = likedVideosIds[currentIndex + 1];
			goto(`/playlist/watch/${nextVideoId}`);
		}
	}

	// Set loaded state when we have playlist data
	$effect(() => {
		isLoaded = likedVideosIds.length > 0;
	});
</script>

<main class="w-full p-4 xl:p-8">
	<div class="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_440px] xl:grid-rows-[auto_auto_1fr]">
		<!-- Video Player Section -->
		<div class="w-full xl:col-start-1 xl:row-start-1">
			{#await data.video}
				<SkeletonPlayer />
			{:then video}
				<VideoPlayer {video} />
			{:catch error}
				<p>Error loading video: {error.message}</p>
			{/await}
		</div>

		<!-- Playlist Navigation Controls -->
		<div class="w-full xl:col-start-1 xl:row-start-2">
			<div class="bg-background-secondary mb-4 flex items-center justify-between rounded-lg p-4">
				<div class="flex items-center gap-4">
					<button
						class="bg-background-tertiary text-primary hover:bg-opacity-80 flex items-center gap-2 rounded-lg px-4 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
						onclick={goToPrevious}
						disabled={!hasPrevious}
					>
						<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
								clip-rule="evenodd"
							></path>
						</svg>
						Previous
					</button>

					<span class="text-primary text-sm">
						{currentIndex + 1} / {likedVideosIds.length}
					</span>

					<button
						class="bg-background-tertiary text-primary hover:bg-opacity-80 flex items-center gap-2 rounded-lg px-4 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
						onclick={goToNext}
						disabled={!hasNext}
					>
						Next
						<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
								clip-rule="evenodd"
							></path>
						</svg>
					</button>
				</div>

				<div class="text-primary text-sm font-medium">Playlist: Liked Videos</div>
			</div>
		</div>

		<!-- Playlist Videos Section -->
		<div
			class="w-full gap-4 sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:col-start-2 xl:row-span-3 xl:row-start-1 xl:flex xl:w-110 xl:flex-col"
		>
			<div class="mb-4">
				<h3 class="text-primary mb-2 text-lg font-semibold">
					Playlist Videos ({likedVideosIds.length})
				</h3>
			</div>

			{#if error}
				<p>
					<strong class="text-primary">Errore nel caricamento dei video: {error}</strong>
				</p>
			{:else if !isLoaded}
				<div class="text-primary">Loading playlist...</div>
			{:else}
				{#each likedVideosIds as videoId, index (videoId)}
					<div in:fly|local={{ x: 50, duration: 200 }} class="relative">
						<!-- Highlight current video -->
						<div
							class="relative {videoId === currentVideoId
								? 'rounded-lg ring-2 ring-blue-500'
								: ''} bg-background-secondary hover:bg-background-tertiary mb-2 rounded-lg p-2 transition-colors"
						>
							<a href={`/playlist/watch/${videoId}`} class="block">
								<div class="flex items-center gap-3">
									<div class="text-secondary w-6 font-mono text-sm">
										{index + 1}
									</div>
									<div class="flex-1">
										<div class="text-primary truncate text-sm font-medium">
											Video ID: {videoId}
										</div>
										{#if videoId === currentVideoId}
											<div class="text-xs font-medium text-blue-500">▶ Now Playing</div>
										{/if}
									</div>
								</div>
							</a>
						</div>
					</div>
				{/each}
			{/if}
		</div>

		<!-- Comments Section -->
		<div class="w-full xl:col-start-1 xl:row-start-3 xl:min-h-0">
			<CommentsCard comments={data.comments} commentsNextPageToken={data.commentsNextPageToken} />
		</div>
	</div>
</main>
