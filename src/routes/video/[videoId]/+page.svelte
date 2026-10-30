<script lang="ts">
	import { createInfiniteQuery } from '@tanstack/svelte-query';
	import VideoPlayer from '#lib/components/videoPlayer.svelte';
	import CommentsCard from '#lib/components/CommentsCard.svelte';
	import RecommendedVideos from '#lib/components/RecommendedVideos.svelte';
	import SkeletonRecommended from '#lib/components/SkeletonRecommended.svelte';
	import { fly } from 'svelte/transition';
	import { inview } from 'svelte-inview';
	import { relatedVideosOptions } from '#lib/queries.js';

	let { data } = $props();

	// La chiave include il videoId: cambiando video la lista riparte da sola,
	// senza il reset manuale dello stato che serviva prima.
	const related = createInfiniteQuery(() =>
		relatedVideosOptions(data.videoId, data.relatedFirstPage)
	);

	const videos = $derived(related.data?.pages.flatMap((p) => p.videos) ?? []);
</script>

<main class="w-full p-4 xl:p-8">
	<div class="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_440px] xl:grid-rows-[auto_1fr]">
		<div class="w-full xl:col-start-1 xl:row-start-1">
			<VideoPlayer video={data.video} user={data.user} />
		</div>

		<div
			class="w-full gap-4 sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:col-start-2 xl:row-span-2 xl:row-start-1 xl:flex xl:w-110 xl:flex-col"
		>
			{#if related.isError}
				<p>
					<strong class="text-primary">
						Errore nel caricamento dei video: {related.error.message}
					</strong>
				</p>
			{:else if related.isPending}
				{#each Array(9), i (i)}
					<SkeletonRecommended />
				{/each}
			{:else}
				{#each videos as video (video.id)}
					<div in:fly|local={{ x: 50, duration: 200 }}>
						<RecommendedVideos {video}></RecommendedVideos>
					</div>
				{/each}
				{#if related.hasNextPage}
					<!-- Infinite scroll per schermi grandi -->
					<div
						class="hidden xl:block"
						use:inview={{ threshold: 0.1 }}
						oninview_enter={() => related.fetchNextPage()}
					>
						<SkeletonRecommended />
					</div>
				{/if}
			{/if}
		</div>
		<div class="xl:hidden">
			<button
				class="bg-background-secondary hover:bg-background-tertiary/90 text-primary w-full cursor-pointer rounded-lg px-4 py-3 font-bold transition-colors"
				onclick={() => related.fetchNextPage()}
			>
				Carica altri video
			</button>
		</div>

		<div class="w-full xl:col-start-1 xl:row-start-2 xl:min-h-0">
			<CommentsCard videoId={data.videoId} firstPage={data.commentsFirstPage} user={data.user} />
		</div>
	</div>
</main>
