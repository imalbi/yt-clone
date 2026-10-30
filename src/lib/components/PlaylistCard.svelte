<script lang="ts">
	import { resolve } from '$app/paths';
	import DurationBadge from './DurationBadge.svelte';
	import type { Video } from '#lib/types/video.js';
	import { formatSubscriberCount, formatTimeAgo } from '#lib/scripts/scripts.js';
	import { watchHref } from '#lib/utils/watchHref.js';

	// `list` e' la playlist da cui si arriva: senza, si guardano i piaciuti.
	let { video, list }: { video: Video; list?: string } = $props();
</script>

<article
	class="group text-primary bg-background hover:bg-background-secondary flex min-w-0 cursor-pointer flex-col gap-4 rounded-2xl p-2.5 transition-colors sm:flex-row"
>
	<div
		class="bg-background-secondary relative aspect-video w-full flex-shrink-0 overflow-hidden rounded-xl sm:w-64"
	>
		<a href={watchHref(video.id, list)} class="block h-full w-full">
			<img
				loading="lazy"
				src={video.thumbnails.maxres ??
					video.thumbnails.high ??
					video.thumbnails.medium ??
					video.thumbnails.standard ??
					video.thumbnails.default}
				alt="Thumbnail per {video.title}"
				class="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
			/>
		</a>
		<DurationBadge seconds={video.durationSeconds} />
	</div>

	<div class="flex min-w-0 flex-1 flex-col py-1">
		<a href={watchHref(video.id, list)} class="block min-w-0">
			<h2 class="line-clamp-2 text-lg leading-tight font-semibold [overflow-wrap:anywhere]">
				{video.title}
			</h2>
		</a>

		<a
			href={resolve('/channel/[channelId]', { channelId: video.channelId })}
			class="text-secondary hover:text-primary mt-2 block max-w-full truncate text-sm font-medium transition-colors"
			title={video.channelTitle}
		>
			{video.channelTitle}
		</a>

		<p class="text-secondary mt-1 truncate text-sm">
			{formatSubscriberCount(video.statistics.viewCount)} visualizzazioni
			<span class="mx-1">•</span>
			{formatTimeAgo(video.publishedAt)}
		</p>

		{#if video.desc}
			<p class="text-secondary mt-3 hidden text-sm [overflow-wrap:anywhere] md:line-clamp-2">
				{video.desc}
			</p>
		{/if}
	</div>
</article>
