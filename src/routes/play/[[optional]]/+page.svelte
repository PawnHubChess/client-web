<script lang="ts">
	import { goto } from "$app/navigation";
	import { connection, determineIsGameId } from "$lib/chess/WebSocketConnection";
	import { hostClient } from "$lib/chess/HostClient";
	import SingleNumberInput from "$lib/SingleNumberInput.svelte";
	import { playstate, debug_local_server } from "$lib/store";
	import { get } from "svelte/store";
	import { dev } from "$app/environment";
	import { Diamonds } from "svelte-loading-spinners";
	import { page } from "$app/stores";
	import { onMount } from "svelte";

	if (get(playstate) === "hosting") goto("/play/create");
	if (get(playstate) === "playing") goto("/play/game");

	let n1_1: number | undefined = undefined;
	let n1_2: number | undefined = undefined;
	let n1_3: number | undefined = undefined;
	let n1_4: number | undefined = undefined;
	let n2_1: number | undefined = undefined;
	let n2_2: number | undefined = undefined;
	let n2_3: number | undefined = undefined;
	let n2_4: number | undefined = undefined;

	let connectionDeclinedMessage: string | undefined;
	let showError1: boolean = false;
	let showError2: boolean = false;
	let showConnectLoadingError: boolean = false;
	let showHostLoadingError: boolean = false;
	let showConnectLoading: boolean = false;
	let showHostLoading: boolean = false;

	// Pass all these to let Svelte know about the dependency
	function checkNumbersValid(
		n1_1: number | undefined,
		n1_2: number | undefined,
		n1_3: number | undefined,
		n1_4: number | undefined,
		n2_1: number | undefined,
		n2_2: number | undefined,
		n2_3: number | undefined,
		n2_4: number | undefined
	): boolean {
		const number1 = `${n1_1}${n1_2}${n1_3}${n1_4}`;
		const number2 = `${n2_1}${n2_2}${n2_3}${n2_4}`;

		if (number1.length !== 4 || number2.length !== 4) return false;
		if (number1 === "0000" || number2 === "0000") return false;
		if (determineIsGameId(number1) === determineIsGameId(number2)) return false;

		// Side-effect: Hide errors
		showError1 = false;
		showError2 = false;

		return true;
	}

	async function handleConnect() {
		const number1 = `${n1_1}${n1_2}${n1_3}${n1_4}`;
		const number2 = `${n2_1}${n2_2}${n2_3}${n2_4}`;
		const gameid = determineIsGameId(number1) ? number1 : number2;
		const code = determineIsGameId(number1) ? number2 : number1;

		showConnectLoading = true;
		showConnectLoadingError = false;
		const errorCallback = () => {
			showConnectLoading = false;
			showConnectLoadingError = true;
		};

		await connection().prepare(errorCallback);

		connection().registerHandler("request-declined", (data: any) => {
			connectionDeclinedMessage = data.message;
			showConnectLoading = false;

			if (data.details === "nonexistent") {
				if (determineIsGameId(number1)) showError1 = true;
				else showError2 = true;
			} else if (data.details === "code") {
				if (determineIsGameId(number1)) showError2 = true;
				else showError1 = true;
			}
		});

		connection().sendConnectRequest(gameid, code);
	}

	async function handleCreateGame() {
		showHostLoading = true;
		showHostLoadingError = false;
		const errorCallback = () => {
			showHostLoading = false;
			showHostLoadingError = true;
		};

		await connection().prepare(errorCallback);
		goto("/play/create");
	}

	onMount(() => {
		const slug = $page.params.optional;
		if (slug && slug.match(/^[0-9]{4}-[0-9]{4}$/)) {
			const [n1, n2, n3, n4, _, n5, n6, n7, n8] = slug.split("");
			n1_1 = parseInt(n1);
			n1_2 = parseInt(n2);
			n1_3 = parseInt(n3);
			n1_4 = parseInt(n4);
			n2_1 = parseInt(n5);
			n2_2 = parseInt(n6);
			n2_3 = parseInt(n7);
			n2_4 = parseInt(n8);
			if (checkNumbersValid(n1_1, n1_2, n1_3, n1_4, n2_1, n2_2, n2_3, n2_4)) {
				handleConnect();
			}
		}
	});
</script>

<div class="mt-16 flex flex-col items-center">
	<div class="flex w-fit flex-col gap-6">
		<div
			class="flex items-center justify-center space-x-10 rounded-md p-2 {showError1
				? 'border border-red-400 bg-red-50 shadow-sm'
				: ''}">
			<div class="grid w-fit grid-cols-4 gap-4">
				<SingleNumberInput bind:value={n1_1} id="input1" />
				<SingleNumberInput bind:value={n1_2} />
				<SingleNumberInput bind:value={n1_3} />
				<SingleNumberInput bind:value={n1_4} nextFocus="input2" />
			</div>
		</div>

		<div
			class="flex items-center justify-center space-x-10 rounded-md p-2 {showError2
				? 'border border-red-400 bg-red-50 shadow-sm'
				: ''}">
			<div class="grid w-fit grid-cols-4 gap-4">
				<SingleNumberInput bind:value={n2_1} id="input2" />
				<SingleNumberInput bind:value={n2_2} />
				<SingleNumberInput bind:value={n2_3} />
				<SingleNumberInput bind:value={n2_4} nextFocus="connectButton" />
			</div>
		</div>

		<button
			id="connectButton"
			disabled={!checkNumbersValid(n1_1, n1_2, n1_3, n1_4, n2_1, n2_2, n2_3, n2_4)}
			class="button-secondary mt-2 flex items-center justify-center gap-4 {showConnectLoading
				? 'bg-indigo-600 text-white'
				: ''}"
			on:click={handleConnect}>
			{showConnectLoading ? "Connecting" : "Connect"}
			{#if showConnectLoading}
				<Diamonds color="#ffffff" size="24" duration="2s" />
			{/if}
		</button>

		{#if connectionDeclinedMessage}
			<p class="max-w-[100%] text-center text-base font-medium text-red-600">
				Please check your inputs.<br />{connectionDeclinedMessage}.
			</p>
		{/if}

		{#if showConnectLoadingError}
			<p class="max-w-[100%] text-center text-base font-medium text-red-600">
				Connection failed.<br />Please try again later.
			</p>
		{/if}

		<div class="relative py-4">
			<div class="absolute inset-0 flex items-center justify-center">
				<div class="w-80 border-b border-gray-300" />
			</div>
			<div class="relative flex justify-center">
				<span class="bg-white px-4 text-sm text-gray-500">or</span>
			</div>
		</div>

		<button
			class="button-secondary flex items-center justify-center gap-4 {showHostLoading
				? 'bg-indigo-600 text-white'
				: ''}"
			on:click={handleCreateGame}>
			{showHostLoading ? "Starting" : "Start a New Game"}
			{#if showHostLoading}
				<Diamonds color="#ffffff" size="24" duration="2s" />
			{/if}
		</button>

		{#if showHostLoadingError}
			<p class="max-w-[100%] text-center text-base font-medium text-red-600">
				Connection failed.<br />Please try again later.
			</p>
		{/if}

		<a
			class="rounded-md text-center text-base font-medium text-gray-500 hover:text-gray-900"
			href="/play/debug"
			>Debugging
		</a>

		{#if dev}
			<div class="self-center">
				<input
					id="entirePageLocalServer"
					type="checkbox"
					class="my-4 mr-2 rounded-md px-3 py-3"
					bind:checked={$debug_local_server} />
				<label for="entirePageLocalServer" class="pr-4">Use local server</label>
			</div>
		{/if}
	</div>
</div>
