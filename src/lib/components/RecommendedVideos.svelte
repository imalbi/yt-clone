<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Video } from '#lib/types/video.js';
	import { formatTimeAgo, formatSubscriberCount } from '#lib/scripts/scripts.js';
	import DurationBadge from './DurationBadge.svelte';

	let { video }: { video: Video } = $props();
</script>

<a href={resolve('/video/[videoId]', { videoId: video.id })} class="group block">
	<article
		class="text-primary hover:bg-background-secondary flex cursor-pointer flex-col gap-3 rounded-2xl p-2 transition-colors xl:flex-row"
	>
		<div class="xl:w-44 xl:flex-shrink-0">
			<div class="bg-background-secondary relative aspect-video w-full overflow-hidden rounded-xl">
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
			</div>
		</div>

		<div class="flex min-w-0 flex-1 flex-col justify-center py-0.5">
			<h2
				class="text-primary line-clamp-2 text-sm leading-snug font-semibold [overflow-wrap:anywhere]"
				title={video.title}
			>
				{video.title}
			</h2>
			<p class="text-secondary mt-1 truncate text-xs">
				{video.channelTitle}
			</p>
			<p class="text-secondary mt-0.5 truncate text-xs">
				{formatSubscriberCount(video.statistics.viewCount)} visualizzazioni • {formatTimeAgo(
					video.publishedAt
				)}
			</p>
		</div>
	</article>
</a>
