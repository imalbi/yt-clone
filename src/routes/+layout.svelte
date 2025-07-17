<script lang="ts">
	import '../app.css';
	import TopBar from '$lib/components/topBar.svelte';
	import SideBar from '$lib/components/sideBar.svelte';
	import SideBarOverlay from '$lib/components/sideBarOverlay.svelte';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	let isMenuOpen = $state(false);

	let inputSearch = $state('');

	function handleToggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
	let { children } = $props();

	let isMobile = $state(false);

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
<div class="flex flex-row">
	{#if page.url.pathname.startsWith('/video/')}
		<!-- No sidebar for video pages -->
	{:else if isMobile}
		<!-- No sidebar for search on mobile -->
	{:else}
		<aside><SideBar></SideBar></aside>
	{/if}
	{@render children()}
</div>

<SideBarOverlay isOpen={isMenuOpen} close={handleToggleMenu}></SideBarOverlay>
