<script lang="ts">
	import { formatSubscriberCount } from '$lib/scripts/scripts';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<main class="text-primary bg-background p-4 px-6 xl:m-auto xl:w-[55%]">
	<h1 class=" mb-2 text-4xl font-bold">Tutte le iscrizioni</h1>
	{#if data.subscriptions}
		<ul role="list">
			{#each data.subscriptions as channel (channel.id)}
				<li class="flex flex-row justify-between gap-2 p-4">
					<a
						href={`https://www.youtube.com/channel/${channel.id}`}
						target="_blank"
						rel="noopener noreferrer"
						class="flex flex-row gap-2"
					>
						<div class="flex flex-row gap-2">
							<img
								loading="lazy"
								class="size-30 rounded-full object-cover"
								src={channel.thumbnails.high.url}
								alt="User Avatar"
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
							class="bg-background-secondary ml-2 h-fit cursor-pointer rounded-3xl px-4 py-2 align-middle font-semibold text-white"
							>Iscritto</button
						>
					</div>
				</li>
			{/each}
		</ul>
	{:else}
		<p>Non sei iscritto a nessun canale.</p>
	{/if}
</main>
