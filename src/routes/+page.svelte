<script lang="ts">
	import VideoCard from '$lib/components/videoCard.svelte';
	let { data } = $props();
</script>

<main class="bg-var(--color-bg) w-full md:p-4">
	{#if data.error}
		<p><strong>Ops! Qualcosa è andato storto</strong></p>
	{:else if data.videos}
		<div class="mt-3 grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each data.videos as video (video.id)}
				<VideoCard {video} />
			{/each}
		</div>
	{:else}
		<p>Loading . . .</p>
	{/if}
</main>
