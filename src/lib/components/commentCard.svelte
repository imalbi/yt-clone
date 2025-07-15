<script lang="ts">
	import { formatTimeAgo } from '$lib/scripts/scripts';
	let { commentData } = $props();
	let defaultAvatar = '/media/avatar.webp';
	let likes = 123; //PlaceHolder

	function handleImageError(e: Event) {
		if (e.target instanceof HTMLImageElement) {
			e.target.onerror = null;
			e.target.src = defaultAvatar;
		}
	}
</script>

<div class="flex gap-3">
	<img
		class="size-10 rounded-full"
		onerror={handleImageError}
		src={commentData.authorProfileImageUrl}
		alt="ImgAvatar"
	/>
	<div class="min-w-0">
		<p class="text-sm">
			<strong class="font-semibold">{commentData.authorDisplayName}</strong>
			<span class="ml-2 text-gray-500">{formatTimeAgo(commentData.publishedAt)}</span>
		</p>

		<p class="mt-1 text-sm break-words whitespace-pre-line">
			{commentData.textOriginal}
		</p>

		<div class="mt-2 flex items-center gap-1">
			<button
				class="flex cursor-pointer items-center gap-1.5 rounded-full py-1 pr-2 pl-1 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 hover:text-black"
			>
				<img class="w-6" src="/media/like.svg " alt="Mi piace" />

				{#if likes > 0}
					<span class="text-xs font-medium">{likes}</span>
				{/if}
			</button>

			<button
				class="cursor-pointer rounded-full p-1.5 text-gray-600 transition-colors hover:bg-gray-200 hover:text-black"
			>
				<img class="w-6" src="/media/unlike.svg" alt="Non mi piace" />
			</button>

			<button
				class=" ml-2 cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:text-black"
			>
				Rispondi
			</button>
		</div>
	</div>
</div>
