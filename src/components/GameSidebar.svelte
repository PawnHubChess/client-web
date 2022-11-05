<script lang="ts">
	import { goto } from "$app/navigation";
	import { connection } from "$lib/chess/WebSocketConnection";
	import { Diamonds } from "svelte-loading-spinners";

	export let isOwnMove: boolean;

	function handleRefresh() {
		alert("Not implemented");
	}

	function handleLeaveGame() {
		connection().send(`{"type": "disconnect"}`);
		connection().close();
		goto("/play");
	}
</script>

<div class="flex items-center gap-2 gap-x-4 lg:flex-col lg:items-start">
	<p class="flex items-center justify-center gap-2 text-base font-medium text-gray-600">
		{isOwnMove ? "Your Turn Now!" : "Opponent's Move"}
		{#if !isOwnMove}
			<Diamonds color="#4d5536" size="24" duration="2s" />
		{/if}
	</p>
	<button class="button-secondary" on:click={handleLeaveGame}>Refresh</button>
	<button class="button-secondary" on:click={handleLeaveGame}>Leave Game</button>
</div>
