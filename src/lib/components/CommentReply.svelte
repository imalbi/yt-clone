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

<!-- Risposta al commento con margine sinistro per indicare che è una risposta -->
<div class="border-secondary mt-2 ml-6 flex gap-3 border-l-2 pl-4">
	<img
		class="size-8 rounded-full"
		onerror={handleImageError}
		src={commentData.authorProfileImageUrl}
		alt="ImgAvatar of {commentData.authorDisplayName}"
	/>
	<div class="min-w-0 flex-1">
		<p class="text-xs">
			<strong class="text-primary font-semibold">{commentData.authorDisplayName}</strong>
			<span class="text-secondary ml-2">{formatTimeAgo(commentData.publishedAt)}</span>
		</p>

		<p class="text-primary mt-1 text-sm break-words whitespace-pre-line">
			{commentData.textDisplay}
		</p>

		<div class="mt-2 flex items-center gap-1">
			<button
				class="text-primary hover:bg-background-tertiary flex cursor-pointer items-center gap-1.5 rounded-full py-1 pr-2 pl-1 text-xs font-medium transition-colors"
				aria-label="Like comment"
			>
				<svg
					class="h-4 w-4"
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
				class="text-primary hover:bg-background-tertiary flex cursor-pointer items-center gap-1.5 rounded-full py-1 pr-2 pl-1 text-xs font-medium transition-colors"
				aria-label="Dislike comment"
			>
				<svg
					class="h-4 w-4"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
				>
					<path
						d="M22 21h-4V9h4v12zM2 9c0-1.1.9-2 2-2h6.31l-.95-4.57-.03-.32c0-.41.17-.79.44-1.06L11 1l6.41 6.41c.37.37.59.89.59 1.42V19c0 1.1-.9 2-2 2H7c-.83 0-1.54-.5-1.84-1.22L2.14 12.73c-.09-.23-.14-.47-.14-.73v-1z"
					/>
				</svg>
			</button>

			<button class="text-primary hover:text-secondary ml-2 text-xs font-medium transition-colors">
				Rispondi
			</button>
		</div>
	</div>
</div>
