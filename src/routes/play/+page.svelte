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
	} from '$lib/chess/host';
	import {
		startClient,
		clientOpenState,
		stopClient,
		sendConnectionRequest,
		send as sendClient
	} from '$lib/chess/websocketClient';

	let useCloud = false;

	let hostOpen = false;
	let startHostEnabled = true;
	let customHostInput = '';
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
		else startHost(useCloud, hostCallback);
		console.log(hostOutput);
	}

	let receivedRequest = false;
	lastRequest.subscribe((value) => (receivedRequest = typeof value !== 'undefined'));

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
		else startClient(useCloud, clientCallback);
		console.log(clientOutput);
	}

	let connectHostId = '';
	let connectCode = '';
	let customClientInput = '';
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

<input id="cloudCheckbox" type="checkbox" bind:checked={useCloud} />
<label for="cloudCheckbox">Use Cloud Server</label>
<div class="clientsContainer">
	<div class="host">
		<button disabled={!startHostEnabled} on:click={handleToggleHost}>
			{hostOpen ? 'Stop Host' : 'Start Host'}
		</button>
		{#if receivedRequest}
			<button on:click={handleAcceptRequest}>Accept</button>
			<button on:click={hanldeDeclineRequest}>Decline</button>
		{/if}
		{#if hostOpen}
			<div>
				<input
					type="text"
					bind:value={customHostInput}
					on:keypress={handleHostCustomInput}
					placeholder="Send..."
				/>
			</div>
		{/if}
		<code>
			{#each hostOutput as output}
				{output}
				<br />
			{/each}
		</code>
	</div>
	<div class="attendee">
		<button disabled={!startClientEnabled} on:click={handleToggleClient}>
			{clientOpen ? 'Stop Client' : 'Start Client'}
		</button>
		{#if clientOpen}
			<div>
				<input type="text" bind:value={connectHostId} placeholder="Host ID" />
				<input type="text" bind:value={connectCode} placeholder="Connection Code" />
				<button on:click={handleConnectToHost}>Send Request</button>
			</div>
			<div>
				<input
					type="text"
					bind:value={customClientInput}
					on:keypress={handleClientCustomInput}
					placeholder="Send..."
				/>
			</div>
		{/if}
		<code>
			{#each clientOutput as output}
				{output}
				<br />
			{/each}
		</code>
	</div>
</div>

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
		background-color: #1a1a1a;
		padding: 1rem;
	}
</style>
