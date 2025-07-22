<script lang="ts">
	const { description } = $props();

	let isExpanded = $state(false);

	function toggleExpansion() {
		isExpanded = !isExpanded;
	}
</script>

<button
	type="button"
	onclick={toggleExpansion}
	aria-expanded={isExpanded}
	class="w-full cursor-pointer text-left"
>
	{#if isExpanded}
		<p class="whitespace-pre-wrap">{description}</p>
	{:else}
		<p class="line-clamp-2 whitespace-pre-wrap">{description}</p>
		<p class="text-l font font-semibold">Mostra altro..</p>
	{/if}
</button>
