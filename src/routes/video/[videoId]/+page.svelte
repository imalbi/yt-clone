<script lang="ts">
    import { page } from "$app/state";
    import VideoPlayer from "$lib/components/videoPlayer.svelte";
    import CommentsCard from "$lib/components/CommentsCard.svelte";
    import RecommendedVideos from "$lib/components/RecommendedVideos.svelte";
    export let data;
    const video=page.url.pathname.split("/").pop();
</script>


<div class="flex flex-row">
    <VideoPlayer class="" {data}/>
    <div class=""></div>
    </div>    
<CommentsCard/>
