<script lang="ts">
	import { likedVideosStore } from '$lib/stores/likedVideosStore';
	import PlaylistCard from '$lib/components/PlaylistCard.svelte';
	import { onMount } from 'svelte';
	import type { Video } from '$lib/api/mock.js';

	let { data } = $props();
	let videos = $state<{ [key: string]: Video }>({});
	let loadingVideos = $state<Set<string>>(new Set());

	// Fetch video details for each video ID in the store
	async function fetchVideoDetails(videoId: string) {
		if (videos[videoId] || loadingVideos.has(videoId)) return;

		loadingVideos.add(videoId);
		try {
			const response = await fetch(`/api/videos?id=${videoId}`);
			if (response.ok) {
				const data = await response.json();
				if (data.video) {
					videos = { ...videos, [videoId]: data.video };
				}
			}
		} catch (error) {
			console.error('Error fetching video details:', error);
		} finally {
			loadingVideos.delete(videoId);
		}
	}
	onMount(() => {
		likedVideosStore.initFromApi(data.accessToken);
	});
	// Watch for changes in likedVideosStore and fetch video details
	$effect(() => {
		$likedVideosStore.forEach((videoId) => {
			if (!videos[videoId]) {
				fetchVideoDetails(videoId);
			}
		});
	});

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		if (!event.dataTransfer) return;

		const fromIndex = Number(event.dataTransfer.getData('text/plain'));
		const toIndex = Number((event.currentTarget as HTMLElement).dataset.index);
		if (!isNaN(fromIndex) && !isNaN(toIndex) && fromIndex !== toIndex) {
			likedVideosStore.moveItem(fromIndex, toIndex);
		}
	}
</script>

<main class="text-primary mx-auto w-[60%] py-4">
	<!-- Playlist Header -->
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold">Liked Videos</h1>
			<p class="text-secondary text-sm">{$likedVideosStore.length} videos</p>
		</div>

		{#if $likedVideosStore.length > 0}
			<a
				href={`/playlist/watch/${$likedVideosStore[0]}`}
				class="bg-background-secondary text-primary hover:bg-background-tertiary flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-colors"
			>
				<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
						clip-rule="evenodd"
						class="text-red-500"
					></path>
				</svg>
				Play All
			</a>
		{/if}
	</div>

	{#if $likedVideosStore.length === 0}
		<div class="py-12 text-center">
			<p class="text-secondary mb-4">No liked videos yet</p>
			<a href="/" class="text-blue-500 hover:underline">Browse videos to like some!</a>
		</div>
	{:else}
		<ul>
			{#each $likedVideosStore as videoId, index}
				<li
					draggable="true"
					data-index={index}
					ondragstart={(e) => {
						if (!e.dataTransfer) return;
						e.dataTransfer.setData('text/plain', index.toString());
					}}
					ondragover={(e) => e.preventDefault()}
					ondrop={handleDrop}
				>
					{#if videos[videoId]}
						<PlaylistCard video={videos[videoId]} />
					{:else}
						<!-- Loading skeleton for individual video -->
						<div class="bg-background-secondary mb-4 animate-pulse rounded-lg p-4">
							<div class="flex gap-4">
								<div class="bg-background-tertiary h-24 w-32 rounded"></div>
								<div class="flex-1">
									<div class="bg-background-tertiary mb-2 h-4 w-3/4 rounded"></div>
									<div class="bg-background-tertiary mb-2 h-3 w-1/2 rounded"></div>
									<div class="bg-background-tertiary h-3 w-1/4 rounded"></div>
								</div>
							</div>
						</div>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</main>
