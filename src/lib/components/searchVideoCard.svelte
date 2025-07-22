<script lang="ts">
	import type { Video } from '$lib/api/mock';
	let { video }: { video: Video } = $props();
	import { formatTimeAgo } from '$lib/scripts/scripts';
	import { formatSubscriberCount } from '$lib/scripts/scripts';
</script>

<a href="/video/{video.id}" class="block">
	<article
		class=" text-primary bg-background-primary flex cursor-pointer flex-col gap-4 rounded-lg p-2 sm:flex-row"
	>
		<div class="aspect-video w-full flex-shrink-0 sm:w-56">
			<img
				loading="lazy"
				class="w-full rounded-md object-cover"
				src={video.thumbnails.maxres ??
					video.thumbnails.high ??
					video.thumbnails.medium ??
					video.thumbnails.default ??
					video.thumbnails.standard}
				alt="Thumbnail per {video.title}"
			/>
		</div>

		<div class="flex min-w-0 flex-1 flex-col">
			<h3 class="line-clamp-1 text-lg font-bold">{video.title}</h3>

			<div class="text-secondary mt-1 text-sm">
				<p>{video.channelTitle}</p>
				<p>
					<span>{formatSubscriberCount(video.statistics.viewCount)} visualizzazioni</span>
					<span class="mx-1">•</span>
					<span>{formatTimeAgo(video.publishedAt)}</span>
				</p>
			</div>

			<p class="text-secondary mt-2 hidden text-sm md:line-clamp-2">
				{video.desc}
			</p>
		</div>
	</article>
</a>
