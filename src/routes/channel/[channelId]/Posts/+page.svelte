<script lang="ts">
	import { onMount } from 'svelte';

	let posts = $state<any[]>([]);
	let isLoading = $state(true);

	onMount(async () => {
		try {
			const response = await fetch('https://dummyjson.com/posts');
			const data = await response.json();
			posts = data.posts;
		} catch (error) {
			console.error('Error fetching posts:', error);
		} finally {
			isLoading = false;
		}
	});
</script>

<div class="p-4">
	<h2 class="mb-4 text-xl font-bold">Posts</h2>
	{#if isLoading}
		<p>Loading posts...</p>
	{:else}
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each posts as post (post.id)}
				<div class="rounded-lg border border-gray-200 p-4">
					<h3 class="text-lg font-bold">{post.title}</h3>
					<p class="mt-2 text-gray-600">{post.body}</p>
				</div>
			{/each}
		</div>
	{/if}
</div>
