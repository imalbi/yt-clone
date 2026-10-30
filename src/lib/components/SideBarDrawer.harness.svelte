<script lang="ts">
	import { Dialog } from 'bits-ui';
	import SideBarDrawer from './SideBarDrawer.svelte';
	import TopBar from './topBar.svelte';
</script>

<Dialog.Root>
	<TopBar showMenuButton={true} user={null} />
	<SideBarDrawer />
</Dialog.Root>
