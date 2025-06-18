<script>
  import CommentCard from './commentCard.svelte';

    let { data } = $props();
</script>

<div class="bg-gray-200 rounded-2xl p-4 flex flex-col gap-3">
    {#each data.comments as comment(comment.id)}
    <CommentCard {comment}></CommentCard>
    {/each}
</div>