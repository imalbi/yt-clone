<script lang="ts">
    import { onMount } from "svelte";
    let{onToggle} = $props();
    let user ={
        img: "/media/avatar.webp"
    }
    let showOnlySearch=$state(false);
    let isMobile = $state(false);
    //If not logged 3dots and login, no mic too

    onMount(()=>{
        if (typeof window !== 'undefined') {
            isMobile = window.innerWidth < 768;
            function updateIsMobile() {
                isMobile = window.innerWidth < 768;
            }
            window.addEventListener('resize', updateIsMobile);
            return () => window.removeEventListener('resize', updateIsMobile);
        }
    })

    function showSearch(){
        if(isMobile){
            showOnlySearch=true;
        }
        else{
            console.log("Not on mobile");
        }
    }


</script>

<nav class="bg-white flex items-center justify-between mt-2 w-full">

    {#if showOnlySearch}
    <div class="flex items-center w-full">
      <button
        class="border border-gray-300 border-r-0 rounded-l-full h-10 px-4 hover:bg-gray-100 cursor-pointer "
        aria-label="Chiudi"
        onclick={()=>showOnlySearch=false}
      >
        ←
      </button>
      <input
        type="text"
        class="border border-gray-300 rounded-r-full h-10 px-4 flex-1"
        placeholder="Cerca"
      />
    </div>
    {:else}
    <div class="flex items-center gap-4 whitespace-nowrap flex-shrink-0 ml-5">
        <button class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
        onclick={onToggle}>
            <img src="/media/burger.svg" alt="Menu" class="w-6 h-6" />
        </button>
        <a href="/"><img class="h-8" src="/media/ytlogo.svg" alt="Home"></a>
    </div>

    
    <div class="flex items-center flex-shrink-0 order-2">
        <input class="hidden md:block rounded-l-3xl border border-gray-300 h-10 w-[25vw]" type="text" placeholder="Cerca">
        <button class="cursor-pointer rounded-full bg-#F0F0F0 border border-gray-300 h-10 p-2 hover:bg-gray-200
        md:rounded-r-full md:rounded-l-none md:borderl-l-0"
        onclick={showSearch}
        ><img class="w-6 p-1"src="/media/search.svg" alt="Cerca Bottone"></button>
    </div>
    
    <div class="flex items-center flex-shrink-0 gap-2 order-3 mr-5">
        <button class="flex items-center rounded-3xl h-10 pr-6 bg-gray-100 hover:bg-gray-200 cursor-pointer"><img class="h-9" src="/media/add.svg" alt="">Crea</button>
        <button class="rounded-full h-10 w-10 bg-gray-100 hover:bg-gray-200 cursor-pointer"><img class="p-2" src="/media/bell.svg" alt=""></button>
        <button class="rounded-full h-10 w-10 cursor-pointer"><img class="rounded-full" src={user.img} alt=""></button>
    </div>
    
    {/if}
    </nav>

<style>

</style>