<script lang="ts">
	import '../app.css';
	import TopBar from '#lib/components/topBar.svelte';
	import SideBar from '#lib/components/sideBar.svelte';
	import BottomBar from '#lib/components/bottomBar.svelte';
	import SideBarDrawer from '#lib/components/SideBarDrawer.svelte';
	import { page } from '$app/state';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { Dialog } from 'bits-ui';

	let { data, children } = $props();
	let isHomepage = $derived(page.url.pathname === '/');
</script>

<QueryClientProvider client={data.queryClient}>
	<Dialog.Root>
		<TopBar user={data.user} showMenuButton={!isHomepage} />
		<div class="flex min-h-screen flex-row pt-16">
			{#if isHomepage}
				<aside class="hidden w-20 shrink-0 md:block">
					<SideBar />
				</aside>
			{/if}
			<div class="min-w-0 flex-1 pb-16 md:pb-6">
				{@render children()}
			</div>
			<BottomBar />
		</div>
		{#if !isHomepage}
			<SideBarDrawer />
		{/if}
	</Dialog.Root>
</QueryClientProvider>
