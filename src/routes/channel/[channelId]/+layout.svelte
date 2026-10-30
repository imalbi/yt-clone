<script lang="ts">
	import { resolve } from '$app/paths';
	import ChannelHeader from '#lib/components/ChannelHeader.svelte';
	import { page } from '$app/state';
	let { data, children } = $props();
	const channelId = $derived(data.channelId);
	let aClass = 'text-primary hover:border-secondary px-4 py-2 hover:border-b-2';
</script>

<main class="w-full xl:m-auto xl:w-[80%]">
	{#if data.channel}
		<ChannelHeader channel={data.channel} user={data.user} />

		<nav class="flex gap-2 pb-2">
			<a
				href={resolve('/channel/[channelId]', { channelId })}
				class={aClass}
				class:active={page.url.pathname === resolve('/channel/[channelId]', { channelId })}
			>
				Videos
			</a>
			<a
				href={resolve('/channel/[channelId]/info', { channelId })}
				class={aClass}
				class:active={page.url.pathname === resolve('/channel/[channelId]/info', { channelId })}
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
