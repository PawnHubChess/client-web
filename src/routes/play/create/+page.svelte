<script lang="ts">
	import { goto } from "$app/navigation";
	import ShareHostLink from "$components/ShareHostLink.svelte";
	import { hostClient, host_code } from "$lib/chess/HostClient";
	import { connection } from "$lib/chess/WebSocketConnection";
	import { client_id, playstate } from "$lib/store";
	import { onMount } from "svelte";
	import { Diamonds } from "svelte-loading-spinners";
	import Skeleton from "svelte-skeleton/Skeleton.svelte";
	import { get } from "svelte/store";

	onMount(async () => {
		if (get(playstate) === "playing") goto("/play/game");
		if (get(playstate) === "closed") hostClient().connect();
	});

	function handleCancel() {
		connection().close();
		goto("/play");
	}
</script>

<div class="mt-2 tall:mt-24 mb-24 flex flex-col items-center justify-center gap-10">
	<div>
		{#if !$client_id}
			<Skeleton width={180} height={72} />
		{/if}
		<p class="text-7xl font-bold text-gray-900">{$client_id || ""}</p>
		<p class="text-center text-base font-medium text-gray-500">Game Identifier</p>
	</div>
	<div>
		{#if !$host_code}
			<Skeleton width={180} height={72} />
		{/if}
		<p class="text-7xl font-bold text-gray-900">{$host_code || ""}</p>
		<p class="text-center text-base font-medium text-gray-500">Connection Code</p>
	</div>

	<ShareHostLink gameid={$client_id} code={$host_code} />

	<div>
		<p
			class="mt-4 flex items-center justify-center gap-2 text-center text-base font-medium text-gray-600">
			{$client_id && $host_code ? "Waiting for Opponent" : "Creating Game"}
			<Diamonds color="#4d5536" size="24" duration="2s" />
		</p>
		<p class="mt-2 text-center text-base font-medium text-gray-500">
			{#if $client_id && $host_code}
				Share these numbers with your friend to play against them!
			{/if}
		</p>
	</div>

	<button class="button-secondary" on:click={handleCancel}>Cancel</button>
</div>
