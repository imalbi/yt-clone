<script lang="ts">
  import DescriptionBox from './DescriptionBox.svelte';

    import { formatSubscriberCount } from "$lib/scripts/scripts";
    
    let {data} = $props();
    const src = $derived(`https://www.youtube.com/embed/${data.video.id}`);
    const videoData= $derived(data.video);


    //FORMAT DATA
    function formatData(dataIn:string) {
        const dataPubblicazione = new Date(dataIn);
        
        const opzioniDiFormattazione = {
            day: '2-digit' as const,
            month: 'short' as const,
            year: 'numeric' as const
        };
        const formattatore =new Intl.DateTimeFormat('it-IT', opzioniDiFormattazione);
        const stringaFormattata = formattatore.format(dataPubblicazione);
        return stringaFormattata;

    }
    

    
</script>
{#if data&&data.video&&data.channel}
    <div class="flex flex-col gap-2 w-full">
        <iframe class="aspect-video rounded-2xl" id="ytplayer" title="Video" {src} frameborder="0"></iframe>

        <h1 class= "font-bold text-xl">{data.video.title}{videoData.snippet.title}</h1>
        <div class="flex flex-row justify-between">
            <div class="flex flex-row gap-2 mt-2">
                <img class="rounded-full contain-content size-14" src={data.channel.snippet.thumbnails.default.url} alt="Channel Avatar">
                <div class="flex flex-col ">
                    <h2 class="font-bold ">{data.channel.snippet.title}</h2>
                    <p class="font-light text-gray-600">{formatSubscriberCount(data.channel.statistics.subscriberCount)} di iscritti</p>

                </div>
                <button class="rounded-3xl bg-black text-white px-4 py-2 h-fit font-semibold cursor-pointer align-middle">Iscriviti</button>
            </div>

            <div class=" md:flex mr-10 h-12 hidden ">
                <button class="bg-gray-200 hover:bg-gray-300 rounded-l-full cursor-pointer px-2"> Su {formatSubscriberCount(videoData.statistics.likeCount)} </button>
                <button class="bg-gray-200 hover:bg-gray-300 rounded-r-full cursor-pointer px-2"> Giu </button>
                <button class="bg-gray-200 hover:bg-gray-300 rounded-full px-3 py-1 cursor-pointer ml-3"> Condividi </button>
                <button class="bg-gray-200 hover:bg-gray-300 rounded-full px-3 py-1 cursor-pointer ml-3"> Scarica </button>
                <button class="bg-gray-200 hover:bg-gray-300 rounded-full size-12 cursor-pointer ml-3 pb-4 font-bold text-2xl"> ... </button>
            </div>
        </div>
        <div class="rounded-2xl bg-gray-200 p-3 cursor-pointer">
            <h3>{formatSubscriberCount(videoData.statistics.viewCount)} visualizzazioni  {formatData(videoData.snippet.publishedAt)}</h3>
            <DescriptionBox description={videoData.snippet.description}></DescriptionBox>
        </div>

    </div>
{:else}
<p>Video non trovato o dati mancanti</p>
{/if}