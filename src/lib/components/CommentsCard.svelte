<script lang="ts">
	import CommentCard from './commentCard.svelte';
	import type { CommentThread } from '$lib/types/commentThread';
	import type { Video } from '$lib/api/mock';

	let {
		comments,
		video
	}: {
		comments: Promise<CommentThread[]>;
		video: Promise<Video | null>;
	} = $props();
	//video is used to get the comment count
	//with video.statistics.commentCount we can get the number of comments, but it is a promise

	let newComment = $state('');
	let show = $state(false);

	// Combina entrambe le Promise per un loading unificato
	const dataPromise = Promise.all([comments, video]);
</script>

<div class="bg-background-secondary text-primary m-auto mt-10 flex flex-col gap-3 rounded-2xl p-4">
	{#await dataPromise}
		<p>Caricamento dei commenti e informazioni video...</p>
	{:then [resolvedComments, resolvedVideo]}
		<h1 class="text-primary mb-2 p-2 font-bold">
			{resolvedVideo?.statistics?.commentCount || 0} commenti
		</h1>

		<form class="">
			<textarea
				class="w-full"
				onfocus={() => (show = true)}
				bind:value={newComment}
				placeholder="Aggiungi un commento (PlaceHolder)"
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
		<!--Each thread comments is here-->
		{#each resolvedComments as comment (comment.id)}
			<CommentCard commentData={comment.topLevelComment}></CommentCard>
			<!--
			Here we have the replies
			-->
			{#if comment.replies && comment.replies.length > 0}
				<div class="ml-4">
					<p class="text-secondary">Risposte:</p>
				</div>
			{/if}
			<!--TODO: Replies Should have a different style-->
			{#each comment.replies as reply (reply.id)}
				<CommentCard commentData={reply}></CommentCard>
			{/each}
		{/each}
		<button
			class="bg-background-secondary hover:bg-background-tertiary text-primary cursor-pointer rounded-2xl p-2 font-semibold"
			>Mostra altro</button
		>
	{:catch error}
		<p class="text-red-500">Errore nel caricamento: {error?.message || error}</p>
	{/await}
</div>
