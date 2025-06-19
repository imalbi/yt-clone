<script lang="ts">
    let {video} = $props(); 
    import { formatTimeAgo } from "$lib/scripts/scripts";
    import { formatSubscriberCount } from "$lib/scripts/scripts";

</script>

<a href="/video/{video.videoId}" class="block"> <article class="flex flex-col sm:flex-row gap-4 rounded-lg p-2 bg-gray-100 hover:bg-gray-200 cursor-pointer">
        
        <div class="w-full sm:w-56 aspect-video flex-shrink-0"> 
            <img class="w-full  object-cover rounded-md" src={video.thumbnail} alt="Thumbnail per {video.title}">
        </div>
        
        <div class="flex flex-col flex-1 min-w-0">
            <h3 class="text-lg font-bold line-clamp-1">{video.title}</h3>
            
            <div class="text-sm text-gray-600 mt-1">
                <p>{video.channelTitle}</p>
                <p>
                    <span>{formatSubscriberCount(video.viewCount)} visualizzazioni</span>
                    <span class="mx-1">•</span>
                    <span>{formatTimeAgo(video.publishedAt)}</span>
                </p>
            </div>

            <p class="text-sm text-gray-500 mt-2 hidden md:line-clamp-2">
                {video.description}
            </p>
        </div>

    </article>
</a>