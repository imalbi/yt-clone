<script lang="ts">
    const { description } = $props();
    
    let isExpanded = $state(false);

    function toggleExpansion(){
        isExpanded=!isExpanded;
    }
</script>
<button type="button" onclick={toggleExpansion} aria-expanded={isExpanded} class="w-full text-left cursor-pointer">
    {#if isExpanded}
        <p class="whitespace-pre-wrap">{description}</p>
    {:else}
        <p class="whitespace-pre-wrap line-clamp-2">{description}</p>
        <p class="text-l font-semibold font">Mostra altro..</p>
    {/if}
</button>


