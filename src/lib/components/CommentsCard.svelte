<script lang="ts">
	import CommentCard from './commentCard.svelte';
	import type { CommentThread } from '$lib/types/commentThread';
	import CommentReply from '$lib/components/CommentReply.svelte';
	import type { Video } from '$lib/api/mock';
	import { inview } from 'svelte-inview';
	import { page } from '$app/state';
	import { comments as commentsStore } from '$lib/stores/commentsStore';
	import { userStore } from '$lib/stores/userStore';
	import { afterNavigate } from '$app/navigation';
	import { onDestroy } from 'svelte';

	let {
		comments,
		commentsNextPageToken
	}: {
		comments: Promise<CommentThread[]>;
		commentsNextPageToken: Promise<string | undefined>;
	} = $props();

	// Subscribe to the store for this video ID
	let allComments = $state<CommentThread[]>([]);
	let nextPageToken = $state<string | undefined>(undefined);
	let isLoaded = $state(false);
	let newComment = $state('');
	let show = $state(false);

	// Create a store subscription that updates allComments when the store changes
	const unsubscribe = commentsStore.subscribe((store) => {
		if (page.params.videoId) {
			const storeComments = store[page.params.videoId] || [];
			allComments = storeComments; // aggiorna SEMPRE
		}
	});

	// Cleanup the subscription when the component is destroyed
	onDestroy(unsubscribe);

	// Combine promises for loading
	//const dataPromise = Promise.all([comments, video]);

	// Add a new comment
	async function addComment() {
		if (newComment.trim() === '') return;
		if (!$userStore) {
			alert('Devi essere loggato per aggiungere un commento.');
			return;
		}

		const commentData: CommentThread = {
			id: crypto.randomUUID(),
			topLevelComment: {
				id: crypto.randomUUID(),
				textDisplay: newComment,
				publishedAt: new Date().toISOString(),
				authorChannelId: '',
				authorChannelUrl: '',
				authorDisplayName: $userStore?.name || 'Tu',
				authorProfileImageUrl: $userStore?.picture || '',
				likeCount: 0
			},
			replies: []
		};

		// Add to store (will trigger subscription update)
		commentsStore.addComment(page.params.videoId, commentData);

		newComment = '';
		show = false;
	}

	// Load more comments
	async function loadMoreComments() {
		if (!nextPageToken) return;

		try {
			const response = await fetch(
				`/api/comments?videoId=${page.params.videoId}&pageToken=${nextPageToken}`
			);
			const newCommentsData = await response.json();

			// Add the new comments to the store
			const added = commentsStore.addApiComments(page.params.videoId, newCommentsData.comments);

			nextPageToken = newCommentsData.nextPageToken;
			if (added === 0) {
				loadMoreComments();
			} // If no new comments, try loading more
		} catch (error) {
			console.error('Error loading more comments:', error);
		}
	}

	// Initialize comments on navigation
	afterNavigate(() => {
		console.log('Navigated to a new video, resetting comments state');
		isLoaded = false;
		nextPageToken = undefined;
		allComments = [];

		(async () => {
			try {
				const [initialComments, token] = await Promise.all([comments, commentsNextPageToken]);
				commentsStore.addApiComments(page.params.videoId, initialComments);
				nextPageToken = token;
			} catch (error) {
				console.error('Error loading comments:', error);
			} finally {
				isLoaded = true;
			}
		})();
	});
</script>

<div class="bg-background-secondary text-primary m-auto mt-10 flex flex-col gap-3 rounded-2xl p-4">
	{#await comments}
		<p class="text-secondary">Caricamento dei commenti ...</p>
	{:then}
		<h1 class="text-primary mb-2 p-2 font-bold">
			{isLoaded ? allComments.length : 0} commenti
		</h1>

		<form>
			<textarea
				class="w-full"
				onfocus={() => (show = true)}
				bind:value={newComment}
				placeholder="Aggiungi un commento (LocalStorage)"
			></textarea>
			{#if show}
				<div class="mr-4 flex justify-end gap-3">
					<button
						type="button"
						class="bg-background-secondary text-primary cursor-pointer rounded-2xl p-2"
						onclick={(e) => {
							e.preventDefault();
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
								addComment();
							}}
						>
							Commenta
						</button>
					{:else}
						<div
							class="bg-background-tertiary text-primary/60 rounded-2xl p-2"
							tabindex="-1"
							role="button"
							onmousedown={(e) => {
								e.preventDefault();
								e.stopPropagation();
							}}
						>
							Commenta
						</div>
					{/if}
				</div>
			{/if}
		</form>
		<!-- Mostra i commenti (prima quelli iniziali, poi quelli caricati dinamicamente) -->
		{#each allComments as comment (comment.id)}
			<CommentCard commentData={comment.topLevelComment} threadId={comment.id}></CommentCard>
			{#if comment.replies && comment.replies.length > 0}
				<div class="ml-4">
					<p class="text-secondary">Risposte:</p>
				</div>
			{/if}
			{#each comment.replies as reply (reply.id)}
				<CommentReply commentData={reply}></CommentReply>
			{/each}
		{/each}

		<!-- Infinite scroll trigger -->
		{#if nextPageToken}
			<div use:inview={{ threshold: 0.1 }} oninview_enter={loadMoreComments}>
				<p class="text-secondary text-center">Caricamento commenti...</p>
			</div>
		{/if}
	{:catch error}
		<p class="text-red-500">Errore nel caricamento: {error?.message || error}</p>
	{/await}
</div>
