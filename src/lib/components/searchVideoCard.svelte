<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Video } from '#lib/types/video.js';
	import { formatTimeAgo, formatSubscriberCount } from '#lib/scripts/scripts.js';
	import DurationBadge from './DurationBadge.svelte';

	let { video }: { video: Video } = $props();
</script>

<article
	class="text-primary hover:bg-background-secondary group flex cursor-pointer flex-col gap-4 rounded-2xl p-2.5 transition-colors sm:flex-row"
>
	<a
		href={resolve('/video/[videoId]', { videoId: video.id })}
		class="bg-background-secondary relative block aspect-video w-full flex-shrink-0 overflow-hidden rounded-xl sm:w-64"
	>
		<img
			loading="lazy"
			class="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
			src={video.thumbnails.maxres ??
				video.thumbnails.high ??
				video.thumbnails.medium ??
				video.thumbnails.standard ??
				video.thumbnails.default}
			alt="Thumbnail per {video.title}"
		/>
		<DurationBadge seconds={video.durationSeconds} />
	</a>

	<div class="flex min-w-0 flex-1 flex-col py-1">
		<a href={resolve('/video/[videoId]', { videoId: video.id })} class="block">
			<h2
				class="text-primary line-clamp-2 text-base leading-snug font-semibold [overflow-wrap:anywhere]"
			>
				{video.title}
			</h2>
		</a>

		<div class="text-secondary mt-2 text-xs">
			<a
				href={resolve('/channel/[channelId]', { channelId: video.channelId })}
				class="hover:text-primary inline-block font-medium transition-colors"
			>
				{video.channelTitle}
			</a>
			<p class="mt-0.5">
				<span>{formatSubscriberCount(video.statistics.viewCount)} visualizzazioni</span>
				<span class="mx-1">•</span>
				<span>{formatTimeAgo(video.publishedAt)}</span>
			</p>
		</div>

		{#if video.desc}
			<p class="text-secondary mt-2 hidden text-xs [overflow-wrap:anywhere] md:line-clamp-2">
				{video.desc}
			</p>
		{/if}
	</div>
</article>
