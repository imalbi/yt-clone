<script lang="ts">
	import { resolve } from '$app/paths';
	import { isNavActive, items } from '#lib/utils/menuItems.js';
	import { page } from '$app/state';
</script>

<nav
	class="bg-background/95 border-border-color fixed inset-x-0 bottom-0 z-40 flex h-14 items-center justify-around border-t backdrop-blur md:hidden"
	aria-label="Navigazione principale mobile"
>
	{#each items as item (item.ref)}
		{@const isActive = isNavActive(item.ref, page.url)}
		<a
			href={resolve(item.ref)}
			aria-current={isActive ? 'page' : undefined}
			class="flex flex-1 flex-col items-center justify-center py-1 transition-colors {isActive
				? 'text-primary font-semibold'
				: 'text-secondary hover:text-primary font-normal'}"
		>
			<span class="h-5 w-5">
				{#if isActive}
					<item.activeIcon />
				{:else}
					<item.icon />
				{/if}
			</span>
			<span class="text-[10px] leading-tight">
				{item.description}
			</span>
		</a>
	{/each}
</nav>
