<script lang="ts">
	import PlaylistPreviewCard from '#lib/components/PlaylistPreviewCard.svelte';
	import { resolve } from '$app/paths';

	let { data } = $props();
</script>

<main class="text-primary mx-auto w-full max-w-6xl p-4">
	<h1 class="mb-6 text-2xl font-bold">Le tue playlist</h1>

	{#await data.playlists}
		<p class="text-secondary">Caricamento delle playlist...</p>
	{:then playlists}
		{#if playlists.length === 0}
			<p class="text-secondary">
				Non hai ancora creato playlist. I video che ti piacciono sono

				<a href={resolve('playlist/liked')} class="text-blue-500 hover:underline">qui</a>

				.
			</p>
		{:else}
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each playlists as playlist (playlist.id)}
					<PlaylistPreviewCard {playlist} />
				{/each}
			</div>
		{/if}
	{:catch error}
		<p class="text-red-500">Errore nel caricamento delle playlist: {error.message}</p>
	{/await}
</main>
