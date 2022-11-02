<script lang="ts">
	import { ClientHost } from '$lib/chess/ClientHost';
	import type { WebSocketConnection } from '$lib/chess/WebSocketConnection';
	import SingleNumberInput from '$lib/SingleNumberInput.svelte';
	import { connection, hostClient } from '$lib/store';

	let n1_1: number | undefined = undefined;
	let n1_2: number | undefined = undefined;
	let n1_3: number | undefined = undefined;
	let n1_4: number | undefined = undefined;
	let n2_1: number | undefined = undefined;
	let n2_2: number | undefined = undefined;
	let n2_3: number | undefined = undefined;
	let n2_4: number | undefined = undefined;

	let ws: WebSocketConnection;
	connection.subscribe((value) => (ws = value));
	let host: ClientHost;
	hostClient.subscribe((value) => (host = value));

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
		if (number1 === '0000' || number2 === '0000') return false;
		if (determineIsGameId(number1) === determineIsGameId(number2)) return false;

		return true;
	}

	function determineIsGameId(input: string) {
		return Number(input) < 1000;
	}

	function handleConnect() {
		const number1 = `${n1_1}${n1_2}${n1_3}${n1_4}`;
		const number2 = `${n2_1}${n2_2}${n2_3}${n2_4}`;
		const gameid = determineIsGameId(number1) ? number1 : number2;
		const code = determineIsGameId(number1) ? number2 : number1;

		console.log(`gameid: ${gameid}, code: ${code}`);

		ws.prepare().then(() => {
			ws.registerHandler('connected-id', (data) => {
				alert(data.toString());
			});

			//sendAttendeeConnectRequest(gameid, code);
		});
	}

	function handleCreateGame() {
		hostClient.set(new ClientHost());
		host.connect().then(() => {
			alert(`HostId: ${host.id}, Code: ${host.code}`);
		})
	}
</script>

<div class="flex flex-col mt-16 items-center">
	<div class="flex flex-col gap-6 w-fit">
		<div class="flex justify-center items-center space-x-10">
			<div class="grid grid-cols-4 gap-4 w-fit">
				<SingleNumberInput bind:value={n1_1} id="input1" />
				<SingleNumberInput bind:value={n1_2} />
				<SingleNumberInput bind:value={n1_3} />
				<SingleNumberInput bind:value={n1_4} nextFocus="input2" />
			</div>
		</div>

		<div class="flex justify-center items-center space-x-10">
			<div class="grid grid-cols-4 gap-4 w-fit">
				<SingleNumberInput bind:value={n2_1} id="input2" />
				<SingleNumberInput bind:value={n2_2} />
				<SingleNumberInput bind:value={n2_3} />
				<SingleNumberInput bind:value={n2_4} nextFocus="connectButton" />
			</div>
		</div>

		<button
			id="connectButton"
			disabled={!checkNumbersValid(n1_1, n1_2, n1_3, n1_4, n2_1, n2_2, n2_3, n2_4)}
			class="button-secondary mt-2"
			on:click={handleConnect}
		>
			Connect
		</button>

		<div class="relative py-4">
			<div class="absolute inset-0 flex items-center justify-center">
				<div class="w-80 border-b border-gray-300" />
			</div>
			<div class="relative flex justify-center">
				<span class="bg-white px-4 text-sm text-gray-500">or</span>
			</div>
		</div>

		<button class="button-secondary" on:click={handleCreateGame}> Start a New Game </button>

		<a
			class="text-base text-center font-medium text-gray-500 hover:text-gray-900 rounded-md"
			href="/play/debug"
			>Debugging
		</a>
	</div>
</div>
