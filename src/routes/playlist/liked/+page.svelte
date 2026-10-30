<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { resolve } from '$app/paths';
	import IconPlayCircle from '~icons/mdi/play-circle';
	import PlaylistCard from '#lib/components/PlaylistCard.svelte';
	import { likedVideosOptions } from '#lib/queries.js';
	import { playlistOrder } from '#lib/stores/playlistOrder.svelte.js';

	// Una richiesta sola: l'endpoint restituisce i video completi. Prima
	// arrivavano solo gli id e la pagina ne chiedeva i dettagli uno per uno.
	const liked = createQuery(() => likedVideosOptions(true));

	const videos = $derived(playlistOrder.sort(liked.data?.videos ?? []));

	function handleDrop(event: DragEvent & { currentTarget: HTMLElement }) {
		event.preventDefault();
		if (!event.dataTransfer) return;

		const from = Number(event.dataTransfer.getData('text/plain'));
		const to = Number(event.currentTarget.dataset.index);
		if (!isNaN(from) && !isNaN(to) && from !== to) {
			playlistOrder.move(
				videos.map((v) => v.id),
				from,
				to
			);
		}
	}
</script>

<main class="text-primary mx-auto w-full max-w-5xl px-4 py-4">
	<div
		class="mb-6 flex min-w-0 flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between"
	>
		<div class="max-w-full min-w-0">
			<h1 class="text-2xl font-bold">Liked Videos</h1>
			<p class="text-secondary text-sm">{videos.length} videos</p>
		</div>

		{#if videos.length > 0}
			<a
				href={resolve('/playlist/watch/[videoId]', { videoId: videos[0].id })}
				class="bg-background-secondary text-primary hover:bg-background-tertiary flex flex-shrink-0 items-center gap-2 rounded-lg px-6 py-3 font-medium transition-colors"
			>
				<IconPlayCircle class="h-5 w-5" />
				Play All
			</a>
		{/if}
	</div>

	{#if liked.isError}
		<p class="text-red-500">Errore nel caricamento: {liked.error.message}</p>
	{:else if liked.isPending}
		<p class="text-secondary py-12 text-center">Caricamento della playlist...</p>
	{:else if videos.length === 0}
		<div class="py-12 text-center">
			<p class="text-secondary mb-4">No liked videos yet</p>
			<a href={resolve('/')} class="text-blue-500 hover:underline">Browse videos to like some!</a>
		</div>
	{:else}
		<ul class="flex flex-col gap-3">
			{#each videos as video, index (video.id)}
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
					<PlaylistCard {video} />
				</li>
			{/each}
		</ul>
	{/if}
</main>
