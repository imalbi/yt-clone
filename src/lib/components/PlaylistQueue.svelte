<script lang="ts">
	import type { Video } from '#lib/types/video.js';
	import IconPlay from '~icons/mdi/play';
	import DurationBadge from './DurationBadge.svelte';
	import { watchHref } from '#lib/utils/watchHref.js';

	let {
		videos,
		currentVideoId,
		list,
		title = 'Video piaciuti'
	}: { videos: Video[]; currentVideoId: string; list?: string; title?: string } = $props();

	function thumbnail(video: Video) {
		return (
			video.thumbnails.maxres ??
			video.thumbnails.high ??
			video.thumbnails.medium ??
			video.thumbnails.standard ??
			video.thumbnails.default
		);
	}
</script>

<section aria-labelledby="playlist-queue-title" class="min-w-0">
	<div class="mb-3 flex items-end justify-between gap-4 px-1">
		<div>
			<p class="text-secondary text-xs font-medium tracking-wide">PLAYLIST</p>
			<h2 id="playlist-queue-title" class="text-primary text-lg font-semibold">{title}</h2>
		</div>
		<span class="text-secondary text-sm tabular-nums">{videos.length} video</span>
	</div>

	<ol class="flex flex-col gap-1.5">
		{#each videos as video, index (video.id)}
			{@const current = video.id === currentVideoId}
			<li>
				<a
					href={watchHref(video.id, list)}
					aria-current={current ? 'page' : undefined}
					class="group grid min-w-0 grid-cols-[1.5rem_7rem_minmax(0,1fr)] items-center gap-2 rounded-xl border-l-2 py-2 pr-2 transition-colors {current
						? 'border-primary bg-background-tertiary'
						: 'hover:bg-background-secondary border-transparent'}"
				>
					<span class="text-secondary text-center text-xs tabular-nums">{index + 1}</span>
					<span class="bg-background-secondary relative aspect-video overflow-hidden rounded-lg">
						{#if thumbnail(video)}
							<img
								loading="lazy"
								src={thumbnail(video)}
								alt="Miniatura di {video.title}"
								class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
							/>
						{:else}
							<span class="text-secondary flex h-full items-center justify-center text-xs">
								Nessuna miniatura
							</span>
						{/if}
						<DurationBadge seconds={video.durationSeconds} />
					</span>
					<span class="min-w-0">
						<span class="text-primary line-clamp-2 text-sm leading-snug font-medium">
							{video.title}
						</span>
						<span class="text-secondary mt-1 block truncate text-xs">{video.channelTitle}</span>
						{#if current}
							<span class="text-primary mt-1 flex items-center gap-1 text-xs font-medium">
								<IconPlay class="h-3.5 w-3.5" aria-hidden="true" />
								In riproduzione
							</span>
						{/if}
					</span>
				</a>
			</li>
		{/each}
	</ol>
</section>
