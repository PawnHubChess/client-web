<script>
	import { startHost, hostRunningState, stopHost } from '$lib/chess/host';
	import { get } from 'svelte/store';

	let useProduction = false;

	let hostRunning = false;
	let startHostEnabled = true;
	let hostOutput = '';

	hostRunningState.subscribe((value) => {
		hostRunning = value;
		startHostEnabled = true;
	});

	function handleToggleHost() {
		startHostEnabled = false;
		if (hostRunning) stopHost();
		else startHost(useProduction, (output) => (hostOutput += output + '\n\n'));
	}
</script>

<h1>Play Chess!</h1>
<input type="checkbox" checked={useProduction} />Use Production Server
<button disabled={!startHostEnabled} on:click={handleToggleHost}>
	{hostRunning ? 'Stop Host' : 'Start Host'}
</button>
<code>{hostOutput}</code>
