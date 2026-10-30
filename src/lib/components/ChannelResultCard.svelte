<script lang="ts">
	import { resolve } from '$app/paths';
	import { avatarUrl } from '#lib/avatar.js';
	import { formatSubscriberCount } from '#lib/scripts/scripts.js';
	import type { Channel } from '#lib/types/channel.js';

	let { channel }: { channel: Channel } = $props();
</script>

<a href={resolve('/channel/[channelId]', { channelId: channel.id })} class="block">
	<article class="text-primary flex cursor-pointer items-center gap-4 rounded-lg p-2">
		<img
			loading="lazy"
			class="size-24 shrink-0 rounded-full object-cover sm:size-32"
			src={avatarUrl(channel.thumbnails, channel.title)}
			referrerpolicy="no-referrer"
			alt="Avatar di {channel.title}"
		/>
		<div class="flex min-w-0 flex-col">
			<h3 class="line-clamp-1 text-lg font-bold">{channel.title}</h3>
			<p class="text-secondary text-sm">
				{#if channel.customUrl}<span>{channel.customUrl}</span><span class="mx-1">•</span>{/if}
				<span>{formatSubscriberCount(channel.statistics.subscriberCount)} iscritti</span>
			</p>
			<p class="text-secondary mt-1 hidden text-sm md:line-clamp-1">{channel.description}</p>
		</div>
	</article>
</a>
