<script lang="ts">
	import SkeletonHome from '$lib/components/SkeletonHome.svelte';
	import VideoCard from '$lib/components/videoCard.svelte';
	let { data } = $props();
</script>

<main class="bg-background w-full md:p-4">
	{#await data.videos}
		<SkeletonHome></SkeletonHome>
	{:then videos}
		<div class="mt-3 grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each videos as video (video.id)}
				<VideoCard {video} />
			{/each}
		</div>
	{:catch error}
		<p>
			<strong class="text-primary"
				>Errore nel caricamento dei video: {error?.message ?? error}</strong
			>
		</p>
	{/await}
</main>
