<script>
	let { video } = $props();
</script>

<article
	class="bg-background hover:bg-background-secondary flex flex-row items-start rounded-lg border p-4 transition-colors"
>
	<div>
		<img src={video.thumbnail} alt={video.title} />
	</div>
	<div class="ml-4 flex-col">
		<h2>{video.title}</h2>

		<a
			href={`/channel/${video.channelId}`}
			class="text-secondary hover:text-primary text-sm hover:font-bold"
		>
			<p>Channel: {video.channelId}</p>
		</a>
	</div>
</article>
