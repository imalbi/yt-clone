<script lang="ts">
    import SearchVideoCard from "$lib/components/searchVideoCard.svelte";
    
    let {data} = $props();



</script>

<main class="mt-3 p-2 w-full max-w-5xl mx-auto">
    {#each data.searchResults as video(video.videoId) }
        <SearchVideoCard {video}></SearchVideoCard>
    {/each}
</main>
