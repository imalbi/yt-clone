<script lang="ts">
	import { resolve } from '$app/paths';
	import { formatSubscriberCount } from '#lib/scripts/scripts.js';
	import { avatarUrl } from '#lib/avatar.js';
	import { unsubscribe as unsubscribeChannel } from '#lib/youtube.remote.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Lo stato locale sono gli id tolti, non una copia della lista: cosi' `data`
	// resta letto dentro un $derived e la pagina segue il `load` anche quando
	// ci si torna navigando, invece di restare ferma al primo caricamento.
	let removed = $state<string[]>([]);

	const subscriptions = $derived(
		(data.subscriptions ?? []).filter((sub) => !removed.includes(sub.subscriptionId ?? ''))
	);

	// La riga sparisce subito e torna al suo posto se la chiamata fallisce,
	// invece di lasciare un alert e la lista invariata. Qui l'ottimismo resta a
	// mano: `withOverride` aggiorna una remote query, e questa lista arriva dal
	// `load`, non da una query.
	async function unsubscribe(channelId: string, subscriptionId: string | undefined) {
		if (!subscriptionId) return;

		removed = [...removed, subscriptionId];
		try {
			await unsubscribeChannel({ channelId, subscriptionId });
		} catch {
			removed = removed.filter((id) => id !== subscriptionId);
		}
	}
</script>

<main class="text-primary bg-background p-4 px-6 xl:m-auto xl:w-[55%]">
	<h1 class=" mb-2 text-4xl font-bold">Tutte le iscrizioni</h1>
	{#if subscriptions.length > 0}
		<ul role="list">
			{#each subscriptions as channel (channel.id)}
				<li class="flex flex-row justify-between gap-2 p-4">
					<a
						href={resolve('/channel/[channelId]', { channelId: channel.id })}
						target="_blank"
						rel="noopener noreferrer"
						class="flex flex-row gap-2"
					>
						<div class="flex flex-row gap-2">
							<img
								class="size-30 rounded-full object-cover"
								src={avatarUrl(channel.thumbnails, channel.title)}
								referrerpolicy="no-referrer"
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
							onclick={() => unsubscribe(channel.id, channel.subscriptionId)}
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
