<script lang="ts">
	import ChannelHeader from '$lib/components/ChannelHeader.svelte';
	import { page } from '$app/state';

	let { data, children } = $props();
	const channelId = page.params.channelId;
</script>

<main class="w-full">
	{#if data.channel}
		<ChannelHeader channel={data.channel} subscriptions={data.subscriptions} />

		<nav class="flex border-b border-gray-200">
			<a
				href={`/channel/${channelId}`}
				class="px-4 py-2"
				class:active={page.url.pathname === `/channel/${channelId}`}
			>
				Videos
			</a>
			<a
				href={`/channel/${channelId}/Posts`}
				class="px-4 py-2"
				class:active={page.url.pathname === `/channel/${channelId}/Posts`}
			>
				Posts
			</a>
			<a
				href={`/channel/${channelId}/playlists`}
				class="px-4 py-2"
				class:active={page.url.pathname === `/channel/${channelId}/playlists`}
			>
				Playlists
			</a>
		</nav>

		{@render children()}
	{:else}
		<div class="h-60 w-full animate-pulse bg-gray-200"></div>
	{/if}
</main>

<style>
	.active {
		border-bottom: 2px solid blue;
		color: blue;
	}
</style>
