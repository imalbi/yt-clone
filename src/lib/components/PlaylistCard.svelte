<script>
	let { video } = $props();
</script>

<article
	class="bg-background hover:bg-background-secondary flex cursor-pointer flex-row items-start rounded-lg border p-4 transition-colors"
>
	<div>
		<a href={`/playlist/watch/${video.id}`}>
			<img src={video.thumbnail} alt={video.title} />
		</a>
	</div>
	<div class="ml-4 flex-col">
		<a href={`/playlist/watch/${video.id}`} class="block">
			<h2 class="hover:text-primary">{video.title}</h2>
		</a>

		<a
			href={`/channel/${video.channelId}`}
			class="text-secondary hover:text-primary text-sm hover:font-bold"
		>
			<p>{video.channelTitle}</p>
		</a>
	</div>
</article>
