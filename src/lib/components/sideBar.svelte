<script lang="ts">
	import { items } from '$lib/utils/menuItems';
	import { theme } from '$lib/stores/themeStore'; // Import theme store
</script>

<nav class="flex flex-col gap-3 pt-4" id="side-bar-main">
	<!--
		Needs ul and li for better semantics and accessibility
	-->
	<ul>
		{#each items as item}
			<li>
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
			</li>
		{/each}
		<li>
			<!-- Toggle theme button -->
			<button onclick={() => theme.toggle()}> Toggle Theme </button>
		</li>
		<li>
			<p>Current Theme: {JSON.stringify($theme)}</p>
		</li>
	</ul>
</nav>
