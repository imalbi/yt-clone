<script lang="ts">
	import { queryKeys } from '#lib/queries.js';
	import { formatData, formatSubscriberCount } from '#lib/scripts/scripts.js';
	import { subscriptionState } from '#lib/subscription.svelte.js';
	import type { Video } from '#lib/types/video.js';
	import type { User } from '#lib/types/user.js';
	import { likeStatus, rateVideo } from '#lib/youtube.remote.js';
	import { resolve } from '$app/paths';
	import { useQueryClient } from '@tanstack/svelte-query';
	import IconShareVariant from '~icons/mdi/share-variant';
	import IconThumbDown from '~icons/mdi/thumb-down';
	import IconThumbDownOutline from '~icons/mdi/thumb-down-outline';
	import IconThumbUp from '~icons/mdi/thumb-up';
	import IconThumbUpOutline from '~icons/mdi/thumb-up-outline';
	import IconCheck from '~icons/mdi/check';
	import DescriptionBox from './DescriptionBox.svelte';

	// `video` e' null finche' il `load` non risolve, e null se il video non esiste.
	let { video, user }: { video: Video | null; user: User } = $props();

	let copied = $state(false);

	async function handleShare() {
		if (typeof window === 'undefined') return;
		const shareUrl = window.location.href;
		if (navigator.share) {
			try {
				await navigator.share({
					title: video?.title ?? 'Video',
					url: shareUrl
				});
				return;
			} catch {
				// User cancelled or share failed, fallback to clipboard
			}
		}
		if (navigator.clipboard) {
			try {
				await navigator.clipboard.writeText(shareUrl);
				copied = true;
				setTimeout(() => {
					copied = false;
				}, 2000);
			} catch (err) {
				console.error('Clipboard write failed:', err);
			}
		}
	}

	const client = useQueryClient();

	// Stessa query key di ChannelHeader: montati insieme fanno una richiesta sola.
	const subscription = subscriptionState(
		() => video?.channelId ?? '',
		() => !!user
	);

	// Le mutation partono solo da un click sui bottoni, che esistono solo dentro
	// il ramo in cui `video` c'e': l'id si legge da qui una volta sola.
	const videoId = $derived(video?.id ?? '');

	const like = $derived(user && videoId ? likeStatus(videoId) : undefined);
	const videoLiked = $derived(like?.current?.videoLiked ?? null);

	async function handleRating(target: 'like' | 'dislike') {
		if (!user) {
			// L'endpoint risponde con un 302 verso Google: serve una navigazione
			// del browser, non il router. `goto` in SvelteKit 3 rifiuta le
			// destinazioni che non sono pagine dell'app.
			window.location.href = resolve('api/auth/login');
			return;
		}
		if (!like) return;

		const already = target === 'like' ? videoLiked === true : videoLiked === false;
		const rating = already ? 'none' : target;

		// L'override e' l'aggiornamento ottimistico; il valore vero torna con la
		// risposta del comando, che rinfresca la lettura lato server.
		try {
			await rateVideo({ videoId, rating }).updates(
				like.withOverride(() => ({
					videoLiked: rating === 'like' ? true : rating === 'dislike' ? false : null
				}))
			);
		} catch (cause) {
			// Se il comando fallisce l'override viene scartato da se' e il pollice
			// torna com'era. Non c'e' dove mostrare l'errore, come non c'era prima
			// con `rate.error`: qui serve solo a non lasciarlo non gestito.
			console.error('Valutazione fallita:', cause);
			return;
		}

		// Un like cambia la playlist "Liked", che vive sotto un'altra chiave ed e'
		// paginata, quindi resta su TanStack.
		client.invalidateQueries({ queryKey: queryKeys.likedVideos() });
	}
</script>

