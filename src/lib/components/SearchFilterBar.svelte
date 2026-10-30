<script lang="ts">
	import {
		SEARCH_DURATIONS,
		SEARCH_ORDERS,
		SEARCH_PERIODS,
		SEARCH_TYPES,
		type SearchFilters
	} from '#lib/types/searchFilters.js';

	let { filters }: { filters: SearchFilters } = $props();

	// SvelteKit intercetta i form GET e li trasforma in navigazioni lato client
	// (client.js, gestore 'submit'): il form nativo e' quindi sia il percorso
	// senza JavaScript sia quello con. Il bottone resta visibile perche' senza
	// JS `onchange` non parte e serve un modo per applicare i filtri.
	const selectClass =
		'bg-background-secondary text-primary border-border-color cursor-pointer rounded-lg border px-3 py-1.5 text-sm';

	// Derivato e non costante: navigando fra ricerche il componente non viene
	// ricreato, cambia solo la prop.
	const groups = $derived([
		{ name: 'type', label: 'Tipo', value: filters.type, options: SEARCH_TYPES, disabled: false },
		{
			name: 'order',
			label: 'Ordina per',
			value: filters.order,
			options: SEARCH_ORDERS,
			disabled: false
		},
		{
			name: 'duration',
			label: 'Durata',
			value: filters.duration,
			options: SEARCH_DURATIONS,
			// L'API rifiuta videoDuration se non si cercano video: disabilitato il
			// campo non viene inviato, e il filtro torna da solo al default.
			disabled: filters.type === 'channel'
		},
		{
			name: 'uploaded',
			label: 'Data di caricamento',
			value: filters.uploaded,
			options: SEARCH_PERIODS,
			disabled: false
		}
	]);
</script>

<form class="border-border-color flex flex-wrap items-end gap-3 border-b px-4 pb-4">
	{#each groups as group (group.name)}
		<label class="flex flex-col gap-1">
			<span class="text-secondary text-xs">{group.label}</span>
			<select
				name={group.name}
				value={group.value}
				disabled={group.disabled}
				class="{selectClass} disabled:cursor-not-allowed disabled:opacity-40"
				onchange={(event) => event.currentTarget.form?.requestSubmit()}
			>
				{#each group.options as option (option.value)}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</label>
	{/each}

	<button
		type="submit"
		class="bg-background-secondary text-primary hover:bg-background-tertiary cursor-pointer rounded-lg px-4 py-1.5 text-sm font-medium"
	>
		Filtra
	</button>
</form>
