<script lang="ts">
	import { likedVideosStore } from '$lib/stores/likedVideosStore';
	import { onMount } from 'svelte';
	import PlaylistCard from '$lib/components/PlaylistCard.svelte';
	import type { Video } from '$lib/api/mock.js';

	let { data } = $props();
	let loading = $state(true);
	let videos = $state<Video[]>([]);
	onMount(async () => {
		if (data && data.videos) {
			loading = true;
			const resolvedVideos = await data.videos;
			videos = resolvedVideos;
			likedVideosStore.addFromApi(videos.map((video) => video.id));
			loading = false;
		}
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
	{#if loading}
		<p>Caricamento dei video...</p>
	{:else}
		<!-- Playlist Header -->
		<div class="mb-6 flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-bold">Liked Videos</h1>
				<p class="text-secondary text-sm">{$likedVideosStore.length} videos</p>
			</div>

			{#if $likedVideosStore.length > 0}
				<a
					href={`/playlist/watch/${$likedVideosStore[0]}`}
					class="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
				>
					<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
							clip-rule="evenodd"
						></path>
					</svg>
					Play All
				</a>
			{/if}
		</div>

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
					<PlaylistCard video={videos.find((video) => video.id === videoId)} />
				</li>
			{/each}
		</ul>
	{/if}
</main>
