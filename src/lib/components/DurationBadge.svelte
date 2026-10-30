<script lang="ts">
	import { formatDuration } from '#lib/scripts/scripts.js';

	let { seconds }: { seconds?: number } = $props();

	const label = $derived(formatDuration(seconds));
</script>

{#if label}
	<span
		class="pointer-events-none absolute right-1 bottom-1 rounded bg-black/80 px-1 py-0.5 text-xs font-medium text-white"
	>
		{label}
	</span>
{/if}
