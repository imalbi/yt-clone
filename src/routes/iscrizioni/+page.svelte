<script>
	let { data } = $props();
	import { formatSubscriberCount, randomInt } from '$lib/scripts/scripts';

	// Browser-compatible random integer function
</script>

<main class="text-primary bg-background p-4 px-6">
	<h1 class=" mb-2 text-4xl font-bold">Tutte le iscrizioni</h1>

	<ul>
		{#each data.users as user (user.id)}
			<li class="flex flex-row justify-between gap-2 p-4">
				<a href={`/user/${user.username}`} class="flex flex-row gap-2">
					<div class="flex flex-row gap-2">
						<img
							loading="lazy"
							class="size-30 rounded-full object-cover"
							src={user.image}
							alt="User Avatar"
						/>
						<div>
							<h2>{user.username}</h2>

							<p class="text-secondary font-light">
								@{user.username} - {formatSubscriberCount(randomInt(9000, 1000000).toString())} di iscritti
							</p>
							<p class="text-secondary font-light">
								Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam molestias illum
								similique quisquam suscipit sed autem nisi laudantium, explicabo qui, dolorum sit et
								eveniet. Repellat, illo? Esse deleniti illum accusamus.
							</p>
						</div>
					</div>
				</a>
				<div class=" hidden items-center justify-center md:flex">
					<button
						class="bg-background-secondary ml-2 h-fit cursor-pointer rounded-3xl px-4 py-2 align-middle font-semibold text-white"
						>Iscriviti</button
					>
				</div>
			</li>
		{/each}
	</ul>
</main>
