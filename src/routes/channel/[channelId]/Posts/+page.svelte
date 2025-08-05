<script lang="ts">
	import PostCard from '$lib/components/PostCard.svelte';
	import type { Channel } from '$lib/types/channel';
	let { data } = $props();
	const posts = data.posts;
</script>

<div class="p-4">
	<h2 class="mb-4 text-xl font-bold">Posts</h2>
	<div class="flex flex-col gap-4">
		{#if posts.length === 0}
			<p>No posts available.</p>
		{:else}
			{#each posts as post (post.id)}
				<PostCard {post} channel={data.channel} />
			{/each}
		{/if}
	</div>
</div>
