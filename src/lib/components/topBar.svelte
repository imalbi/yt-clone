<script lang="ts">
	import { resolve } from '$app/paths';
	import IconAccountCircleOutline from '~icons/mdi/account-circle-outline';
	import IconMagnify from '~icons/mdi/magnify';
	import IconLogout from '~icons/mdi/logout';
	import IconStarOutline from '~icons/mdi/star-outline';
	import IconPlaylistPlay from '~icons/mdi/playlist-play';
	import IconPlayBoxOutline from '~icons/mdi/play-box-outline';
	import YouTubeLogo from '#lib/components/YouTubeLogo.svelte';
	import { goto } from '$app/navigation';
	import { initialsAvatar, onAvatarError } from '#lib/avatar.js';
	import type { User } from '#lib/types/user.js';
	import { Dialog, DropdownMenu } from 'bits-ui';
	import IconMenu from '~icons/mdi/menu';

	let {
		inputSearch = '',
		user,
		showMenuButton = false
	}: {
		inputSearch?: string;
		user?: User;
		showMenuButton?: boolean;
	} = $props();

	let currentSearch = $derived(inputSearch);

	let showOnlySearchMobile = $state(false);

	function showSearch() {
		if (typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches) {
			showOnlySearchMobile = true;
		}
	}

	let timeout: ReturnType<typeof setTimeout>;
	function debounceSearch() {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			doSearch();
		}, 400);
	}

	function doSearch() {
		if (currentSearch.trim()) {
			goto(resolve('/search/[searchId]', { searchId: currentSearch.trim() }));
		}
	}

	function onsubmit(event: SubmitEvent) {
		event.preventDefault();
		doSearch();
	}
</script>

<header
	class="bg-background/90 text-primary border-border-color fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b px-4 backdrop-blur-md transition-colors"
>
	<!-- Mobile search mode -->
	{#if showOnlySearchMobile}
		<div class="flex w-full items-center gap-2">
			<button
				class="hover:bg-background-secondary text-secondary hover:text-primary flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors"
				aria-label="Chiudi ricerca"
				onclick={() => (showOnlySearchMobile = false)}
			>
				✕
			</button>

			<form class="flex-1" {onsubmit}>
				<input
					type="text"
					bind:value={currentSearch}
					oninput={debounceSearch}
					class="border-border-color bg-background-secondary text-primary focus:border-primary h-10 w-full rounded-full border px-4 text-sm transition-colors outline-none"
					placeholder="Cerca video o canali..."
				/>
			</form>
		</div>
	{:else}
		<!-- Brand / Logo -->
		<div class="flex items-center gap-3">
			{#if showMenuButton}
				<Dialog.Trigger
					class="hover:bg-background-secondary hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors md:flex"
					aria-label="Apri menu"
				>
					<IconMenu class="h-6 w-6" />
				</Dialog.Trigger>
			{/if}
			<a href={resolve('/')} class="flex items-center gap-2" aria-label="Home">
				<YouTubeLogo class="h-5 w-auto cursor-pointer" />
			</a>
		</div>

		<!-- Search bar (Desktop & Tablet) -->
		<div class="flex max-w-lg flex-1 items-center justify-center px-4">
			<form class="flex w-full max-w-md items-center" {onsubmit}>
				<div class="relative w-full">
					<input
						bind:value={currentSearch}
						oninput={debounceSearch}
						class="border-border-color bg-background-secondary/60 text-primary placeholder:text-secondary focus:border-primary focus:bg-background hidden h-10 w-full rounded-full border px-4 pr-10 text-sm transition-all outline-none md:block"
						type="text"
						placeholder="Cerca..."
					/>
				</div>

				<!-- Mobile search trigger icon -->
				<button
					type="button"
					class="hover:bg-background-secondary text-secondary hover:text-primary flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors md:hidden"
					onclick={showSearch}
					aria-label="Apri ricerca"
				>
					<IconMagnify class="h-5 w-5" />
				</button>
			</form>
		</div>

		<!-- Right actions / Auth -->
		<div class="flex items-center gap-2">
			{#if user}
				<DropdownMenu.Root>
					<DropdownMenu.Trigger
						class="ring-offset-background focus-visible:ring-primary flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full transition-transform hover:opacity-90 focus-visible:ring-2 focus-visible:outline-none"
						aria-label="Menu profilo"
					>
						<img
							class="h-full w-full object-cover"
							src={user.picture || initialsAvatar(user.name)}
							referrerpolicy="no-referrer"
							onerror={(event) => onAvatarError(event, initialsAvatar(user.name))}
							alt="Profilo di {user.name}"
						/>
					</DropdownMenu.Trigger>

					<DropdownMenu.Portal>
						<DropdownMenu.Content
							sideOffset={8}
							align="end"
							class="bg-background text-primary border-border-color z-50 min-w-[14rem] overflow-hidden rounded-2xl border p-1.5 shadow-xl backdrop-blur-lg"
						>
							<!-- User info header -->
							<div class="border-border-color border-b px-3 py-2.5">
								<p class="truncate text-sm font-semibold">{user.name}</p>
								<p class="text-secondary truncate text-xs">Account collegato</p>
							</div>

							<div class="py-1">
								<DropdownMenu.Item>
									{#snippet child({ props })}
										<a
											{...props}
											href={resolve('/playlist/liked')}
											class="hover:bg-background-secondary flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors"
										>
											<IconStarOutline class="text-secondary h-4 w-4" />
											<span>Video piaciuti</span>
										</a>
									{/snippet}
								</DropdownMenu.Item>

								<DropdownMenu.Item>
									{#snippet child({ props })}
										<a
											{...props}
											href={resolve('/playlist')}
											class="hover:bg-background-secondary flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors"
										>
											<IconPlaylistPlay class="text-secondary h-4 w-4" />
											<span>Le mie playlist</span>
										</a>
									{/snippet}
								</DropdownMenu.Item>

								<DropdownMenu.Item>
									{#snippet child({ props })}
										<a
											{...props}
											href={resolve('/iscrizioni')}
											class="hover:bg-background-secondary flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors"
										>
											<IconPlayBoxOutline class="text-secondary h-4 w-4" />
											<span>Iscrizioni</span>
										</a>
									{/snippet}
								</DropdownMenu.Item>
							</div>

							<div class="border-border-color border-t pt-1">
								<DropdownMenu.Item>
									{#snippet child({ props })}
										<form method="post" action="/api/auth/logout" class="w-full">
											<button
												{...props}
												type="submit"
												class="hover:bg-background-secondary text-primary flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-colors"
											>
												<IconLogout class="text-secondary h-4 w-4" />
												<span>Esci</span>
											</button>
										</form>
									{/snippet}
								</DropdownMenu.Item>
							</div>
						</DropdownMenu.Content>
					</DropdownMenu.Portal>
				</DropdownMenu.Root>
			{:else}
				<!-- Login button -->
				<a
					class="bg-background-secondary hover:bg-background-tertiary text-primary flex h-9 cursor-pointer items-center gap-2 rounded-full px-3.5 text-sm font-medium transition-colors"
					href={resolve('api/auth/login')}
				>
					<IconAccountCircleOutline class="h-4 w-4" />
					<span>Accedi</span>
				</a>
			{/if}
		</div>
	{/if}
</header>
