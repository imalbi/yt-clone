<script lang="ts">
	import { likedVideosStore } from '$lib/stores/likedVideosStore';
	import { onMount } from 'svelte';
	import PlaylistCard from '$lib/components/PlaylistCard.svelte';

	let { data } = $props();
	let likedVideosIds = $likedVideosStore;

	onMount(async () => {
		if (data && data.videos) {
			const videos = await data.videos;
			likedVideosStore.addFromApi(videos.map((video) => video.id));
		}
	});

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		const fromIndex = Number(event.dataTransfer.getData('text/plain'));
		const toIndex = Number((event.currentTarget as HTMLElement).dataset.index);
		if (!isNaN(fromIndex) && !isNaN(toIndex) && fromIndex !== toIndex) {
			likedVideosStore.moveItem(fromIndex, toIndex);
		}
	}
</script>

<main class="text-primary mx-auto w-[60%] py-4">
	{#await data.videos}
		<p>Caricamento dei video...</p>
	{:then videos}
		<ul>
			{#each likedVideosIds as videoId, index}
				<li
					draggable="true"
					data-index={index}
					ondragstart={(e) => {
						e.dataTransfer.setData('text/plain', index.toString());
					}}
					ondragover={(e) => e.preventDefault()}
					ondrop={handleDrop}
				>
					<PlaylistCard video={videos.find((video) => video.id === videoId)} />
				</li>
			{/each}
		</ul>
	{:catch error}
		<p>Errore nel caricamento dei video: {error.message}</p>
	{/await}
</main>
