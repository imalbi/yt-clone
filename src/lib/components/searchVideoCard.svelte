<script lang="ts">
    let {video} = $props(); 
    import { formatTimeAgo } from "$lib/scripts/scripts";
    import { formatSubscriberCount } from "$lib/scripts/scripts";

</script>

<a href="/video/{video.videoId}">
    <article class="rounded-2xl p-2 bg-gray-100 hover:bg-gray-200 cursor-pointer flex gap-3 ">
        <div class="w-100 aspect-video shrink-0">
            <img class="rounded-2xl" src={video.thumbnail} alt="Thumbnail">
        </div>
        <div class="flex flex-row gap-2">
            <div class="flex flex-col">
                <h1 class="text-2xl font-semibold">{video.title}</h1>
                <p class=" text-gray-600">{video.channelTitle}</p>
                <p class="text-gray-600">{formatSubscriberCount(video.viewCount)} visualizzazioni • {formatTimeAgo(video.publishedAt)}</p>
                <p class="text-gray-600 line-clamp-2">{video.description}</p>
            </div>
        </div>
    </article>
</a>
