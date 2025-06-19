<script lang="ts">
import VideoCard from "$lib/components/videoCard.svelte";
export let data;

</script>
{#if data.error}
    <p> <strong>Ops! Qualcosa è andato storto</strong></p>
{:else if data.videos}
    <div class="grid  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-cols-1 mt-3">
        {#each data.videos as video (video.id)}
            <VideoCard {video}/>
        {/each}

    </div>
{:else}
    <p> Loading . . .</p>
{/if}
    

