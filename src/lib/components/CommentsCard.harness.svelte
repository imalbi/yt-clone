<script lang="ts">
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import CommentsCard from './CommentsCard.svelte';
	import type { CommentThread } from '#lib/types/commentThread.js';
	import type { User } from '#lib/types/user.js';

	/** Solo per i test: vedi commentCard.harness.svelte. */
	let {
		videoId = 'video1',
		firstPage,
		user = null
	}: {
		videoId?: string;
		firstPage: Promise<{ comments: CommentThread[]; nextPageToken?: string }>;
		user?: User;
	} = $props();

	const client = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } }
	});
</script>

<QueryClientProvider {client}>
	<CommentsCard {videoId} {firstPage} {user} />
</QueryClientProvider>
