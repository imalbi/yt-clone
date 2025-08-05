<script lang="ts">
	import VideoCard from '$lib/components/videoCard.svelte';
	import SkeletonRecommended from '$lib/components/SkeletonRecommended.svelte';

	let { data } = $props();
</script>

<div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
	{#await data.videos}
		{#each Array(12) as _}
			<SkeletonRecommended />
		{/each}
	{:then videos}
		{#each videos as video (video.id)}
			<VideoCard {video} />
		{/each}
	{:catch error}
		<p>
			<strong class="text-primary"
				>Errore nel caricamento dei video: {error?.message || error}</strong
			>
		</p>
	{/await}
</div>
