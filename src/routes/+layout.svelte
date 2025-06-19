<script lang="ts">
	import TopBar from "$lib/components/topBar.svelte";
	import SideBar from "$lib/components/sideBar.svelte";
	import SideBarOverlay from "$lib/components/sideBarOverlay.svelte";
	import '../app.css';
	import { page } from "$app/state";

	let isMenuOpen = $state(false);

	let inputSearch = $state('');
	
	
	function handleToggleMenu(){
    isMenuOpen=!isMenuOpen;
}
	let { children } = $props();

	
	
</script>



<TopBar onToggle={handleToggleMenu} {inputSearch}/>
<div class="flex flex-row">
	{#if !page.url.pathname.startsWith("/video/")}
    <aside class="w-30"><SideBar></SideBar></aside>
	{/if}
		{@render children()}
	
</div>
<aside>
</aside>
<SideBarOverlay isOpen={isMenuOpen} close={handleToggleMenu}></SideBarOverlay>

