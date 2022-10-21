<script lang="ts">
	import { startHost, hostRunningState, stopHost } from '$lib/chess/host';
	import { get } from 'svelte/store';

	let useProduction = false;

	let hostRunning = false;
	let startHostEnabled = true;
	let hostOutput: string[] = [];

	hostRunningState.subscribe((value) => {
		hostRunning = value;
		startHostEnabled = true;
	});

	function handleToggleHost() {
		startHostEnabled = false;
		if (hostRunning) stopHost();
		else startHost(useProduction, (output) => hostOutput = [...hostOutput, output]);
        console.log(hostOutput)
	}
</script>

<input type="checkbox" checked={useProduction} />Use Production Server
<button disabled={!startHostEnabled} on:click={handleToggleHost}>
	{hostRunning ? 'Stop Host' : 'Start Host'}
</button>
<code>
    {#each hostOutput as output}
        {output}
        <br>
    {/each}
</code>

<style>
	code {
		white-space: pre-line;
        display: block;
        text-align: start;
        margin-top: 1rem;
        background-color: #1a1a1a;
        padding: 1rem;
	}
</style>
