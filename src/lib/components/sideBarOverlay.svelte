<script lang="ts">
    import { fly } from "svelte/transition";
    import { quintOut } from 'svelte/easing'; // Un'animazione più fluida
    let {isOpen, close}: {isOpen: boolean, close: () => void}  = $props();
    import{items} from "$lib/menuItems";

    function handleKeydown(event: KeyboardEvent) {
    if (isOpen && event.key === 'Escape') {
        close();
    }



}

</script>

<svelte:window onkeydown={handleKeydown}/>  

{#if isOpen}

<button  aria-label="Close Menu" class="fixed inset-0 z-40 bg-black opacity-50" onclick={close}></button>
    
<aside class="fixed top-0 left-0 bottom-0 z-50 flex flex-col bg-white pt-2 pr-10" 
    in:fly={{ x: -256, duration: 300, easing: quintOut }}
    out:fly={{ x: -256, duration: 250, easing: quintOut }}>
        
    <div class="flex items-center gap-4 whitespace-nowrap flex-shrink-0 ml-5">
        <button class="flex items-center justify-center w-10 h-10 rounded-full  hover:bg-gray-200 cursor-pointer" onclick={close}>
        <img src="/media/burger.svg" alt="Menu" class="w-6 h-6" />
        </button>
        <a href="/"><img class="h-8 " src="/media/ytlogo.svg" alt="Home"></a>
    </div>

    <nav class="fixed top-20 left-3 flex flex-col gap-4">
    {#each items as item}
        <a 
            href={item.ref} 
            class="flex items-center w-50  gap-6 rounded-xl p-2   hover:bg-gray-200 cursor-pointer"
        >
            <span class="flex-shrink-0 w-7 h-7">
                {@html item.svg}
            </span>

            <span class="font-medium">
                {item.description}
            </span>
        </a>
    {/each}
</nav> 

    </aside>
    
    {/if}