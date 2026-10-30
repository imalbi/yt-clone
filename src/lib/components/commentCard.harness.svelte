<script lang="ts">
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import CommentCard from './commentCard.svelte';
	import type { Comment } from '#lib/types/commentThread.js';

	/**
	 * Solo per i test. Le mutation vogliono un QueryClient nel contesto, e il
	 * contesto si imposta soltanto durante l'init di un componente: da un file
	 * .ts non e' raggiungibile. Nessun codice dell'app importa questo file.
	 */
	let {
		commentData,
		videoId = 'video1',
		parentId = 'comment1',
		myChannelId = null,
		isReply = false
	}: {
		commentData: Comment;
		videoId?: string;
		parentId?: string;
		myChannelId?: string | null;
		isReply?: boolean;
	} = $props();

	// Senza retry un errore atteso resta un errore, invece di far scadere il test.
	const client = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } }
	});
</script>

<QueryClientProvider {client}>
	<CommentCard {commentData} {videoId} {parentId} {myChannelId} {isReply} />
</QueryClientProvider>
