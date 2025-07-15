<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing'; // Un'animazione più fluida
	let { isOpen, close }: { isOpen: boolean; close: () => void } = $props();
	import { items } from '$lib/utils/menuItems';

	function handleKeydown(event: KeyboardEvent) {
		if (isOpen && event.key === 'Escape') {
			close();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
	<button aria-label="Close Menu" class="fixed inset-0 z-40 bg-black opacity-50" onclick={close}
	></button>

	<aside
		class="fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white pt-2 pr-10"
		in:fly={{ x: -256, duration: 300, easing: quintOut }}
		out:fly={{ x: -256, duration: 250, easing: quintOut }}
	>
		<div class="ml-5 flex flex-shrink-0 items-center gap-4 whitespace-nowrap">
			<button
				class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-gray-200"
				onclick={close}
			>
				<img src="/media/burger.svg" alt="Menu" class="h-6 w-6" />
			</button>
			<a href="/"><img class="h-8" src="/media/ytlogo.svg" alt="Home" /></a>
		</div>

		<nav class="fixed top-20 left-3 flex flex-col gap-4">
			{#each items as item}
				<a
					href={item.ref}
					class="flex w-50 cursor-pointer items-center gap-6 rounded-xl p-2 hover:bg-gray-200"
				>
					<span class="h-7 w-7 flex-shrink-0">
						{@html item.svg}
					</span>

					<span class="font-medium">
						{item.description}
					</span>
				</a>
			{/each}
		</nav>
	</aside>
{/if}
