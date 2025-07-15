<script lang="ts">
	import burger from '$lib/assets/burger.svg';
	import avatar from '$lib/assets/avatar.webp';
	import ytlogo from '$lib/assets/ytlogo.svg';
	import search from '$lib/assets/search.svg';
	import add from '$lib/assets/add.svg';
	import bell from '$lib/assets/bell.svg';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	let { onToggle, inputSearch } = $props();
	let user = {
		img: avatar
	};
	let showOnlySearch = $state(false);
	let isMobile = $state(false);
	//If not logged 3dots and login, no mic too

	onMount(() => {
		if (typeof window !== 'undefined') {
			isMobile = window.innerWidth < 768;
			function updateIsMobile() {
				isMobile = window.innerWidth < 768;
			}
			window.addEventListener('resize', updateIsMobile);
			return () => window.removeEventListener('resize', updateIsMobile);
		}
	});

	function showSearch() {
		if (isMobile) {
			showOnlySearch = true;
		} else {
			console.log('Not on mobile');
		}
	}

	function onsubmit(event: SubmitEvent) {
		event.preventDefault();
		if (inputSearch) {
			console.log({ inputSearch });
			goto(`/search/${inputSearch}`);
		}
	}
</script>

<nav class="mt-2 flex w-full items-center justify-between bg-white">
	{#if showOnlySearch}
		<div class="flex w-full items-center">
			<button
				class="h-10 cursor-pointer rounded-l-full border border-r-0 border-gray-300 px-4 hover:bg-gray-100"
				aria-label="Chiudi"
				onclick={() => (showOnlySearch = false)}
			>
				←
			</button>
			<form class="flex-1" {onsubmit}>
				<input
					type="text"
					bind:value={inputSearch}
					class="h-10 w-full rounded-r-full border border-gray-300 px-4"
					placeholder="Cerca"
				/>
			</form>
		</div>
	{:else}
		<div class="ml-1 flex flex-shrink-0 items-center md:whitespace-nowrap">
			<button
				class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-gray-200"
				onclick={onToggle}
			>
				<img src={burger} alt="Menu" class="h-6 w-6" />
			</button>
			<a href="/"><img class="h-8" src={ytlogo} alt="Home" /></a>
		</div>

		<div class="order-2 flex flex-shrink-0 items-center">
			<form class="flex" {onsubmit}>
				<input
					bind:value={inputSearch}
					class="hidden h-10 w-[25vw] rounded-l-3xl border border-gray-100 md:block"
					type="text"
					placeholder="Cerca"
				/>
				<button
					type="submit"
					class="bg-#F0F0F0 md:borderl-l-0 h-10 cursor-pointer rounded-full border border-gray-100 p-2
        hover:bg-gray-200 md:rounded-l-none md:rounded-r-full"
					onclick={showSearch}><img class="w-6 p-1" src={search} alt="Cerca Bottone" /></button
				>
			</form>
		</div>

		<div class="order-3 mr-1 flex flex-shrink-0 items-center gap-1">
			<button class="flex h-10 cursor-pointer items-center rounded-3xl hover:bg-gray-200"
				><img class="h-9" src={add} alt="" />Crea</button
			>
			<button class="h-10 w-10 cursor-pointer rounded-full hover:bg-gray-200"
				><img class="p-2" src={bell} alt="" /></button
			>
			<button class="h-10 w-10 cursor-pointer rounded-full"
				><img class="rounded-full" src={user.img} alt="" /></button
			>
		</div>
	{/if}
</nav>

<style>
</style>
