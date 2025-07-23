<script lang="ts">
	const { description } = $props();

	let isExpanded = $state(false);
	let descriptionElement: HTMLParagraphElement | null = $state(null);
	let isExpandable = $derived(() => {
		if (!descriptionElement) return false;
		return descriptionElement.scrollHeight > descriptionElement.clientHeight;
	});

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
		<p class="line-clamp-2 whitespace-pre-wrap" bind:this={descriptionElement}>{description}</p>
		{#if isExpandable()}
			<p class="text-l font font-semibold">Mostra altro..</p>
		{/if}
	{/if}
</button>
