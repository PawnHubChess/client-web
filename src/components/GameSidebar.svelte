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

	<div class="sr-focus-layout rounded-md bg-gray-100 p-2">
		<p class="mb-3 text-base text-gray-600">Make a move. {isOwnMove ? "It's your turn." : "It's your opponents turn."}</p>
		<label for="move-from">Move from:</label>
		<input type="text" id="move-from" class="rounded-md mt-1 mb-2" maxlength="2" />
		<label for="move-to">Move to:</label>
		<input type="text" id="move-to" class="rounded-md mt-1" maxlength="2" />
		<input type="submit" value="Submit Move" class="button-secondary mt-4 w-full" />
	</div>

	<button class="button-secondary" on:click={handleLeaveGame}>Refresh</button>
	<button class="button-secondary" on:click={handleLeaveGame}>Leave Game</button>
	
</div>
