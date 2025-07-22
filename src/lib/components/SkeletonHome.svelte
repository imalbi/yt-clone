<div class="mt-3 grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
	{#each Array(12) as _, i}
		<div class="flex animate-pulse flex-col p-2">
			<div class="bg-background-secondary mb-3 aspect-video w-full rounded-lg"></div>
			<div class="bg-background-secondary mb-2 h-4 w-3/4 max-w-full rounded"></div>
			<div class="bg-background-secondary h-3 w-1/2 max-w-full rounded"></div>
		</div>
	{/each}
</div>
