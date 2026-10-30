<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { resolve } from '$app/paths';
	import IconChevronLeft from '~icons/mdi/chevron-left';
	import IconChevronRight from '~icons/mdi/chevron-right';
	import VideoPlayer from '#lib/components/videoPlayer.svelte';
	import CommentsCard from '#lib/components/CommentsCard.svelte';
	import SkeletonPlayer from '#lib/components/SkeletonPlayer.svelte';
	import PlaylistQueue from '#lib/components/PlaylistQueue.svelte';
	import { goto } from '$app/navigation';
	import { playlistPageOptions } from '#lib/queries.js';
	import { playlistOrder } from '#lib/stores/playlistOrder.svelte.js';
	import { watchHref } from '#lib/utils/watchHref.js';

	let { data } = $props();

	const currentVideoId = $derived(data.videoId);
	const isLiked = $derived(data.list === 'LL');

	// Per i piaciuti e' la stessa query key della pagina playlist: passando di
	// qui la lista e' gia' in cache e non viene richiesta di nuovo.
	const items = createQuery(() => playlistPageOptions(data.list));

	// L'ordine scelto a mano con il drag and drop esiste solo per i piaciuti.
	const playlist = $derived(
		isLiked ? playlistOrder.sort(items.data?.videos ?? []) : (items.data?.videos ?? [])
	);
	const isLoaded = $derived(items.isSuccess);
	const currentIndex = $derived(playlist.findIndex((v) => v.id === currentVideoId));
	const hasPrevious = $derived(currentIndex > 0);
	const hasNext = $derived(currentIndex >= 0 && currentIndex < playlist.length - 1);

	// Un video che non e' nella lista caricata non si risolve con un redirect
	// automatico: si dice com'e' e si offre la strada di ritorno.
	const missing = $derived(isLoaded && currentIndex === -1);
	const backHref = $derived(
		isLiked
			? resolve('/playlist/liked')
			: resolve('/playlist/[playlistId]', { playlistId: data.list })
	);

	function goToPrevious() {
		if (hasPrevious) {
			goto(watchHref(playlist[currentIndex - 1].id, data.list));
		}
	}

	function goToNext() {
		if (hasNext) {
			goto(watchHref(playlist[currentIndex + 1].id, data.list));
		}
	}
</script>

<main class="w-full p-4 xl:p-8">
	<div
		class="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_26rem] xl:grid-rows-[auto_auto_1fr]"
	>
		<!-- Video Player Section -->
		<div class="w-full xl:col-start-1 xl:row-start-1">
			{#await data.video}
				<SkeletonPlayer />
			{:then video}
				<VideoPlayer {video} user={data.user} />
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
						<IconChevronLeft class="h-4 w-4" />
						Precedente
					</button>

					<span class="text-primary text-sm">
						{currentIndex + 1} / {playlist.length}
					</span>

					<button
						class="bg-background-tertiary text-primary hover:bg-opacity-80 flex items-center gap-2 rounded-lg px-4 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
						onclick={goToNext}
						disabled={!hasNext}
					>
						Successivo
						<IconChevronRight class="h-4 w-4" />
					</button>
				</div>
			</div>
		</div>

		<aside class="w-full xl:col-start-2 xl:row-span-3 xl:row-start-1">
			<div class="xl:sticky xl:top-20 xl:max-h-[calc(100dvh-6rem)] xl:overflow-y-auto xl:pr-1">
				{#if items.isError}
					<p class="text-primary bg-background-secondary rounded-xl p-4">
						Errore nel caricamento della playlist: {items.error.message}
					</p>
				{:else if !isLoaded}
					<div class="text-secondary bg-background-secondary rounded-xl p-4">
						Caricamento playlist…
					</div>
				{:else if missing}
					<div class="text-primary bg-background-secondary rounded-xl p-4">
						<p>Questo video non è tra quelli caricati di «{data.listTitle}».</p>
						<a href={backHref} class="mt-2 inline-block text-blue-500 hover:underline">
							Torna alla playlist
						</a>
					</div>
				{:else}
					<PlaylistQueue
						videos={playlist}
						{currentVideoId}
						list={data.list}
						title={data.listTitle}
					/>
				{/if}
			</div>
		</aside>

		<!-- Comments Section -->
		<div class="w-full xl:col-start-1 xl:row-start-3 xl:min-h-0">
			<CommentsCard videoId={data.videoId} firstPage={data.commentsFirstPage} user={data.user} />
		</div>
	</div>
</main>
