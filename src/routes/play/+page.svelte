<script lang="ts">
	import { startHost, hostOpenState, stopHost, hostId } from '$lib/chess/host';
	import { startClient, clientOpenState, stopClient, sendConnectionRequest } from '$lib/chess/websocketClient';
	import { get } from 'svelte/store';

	let useProduction = false;

	let hostOpen = false;
	let startHostEnabled = true;
	let hostOutput: string[] = [];

	hostOpenState.subscribe((value) => {
		hostOpen = value;
		startHostEnabled = true;
	});

	function handleToggleHost() {
		startHostEnabled = false;
		if (hostOpen) stopHost();
		else startHost(useProduction, (output) => (hostOutput = [...hostOutput, output]));
		console.log(hostOutput);
	}

	let clientOpen = false;
	let startClientEnabled = true;
	let clientOutput: string[] = [];

	clientOpenState.subscribe((value) => {
		clientOpen = value;
		startClientEnabled = true;
	});

	function handleToggleClient() {
		startClientEnabled = false;
		if (clientOpen) stopClient();
		else startClient(useProduction, output => (clientOutput = [...clientOutput, output]));
		console.log(clientOutput);
	}

	let connectHostId = '';
	let connectCode = '';

    hostId.subscribe(value => connectHostId = value)

	function handleConnectToHost() {
        sendConnectionRequest(connectHostId, connectCode, output => (clientOutput = [...clientOutput, output]))
    }
</script>

<input type="checkbox" checked={useProduction} />Use Production Server
<div class="clientsContainer">
	<div class="host">
		<button disabled={!startHostEnabled} on:click={handleToggleHost}>
			{hostOpen ? 'Stop Host' : 'Start Host'}
		</button>
		<code>
			{#each hostOutput as output}
				{output}
				<br />
			{/each}
		</code>
	</div>
	<div class="attendee">
		<button disabled={!startClientEnabled} on:click={handleToggleClient}>
			{hostOpen ? 'Stop Client' : 'Start Client'}
		</button>
		{#if clientOpen}
			<div>
				<input type="text" value={connectHostId} placeholder="Host ID" />
				<input type="text" value={connectCode} placeholder="Connection Code" />
				<button on:click={handleConnectToHost}>Send Request</button>
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
