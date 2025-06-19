<script lang="ts">
  import CommentCard from './commentCard.svelte';

    let { data } = $props();

    let comment=$state('');

</script>

<div class="bg-gray-200 rounded-2xl p-4 flex flex-col gap-3 mt-10">
  {#await data.streamed.comments}
    <p>Caricamento dei commenti</p>
  {:then comments} 
  <form class="mt-3">
    <textarea class="w-full" bind:value={comment} placeholder="Aggiungi un commento (PlaceHolder)"></textarea>
    <div class= "flex gap-3 justify-end mr-4">
      <button class="text-white bg-red-600 rounded-2xl p-2 cursor-pointer" type="reset">Annulla</button>
      <button class="text-white bg-black rounded-2xl p-2 cursor-pointer" type="submit">Commenta</button>
    </div>
  </form>
  {#each comments as comment(comment.id)}

  <CommentCard commentData={comment.snippet.topLevelComment.snippet}></CommentCard>
  {/each}
    
  {/await}
</div>