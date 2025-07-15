<script lang="ts">
	let { video } = $props();
	import { formatSubscriberCount, formatTimeAgo } from '$lib/scripts/scripts';
	formatSubscriberCount;
</script>

<!-- text-secondary -->
<a href="/video/{video.id}" class="text-primary mt-1 mb-2">
	<article class="hover:bg-secondary cursor-pointer rounded-2xl p-2">
		<div>
			<img
				class="w-full rounded-2xl"
				src={video.thumbnails.maxres ||
					video.thumbnails.medium ||
					video.thumbnails.standard ||
					video.thumbnails.high ||
					video.thumbnails.default}
				loading="lazy"
				alt="{video.title} Thumbnail"
			/>
		</div>
		<div class="flex flex-row gap-2">
			<aside class=" flex-shrink-0">
				<img class="mt-2 size-12 rounded-full object-cover" src={video.avatarUrl} alt="Avatar" />
			</aside>
			<div class="flex flex-col">
				<h1 class="line-clamp-2 text-2xl font-semibold">{video.title}</h1>
				<p class="text-secondary">{video.channelTitle}</p>
				<p class="text-secondary tracking-tight">
					{formatSubscriberCount(video.statistics.viewCount)} visualizzazioni • {formatTimeAgo(
						video.publishedAt
					)}
				</p>
			</div>
		</div>
	</article>
</a>
