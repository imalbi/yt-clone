<script lang="ts">
	import type { Channel } from '$lib/types/channel';
	import { userStore } from '$lib/stores/userStore';

	let { channel } = $props<{
		channel: Channel;
	}>();

	let isSubscribed = $state(false);
	let subscriptionId = $state<string | undefined>(undefined);
	let isLoading = $state(false);

	// Controlla se l'utente è iscritto a questo canale
	async function checkSubscription() {
		if (!$userStore) {
			isSubscribed = false;
			subscriptionId = undefined;
			return;
		}

		try {
			const response = await fetch(`/api/user/subscription-status?channelId=${channel.id}`);
			if (response.ok) {
				const data = await response.json();
				isSubscribed = data.isSubscribed;
				subscriptionId = data.subscriptionId;
				console.log('Subscription status:', {
					channelId: channel.id,
					isSubscribed,
					subscriptionId
				});
			} else {
				console.error('Failed to check subscription status:', response.status);
				isSubscribed = false;
				subscriptionId = undefined;
			}
		} catch (error) {
			console.error('Error checking subscription status:', error);
			isSubscribed = false;
			subscriptionId = undefined;
		}
	} // Controlla lo stato dell'iscrizione quando il componente viene montato o quando cambia il canale
	$effect(() => {
		if (channel?.id) {
			checkSubscription();
		}
	});

	async function handleSubscription() {
		if (!$userStore) return;

		isLoading = true;
		try {
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
					} else {
						console.error('Failed to unsubscribe:', await response.text());
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
				} else {
					console.error('Failed to subscribe:', await response.text());
				}
			}
		} catch (error) {
			console.error('Error toggling subscription:', error);
		} finally {
			isLoading = false;
		}
	}
</script>

<div>
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
			<h1 class="text-primary text-2xl font-bold">{channel.title}</h1>
			<p class="text-secondary">
				{channel.statistics.subscriberCount} subscribers
			</p>
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
</div>
