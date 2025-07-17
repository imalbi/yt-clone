<script lang="ts">
	import VideoPlayer from '$lib/components/videoPlayer.svelte';
	import CommentsCard from '$lib/components/CommentsCard.svelte';
	import RecommendedVideos from '$lib/components/RecommendedVideos.svelte';
	import { mockApiResponse } from '$lib/mocks/popularVideos.js';
	import { fly } from 'svelte/transition';
	import { mockPlayerResponse } from '$lib/api/mock';
	//let { data } = $props();
	// Simulating data for the sake of this example
	let data = { youtubeApi: mockPlayerResponse, comments: [], video: mockApiResponse[0] };
</script>

<div class="w-full p-4 xl:p-8">
	<div class="flex flex-col gap-8 xl:flex-row">
		<div class="w-full">
			<VideoPlayer {data} />
			<CommentsCard {data}></CommentsCard>
		</div>

		<div
			class="w-full gap-4 sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:flex xl:w-110 xl:flex-col"
		>
			{#each mockApiResponse as video, index (video.id)}
				<div in:fly|local={{ x: 50, duration: 400, delay: index * 200 }}>
					<RecommendedVideos {video}></RecommendedVideos>
				</div>
			{/each}
		</div>
	</div>
</div>
