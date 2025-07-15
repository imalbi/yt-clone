<script lang="ts">
	import CommentCard from './commentCard.svelte';

	let { data } = $props();

	let comment = $state('');
</script>

<div class="m-auto mt-10 flex flex-col gap-3 rounded-2xl bg-gray-100 p-4">
	{#await data.streamed.comments}
		<p>Caricamento dei commenti</p>
	{:then comments}
		<form class="">
			<h1 class="mb-2 p-2 font-bold">{data.video.statistics.commentCount} commenti</h1>
			<textarea class="w-full" bind:value={comment} placeholder="Aggiungi un commento (PlaceHolder)"
			></textarea>
			<div class="mr-4 flex justify-end gap-3">
				<button class="cursor-pointer rounded-2xl bg-red-600 p-2 text-white" type="reset"
					>Annulla</button
				>
				<button class="cursor-pointer rounded-2xl bg-black p-2 text-white" type="submit"
					>Commenta</button
				>
			</div>
		</form>
		{#each comments as comment (comment.id)}
			<CommentCard commentData={comment.snippet.topLevelComment.snippet}></CommentCard>
		{/each}
		<button
			class="cursor-pointer rounded-2xl bg-white p-2 text-black hover:bg-black hover:text-white"
			>Mostra altro</button
		>
	{/await}
</div>
