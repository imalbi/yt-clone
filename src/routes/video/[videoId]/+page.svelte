<script lang="ts">
    import { page } from "$app/state";
    import VideoPlayer from "$lib/components/videoPlayer.svelte";
    import CommentsCard from "$lib/components/CommentsCard.svelte";
    import RecommendedVideos from "$lib/components/RecommendedVideos.svelte";
    import { mockApiResponse } from "$lib/mocks/popularVideos.js";
    import { fly} from "svelte/transition";
    let {data} = $props();
    import { onMount } from "svelte";
    const video=page.url.pathname.split("/").pop();

    let recommendedVideos = $state([]);

    // 2. onMount viene eseguito dopo il primo rendering del componente.
    onMount(() => {
        // 3. Usiamo setTimeout per simulare un caricamento di dati (es. una chiamata API).
        setTimeout(() => {
            // 4. Dopo 300ms, popoliamo l'array.
            // Svelte noterà che l'array è cambiato e AGGIUNGERÀ i nuovi elementi al DOM.
            // Questo farà scattare la transizione "in:".
            recommendedVideos = mockApiResponse;
        }, 300); // Un piccolo ritardo è sufficiente
    });

    



</script>
    <div class="w-full p-4 xl:p-8">
        <div class="flex flex-col xl:flex-row gap-8">
    
            <div class="w-full">
                <VideoPlayer {data}/>
                <CommentsCard {data}></CommentsCard>
                
                </div>
            
            <div class="w-full xl:w-110 xl:flex xl:flex-col sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {#each recommendedVideos as video, index (video.id)}
                    <div in:fly|local={{ x: 50, duration: 400, delay:index*200 }}>
                        <RecommendedVideos {video}></RecommendedVideos>
                    </div>
                {/each}
            </div>
    
        </div>
    </div>

