<script lang="ts">
	import "../app.css";
	import { playstate, debug_local_server, unread_move } from "$lib/store";
	import { goto } from "$app/navigation";

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
			<button
				on:click={() => {
					goto("/");
					openMenu = false;
				}}>
				<span class="sr-only">PawnHub</span>
				<img
					class="h-8 w-auto sm:h-10"
					src="https://external-preview.redd.it/PDqfeEIy4aeJCOxEaKB4uDkEGV5dJz0B7FRRMr9eWak.jpg?auto=webp&s=758172d589bdf5e01c047b66d436d75837592dce"
					alt="" />
			</button>
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

		<div class="flex flex-1 items-center justify-center lg:w lg:justify-end">
			<button
				href="/play"
				class="relative button-secondary lg:button-primary {$debug_local_server ? 'lg:bg-orange-600' : ''}"
				on:click={() => {
					goto("/play");
					openMenu = false;
				}}>
				{playButtonMessage($playstate)}
				{#if $unread_move}
					<div
						class="absolute -top-1.5 -right-1.5 inline-flex h-5 w-5 rounded-full border-2 border-white bg-red-500" />
				{/if}
		</div>

		<!-- Mobile menu -->

		<div class="-my-2 -mr-2 lg:hidden">
			<button
				on:click={toggleMenu}
				type="button"
				class="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
				aria-expanded="false">
				<span class="sr-only">Open menu</span>
				<svg
					class="h-6 w-6"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					aria-hidden="true"
					aria-labelledby="ariaMenuTitle">
					<title id="ariaMenuTitle">{!openMenu ? "Open Menu" : "Close Menu"}</title>
					{#if !openMenu}
						<path
							d="M9,11H5c-1.105,0-2-0.895-2-2V5c0-1.105,0.895-2,2-2h4c1.105,0,2,0.895,2,2v4C11,10.105,10.105,11,9,11z" /><path
							d="M19,11h-4c-1.105,0-2-0.895-2-2V5c0-1.105,0.895-2,2-2h4c1.105,0,2,0.895,2,2v4 C21,10.105,20.105,11,19,11z"
							opacity=".35" /><path
							d="M9,21H5c-1.105,0-2-0.895-2-2v-4c0-1.105,0.895-2,2-2h4c1.105,0,2,0.895,2,2v4 C11,20.105,10.105,21,9,21z"
							opacity=".35" /><path
							d="M19,21h-4c-1.105,0-2-0.895-2-2v-4c0-1.105,0.895-2,2-2h4c1.105,0,2,0.895,2,2v4C21,20.105,20.105,21,19,21z" />
					{:else}
						<path
							d="M18,21H6c-1.657,0-3-1.343-3-3V6c0-1.657,1.343-3,3-3h12c1.657,0,3,1.343,3,3v12	C21,19.657,19.657,21,18,21z"
							opacity=".35" /><path
							d="M14.812,16.215L7.785,9.188c-0.384-0.384-0.384-1.008,0-1.392l0.011-0.011c0.384-0.384,1.008-0.384,1.392,0l7.027,7.027	c0.384,0.384,0.384,1.008,0,1.392l-0.011,0.011C15.82,16.599,15.196,16.599,14.812,16.215z" /><path
							d="M7.785,14.812l7.027-7.027c0.384-0.384,1.008-0.384,1.392,0l0.011,0.011c0.384,0.384,0.384,1.008,0,1.392l-7.027,7.027	c-0.384,0.384-1.008,0.384-1.392,0l-0.011-0.011C7.401,15.82,7.401,15.196,7.785,14.812z" />
					{/if}
				</svg>
			</button>
		</div>

		{#if openMenu}
			<div
				class="absolute top-20 left-0 z-20 h-[calc(100vh-5rem)] w-screen bg-mobilemenu lg:hidden"
				on:click={() => {
					console.log("t");
					toggleMenu();
				}}
				on:keypress={(ev) => {
					console.log(ev);
					if (ev.key === "Escape") toggleMenu();
				}}>
				<div class="absolute inset-x-0 z-20 origin-top-right transform p-2 transition lg:hidden">
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
			</div>
		{/if}
	</div>

	<slot />
</div>
