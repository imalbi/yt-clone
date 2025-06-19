<script lang="ts">
  import CommentCard from './commentCard.svelte';

    let { data } = $props();

    let comment=$state('');
    console.log(JSON.stringify(data.video.statistics));
</script>

<div class="bg-gray-100 rounded-2xl p-4 flex flex-col gap-3 mt-10">
  {#await data.streamed.comments}
    <p>Caricamento dei commenti</p>
  {:then comments} 
  <form class="">
    <h1 class="font-bold p-2 mb-2">{data.video.statistics.commentCount} commenti</h1>
    <textarea class="w-full" bind:value={comment} placeholder="Aggiungi un commento (PlaceHolder)"></textarea>
    <div class= "flex gap-3 justify-end mr-4">
      <button class="text-white bg-red-600 rounded-2xl p-2 cursor-pointer" type="reset">Annulla</button>
      <button class="text-white bg-black rounded-2xl p-2 cursor-pointer" type="submit">Commenta</button>
    </div>
  </form>
  {#each comments as comment(comment.id)}

  <CommentCard commentData={comment.snippet.topLevelComment.snippet}></CommentCard>

  {/each}
  <button class="text-black bg-white hover:bg-black rounded-2xl hover:text-white p-2 cursor-pointer">Mostra altro</button>    
  {/await}
</div>