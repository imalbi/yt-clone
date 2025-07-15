<script lang="ts">
	let { video } = $props();
	import { formatSubscriberCount, formatTimeAgo } from '$lib/scripts/scripts';
	formatSubscriberCount;
</script>

<a href="/video/{video.id}" class="mt-1 mb-2">
	<article class="cursor-pointer rounded-2xl p-2 hover:bg-gray-200">
		<div>
			<img
				class="w-full rounded-2xl"
				src={video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.medium?.url}
				loading="lazy"
				alt="Thumbnail"
			/>
		</div>
		<div class="flex flex-row gap-2">
			<aside class=" flex-shrink-0">
				<img
					class="mt-2 size-12 rounded-full object-cover"
					src={video.channelAvatarUrl}
					alt="Avatar"
				/>
			</aside>
			<div class="flex flex-col">
				<h1 class="line-clamp-2 text-2xl font-semibold">{video.snippet.title}</h1>
				<p class=" text-gray-600">{video.snippet.channelTitle}</p>
				<p class="tracking-tight text-gray-600">
					{formatSubscriberCount(video.statistics.viewCount)} visualizzazioni • {formatTimeAgo(
						video.snippet.publishedAt
					)}
				</p>
			</div>
		</div>
	</article>
</a>
