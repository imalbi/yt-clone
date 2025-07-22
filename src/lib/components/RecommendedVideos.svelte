<script lang="ts">
	import type { Video } from '$lib/api/mock';
	import { formatTimeAgo } from '$lib/scripts/scripts';
	let { video }: { video: Video } = $props();
</script>

<a href="/video/{video.id}">
	<article class="bg-background cursor-pointer rounded-2xl p-2 xl:flex">
		<div class="xl:w-48 xl:flex-shrink-0">
			<div class="aspect-video w-full">
				<img
					loading="lazy"
					class="h-full w-full rounded-xl object-cover"
					src={video.thumbnails.high || video.thumbnails.medium || video.thumbnails.default}
					alt="Thumbnail per {video.title}"
				/>
			</div>
		</div>

		<div class="flex min-w-0 flex-1 flex-col justify-center p-2">
			<h1 class="text-primary mt-2 line-clamp-2 text-base leading-tight font-semibold">
				{video.title}
			</h1>
			<p class="text-secondary mt-2 truncate text-sm">
				{video.channelTitle}
			</p>
			<p class="text-secondary mt-1 truncate text-sm">
				{video.statistics.viewCount} visualizzazioni • {formatTimeAgo(video.publishedAt)}
			</p>
		</div>
	</article>
</a>
