<script lang="ts">
    import SearchVideoCard from "$lib/components/searchVideoCard.svelte";
    
    let {data} = $props();



</script>

<main class="mt-3 p-2">
    {#each data.searchResults as video(video.videoId) }
        <SearchVideoCard {video}></SearchVideoCard>
    {/each}
    
        
</main>
