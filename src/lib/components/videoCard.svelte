<script lang="ts">
let {video} = $props();
import { formatSubscriberCount, formatTimeAgo } from "$lib/scripts/scripts";formatSubscriberCount

</script>

<a href="/video/{video.id}">
    <article class="rounded-2xl p-2 bg-gray-100 hover:bg-gray-200 cursor-pointer">
        <div>
            <img class="rounded-2xl w-full" src={video.snippet.thumbnails.maxres.url} alt="Thumbnail">
        </div>
        <div class="flex flex-row gap-2">
            <aside class=" flex-shrink-0"><img class="rounded-full size-12 mt-2 object-cover " src={video.channelAvatarUrl} alt="Avatar"></aside>
            <div class="flex flex-col">
                <h1 class="text-2xl font-semibold line-clamp-2">{video.snippet.title}</h1>
                <p class=" text-gray-600">{video.snippet.channelTitle}</p>
                <p class="text-gray-600 tracking-tight ">{formatSubscriberCount(video.statistics.viewCount)} visualizzazioni • {formatTimeAgo(video.snippet.publishedAt)}</p>
            </div>
        </div>
    </article>
</a>
