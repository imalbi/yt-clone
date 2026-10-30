<script lang="ts">
	import { tick } from 'svelte';

	const { description }: { description: string } = $props();
	const componentId = $props.id();
	const descriptionId = `video-description-${componentId}`;

	let isExpanded = $state(false);
	let descriptionElement: HTMLParagraphElement | null = $state(null);
	let isExpandable = $derived(() => {
		if (!descriptionElement) return false;
		return descriptionElement.scrollHeight > descriptionElement.clientHeight;
	});

	async function toggleExpansion() {
		const element = descriptionElement;
		if (!element) return;

		const startHeight = element.getBoundingClientRect().height;
		isExpanded = !isExpanded;
		await tick();

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		if (typeof element.animate !== 'function') return;

		const endHeight = element.getBoundingClientRect().height;
		if (startHeight === endHeight) return;

		element.animate(
			[
				{ height: `${startHeight}px`, opacity: 0.84 },
				{ height: `${endHeight}px`, opacity: 1 }
			],
			{
				duration: 240,
				easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
			}
		);
	}
</script>

<div class="pt-1">
	<p
		id={descriptionId}
		bind:this={descriptionElement}
		class="overflow-hidden whitespace-pre-wrap"
		class:line-clamp-2={!isExpanded}
	>
		{description}
	</p>

	{#if isExpandable() || isExpanded}
		<button
			type="button"
			class="text-primary mt-1 cursor-pointer text-sm font-semibold hover:underline"
			aria-controls={descriptionId}
			aria-expanded={isExpanded}
			onclick={toggleExpansion}
		>
			{isExpanded ? 'Mostra meno' : 'Mostra altro'}
		</button>
	{/if}
</div>
