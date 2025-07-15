<script lang="ts">
	import { items } from '$lib/utils/menuItems';
</script>

<nav class="flex flex-col gap-3 pt-4" id="side-bar-main">
	{#each items as item}
		<a
			href={item.ref}
			data-sveltekit-prefetch="off"
			class="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl hover:bg-gray-200"
		>
			<span class="h-6 w-6">
				{@html item.svg}
			</span>

			<span class="text-center text-xs">
				{item.description}
			</span>
		</a>
	{/each}
</nav>
