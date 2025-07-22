<script lang="ts">
	import { formatTimeAgo } from '$lib/scripts/scripts';

	let { commentData } = $props();

	function handleImageError(e: Event) {
		if (e.target instanceof HTMLImageElement) {
			e.target.onerror = null;
			const firstLetter = commentData.authorDisplayName?.charAt(1).toUpperCase() || 'A';
			e.target.src = `https://ui-avatars.com/api/?name=${firstLetter}&background=random&color=fff`;
		}
	}
</script>

<div class="flex gap-3">
	<img
		class="size-10 rounded-full"
		onerror={handleImageError}
		src={commentData.authorProfileImageUrl}
		alt="ImgAvatar of {commentData.authorDisplayName}"
	/>
	<div class="min-w-0">
		<p class="text-sm">
			<strong class="font-semibold">{commentData.authorDisplayName}</strong>
			<span class="ml-2 text-gray-500">{formatTimeAgo(commentData.publishedAt)}</span>
		</p>

		<p class="mt-1 text-sm break-words whitespace-pre-line">
			{commentData.textDisplay}
		</p>

		<div class="mt-2 flex items-center gap-1">
			<button
				class="text-primary hover:bg-background-tertiary flex cursor-pointer items-center gap-1.5 rounded-full py-1 pr-2 pl-1 text-sm font-medium transition-colors"
			>
				<svg
					class="h-6 w-6"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
				>
					<path
						d="M2 21h4V9H2v12zM22 9c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L13 1 6.59 7.41C6.22 7.78 6 8.3 6 8.83V19c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1z"
					/>
				</svg>

				{#if commentData.likes > 0}
					<span class="text-xs font-medium">{commentData.likes}</span>
				{/if}
			</button>

			<button
				class="text-primary hover:bg-background-tertiary cursor-pointer rounded-full p-1.5 transition-colors"
				aria-label="Dislike comment"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					class="h-6 w-6"
					fill="currentColor"
				>
					<path
						d="M17 4H6.57c-1.07 0-1.98.67-2.19 1.61l-1.34 6C2.77 12.85 3.82 14 5.23 14h4.23l-1.52 4.94C7.62 19.97 8.46 21 9.62 21c.58 0 1.14-.24 1.52-.65L17 14h4V4h-4zm-6.6 15.67c-.19.21-.48.33-.78.33-.26 0-.5-.11-.63-.3-.07-.1-.15-.26-.09-.47l1.52-4.94.4-1.29H5.23c-.41 0-.8-.17-1.03-.46-.12-.15-.25-.4-.18-.72l1.34-6c.1-.47.61-.82 1.21-.82H16v8.61l-5.6 6.06zM20 13h-3V5h3v8z"
					></path>
				</svg>
			</button>

			<button
				class=" hover:bg-background-tertiary text-primary ml-2 cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
			>
				Rispondi
			</button>
		</div>
	</div>
</div>
