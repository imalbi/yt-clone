<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Channel } from '#lib/types/channel.js';
	import type { User } from '#lib/types/user.js';
	import { formatSubscriberCount } from '#lib/scripts/scripts.js';
	import { avatarUrl } from '#lib/avatar.js';
	import { subscriptionState } from '#lib/subscription.svelte.js';

	let { channel, user }: { channel: Channel; user: User } = $props();

	const subscription = subscriptionState(
		() => channel.id,
		() => !!user
	);
</script>

<div>
	{#if channel.brandingSettings?.image?.bannerExternalUrl}
		<img
			src={channel.brandingSettings.image.bannerExternalUrl}
			referrerpolicy="no-referrer"
			alt="channel banner"
			class="h-48 w-full object-cover"
		/>
	{/if}
	<div class="flex items-center p-4">
		<img
			src={avatarUrl(channel.thumbnails, channel.title)}
			referrerpolicy="no-referrer"
			alt="channel avatar"
			class="h-20 w-20 rounded-full"
		/>
		<div class="ml-4">
			<h1 class="text-primary text-2xl font-bold">{channel.title}</h1>
			<p class="text-secondary">
				{formatSubscriberCount(channel.statistics.subscriberCount)} subscribers
			</p>
			<div class="">
				{#if user}
					<button
						class="text-background mt-2 h-fit cursor-pointer rounded-3xl px-4 py-2 align-middle font-semibold {subscription.isSubscribed
							? 'bg-background-secondary text-primary'
							: 'bg-primary'}"
						onclick={subscription.toggle}
						disabled={subscription.isPending}
					>
						{subscription.isSubscribed ? 'Iscritto' : 'Iscriviti'}
					</button>
				{:else}
					<a
						href={resolve('api/auth/login')}
						class="bg-background-secondary inline-block rounded-full px-4 py-2 font-bold text-white"
					>
						Iscriviti
					</a>
				{/if}
			</div>
		</div>
	</div>
</div>
