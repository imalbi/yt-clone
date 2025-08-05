<script lang="ts">
	import ChannelHeader from '$lib/components/ChannelHeader.svelte';
	import { page } from '$app/state';
	let { data, children } = $props();
	let aClass = 'text-primary hover:border-secondary px-4 py-2 hover:border-b-2';
	$inspect(page);
</script>

<main class="w-full xl:m-auto xl:w-[80%]">
	{#if data.channel}
		<ChannelHeader channel={data.channel} />

		<nav class="flex gap-2 pb-2">
			<a
				href={`/channel/${page.params.channelId}`}
				class={aClass}
				class:active={page.url.pathname === `/channel/${page.params.channelId}`}
			>
				Videos
			</a>
			<a
				href={`/channel/${page.params.channelId}/Posts`}
				class={aClass}
				class:active={page.url.pathname === `/channel/${page.params.channelId}/Posts`}
			>
				Posts
			</a>
			<a
				href={`/channel/${page.params.channelId}/info`}
				class={aClass}
				class:active={page.url.pathname === `/channel/${page.params.channelId}/info`}
			>
				Info
			</a>
		</nav>

		{@render children()}
	{:else}
		<div class="h-60 w-full animate-pulse bg-gray-200"></div>
	{/if}
</main>

<style>
	.active {
		border-bottom: 2px solid var(--text-primary);
		font-weight: bold;
	}
</style>
