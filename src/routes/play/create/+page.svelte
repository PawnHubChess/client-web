<script lang="ts">
	import { hostClient, host_code } from '$lib/chess/HostClient';
	import { client_id } from '$lib/store';

	if (hostClient().state === WebSocket.CLOSED) {
		hostClient().connect();
	}
</script>

<div class="flex flex-col justify-center items-center gap-10 mt-16">
	<p class="text-7xl text-gray-900 font-bold">{$client_id}</p>
	<p class="text-7xl text-gray-900 font-bold">{$host_code}</p>
	<p class="text-base text-gray-600 font-medium">Waiting for Opponent</p>
</div>
