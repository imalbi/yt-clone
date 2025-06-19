<script lang="ts">
  import { formatTimeAgo } from "$lib/scripts/scripts";
  let {video} = $props();


</script>

<a href="/video/{video.id}">
    <article class="rounded-2xl p-2 bg-gray-100 hover:bg-gray-200 cursor-pointer xl:flex">
        <div class="xl:w-48 xl:flex-shrink-0">
            <div class="aspect-video w-full">
                <img 
                    class="rounded-xl w-full h-full object-cover" 
                    src={video.snippet.thumbnails.medium.url} 
                    alt="Thumbnail per {video.snippet.title}"
                >
            </div>
        </div>

        <div class="flex flex-1 flex-col justify-center min-w-0 p-2">
            <h1 class="text-base font-semibold leading-tight mt-2 line-clamp-2">
                {video.snippet.title}
            </h1>
            <p class="text-sm text-gray-600 mt-2 truncate">
                {video.snippet.channelTitle}
            </p>
            <p class="text-sm text-gray-600 mt-1 truncate">
                {video.statistics.viewCount} visualizzazioni • {formatTimeAgo(video.snippet.publishedAt)}
            </p>
        </div>

    </article>
</a>