<script lang="ts">
	import { hostClient, host_code } from '$lib/chess/HostClient';
	import { client_id } from '$lib/store';
	import { onMount } from 'svelte';
	import Skeleton from 'svelte-skeleton/Skeleton.svelte';

	onMount(async () => {
		if (hostClient().state === WebSocket.CLOSED) {
			hostClient().connect();
		}
	});
</script>

<div class="flex flex-col justify-center items-center gap-10 mt-24">
	<div>
		{#if !$client_id}
			<Skeleton width={180} height={72} />
		{/if}
		<p class="text-7xl text-gray-900 font-bold">{$client_id || ''}</p>
		<p class="text-base text-gray-500 font-medium text-center">Game Identifier</p>
	</div>
	<div>
		{#if !$host_code}
			<Skeleton width={180} height={72} />
		{/if}
		<p class="text-7xl text-gray-900 font-bold">{$host_code || ''}</p>
		<p class="text-base text-gray-500 font-medium text-center">Connection Code</p>
	</div>
    <div>
        <p class="text-base text-gray-600 font-medium text-center mt-4">Waiting for Opponent...</p>
        <p class="text-base text-gray-500 font-medium text-center mt-2">Share these numbers with your friend to play against them!</p>
    </div>
</div>
