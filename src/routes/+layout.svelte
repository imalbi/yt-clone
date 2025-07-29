<script lang="ts">
	import '../app.css';
	import TopBar from '$lib/components/topBar.svelte';
	import SideBar from '$lib/components/sideBar.svelte';
	import SideBarOverlay from '$lib/components/sideBarOverlay.svelte';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { userStore } from '$lib/stores/userStore';

	let { data, children } = $props();
	let isMenuOpen = $state(false);

	let inputSearch = $state('');

	function handleToggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	let isMobile = $state(false);
	$effect(() => {
		// Aggiorna lo stato dell'input di ricerca quando cambia il percorso della pagina
		$userStore = data.user;
	});

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
</script>

<TopBar onToggle={handleToggleMenu} {inputSearch} />
<div class="flex flex-row pt-16">
	{#if page.url.pathname.startsWith('/video/')}
		<!-- No sidebar for video pages -->
		{@render children()}
	{:else if isMobile}
		<!-- No sidebar for search on mobile -->
		{@render children()}
	{:else}
		<!-- Sidebar placeholder + fixed sidebar -->
		<aside class="w-20 flex-shrink-0"><SideBar></SideBar></aside>
		<main class="flex-1">{@render children()}</main>
	{/if}
</div>

<SideBarOverlay isOpen={isMenuOpen} close={handleToggleMenu}></SideBarOverlay>
