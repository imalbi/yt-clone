<script lang="ts">
	import VideoPlayer from '$lib/components/videoPlayer.svelte';
	import CommentsCard from '$lib/components/CommentsCard.svelte';
	import RecommendedVideos from '$lib/components/RecommendedVideos.svelte';
	import { fly } from 'svelte/transition';
	import SkeletonHome from '$lib/components/SkeletonHome.svelte';

	let { data } = $props();

	//TODO: refactor to have comment below video and related videos on the right side
</script>

<div class="w-full p-4 xl:p-8">
	<div class="flex flex-col gap-8 xl:flex-row">
		<div class="w-full">
			{#if data.video}
				<VideoPlayer video={data.video} />
				{#await data.comments}
					<p>Loading comments...</p>
				{:then comments}
					<CommentsCard {comments} video={data.video}></CommentsCard>
				{/await}
			{:else}
				<p>Error loading video</p>
			{/if}
		</div>

		<div
			class="w-full gap-4 sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:flex xl:w-110 xl:flex-col"
		>
			{#await data.relatedVideos}
				<SkeletonHome />
			{:then videos}
				{#each videos as video, index (video.id)}
					<div in:fly|local={{ x: 50, duration: 400, delay: index * 200 }}>
						<RecommendedVideos {video}></RecommendedVideos>
					</div>
				{/each}
			{:catch error}
				<p>Error loading related videos: {error.message}</p>
			{/await}
		</div>
	</div>
</div>
