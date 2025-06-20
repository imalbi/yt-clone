<script lang="ts">
    import { page } from "$app/state";
    import VideoPlayer from "$lib/components/videoPlayer.svelte";
    import CommentsCard from "$lib/components/CommentsCard.svelte";
    import RecommendedVideos from "$lib/components/RecommendedVideos.svelte";
    import { mockApiResponse } from "$lib/mocks/popularVideos.js";
    import { fly} from "svelte/transition";
    let {data} = $props();

</script>
    <div class="w-full p-4 xl:p-8">
        <div class="flex flex-col xl:flex-row gap-8">
    
            <div class="w-full">
                <VideoPlayer {data}/>
                <CommentsCard {data}></CommentsCard>
                
                </div>
            
            <div class="w-full xl:w-110 xl:flex xl:flex-col sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {#each mockApiResponse as video, index (video.id)}
                    <div in:fly|local={{ x: 50, duration: 400, delay:index*200 }}>
                        <RecommendedVideos {video}></RecommendedVideos>
                    </div>
                {/each}
            </div>
    
        </div>
    </div>

