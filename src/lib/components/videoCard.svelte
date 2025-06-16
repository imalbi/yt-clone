<script lang="ts">
let sampleImg="/media/hq720.avif";
let avatar= "/media/avatar.webp";
</script>
<article class="p-2 bg-gray-100 hover:bg-gray-200 cursor-pointer">
    <div>
        <img class="rounded-2xl" src={sampleImg} alt="Thumbnail">
    </div>
    <div class="flex flex-row">
        <aside><img class="rounded-full w-12" src={avatar} alt="Avatar"></aside>
        <div>
            <h1 class="text-2xl">Titolo</h1>
            <p class=" text-gray-600">NomeCanale</p>
            <p class="text-gray-600"> n Visualizzazioni ^ tempo</p>
        </div>
    </div>
</article>
