<script lang="ts">
	import IconThumbDownOutline from '~icons/mdi/thumb-down-outline';
	import IconThumbUpOutline from '~icons/mdi/thumb-up-outline';
	import { formatTimeAgo, linkify } from '#lib/scripts/scripts.js';
	import { initialsAvatar, onAvatarError } from '#lib/avatar.js';
	import { commentActions } from '#lib/comments.svelte.js';
	import type { Comment } from '#lib/types/commentThread.js';

	/**
	 * Un commento, in cima al thread o come risposta. Erano due componenti con
	 * lo stesso contenuto e misure diverse; da quando si possono modificare
	 * sarebbero state due copie anche del modulo e delle mutation, e per la
	 * Data API un commento e una risposta sono la stessa risorsa.
	 */
	let {
		commentData,
		videoId,
		parentId,
		myChannelId = null,
		isReply = false
	}: {
		commentData: Comment;
		videoId: string;
		/**
		 * Il commento in cima al thread. Le risposte vanno tutte li' sotto: la
		 * Data API non annida un terzo livello, quindi rispondere a una risposta
		 * significa comunque rispondere al capofila.
		 */
		parentId: string;
		/** Il canale di chi guarda: null se non e' loggato o non ne ha uno. */
		myChannelId?: string | null;
		isReply?: boolean;
	} = $props();

	const actions = commentActions(() => videoId);

	// Il confronto decide solo quali bottoni mostrare: a rifiutare la modifica
	// del commento di un altro e' comunque YouTube, con un 403.
	const isMine = $derived(!!myChannelId && commentData.authorChannelId === myChannelId);

	const parts = $derived(linkify(commentData.textDisplay));

	// Un modulo solo per due usi: riscrivere questo commento o rispondergli.
	// Campo, bottoni e stato di attesa sono gli stessi, cambia dove finisce il
	// testo, quindi duplicarlo sarebbe stata la terza copia dello stesso form.
	let mode = $state<'edit' | 'reply' | null>(null);
	let draft = $state('');
	let confirmingDelete = $state(false);

	const busy = $derived(actions.busy);
	const failure = $derived(actions.failure);

	function startWriting(next: 'edit' | 'reply') {
		draft = next === 'edit' ? commentData.textDisplay : '';
		mode = next;
		actions.reset();
	}

	function save() {
		const close = () => (mode = null);

		if (mode === 'edit') actions.edit(commentData.id, draft, close);
		else actions.reply(parentId, draft, close);
	}
</script>

<div class={isReply ? 'border-secondary mt-2 ml-6 flex gap-3 border-l-2 pl-4' : 'flex gap-3'}>
	<img
		class="{isReply ? 'size-8' : 'size-10'} rounded-full"
		onerror={(event) => onAvatarError(event, initialsAvatar(commentData.authorDisplayName))}
		src={commentData.authorProfileImageUrl}
		referrerpolicy="no-referrer"
		alt="Avatar di {commentData.authorDisplayName}"
	/>
	<div class="min-w-0 flex-1">
		<p class={isReply ? 'text-xs' : 'text-sm'}>
			<strong class="text-primary font-semibold">{commentData.authorDisplayName}</strong>
			<span class="text-secondary ml-2">{formatTimeAgo(commentData.publishedAt)}</span>
		</p>

		{#if mode !== 'edit'}
			<div class="text-primary mt-1 text-sm break-words whitespace-pre-line">
				{#each parts as part, i (i)}
					{#if part.href}
						<!-- L'indirizzo lo scrive chi commenta: e' esterno per definizione, non
						     una rotta di questa app da passare a resolve(). -->
						<!-- eslint-disable svelte/no-navigation-without-resolve -->
						<a
							href={part.href}
							target="_blank"
							rel="noopener noreferrer nofollow"
							class="text-blue-500 hover:underline">{part.text}</a
						>
						<!-- eslint-enable svelte/no-navigation-without-resolve -->
					{:else}{part.text}{/if}
				{/each}
			</div>
		{/if}

		{#if mode}
			<form
				class="mt-1"
				onsubmit={(event) => {
					event.preventDefault();
					save();
				}}
			>
				<textarea
					class="border-border-color bg-background text-primary w-full rounded-lg border p-2 text-sm"
					bind:value={draft}
					disabled={busy}
					aria-label={mode === 'edit' ? 'Modifica il commento' : 'Rispondi al commento'}></textarea>
				<div class="flex justify-end gap-2">
					<button
						type="button"
						class="text-primary cursor-pointer rounded-2xl p-2 text-sm"
						onclick={() => (mode = null)}
					>
						Annulla
					</button>
					<button
						type="submit"
						class="cursor-pointer rounded-2xl bg-blue-500 p-2 text-sm font-bold text-white disabled:opacity-50"
						disabled={busy || draft.trim() === ''}
					>
						{mode === 'edit' ? 'Salva' : 'Rispondi'}
					</button>
				</div>
			</form>
		{/if}

		{#if failure}
			<p class="mt-1 text-xs text-red-500">{failure}</p>
		{/if}

		<div class="mt-2 flex items-center gap-1">
			<button
				class="text-primary hover:bg-background-tertiary flex cursor-pointer items-center gap-1.5 rounded-full py-1 pr-2 pl-1 {isReply
					? 'text-xs'
					: 'text-sm'} font-medium transition-colors"
				aria-label="Like comment"
			>
				<IconThumbUpOutline class={isReply ? 'h-4 w-4' : 'h-6 w-6'} />

				{#if commentData.likeCount > 0}
					<span class="text-xs font-medium">{commentData.likeCount}</span>
				{/if}
			</button>

			<button
				class="text-primary hover:bg-background-tertiary cursor-pointer rounded-full p-1.5 transition-colors"
				aria-label="Dislike comment"
			>
				<IconThumbDownOutline class={isReply ? 'h-4 w-4' : 'h-6 w-6'} />
			</button>

			<!-- Senza un canale non si commenta: il bottone sparisce invece di
			     aprire un modulo che YouTube rifiuterebbe. -->
			{#if myChannelId && mode !== 'reply'}
				<button
					class="hover:bg-background-tertiary text-primary ml-2 cursor-pointer rounded-full px-3 py-1.5 {isReply
						? 'text-xs'
						: 'text-sm'} font-medium transition-colors"
					onclick={() => startWriting('reply')}
				>
					Rispondi
				</button>
			{/if}

			{#if isMine && mode !== 'edit'}
				<button
					class="hover:bg-background-tertiary text-secondary cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
					onclick={() => startWriting('edit')}
				>
					Modifica
				</button>

				{#if confirmingDelete}
					<!-- Conferma in linea invece di un confirm() del browser: due
					     bottoni sono meno codice di una finestra modale e non
					     bloccano la pagina. -->
					<span class="text-secondary text-xs">Eliminare?</span>
					<button
						class="cursor-pointer rounded-full px-2 py-1.5 text-xs font-bold text-red-500 disabled:opacity-50"
						disabled={actions.removing}
						onclick={() => actions.remove(commentData.id)}
					>
						Sì
					</button>
					<button
						class="text-secondary cursor-pointer rounded-full px-2 py-1.5 text-xs"
						onclick={() => (confirmingDelete = false)}
					>
						No
					</button>
				{:else}
					<button
						class="hover:bg-background-tertiary text-secondary cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
						onclick={() => (confirmingDelete = true)}
					>
						Elimina
					</button>
				{/if}
			{/if}
		</div>
	</div>
</div>
