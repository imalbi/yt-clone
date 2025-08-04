<script lang="ts">
	import { formatSubscriberCount } from '$lib/scripts/scripts';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Crea una copia reattiva dei dati
	let subscriptions = $state(data.subscriptions || []);

	function getThumbnailUrl(thumbnails: any) {
		let url = '';
		if (thumbnails?.medium?.url) url = thumbnails.medium.url;
		else if (thumbnails?.default?.url) url = thumbnails.default.url;
		else if (thumbnails?.high?.url) url = thumbnails.high.url;
		else return 'https://via.placeholder.com/88x88?text=No+Image';

		// Forza il reload rimuovendo parametri che potrebbero causare problemi
		return url.replace(/=s\d+-c-k-c0x00ffffff-no-rj/, '=s240-c-k-c0x00ffffff-no-rj');
	}

	async function unsubscribe(subscriptionId: string | undefined) {
		if (!subscriptionId) return;
		const response = await fetch('/api/user/unsubscribe', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ subscriptionId })
		});

		if (response.ok) {
			// Aggiorna la lista reattiva
			subscriptions = subscriptions.filter((sub) => sub.subscriptionId !== subscriptionId);
		} else {
			alert('Failed to unsubscribe. Please try again.');
		}
	}
</script>

<main class="text-primary bg-background p-4 px-6 xl:m-auto xl:w-[55%]">
	<h1 class=" mb-2 text-4xl font-bold">Tutte le iscrizioni</h1>
	{#if subscriptions && subscriptions.length > 0}
		<ul role="list">
			{#each subscriptions as channel (channel.id)}
				<li class="flex flex-row justify-between gap-2 p-4">
					<a
						href={`/channel/${channel.id}`}
						target="_blank"
						rel="noopener noreferrer"
						class="flex flex-row gap-2"
					>
						<div class="flex flex-row gap-2">
							<img
								class="size-30 rounded-full object-cover"
								src={getThumbnailUrl(channel.thumbnails)}
								alt="{channel.title} Avatar"
							/>
							<div>
								<h2 class="hover:font-bold">{channel.title}</h2>

								<p class="text-secondary hover:text-primary font-light">
									{channel.customUrl} -
									{formatSubscriberCount(channel.statistics.subscriberCount)}
									di iscritti
								</p>
								<p class="text-secondary max-w-2xl font-light">
									{channel.description}
								</p>
							</div>
						</div>
					</a>
					<div class=" hidden items-center justify-center md:flex">
						<button
							onclick={() => unsubscribe(channel.subscriptionId)}
							class="bg-background-secondary ml-2 h-fit cursor-pointer rounded-3xl px-4 py-2 align-middle font-semibold text-white"
							>Disiscriviti</button
						>
					</div>
				</li>
			{/each}
		</ul>
	{:else}
		<p>Non sei iscritto a nessun canale.</p>
	{/if}
</main>
