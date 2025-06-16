<script lang="ts">
	import TopBar from "$lib/components/topBar.svelte";
	import SideBar from "$lib/components/sideBar.svelte";
	import SideBarOverlay from "$lib/components/sideBarOverlay.svelte";
	import '../app.css';

	let isMenuOpen = $state(false);
	function handleToggleMenu(){
    isMenuOpen=!isMenuOpen;
}
	let { children } = $props();
</script>



<TopBar onToggle={handleToggleMenu}/>
<div class="flex flex-row">
    <aside class="w-30"><SideBar></SideBar></aside>
	<div class="pt-10">
		{@render children()}
	</div>
	
</div>
<aside>
</aside>
<SideBarOverlay isOpen={isMenuOpen} close={handleToggleMenu}></SideBarOverlay>

