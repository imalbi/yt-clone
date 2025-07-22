<script lang="ts">
	import SearchVideoCard from '$lib/components/searchVideoCard.svelte';
	let { data } = $props();
	import { page } from '$app/state';
</script>

<main class="mx-auto mt-3 flex w-full max-w-5xl flex-col gap-5 p-2 px-4">
	{#await data.searchResults}
		<p>Loading...</p>
	{:then videos}
		{#if videos.length > 0}
			{#each videos as video (video.id)}
				<SearchVideoCard {video}></SearchVideoCard>
			{/each}
		{:else}
			<p>Nessun risultato per {page.params.searchId}</p>
		{/if}
	{:catch error}
		<p>Error: {error.message}</p>
	{/await}
</main>
