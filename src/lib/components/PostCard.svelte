<script lang="ts">
	import type { Channel } from '$lib/types/channel';
	let { post, channel }: { post: any; channel: Channel } = $props();
</script>

<div class="text-primary rounded-lg border border-gray-200 p-4">
	<div>
		<img
			src={channel.thumbnails.default.url}
			alt={channel.title}
			class="mr-4 inline-block h-12 w-12 rounded-full"
		/>
	</div>
	<div>
		<p class="text-sm text-gray-500">Posted by {channel.title}</p>
		<h3 class="text-lg font-bold">{post.title}</h3>
		<p class="mt-2">{post.body}</p>
	</div>
</div>
