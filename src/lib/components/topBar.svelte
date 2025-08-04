<script lang="ts">
	import avatar from '$lib/assets/avatar.webp';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	let { onToggle, inputSearch } = $props();
	import { isLogged, userStore } from '$lib/stores/userStore';
	let user = {
		img: avatar
	};
	let showOnlySearch = $state(false);
	let isMobile = $state(false);
	let showProfile = $state(false);

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
		}
	}

	let timeout: ReturnType<typeof setTimeout>;
	function debounceSearch() {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			doSearch();
		}, 500);
	}

	function doSearch() {
		if (inputSearch) {
			goto(`/search/${inputSearch}`);
		}
	}

	function onsubmit(event: SubmitEvent) {
		event.preventDefault();
		doSearch();
	}
</script>

<nav
	class="bg-background text-primary fixed top-0 z-50 flex w-full items-center justify-between p-3 shadow-md"
>
	<!-- Mobile search button -->
	{#if showOnlySearch}
		<div class="flex w-full items-center">
			<button
				class="border-border-color hover:bg-background-secondary h-10 cursor-pointer rounded-l-full border border-r-0 px-4"
				aria-label="Chiudi"
				onclick={() => (showOnlySearch = false)}
			>
				←
			</button>
			<form class="flex-1" {onsubmit}>
				<input
					type="text"
					bind:value={inputSearch}
					oninput={debounceSearch}
					class="border-border-color bg-background-secondary text-primary h-10 w-full rounded-r-full border px-4"
					placeholder="Cerca"
				/>
			</form>
		</div>
	{:else}
		<!-- End of mobile search button -->
		<!-- Container for menu button, youtube logo(refers homepage) -->
		<div class="flex flex-shrink-0 items-center justify-between gap-3 md:whitespace-nowrap">
			<!-- Menu button -->
			<button id="button" aria-label="Menu" onclick={onToggle} class="cursor-pointer">
				<div class="hover:bg-background-secondary h-12 w-12 rounded-full p-2.5">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="24"
						viewBox="0 0 24 24"
						width="24"
						focusable="false"
						aria-hidden="true"
						style="pointer-events: none; display: inherit; width: 100%; height: 100%; fill: currentColor;"
						class="hover:fill-black"
					>
						<path d="M21 6H3V5h18v1zm0 5H3v1h18v-1zm0 6H3v1h18v-1z"></path>
					</svg>
				</div>
			</button>
			<!-- YouTube logo -->
			<a href="/" class="flex-shrink-0" aria-label="YouTube homepage">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					id="yt-ringo2-svg_yt10"
					width="110"
					height="25"
					viewBox="0 0 93 20"
					focusable="false"
					aria-hidden="true"
					class="cursor-pointer"
					style=" display: inherit; width: 100%; height: 100%; fill: currentColor"
				>
					<g>
						<path
							d="M14.4848 20C14.4848 20 23.5695 20 25.8229 19.4C27.0917 19.06 28.0459 18.08 28.3808 16.87C29 14.65 29 9.98 29 9.98C29 9.98 29 5.34 28.3808 3.14C28.0459 1.9 27.0917 0.94 25.8229 0.61C23.5695 0 14.4848 0 14.4848 0C14.4848 0 5.42037 0 3.17711 0.61C1.9286 0.94 0.954148 1.9 0.59888 3.14C0 5.34 0 9.98 0 9.98C0 9.98 0 14.65 0.59888 16.87C0.954148 18.08 1.9286 19.06 3.17711 19.4C5.42037 20 14.4848 20 14.4848 20Z"
							fill="#FF0033"
						></path>
						<path d="M19 10L11.5 5.75V14.25L19 10Z" fill="white"></path>
					</g>
					<g id="youtube-paths_yt10">
						<path
							d="M37.1384 18.8999V13.4399L40.6084 2.09994H38.0184L36.6984 7.24994C36.3984 8.42994 36.1284 9.65994 35.9284 10.7999H35.7684C35.6584 9.79994 35.3384 8.48994 35.0184 7.22994L33.7384 2.09994H31.1484L34.5684 13.4399V18.8999H37.1384Z"
						></path>
						<path
							d="M44.1003 6.29994C41.0703 6.29994 40.0303 8.04994 40.0303 11.8199V13.6099C40.0303 16.9899 40.6803 19.1099 44.0403 19.1099C47.3503 19.1099 48.0603 17.0899 48.0603 13.6099V11.8199C48.0603 8.44994 47.3803 6.29994 44.1003 6.29994ZM45.3903 14.7199C45.3903 16.3599 45.1003 17.3899 44.0503 17.3899C43.0203 17.3899 42.7303 16.3499 42.7303 14.7199V10.6799C42.7303 9.27994 42.9303 8.02994 44.0503 8.02994C45.2303 8.02994 45.3903 9.34994 45.3903 10.6799V14.7199Z"
						></path>
						<path
							d="M52.2713 19.0899C53.7313 19.0899 54.6413 18.4799 55.3913 17.3799H55.5013L55.6113 18.8999H57.6012V6.53994H54.9613V16.4699C54.6812 16.9599 54.0312 17.3199 53.4212 17.3199C52.6512 17.3199 52.4113 16.7099 52.4113 15.6899V6.53994H49.7812V15.8099C49.7812 17.8199 50.3613 19.0899 52.2713 19.0899Z"
						></path>
						<path
							d="M62.8261 18.8999V4.14994H65.8661V2.09994H57.1761V4.14994H60.2161V18.8999H62.8261Z"
						></path>
						<path
							d="M67.8728 19.0899C69.3328 19.0899 70.2428 18.4799 70.9928 17.3799H71.1028L71.2128 18.8999H73.2028V6.53994H70.5628V16.4699C70.2828 16.9599 69.6328 17.3199 69.0228 17.3199C68.2528 17.3199 68.0128 16.7099 68.0128 15.6899V6.53994H65.3828V15.8099C65.3828 17.8199 65.9628 19.0899 67.8728 19.0899Z"
						></path>
						<path
							d="M80.6744 6.26994C79.3944 6.26994 78.4744 6.82994 77.8644 7.73994H77.7344C77.8144 6.53994 77.8744 5.51994 77.8744 4.70994V1.43994H75.3244L75.3144 12.1799L75.3244 18.8999H77.5444L77.7344 17.6999H77.8044C78.3944 18.5099 79.3044 19.0199 80.5144 19.0199C82.5244 19.0199 83.3844 17.2899 83.3844 13.6099V11.6999C83.3844 8.25994 82.9944 6.26994 80.6744 6.26994ZM80.7644 13.6099C80.7644 15.9099 80.4244 17.2799 79.3544 17.2799C78.8544 17.2799 78.1644 17.0399 77.8544 16.5899V9.23994C78.1244 8.53994 78.7244 8.02994 79.3944 8.02994C80.4744 8.02994 80.7644 9.33994 80.7644 11.7299V13.6099Z"
						></path>
						<path
							d="M92.6517 11.4999C92.6517 8.51994 92.3517 6.30994 88.9217 6.30994C85.6917 6.30994 84.9717 8.45994 84.9717 11.6199V13.7899C84.9717 16.8699 85.6317 19.1099 88.8417 19.1099C91.3817 19.1099 92.6917 17.8399 92.5417 15.3799L90.2917 15.2599C90.2617 16.7799 89.9117 17.3999 88.9017 17.3999C87.6317 17.3999 87.5717 16.1899 87.5717 14.3899V13.5499H92.6517V11.4999ZM88.8617 7.96994C90.0817 7.96994 90.1717 9.11994 90.1717 11.0699V12.0799H87.5717V11.0699C87.5717 9.13994 87.6517 7.96994 88.8617 7.96994Z"
						></path>
					</g>
				</svg>
			</a>
		</div>

		<!-- Search bar -->
		<div class="order-2 flex flex-shrink-0 items-center">
			<form class="flex" {onsubmit}>
				<input
					bind:value={inputSearch}
					oninput={debounceSearch}
					class="border-border-color bg-background text-primary hidden h-10 w-[25vw] rounded-l-3xl border px-4 md:block"
					type="text"
					placeholder="Cerca"
				/>
				<button
					type="submit"
					class="border-border-color bg-background-secondary h-10 cursor-pointer rounded-full border p-2 md:rounded-l-none md:rounded-r-full"
					onclick={showSearch}
					aria-label="Cerca"
				>
					<svg
						class="w-6 p-1"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
						aria-hidden="true"
					>
						<circle cx="11" cy="11" r="7" />
						<line x1="16.65" y1="16.65" x2="21" y2="21" />
					</svg>
				</button>
			</form>
		</div>

		<!--Container for buttons: add new video button, notifications, avatar-->
		<div class="order-3 mr-1 flex flex-shrink-0 items-center gap-1">
			<!--add new video button-->
			{#if $isLogged}
				<button
					class="bg-background-secondary hover:bg-background-tertiary flex h-10 cursor-pointer items-center rounded-3xl p-2 pr-4 font-semibold"
				>
					<svg
						class="h-6 w-6"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<line x1="12" y1="8" x2="12" y2="16" class="stroke-current" />
						<line x1="8" y1="12" x2="16" y2="12" class="stroke-current" />
					</svg>
					Crea
				</button>

				<!-- Notifiche -->
				<button
					class="bg-background hover:bg-background-secondary hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full md:flex"
					aria-label="Notifiche"
				>
					<svg
						class="h-6 w-6"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<path
							class="stroke-current"
							d="M18 16v-5a6 6 0 10-12 0v5a2 2 0 01-2 2h16a2 2 0 01-2-2z"
						/>
						<path class="stroke-current" d="M13.73 21a2 2 0 01-3.46 0" />
					</svg>
				</button>
				<!-- Avatar -->
				<button
					class="h-10 w-10 cursor-pointer rounded-full"
					onclick={() => (showProfile = !showProfile)}
					aria-label="Profilo Utente"
				>
					<img class="rounded-full" src={$userStore?.picture} alt="Profile" />
				</button>
			{:else}
				<!-- Login button -->
				<button
					class="bg-background-secondary hover:bg-background-tertiary flex h-10 cursor-pointer items-center rounded-3xl p-2 pr-4 font-semibold"
					onclick={() => goto('/api/auth/login')}
				>
					<svg
						class="h-6 w-6"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						aria-hidden="true"
					>
						<circle cx="12" cy="8" r="4" />
						<path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
					</svg>
					<span class="ml-2">Accedi</span>
				</button>
			{/if}
		</div>
	{/if}
</nav>
{#if showProfile}
	<div
		class="bg-background-secondary text-primary fixed top-0 right-0 z-50 mt-16 w-64 transform rounded-lg p-4"
		role="dialog"
		aria-modal="true"
		tabindex="0"
		onkeydown={(e) => e.key === 'Escape' && (showProfile = false)}
	>
		<!-- Overlay per click fuori -->
		<button
			type="button"
			class="fixed inset-0 z-40"
			style="background: transparent;"
			aria-label="Chiudi profilo"
			tabindex="0"
			onclick={() => (showProfile = false)}
			onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (showProfile = false)}
		></button>
		<ul class="relative z-50">
			<li><a href="/profile">Il tuo profilo</a></li>
			<li><a href="/settings">Impostazioni</a></li>
			<li>
				<form method="post" action="/api/auth/logout">
					<button type="submit" class="w-full text-left">Esci</button>
				</form>
			</li>
		</ul>
	</div>
{/if}
