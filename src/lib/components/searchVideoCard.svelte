<script lang="ts">
	let { video } = $props();
	import { formatTimeAgo } from '$lib/scripts/scripts';
	import { formatSubscriberCount } from '$lib/scripts/scripts';
</script>

<a href="/video/{video.videoId}" class="block">
	<article
		class="flex cursor-pointer flex-col gap-4 rounded-lg bg-gray-100 p-2 hover:bg-gray-200 sm:flex-row"
	>
		<div class="aspect-video w-full flex-shrink-0 sm:w-56">
			<img
				loading="lazy"
				class="w-full rounded-md object-cover"
				src={video.thumbnail}
				alt="Thumbnail per {video.title}"
			/>
		</div>

		<div class="flex min-w-0 flex-1 flex-col">
			<h3 class="line-clamp-1 text-lg font-bold">{video.title}</h3>

			<div class="mt-1 text-sm text-gray-600">
				<p>{video.channelTitle}</p>
				<p>
					<span>{formatSubscriberCount(video.viewCount)} visualizzazioni</span>
					<span class="mx-1">•</span>
					<span>{formatTimeAgo(video.publishedAt)}</span>
				</p>
			</div>

			<p class="mt-2 hidden text-sm text-gray-500 md:line-clamp-2">
				{video.description}
			</p>
		</div>
	</article>
</a>