<!-- Il genitore ha gia' atteso la promise, quindi qui `video` e' un valore:
     l'{#await} che c'era prima era inerte e il suo {:catch} irraggiungibile.
     Serve invece la guardia sul null, che getVideoById restituisce per un
     video inesistente e che nessuno controllava. -->
{#if video}
	{@const src = `https://www.youtube.com/embed/${video.id}`}
	<div class="flex w-full flex-col gap-2">
		<iframe
			class="aspect-video rounded-2xl"
			id="ytplayer"
			title="Video"
			{src}
			frameborder="0"
			allowfullscreen
		></iframe>

		<h1 class="text-primary text-xl font-bold">{video.title}</h1>
		<div class="text-primary flex flex-col justify-between md:flex-row">
			<div class="mt-2 flex flex-row gap-2">
				<img
					loading="lazy"
					class="size-14 rounded-full contain-content"
					src={video.avatarUrl}
					referrerpolicy="no-referrer"
					alt="Channel Avatar"
				/>
				<div class="flex flex-col">
					<a
						href={resolve('/channel/[channelId]', { channelId: video.channelId })}
						class="text-primary font-semibold hover:underline"
					>
						<h2 class="font-bold">{video.channelTitle}</h2>
					</a>
					{#if video.channelSubscriberCount && !video.channelSubscriberCountHidden}
						<p class="text-secondary font-light">
							{formatSubscriberCount(video.channelSubscriberCount)} di iscritti
						</p>
					{/if}
				</div>
				{#if user}
					<button
						class="text-background ml-2 h-fit cursor-pointer rounded-3xl px-4 py-2 align-middle font-semibold {subscription.isSubscribed
							? 'bg-background-secondary text-primary'
							: 'bg-primary'}"
						onclick={subscription.toggle}
					>
						{subscription.isSubscribed ? 'Iscritto' : 'Iscriviti'}
					</button>
				{:else}
					<button
						class="bg-background-secondary text-primary rounded-full px-4 py-2 font-bold"
						onclick={() => (window.location.href = '/api/auth/login')}>Subscribe</button
					>
				{/if}
			</div>

			<div class="mr-10 flex h-12">
				<button
					class="bg-background-secondary hover:bg-background-tertiary text-primary flex h-full cursor-pointer items-center gap-2 rounded-l-full px-4 {videoLiked ===
					true
						? 'bg-background-tertiary!'
						: ''}"
					aria-label="like"
					aria-pressed={videoLiked === true}
					onclick={() => handleRating('like')}
					disabled={rateVideo.pending > 0}
				>
					{#if videoLiked === true}
						<IconThumbUp class="text-primary h-6 w-6" data-icon-variant="filled" />
					{:else}
						<IconThumbUpOutline class="text-primary h-6 w-6" data-icon-variant="outline" />
					{/if}
					<span class="text-primary text-center font-semibold text-nowrap">
						{formatSubscriberCount(video.statistics.likeCount ? video.statistics.likeCount : '0')}
					</span>
				</button>
				<button
					class="bg-background-secondary text-primary hover:bg-background-tertiary flex h-full cursor-pointer items-center rounded-r-full px-4 {videoLiked ===
					false
						? 'bg-background-tertiary!'
						: ''}"
					aria-label="dislike"
					aria-pressed={videoLiked === false}
					onclick={() => handleRating('dislike')}
					disabled={rateVideo.pending > 0}
				>
					{#if videoLiked === false}
						<IconThumbDown class="text-primary h-6 w-6" data-icon-variant="filled" />
					{:else}
						<IconThumbDownOutline class="text-primary h-6 w-6" data-icon-variant="outline" />
					{/if}
				</button>

				<button
					class="bg-background-secondary hover:bg-background-tertiary text-primary ml-3 flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 font-medium transition-colors"
					onclick={handleShare}
					aria-label="Condividi video"
				>
					{#if copied}
						<IconCheck class="h-5 w-5 text-green-500" />
						<span class="text-sm text-green-500">Copiato!</span>
					{:else}
						<IconShareVariant class="h-5 w-5" />
						<span class="text-sm">Condividi</span>
					{/if}
				</button>
			</div>
		</div>

		<div class="text-primary bg-background-secondary cursor-pointer rounded-2xl p-3">
			<h3 class="text-sm font-semibold">
				{formatSubscriberCount(video.statistics.viewCount)} visualizzazioni {formatData(
					video.publishedAt
				)}
			</h3>
			<DescriptionBox description={video.desc} />
		</div>
	</div>
{:else}
	<p class="text-secondary p-4">Questo video non è disponibile.</p>
{/if}
