<script lang="ts">
	import {
		startHost,
		hostOpenState,
		stopHost,
		hostId,
		lastRequest,
		acceptLastRequest,
		declineLastRequest,
		send as sendHost
	} from "$lib/chess-debug/host";
	import {
		startClient,
		clientOpenState,
		stopClient,
		sendConnectionRequest,
		send as sendClient
	} from "$lib/chess-debug/websocketClient";
	import { debug_local_server } from "$lib/store";
	import { get } from "svelte/store";

	let hostOpen = false;
	let startHostEnabled = true;
	let customHostInput = "";
	const handleHostCustomInput = (e: KeyboardEvent) => {
		if (e.charCode == 13) sendHost(customHostInput, hostCallback);
	};

	let hostOutput: string[] = [];
	const hostCallback = (output: string) => (hostOutput = [...hostOutput, output]);

	hostOpenState.subscribe((value) => {
		hostOpen = value;
		startHostEnabled = true;
	});

	function handleToggleHost() {
		startHostEnabled = false;
		if (hostOpen) stopHost();
		else startHost(!get(debug_local_server), hostCallback);
		console.log(hostOutput);
	}

	let receivedRequest = false;
	lastRequest.subscribe((value) => (receivedRequest = typeof value !== "undefined"));

	const handleAcceptRequest = () => acceptLastRequest(hostCallback);
	const hanldeDeclineRequest = () => declineLastRequest(hostCallback);

	let clientOpen = false;
	let startClientEnabled = true;
	let clientOutput: string[] = [];
	const clientCallback = (output: string) => (clientOutput = [...clientOutput, output]);

	clientOpenState.subscribe((value) => {
		clientOpen = value;
		startClientEnabled = true;
	});

	function handleToggleClient() {
		startClientEnabled = false;
		if (clientOpen) stopClient();
		else startClient(!get(debug_local_server), clientCallback);
		console.log(clientOutput);
	}

	let connectHostId = "";
	let connectCode = "";
	let customClientInput = "";
	const handleClientCustomInput = (e: KeyboardEvent) => {
		if (e.charCode == 13) sendClient(customClientInput, clientCallback);
	};

	hostId.subscribe((value) => {
		if (value) connectHostId = value as string;
	});

	function handleConnectToHost() {
		sendConnectionRequest(connectHostId, connectCode, clientCallback);
	}
</script>

<main>
	<input
		id="entirePageLocalServer"
		type="checkbox"
		class="my-4 rounded-md px-3 py-3"
		bind:checked={$debug_local_server} />
	<label for="entirePageLocalServer" class="pr-4">Use local server everywhere</label>

	<div class="clientsContainer">
		<div class="host">
			<button class="button-primary" disabled={!startHostEnabled} on:click={handleToggleHost}>
				{hostOpen ? "Stop Host" : "Start Host"}
			</button>
			{#if receivedRequest}
				<button on:click={handleAcceptRequest} class="button-secondary">Accept</button>
				<button on:click={hanldeDeclineRequest} class="button-secondary">Decline</button>
			{/if}
			{#if hostOpen}
				<div>
					<input
						type="text"
						bind:value={customHostInput}
						on:keypress={handleHostCustomInput}
						placeholder="Send..."
						class="mt-2 rounded-md" />
				</div>
			{/if}
			<code class="rounded-md bg-gray-100">
				{#each hostOutput as output}
					{output}
					<br />
				{/each}
			</code>
		</div>
		<div class="attendee">
			<button class="button-primary" disabled={!startClientEnabled} on:click={handleToggleClient}>
				{clientOpen ? "Stop Client" : "Start Client"}
			</button>
			{#if clientOpen}
				<div>
					<input
						type="text"
						bind:value={connectHostId}
						placeholder="Host ID"
						class="mt-2 rounded-md" />
					<input
						type="text"
						bind:value={connectCode}
						placeholder="Connection Code"
						class="mt-2 rounded-md" />
					<button class="button-secondary" on:click={handleConnectToHost}>Send Request</button>
				</div>
				<div>
					<input
						type="text"
						bind:value={customClientInput}
						on:keypress={handleClientCustomInput}
						placeholder="Send..."
						class="mt-2 rounded-md" />
				</div>
			{/if}
			<code class="rounded-md bg-gray-100">
				{#each clientOutput as output}
					{output}
					<br />
				{/each}
			</code>
		</div>
	</div>
</main>

<style>
	.clientsContainer {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-gap: 1rem;
	}

	code {
		white-space: pre-line;
		display: block;
		text-align: start;
		margin-top: 1rem;
		padding: 1rem;
	}
</style>
