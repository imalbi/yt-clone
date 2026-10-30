<script lang="ts">
	import { resolve } from '$app/paths';
	import { formatTimeAgo, formatSubscriberCount } from '#lib/scripts/scripts.js';
	import DurationBadge from './DurationBadge.svelte';
	import type { Video } from '#lib/types/video.js';

	let { video }: { video: Video } = $props();
</script>

<article class="group flex flex-col gap-3 rounded-2xl p-2 transition-colors">
	<a
		href={resolve('/video/[videoId]', { videoId: video.id })}
		class="bg-background-secondary relative block aspect-video w-full overflow-hidden rounded-2xl"
	>
		<img
			class="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
			src={video.thumbnails.maxres ??
				video.thumbnails.high ??
				video.thumbnails.medium ??
				video.thumbnails.standard ??
				video.thumbnails.default}
			loading="lazy"
			alt="Thumbnail per {video.title}"
		/>
		<DurationBadge seconds={video.durationSeconds} />
	</a>

	<div class="flex flex-row gap-3">
		<a
			href={resolve('/channel/[channelId]', { channelId: video.channelId })}
			class="flex-shrink-0"
			aria-label="Canale {video.channelTitle}"
		>
			<img
				class="size-9 rounded-full object-cover"
				src={video.avatarUrl}
				referrerpolicy="no-referrer"
				alt="Avatar del canale"
				loading="lazy"
			/>
		</a>
		<div class="flex min-w-0 flex-1 flex-col">
			<a href={resolve('/video/[videoId]', { videoId: video.id })} class="block">
				<h2
					class="text-primary line-clamp-2 text-sm leading-snug font-semibold [overflow-wrap:anywhere]"
					title={video.title}
				>
					{video.title}
				</h2>
			</a>
			<a
				href={resolve('/channel/[channelId]', { channelId: video.channelId })}
				class="text-secondary hover:text-primary mt-1 truncate text-xs transition-colors"
			>
				{video.channelTitle}
			</a>
			<p class="text-secondary mt-0.5 text-xs">
				{formatSubscriberCount(video.statistics.viewCount)} visualizzazioni • {formatTimeAgo(
					video.publishedAt
				)}
			</p>
		</div>
	</div>
</article>
