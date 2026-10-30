<script lang="ts">
	import { formatSubscriberCount, formatTimeAgo } from '#lib/scripts/scripts.js';
	let { data } = $props();
	const src = $derived(`https://www.youtube.com/${data.channel.customUrl}`);
</script>

<div class="p-4">
	<h1 class="text-primary text-xl font-bold">Info</h1>
	<p class="text-secondary">{data.channel.description}</p>
	<div class="text-primary mt-4">
		<h2 class="text-lg font-semibold">Channel Details</h2>
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- URL esterno del canale, non una rotta dell'app -->
		<a href={src} target="_blank" rel="noopener noreferrer">
			<p class="font-bold hover:text-blue-400">{src}</p>
		</a>
		<p><strong>Data iscrizione:</strong> {formatTimeAgo(data.channel.publishedAt)}</p>
		<p><strong>Title:</strong> {data.channel.title}</p>
		<p>
			<strong>Subscribers:</strong>
			{formatSubscriberCount(data.channel.statistics.subscriberCount)}
		</p>
		<p><strong>Total Views:</strong> {formatSubscriberCount(data.channel.statistics.viewCount)}</p>
		<p><strong>Videos:</strong> {data.channel.statistics.videoCount}</p>
	</div>
</div>
