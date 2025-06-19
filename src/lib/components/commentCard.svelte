<script lang="ts">
    import { formatTimeAgo } from "$lib/scripts/scripts";
    let { commentData } = $props();
    let defaultAvatar = "/media/avatar.webp";
    let likes= 123; //PlaceHolder

    function handleImageError(e: Event) {
        if (e.target instanceof HTMLImageElement) {
            e.target.onerror = null; 
            e.target.src = defaultAvatar;
        }
    }
</script>
<div class="flex gap-3">
    <img class="size-10 rounded-full" onerror={handleImageError} 
    src={commentData.authorProfileImageUrl} alt="ImgAvatar">
    <div class="min-w-0">
        <p class="text-sm">
            <strong class="font-semibold">{commentData.authorDisplayName}</strong>
            <span class="text-gray-500 ml-2">{formatTimeAgo(commentData.publishedAt)}</span>
        </p>
        
        <p class="text-sm break-words whitespace-pre-line mt-1">
            {commentData.textOriginal}
        </p>


        <div class="flex items-center gap-1 mt-2">

            <button class="cursor-pointer flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-200 hover:text-black transition-colors">
                <img class="w-6"src="/media/like.svg " alt="Mi piace">
                
                {#if likes > 0}
                    <span class="text-xs font-medium">{likes}</span>
                {/if}
            </button>

            <button class="cursor-pointer p-1.5 rounded-full text-gray-600 hover:bg-gray-200 hover:text-black transition-colors">
                <img class="w-6"src="/media/unlike.svg" alt="Non mi piace">
            </button>

            <button class=" cursor-pointer px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 hover:text-black transition-colors ml-2">
                Rispondi
            </button>
        </div>


    </div>

</div>

