<script lang="ts">
	import { goto } from '$app/navigation';
	import ShareHostLink from '$components/ShareHostLink.svelte';
	import { hostClient, host_code } from '$lib/chess/HostClient';
	import { connection } from '$lib/chess/WebSocketConnection';
	import { client_id, playstate } from '$lib/store';
	import { onMount } from 'svelte';
	import { Diamonds } from 'svelte-loading-spinners';
	import Skeleton from 'svelte-skeleton/Skeleton.svelte';
	import { get } from 'svelte/store';

	onMount(async () => {
		if (get(playstate) === 'playing') goto('/play/game');
		if (get(playstate) === 'closed') hostClient().connect();
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

	<ShareHostLink gameid={$client_id} code={$host_code} />

	<div>
		<p
			class="text-base text-gray-600 font-medium text-center mt-4 flex justify-center items-center gap-2"
		>
			{$client_id && $host_code ? 'Waiting for Opponent' : 'Creating Game'}
			<Diamonds color="#4d5536" size="24" duration="2s" />
		</p>
		<p class="text-base text-gray-500 font-medium text-center mt-2">
			{#if $client_id && $host_code}
				Share these numbers with your friend to play against them!
			{/if}
		</p>
	</div>
</div>
