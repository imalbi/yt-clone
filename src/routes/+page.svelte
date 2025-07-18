<script lang="ts">
	import VideoCard from '$lib/components/videoCard.svelte';
	let { data } = $props();
</script>

<main class="bg-background w-full md:p-4">
	{#if data.error}
		<p><strong class="text-primary">Ops! Qualcosa è andato storto</strong></p>
	{:else}
		{#await data.videos}
			<!--TODO: Add a loading spinner or skeleton UI-->
			<p class="text-primary">Loading . . .</p>
		{:then videos}
			<div class="mt-3 grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each videos as video (video.id)}
					<VideoCard {video} />
				{/each}
			</div>
		{:catch error}
			<!-- TODO: Add error handling UI -->
			<p><strong class="text-primary">Errore nel caricamento dei video</strong></p>
		{/await}
	{/if}
</main>
