<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	// 403 dalla Data API significa quasi sempre quota giornaliera esaurita. E' il
	// modo in cui questa demo smette di funzionare a fine giornata, e senza un
	// messaggio dedicato si legge come "il sito e' rotto" invece che "riprova domani".
	let quotaExceeded = $derived(page.status === 403);
</script>

<main class="bg-background flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 p-8">
	<h1 class="text-primary text-6xl font-bold">{page.status}</h1>

	{#if quotaExceeded}
		<p class="text-primary text-lg font-medium">Quota giornaliera della YouTube API esaurita</p>
		<p class="text-secondary max-w-md text-center text-sm">
			L'API concede 10.000 unità al giorno e sono finite. Il limite si azzera a mezzanotte, ora del
			Pacifico.
		</p>
	{:else if page.status === 404}
		<p class="text-primary text-lg font-medium">Pagina non trovata</p>
	{:else}
		<p class="text-primary text-lg font-medium">
			{page.error?.message ?? 'Qualcosa è andato storto'}
		</p>
	{/if}

	<a
		href={resolve('/')}
		class="bg-background-secondary text-primary hover:bg-background-tertiary mt-2 rounded-full px-5 py-2 text-sm font-medium transition-colors"
	>
		Torna alla home
	</a>
</main>
