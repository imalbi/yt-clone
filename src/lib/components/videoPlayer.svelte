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
        <iframe class="aspect-video rounded-2xl" id="ytplayer" title="Video" {src} frameborder="0" allowfullscreen></iframe>

        <h1 class= "font-bold text-xl">{data.video.title}{videoData.snippet.title}</h1>
        <div class="flex md:flex-row flex-col justify-between">
            <div class="flex flex-row gap-2 mt-2">
                <img loading="lazy" class="rounded-full contain-content size-14" src={data.channel.snippet.thumbnails.default.url} alt="Channel Avatar">
                <div class="flex flex-col ">
                    <h2 class="font-bold ">{data.channel.snippet.title}</h2>
                    <p class="font-light text-gray-600">{formatSubscriberCount(data.channel.statistics.subscriberCount)} di iscritti</p>

                </div>
                <button class="rounded-3xl bg-black text-white px-4 py-2 h-fit font-semibold cursor-pointer align-middle">Iscriviti</button>
            </div>

            <div class="mr-10 h-12 flex">
                <button class="bg-gray-100 hover:bg-gray-300 rounded-l-full cursor-pointer px-4 h-full flex items-center gap-2"> 
                    <svg class = "w-6 h-6"xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 270 270"  preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px); content-visibility: visible;"><defs><clipPath id="__lottie_element_736"><rect width="270" height="270" x="0" y="0"></rect></clipPath><clipPath id="__lottie_element_738"><path d="M0,0 L480,0 L480,480 L0,480z"></path></clipPath><clipPath id="__lottie_element_742"><path d="M0,0 L480,0 L480,480 L0,480z"></path></clipPath><clipPath id="__lottie_element_755"><path d="M0,0 L480,0 L480,480 L0,480z"></path></clipPath><clipPath id="__lottie_element_767"><path d="M0,0 L480,0 L480,480 L0,480z"></path></clipPath><clipPath id="__lottie_element_779"><path d="M0,0 L480,0 L480,480 L0,480z"></path></clipPath><clipPath id="__lottie_element_791"><path d="M0,0 L480,0 L480,480 L0,480z"></path></clipPath><clipPath id="__lottie_element_803"><path d="M0,0 L480,0 L480,480 L0,480z"></path></clipPath></defs><g clip-path="url(#__lottie_element_736)"><g clip-path="url(#__lottie_element_738)" transform="matrix(0.4350000023841858,0,0,0.4350000023841858,28.474998474121094,26.724998474121094)" opacity="1" style="display: block;"><g clip-path="url(#__lottie_element_803)" style="display: none;"><g style="display: none;"><path stroke-linecap="round" stroke-linejoin="round" fill-opacity="0"></path></g><g style="display: none;"><path stroke-linecap="round" stroke-linejoin="round" fill-opacity="0"></path></g></g><g clip-path="url(#__lottie_element_791)" style="display: none;"><g style="display: none;"><path stroke-linecap="round" stroke-linejoin="round" fill-opacity="0"></path></g><g style="display: none;"><path stroke-linecap="round" stroke-linejoin="round" fill-opacity="0"></path></g></g><g clip-path="url(#__lottie_element_779)" style="display: none;"><g style="display: none;"><path stroke-linecap="round" stroke-linejoin="round" fill-opacity="0"></path></g><g style="display: none;"><path stroke-linecap="round" stroke-linejoin="round" fill-opacity="0"></path></g></g><g clip-path="url(#__lottie_element_767)" style="display: none;"><g style="display: none;"><path stroke-linecap="round" stroke-linejoin="round" fill-opacity="0"></path></g><g style="display: none;"><path stroke-linecap="round" stroke-linejoin="round" fill-opacity="0"></path></g></g><g clip-path="url(#__lottie_element_755)" style="display: none;"><g style="display: none;"><path stroke-linecap="round" stroke-linejoin="round" fill-opacity="0"></path></g><g style="display: none;"><path stroke-linecap="round" stroke-linejoin="round" fill-opacity="0"></path></g></g><g clip-path="url(#__lottie_element_742)" transform="matrix(1,0,0,1,0,0)" opacity="1" style="display: block;"><g style="display: none;"><path></path><g><g></g></g></g><g transform="matrix(10,0,0,10,120,120)" opacity="1" style="display: block;"><path fill="rgb(0,0,0)" fill-opacity="1" d=" M8,11 C8,11 3,11 3,11 C3,11 3,21 3,21 C3,21 8,21 8,21 C8,21 8,11 8,11z M18.770000457763672,11 C18.770000457763672,11 14.539999961853027,11 14.539999961853027,11 C14.539999961853027,11 16.059999465942383,6.059999942779541 16.059999465942383,6.059999942779541 C16.3799991607666,5.03000020980835 15.539999961853027,4 14.380000114440918,4 C13.800000190734863,4 13.239999771118164,4.239999771118164 12.859999656677246,4.650000095367432 C12.859999656677246,4.650000095367432 7,11 7,11 C7,11 7,21 7,21 C7,21 17.43000030517578,21 17.43000030517578,21 C18.489999771118164,21 19.40999984741211,20.329999923706055 19.6200008392334,19.389999389648438 C19.6200008392334,19.389999389648438 20.959999084472656,13.390000343322754 20.959999084472656,13.390000343322754 C21.229999542236328,12.149999618530273 20.18000030517578,11 18.770000457763672,11z M7,20 C7,20 4,20 4,20 C4,20 4,12 4,12 C4,12 7,12 7,12 C7,12 7,20 7,20z M19.979999542236328,13.170000076293945 C19.979999542236328,13.170000076293945 18.639999389648438,19.170000076293945 18.639999389648438,19.170000076293945 C18.540000915527344,19.649999618530273 18.030000686645508,20 17.43000030517578,20 C17.43000030517578,20 8,20 8,20 C8,20 8,11.390000343322754 8,11.390000343322754 C8,11.390000343322754 13.600000381469727,5.329999923706055 13.600000381469727,5.329999923706055 C13.789999961853027,5.119999885559082 14.079999923706055,5 14.380000114440918,5 C14.640000343322754,5 14.880000114440918,5.110000133514404 15.010000228881836,5.300000190734863 C15.079999923706055,5.400000095367432 15.15999984741211,5.559999942779541 15.100000381469727,5.769999980926514 C15.100000381469727,5.769999980926514 13.579999923706055,10.710000038146973 13.579999923706055,10.710000038146973 C13.579999923706055,10.710000038146973 13.180000305175781,12 13.180000305175781,12 C13.180000305175781,12 14.529999732971191,12 14.529999732971191,12 C14.529999732971191,12 18.760000228881836,12 18.760000228881836,12 C19.170000076293945,12 19.559999465942383,12.170000076293945 19.790000915527344,12.460000038146973 C19.920000076293945,12.609999656677246 20.049999237060547,12.859999656677246 19.979999542236328,13.170000076293945z"></path></g></g></g></g></svg>
                    <span class="text-center text-nowrap">{formatSubscriberCount(videoData.statistics.likeCount)}</span> </button>
                <button class="bg-gray-100 hover:bg-gray-300 rounded-r-full cursor-pointer px-4 h-full flex items-center" aria-label="dislike">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-6 h-6" fill="currentColor">
                <path d="M17 4H6.57c-1.07 0-1.98.67-2.19 1.61l-1.34 6C2.77 12.85 3.82 14 5.23 14h4.23l-1.52 4.94C7.62 19.97 8.46 21 9.62 21c.58 0 1.14-.24 1.52-.65L17 14h4V4h-4zm-6.6 15.67c-.19.21-.48.33-.78.33-.26 0-.5-.11-.63-.3-.07-.1-.15-.26-.09-.47l1.52-4.94.4-1.29H5.23c-.41 0-.8-.17-1.03-.46-.12-.15-.25-.4-.18-.72l1.34-6c.1-.47.61-.82 1.21-.82H16v8.61l-5.6 6.06zM20 13h-3V5h3v8z"></path>
                </svg>       
                </button>

                <button class="bg-gray-100 hover:bg-gray-300 rounded-full px-3 py-1 cursor-pointer ml-3 "> Condividi </button>
                <button class="bg-gray-100 hover:bg-gray-300 rounded-full px-3 py-1 cursor-pointer ml-3 "> Scarica </button>
                <button class="bg-gray-100 hover:bg-gray-300 rounded-full size-12 cursor-pointer ml-3 pb-4 font-bold text-2xl hidden md:block"> ... </button>
            </div>
        </div>
        <div class="rounded-2xl bg-gray-100 p-3 cursor-pointer">
            <h3>{formatSubscriberCount(videoData.statistics.viewCount)} visualizzazioni  {formatData(videoData.snippet.publishedAt)}</h3>
            <DescriptionBox description={videoData.snippet.description}></DescriptionBox>
        </div>

    </div>
{:else}
<p>Video non trovato o dati mancanti</p>
{/if}