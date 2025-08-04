<script lang="ts">
	import type { Channel } from '$lib/types/channel';
	import { userStore } from '$lib/stores/userStore';

	let { channel, subscriptions = [] } = $props<{
		channel: Channel;
		subscriptions: any[];
	}>();

	let isSubscribed = $state(false);
	let subscriptionId = $state<string | undefined>(undefined);

	$effect(() => {
		const subscription = subscriptions.find((sub: Channel) => sub.id === channel.id);
		if (subscription) {
			isSubscribed = true;
			subscriptionId = subscription.subscriptionId;
		} else {
			isSubscribed = false;
			subscriptionId = undefined;
		}
	});

	async function handleSubscription() {
		if (isSubscribed) {
			// Unsubscribe
			if (subscriptionId) {
				const response = await fetch('/api/user/unsubscribe', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ subscriptionId })
				});
				if (response.ok) {
					isSubscribed = false;
					subscriptionId = undefined;
				}
			}
		} else {
			// Subscribe
			const response = await fetch('/api/user/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ channelId: channel.id })
			});
			if (response.ok) {
				const data = await response.json();
				isSubscribed = true;
				subscriptionId = data.subscriptionId;
			}
		}
	}
</script>

<div class="channel-header">
	{#if channel.brandingSettings?.image?.bannerExternalUrl}
		<img
			src={channel.brandingSettings.image.bannerExternalUrl}
			alt="channel banner"
			class="h-48 w-full object-cover"
		/>
	{/if}
	<div class="flex items-center p-4">
		<img src={channel.thumbnails.default.url} alt="channel avatar" class="h-20 w-20 rounded-full" />
		<div class="ml-4">
			<h1 class="text-2xl font-bold">{channel.title}</h1>
			<p class="text-gray-500">
				{channel.statistics.subscriberCount} subscribers
			</p>
		</div>
		<div class="ml-auto">
			{#if $userStore}
				<button
					class="rounded-full px-4 py-2 font-bold text-white {isSubscribed
						? 'bg-gray-400'
						: 'bg-red-600'}"
					onclick={handleSubscription}
				>
					{isSubscribed ? 'Subscribed' : 'Subscribe'}
				</button>
			{/if}
		</div>
	</div>
</div>
