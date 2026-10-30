<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { Dialog } from 'bits-ui';
	import IconClose from '~icons/mdi/close';
	import { isNavActive, items } from '#lib/utils/menuItems.js';
	import YouTubeLogo from './YouTubeLogo.svelte';
</script>

<Dialog.Portal>
	<Dialog.Overlay
		class="drawer-overlay fixed inset-0 z-50 hidden bg-black/55 backdrop-blur-[1px] md:block"
	/>
	<Dialog.Content
		class="drawer-panel bg-background text-primary border-border-color fixed inset-y-0 left-0 z-50 hidden w-[min(19rem,calc(100vw-2rem))] flex-col border-r p-3 shadow-2xl outline-none md:flex"
	>
		<Dialog.Title class="sr-only">Navigazione principale</Dialog.Title>

		<div class="flex h-12 items-center gap-3 px-1">
			<Dialog.Close
				class="hover:bg-background-secondary flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors"
				aria-label="Chiudi menu"
			>
				<IconClose class="h-6 w-6" />
			</Dialog.Close>
			<a href={resolve('/')} aria-label="Home" class="flex items-center">
				<YouTubeLogo class="h-5 w-auto" />
			</a>
		</div>

		<nav class="mt-5" aria-label="Navigazione principale">
			<ul class="flex flex-col gap-1">
				{#each items as item (item.ref)}
					{@const active = isNavActive(item.ref, page.url)}
					<li>
						<Dialog.Close>
							{#snippet child({ props })}
								<a
									{...props}
									href={resolve(item.ref)}
									aria-current={active ? 'page' : undefined}
									class="hover:bg-background-secondary flex items-center gap-4 rounded-xl px-3 py-3 transition-colors {active
										? 'bg-background-secondary font-semibold'
										: 'text-secondary hover:text-primary'}"
								>
									<span class="h-6 w-6 shrink-0">
										{#if active}<item.activeIcon />{:else}<item.icon />{/if}
									</span>
									<span>{item.description}</span>
								</a>
							{/snippet}
						</Dialog.Close>
					</li>
				{/each}
			</ul>
		</nav>
	</Dialog.Content>
</Dialog.Portal>

<style>
	.drawer-overlay[data-state='open'] {
		animation: drawer-fade-in 180ms ease-out;
	}
	.drawer-overlay[data-state='closed'] {
		animation: drawer-fade-out 150ms ease-in;
	}
	.drawer-panel[data-state='open'] {
		animation: drawer-slide-in 220ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	.drawer-panel[data-state='closed'] {
		animation: drawer-slide-out 170ms ease-in;
	}
	@keyframes drawer-fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes drawer-fade-out {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}
	@keyframes drawer-slide-in {
		from {
			transform: translateX(-100%);
		}
		to {
			transform: translateX(0);
		}
	}
	@keyframes drawer-slide-out {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-100%);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.drawer-overlay,
		.drawer-panel {
			animation-duration: 1ms !important;
		}
	}
</style>
