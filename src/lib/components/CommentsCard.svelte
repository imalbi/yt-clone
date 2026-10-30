<script lang="ts">
	import { createInfiniteQuery, useQueryClient } from '@tanstack/svelte-query';
	import CommentCard from './commentCard.svelte';
	import { inview } from 'svelte-inview';
	import { commentsOptions, queryKeys } from '#lib/queries.js';
	import { myChannelId, postComment } from '#lib/youtube.remote.js';
	import type { CommentThread } from '#lib/types/commentThread.js';
	import type { User } from '#lib/types/user.js';

	let {
		videoId,
		firstPage,
		user
	}: {
		videoId: string;
		firstPage: Promise<{ comments: CommentThread[]; nextPageToken?: string; disabled?: boolean }>;
		user: User;
	} = $props();

	let newComment = $state('');
	let show = $state(false);

	const client = useQueryClient();
	const thread = createInfiniteQuery(() => commentsOptions(videoId, firstPage));

	// Chiesto una volta per pagina e condiviso con ogni commento: e' cio' che
	// distingue i propri commenti, quelli che si possono modificare.
	const me = $derived(user ? myChannelId() : undefined);
	const myId = $derived(me?.current ?? null);

	const allComments = $derived(thread.data?.pages.flatMap((p) => p.comments) ?? []);

	// Il commento viene pubblicato davvero su YouTube. Prima restava in
	// localStorage e non lo vedeva nessun altro: era una feature finta.
	async function publish() {
		try {
			await postComment({ videoId, text: newComment });
		} catch (cause) {
			// Non c'e' un posto dove mostrarlo, come prima. Almeno il testo scritto
			// non sparisce e non resta un rejection non gestito.
			console.error('Pubblicazione del commento fallita:', cause);
			return;
		}
		newComment = '';
		show = false;
		// La lista e' paginata, quindi resta su TanStack.
		client.invalidateQueries({ queryKey: queryKeys.comments(videoId) });
	}
</script>

<div class="bg-background-secondary text-primary m-auto mt-10 flex flex-col gap-3 rounded-2xl p-4">
	{#if thread.isError}
		<p class="text-red-500">Errore nel caricamento dei commenti: {thread.error.message}</p>
	{:else if thread.isPending}
		<p class="text-secondary">Caricamento dei commenti ...</p>
	{:else if thread.data?.pages[0]?.disabled}
		<p class="text-secondary">I commenti sono disattivati per questo video.</p>
	{:else}
		<h1 class="text-primary mb-2 p-2 font-bold">{allComments.length} commenti</h1>

		<form>
			<textarea
				class="w-full"
				onfocus={() => (show = true)}
				bind:value={newComment}
				placeholder={user ? 'Aggiungi un commento' : 'Accedi per commentare'}
				disabled={!user || postComment.pending > 0}></textarea>
			{#if show}
				<div class="mr-4 flex justify-end gap-3">
					<button
						type="button"
						class="bg-background-secondary text-primary cursor-pointer rounded-2xl p-2"
						onclick={() => {
							newComment = '';
							show = false;
						}}>Annulla</button
					>
					{#if newComment !== ''}
						<button
							class="text-primary cursor-pointer rounded-2xl bg-blue-500 p-2 font-bold"
							type="submit"
							onclick={(e) => {
								e.preventDefault();
								publish();
							}}
						>
							Commenta
						</button>
					{:else}
						<div class="bg-background-tertiary text-primary/60 rounded-2xl p-2">Commenta</div>
					{/if}
				</div>
			{/if}
		</form>

		{#each allComments as comment (comment.id)}
			<CommentCard
				commentData={comment.topLevelComment}
				{videoId}
				parentId={comment.topLevelComment.id}
				myChannelId={myId}
			/>
			{#if comment.replies.length > 0}
				<div class="ml-4">
					<p class="text-secondary">Risposte:</p>
				</div>
			{/if}
			{#each comment.replies as reply (reply.id)}
				<CommentCard
					commentData={reply}
					{videoId}
					parentId={comment.topLevelComment.id}
					myChannelId={myId}
					isReply
				/>
			{/each}
		{/each}

		{#if thread.hasNextPage}
			<div use:inview={{ threshold: 0.1 }} oninview_enter={() => thread.fetchNextPage()}>
				<p class="text-secondary text-center">Caricamento commenti...</p>
			</div>
		{/if}
	{/if}
</div>
