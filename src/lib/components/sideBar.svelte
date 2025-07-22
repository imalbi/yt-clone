<script lang="ts">
	import { items } from '$lib/utils/menuItems';
	import { page } from '$app/state';
</script>

<nav class="flex gap-3 pt-4">
	<!--
		Needs ul and li for better semantics and accessibility
	-->
	<ul>
		{#each items as item (item.ref)}
			<li>
				<a
					href={item.ref}
					data-sveltekit-prefetch="off"
					class="hover:bg-background-secondary bg-background flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl"
				>
					<span class="text-primary h-6 w-6">
						{#if item.ref === page.url.pathname}
							{@html item.activesvg}
						{:else}
							{@html item.svg}
						{/if}
					</span>

					<span class="text-primary text-center text-xs">
						{item.description}
					</span>
				</a>
			</li>
		{/each}
	</ul>
</nav>
