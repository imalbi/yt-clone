<script>
	let { video } = $props();
</script>

<article
	class="group bg-background hover:bg-background-secondary flex cursor-pointer flex-row items-start rounded-xl border border-gray-200 p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:border-gray-700"
>
	<div class="relative flex-shrink-0 overflow-hidden rounded-lg">
		<a href={`/playlist/watch/${video.id}`} class="block">
			<img
				src={video.thumbnails.default}
				alt={video.title}
				class="h-24 w-40 object-cover transition-transform duration-300 group-hover:scale-105"
			/>
			<div
				class="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10"
			></div>
		</a>
	</div>

	<div class="ml-5 flex min-w-0 flex-1 flex-col justify-between">
		<div class="space-y-2">
			<a href={`/playlist/watch/${video.id}`} class="block">
				<h2
					class="group-hover:text-primary line-clamp-2 text-base leading-tight font-semibold text-gray-900 transition-colors duration-200 dark:text-white"
				>
					{video.title}
				</h2>
			</a>

			<a
				href={`/channel/${video.channelId}`}
				class="text-secondary hover:text-primary inline-block text-sm font-medium transition-all duration-200 hover:font-semibold"
			>
				{video.channelTitle}
			</a>
		</div>
	</div>
</article>
