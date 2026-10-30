<script lang="ts">
	import { resolve } from '$app/paths';
	import { isNavActive, items } from '#lib/utils/menuItems.js';
	import { page } from '$app/state';
</script>

<aside
	class="bg-background/95 border-border-color fixed top-16 bottom-0 left-0 z-40 hidden w-20 flex-col items-center border-r py-3 backdrop-blur md:flex"
>
	<nav class="flex w-full flex-col items-center">
		<ul class="flex w-full flex-col items-center gap-1.5 px-2">
			{#each items as item (item.ref)}
				{@const isActive = isNavActive(item.ref, page.url)}
				<li class="w-full">
					<a
						href={resolve(item.ref)}
						aria-current={isActive ? 'page' : undefined}
						class="flex w-full flex-col items-center justify-center gap-1.5 rounded-2xl py-3.5 transition-all duration-150 {isActive
							? 'bg-background-secondary text-primary font-semibold shadow-xs'
							: 'text-secondary hover:text-primary hover:bg-background-secondary/60 font-normal'}"
					>
						<span class="h-6 w-6">
							{#if isActive}
								<item.activeIcon />
							{:else}
								<item.icon />
							{/if}
						</span>

						<span class="text-center text-[11px] leading-none tracking-tight">
							{item.description}
						</span>
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</aside>
