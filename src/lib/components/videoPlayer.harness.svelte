<script lang="ts">
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import VideoPlayer from './videoPlayer.svelte';
	import type { Video } from '#lib/types/video.js';
	import type { User } from '#lib/types/user.js';

	/** Solo per i test: vedi commentCard.harness.svelte. */
	let {
		video,
		user = null
	}: {
		video: Video | null;
		user?: User;
	} = $props();

	const client = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } }
	});
</script>

<QueryClientProvider {client}>
	<VideoPlayer {video} {user} />
</QueryClientProvider>
