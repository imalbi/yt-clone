<script lang="ts">
	import { formatTimeAgo } from '$lib/scripts/scripts';
	let { video } = $props();
</script>

<a href="/video/{video.id}">
	<article class="cursor-pointer rounded-2xl bg-gray-100 p-2 hover:bg-gray-200 xl:flex">
		<div class="xl:w-48 xl:flex-shrink-0">
			<div class="aspect-video w-full">
				<img
					loading="lazy"
					class="h-full w-full rounded-xl object-cover"
					src={video.snippet.thumbnails.highres?.url || video.snippet.thumbnails.medium.url}
					alt="Thumbnail per {video.snippet.title}"
				/>
			</div>
		</div>

		<div class="flex min-w-0 flex-1 flex-col justify-center p-2">
			<h1 class="mt-2 line-clamp-2 text-base leading-tight font-semibold">
				{video.snippet.title}
			</h1>
			<p class="mt-2 truncate text-sm text-gray-600">
				{video.snippet.channelTitle}
			</p>
			<p class="mt-1 truncate text-sm text-gray-600">
				{video.statistics.viewCount} visualizzazioni • {formatTimeAgo(video.snippet.publishedAt)}
			</p>
		</div>
	</article>
</a>
