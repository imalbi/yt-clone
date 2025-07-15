<script lang="ts">
	import SearchVideoCard from '$lib/components/SearchVideoCard.svelte';

	let { data } = $props();
	import { page } from '$app/state';
</script>

<main class="mx-auto mt-3 flex w-full max-w-5xl flex-col gap-5 p-2 px-4">
	{#if data.searchResults}
		{#each data.searchResults as video (video.videoId)}
			<SearchVideoCard {video}></SearchVideoCard>
		{/each}
	{:else}
		<p>Nessun risultato per {page.params.searchId}</p>
	{/if}
</main>
