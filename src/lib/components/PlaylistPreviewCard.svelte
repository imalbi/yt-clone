<script lang="ts">
	import { resolve } from '$app/paths';
	import IconPlaylistPlay from '~icons/mdi/playlist-play';
	import type { Playlist } from '#lib/types/playlist.js';

	let { playlist }: { playlist: Playlist } = $props();
</script>

<a href={resolve('/playlist/[playlistId]', { playlistId: playlist.id })} class="group block">
	<article
		class="text-primary flex cursor-pointer flex-col gap-2 rounded-2xl p-2 transition-colors"
	>
		<div class="bg-background-secondary relative aspect-video w-full overflow-hidden rounded-2xl">
			{#if playlist.thumbnail}
				<img
					loading="lazy"
					class="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
					src={playlist.thumbnail}
					alt="Copertina di {playlist.title}"
				/>
			{:else}
				<div class="text-secondary flex h-full w-full items-center justify-center">
					<IconPlaylistPlay class="h-10 w-10 opacity-40" />
				</div>
			{/if}
			{#if playlist.itemCount !== undefined}
				<span
					class="absolute right-2 bottom-2 flex items-center gap-1 rounded-lg bg-black/80 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-xs"
				>
					<IconPlaylistPlay class="h-3.5 w-3.5" />
					{playlist.itemCount}
				</span>
			{/if}
		</div>
		<h2
			class="line-clamp-2 text-sm leading-snug font-semibold [overflow-wrap:anywhere]"
			title={playlist.title}
		>
			{playlist.title}
		</h2>
	</article>
</a>
