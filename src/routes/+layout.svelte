<script lang="ts">
	import "../app.css";
	import { playstate, debug_local_server } from "$lib/store";

	function playButtonMessage(state: string) {
		switch (state) {
			case "hosting":
				return "Invite Friends!";
			case "playing":
				return "Return to Game";
			default:
				return "Play Chess!";
		}
	}

	let openMenu = false;
	function toggleMenu() {
		openMenu = !openMenu;
	}
</script>

<div class="mx-auto max-w-7xl px-4 sm:px-6">
	<div
		class="flex items-center justify-between border-b-2 border-gray-100 py-6 lg:justify-start lg:space-x-10">
		<div class="flex justify-start lg:w-0 lg:flex-1">
			<a href="/">
				<span class="sr-only">PawnHub</span>
				<img
					class="h-8 w-auto sm:h-10"
					src="https://external-preview.redd.it/PDqfeEIy4aeJCOxEaKB4uDkEGV5dJz0B7FRRMr9eWak.jpg?auto=webp&s=758172d589bdf5e01c047b66d436d75837592dce"
					alt="" />
			</a>
		</div>

		<nav class="hidden space-x-10 lg:flex">
			<a href="/" class="text-base font-medium text-gray-500 hover:text-gray-900">The Project</a>
			<a href="/team" class="text-base font-medium text-gray-500 hover:text-gray-900"
				>Meet the Team</a>
			<a href="/research" class="text-base font-medium text-gray-500 hover:text-gray-900"
				>Research</a>
			<a href="/art" class="text-base font-medium text-gray-500 hover:text-gray-900"
				>Connecting Cultures</a>

			<div class="relative" />
		</nav>

		<div class="flex flex-1 items-center justify-center lg:w-0 lg:justify-end">
			<a
				href="/play"
				class="button-secondary lg:button-primary {$debug_local_server ? 'bg-orange-600' : ''}"
				>{playButtonMessage($playstate)}</a>
		</div>

		<!-- Mobile menu -->

		<div class="-my-2 -mr-2 lg:hidden">
			<button
				on:click={toggleMenu}
				type="button"
				class="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
				aria-expanded="false">
				<span class="sr-only">Open menu</span>
				<!-- Heroicon name: outline/bars-3 -->
				<svg
					class="h-6 w-6"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					aria-hidden="true">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
				</svg>
			</button>
		</div>

		{#if openMenu}
			<div
				class="absolute inset-x-0 top-20 z-20 origin-top-right transform p-2 transition md:hidden">
				<div class="rounded-lg bg-white p-6 pt-3 shadow-md">
					<div class="">
						<nav class="flex flex-col justify-center gap-6">
							<a
								href="/"
								class="-m-3 rounded-md p-3 text-center text-base font-medium text-gray-900 hover:bg-gray-50">
								The Project
							</a>
							<a
								href="/team"
								class="-m-3 rounded-md p-3 text-center text-base font-medium text-gray-900 hover:bg-gray-50">
								Meet the Team
							</a>
							<a
								href="/research"
								class="-m-3 rounded-md p-3 text-center text-base font-medium text-gray-900 hover:bg-gray-50">
								Research
							</a>
							<a
								href="/art"
								class="-m-3 rounded-md p-3 text-center text-base font-medium text-gray-900 hover:bg-gray-50">
								Connecting Cultures
							</a>
						</nav>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<slot />
</div>
