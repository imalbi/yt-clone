<script lang="ts">
	import { resolve } from '$app/paths';
	import type { VideoCategory } from '#lib/types/category.js';

	let { categories, selected }: { categories: VideoCategory[]; selected?: string } = $props();

	const home = resolve('/');

	// Chip come link e non come bottoni: la categoria e' un indirizzo, quindi
	// deve essere apribile in una nuova scheda e raggiungibile dal tasto indietro.
	const chipClass =
		'shrink-0 cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors';
</script>

<div class="flex [scrollbar-width:none] gap-3 overflow-x-auto px-2 py-1">
	<a
		href={home}
		class="{chipClass} {selected === undefined
			? 'bg-primary text-background'
			: 'bg-background-secondary text-primary hover:bg-background-tertiary'}"
		aria-current={selected === undefined ? 'page' : undefined}
	>
		Tutti
	</a>
	{#each categories as category (category.id)}
		<a
			href="{home}?category={category.id}"
			class="{chipClass} {selected === category.id
				? 'bg-primary text-background'
				: 'bg-background-secondary text-primary hover:bg-background-tertiary'}"
			aria-current={selected === category.id ? 'page' : undefined}
		>
			{category.title}
		</a>
	{/each}
</div>
