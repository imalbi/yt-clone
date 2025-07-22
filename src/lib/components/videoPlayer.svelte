<script lang="ts">
	import DescriptionBox from './DescriptionBox.svelte';
	import SkeletonPlayer from './SkeletonPlayer.svelte';
	import { formatSubscriberCount } from '$lib/scripts/scripts';
	let { video } = $props();

	//FORMAT DATA
	function formatData(dataIn: string) {
		const dataPubblicazione = new Date(dataIn);

		const opzioniDiFormattazione = {
			day: '2-digit' as const,
			month: 'short' as const,
			year: 'numeric' as const
		};
		const formattatore = new Intl.DateTimeFormat('it-IT', opzioniDiFormattazione);
		const stringaFormattata = formattatore.format(dataPubblicazione);
		return stringaFormattata;
	}
</script>

{#await video}
	<SkeletonPlayer />
{:then video}
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
					alt="Channel Avatar"
				/>
				<div class="flex flex-col">
					<h2 class="font-bold">{video.channelTitle}</h2>
					<p class="text-secondary font-light">
						{formatSubscriberCount('1233456789')} di iscritti
					</p>
				</div>
				<button
					class="bg-background-secondary ml-2 h-fit cursor-pointer rounded-3xl px-4 py-2 align-middle font-semibold text-white"
					>Iscriviti</button
				>
			</div>

			<div class="mr-10 flex h-12">
				<button
					class="bg-background-secondary hover:bg-background-tertiary text-primary flex h-full cursor-pointer items-center gap-2 rounded-l-full px-4"
				>
					<svg
						class="h-6 w-6"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
					>
						<path
							d="M2 21h4V9H2v12zM22 9c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L13 1 6.59 7.41C6.22 7.78 6 8.3 6 8.83V19c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1z"
							class="text-primary"
						/>
					</svg>
					<span class="text-primary text-center font-semibold text-nowrap"
						>{formatSubscriberCount(
							video.statistics.likeCount ? video.statistics.likeCount : '0'
						)}</span
					>
				</button>
				<button
					class="bg-background-secondary text-primary hover:bg-background-tertiary flex h-full cursor-pointer items-center rounded-r-full px-4"
					aria-label="dislike"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						class="h-6 w-6"
						fill="currentColor"
					>
						<path
							d="M17 4H6.57c-1.07 0-1.98.67-2.19 1.61l-1.34 6C2.77 12.85 3.82 14 5.23 14h4.23l-1.52 4.94C7.62 19.97 8.46 21 9.62 21c.58 0 1.14-.24 1.52-.65L17 14h4V4h-4zm-6.6 15.67c-.19.21-.48.33-.78.33-.26 0-.5-.11-.63-.3-.07-.1-.15-.26-.09-.47l1.52-4.94.4-1.29H5.23c-.41 0-.8-.17-1.03-.46-.12-.15-.25-.4-.18-.72l1.34-6c.1-.47.61-.82 1.21-.82H16v8.61l-5.6 6.06zM20 13h-3V5h3v8z"
						></path>
					</svg>
				</button>

				<button
					class="bg-background-secondary text-primary hover:bg-background-tertiary ml-3 flex cursor-pointer items-center gap-2 rounded-full px-3 py-1 font-semibold"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						class="h-6 w-6"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<circle cx="18" cy="5" r="3"></circle>
						<circle cx="6" cy="12" r="3"></circle>
						<circle cx="18" cy="19" r="3"></circle>
						<line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
						<line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
					</svg>
					Condividi
				</button>
				<button
					class="bg-background-secondary hover:bg-background-tertiary text-primary ml-3 flex cursor-pointer items-center gap-2 rounded-full px-3 py-1 font-semibold text-nowrap"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="h-6 w-6"
					>
						<path
							d="M12 16V4m0 12l-4-4m4 4l4-4M4 20h16"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							fill="none"
						/>
					</svg>
					Scarica
				</button>
				<button
					class="text-primary bg-background-secondary hover:bg-background-tertiary ml-3 hidden size-12 cursor-pointer rounded-full pb-4 text-2xl font-bold md:block"
				>
					...
				</button>
			</div>
		</div>
		<div class="text-primary bg-background-secondary cursor-pointer rounded-2xl p-3">
			<h3 class="text-sm font-semibold">
				{formatSubscriberCount(video.statistics.viewCount)} visualizzazioni {formatData(
					video.publishedAt
				)}
			</h3>
			<DescriptionBox description={video.desc}></DescriptionBox>
		</div>
	</div>
{:catch error}
	<p>Errore nel caricamento del video: {error?.message ?? error}</p>
{/await}
