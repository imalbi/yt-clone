<script lang="ts">
	import CommentCard from './commentCard.svelte';
	import type { CommentThread } from '$lib/types/commentThread';
	import CommentReply from '$lib/components/CommentReply.svelte';
	import type { Video } from '$lib/api/mock';
	import { inview } from 'svelte-inview';
	import { page } from '$app/state';
	import { comments as commentsStore, commentStoreData } from '$lib/stores/commentsStore';

	import { userStore } from '$lib/stores/userStore';
	import { afterNavigate } from '$app/navigation';
	let {
		comments,
		video,
		commentsNextPageToken
	}: {
		comments: Promise<CommentThread[]>;
		video: Promise<Video | null>;
		commentsNextPageToken: Promise<string | undefined>;
	} = $props();

	let allComments = $derived<CommentThread[]>($commentStoreData[page.params.videoId] || []); // Inizializza con i commenti mock
	let nextPageToken = $state<string | undefined>(undefined);
	let isLoaded = $state(false);
	let newComment = $state('');
	let show = $state(false);

	// Combina entrambe le Promise per un loading unificato
	const dataPromise = Promise.all([comments, video]);

	//Funzione per gestire aggiunta di un nuovo commento
	async function addComment() {
		if (newComment.trim() === '') return;
		if (!userStore) {
			alert('Devi essere loggato per aggiungere un commento.');
			return;
		}

		const commentData: CommentThread = {
			id: crypto.randomUUID(),
			topLevelComment: {
				id: crypto.randomUUID(),
				textDisplay: newComment,
				publishedAt: new Date().toISOString(),
				authorChannelId: '', // Non necessario per il mock
				authorChannelUrl: '', // Non necessario per il mock
				authorDisplayName: $userStore?.name || 'Tu',
				authorProfileImageUrl: $userStore?.picture || '',
				likeCount: 0
			},
			replies: []
		};

		allComments = [commentData, ...allComments];
		newComment = '';
		show = false;

		// Aggiungi il nuovo commento allo store
		commentsStore.addComment(page.params.videoId, commentData);
	}

	async function loadMoreComments() {
		if (!nextPageToken) return;

		try {
			const response = await fetch(
				`/api/comments?videoId=${page.params.videoId}&pageToken=${nextPageToken}`
			);
			const newCommentsData = await response.json();

			// Filtra commenti duplicati
			const existingIds = new Set(allComments.map((c) => c.id));
			const newUniqueComments = newCommentsData.comments.filter(
				(comment: CommentThread) => !existingIds.has(comment.id)
			);

			allComments = [...allComments, ...newUniqueComments];
			nextPageToken = newCommentsData.nextPageToken;
		} catch (error) {
			console.error('Error loading more comments:', error);
		}
	}

	afterNavigate(() => {
		console.log('Navigated to a new video, resetting comments state');
		// Resetta lo stato quando si naviga in una nuova pagina video
		isLoaded = false;
		allComments = [];
		nextPageToken = undefined;

		// Ricarica i commenti per il nuovo video
		allComments = commentsStore.getComments(page.params.videoId) || [];

		Promise.all([comments, commentsNextPageToken])
			.then(([initialComments, token]) => {
				allComments.push(...initialComments);
				nextPageToken = token;
				isLoaded = true;
			})
			.catch((error) => {
				console.error('Error loading comments:', error);
				isLoaded = true;
			});
	});
</script>

<div class="bg-background-secondary text-primary m-auto mt-10 flex flex-col gap-3 rounded-2xl p-4">
	{#await dataPromise}
		<p class="text-secondary">Caricamento dei commenti ...</p>
	{:then [resolvedComments, resolvedVideo]}
		<h1 class="text-primary mb-2 p-2 font-bold">
			{resolvedVideo?.statistics?.commentCount || 0} commenti
		</h1>

		<form class="">
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
							onmousedown={(e) => (e.preventDefault(), e.stopPropagation())}
						>
							Commenta
						</div>
					{/if}
				</div>
			{/if}
		</form>

		<!-- Mostra i commenti (prima quelli iniziali, poi quelli caricati dinamicamente) -->
		{#each isLoaded ? allComments : [] as comment (comment.id)}
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
