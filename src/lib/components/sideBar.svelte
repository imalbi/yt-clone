<script lang="ts">
import { items } from "$lib/menuItems";

</script>


<nav class="flex flex-col gap-3 pt-4 " id="side-bar-main">
    {#each items as item}
        <a 
            href={item.ref} 
            data-sveltekit-prefetch="off"
            class="flex flex-col items-center justify-center h-20 w-20 gap-1 rounded-xl  hover:bg-gray-200 cursor-pointer"
        >
            <span class="w-6 h-6">
                {@html item.svg}
            </span>

            <span class="text-xs text-center">
                {item.description}
            </span>
        </a>
    {/each}
</nav>
