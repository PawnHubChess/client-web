<script lang="ts">
	import { goto } from "$app/navigation";
	import { srSpeak, srSpeakMove } from "$lib/Accessibility";
	import { connection } from "$lib/chess/WebSocketConnection";
	import { board_fen, pending_move } from "$lib/store";
	import { Diamonds } from "svelte-loading-spinners";

	export let isOwnMove: boolean;

	let moveFrom: string;
	let moveTo: string;

	function handleMakeMove() {
		if (!isOwnMove || !moveFrom.match(/^[a-hA-H][0-8]$/) || !moveTo.match(/^[a-hA-H][0-8]$/)) {
			srSpeak("You cannot make this move right now", "assertive", document);
			return;
		}
		srSpeakMove(moveFrom, moveTo, moveFrom, true);
		connection().sendMove(moveFrom.toLowerCase(), moveTo.toLowerCase());
		moveFrom = "";
		moveTo = "";
	}

	function handleFocusNext(e: KeyboardEvent, maxlength: number) {
		if (e.which < 48 || e.which > 90) return;
		if ((e.target as HTMLInputElement)?.value.length === maxlength) {
			const next = (e.target as HTMLInputElement)?.nextElementSibling as HTMLInputElement;
			if (next) next.focus();
		}
	}

	function handleRefresh() {
		// Force the game state to reload by resetting
		board_fen.set("8/8/8/8/8/8/8/8");
		connection().send(`{"type": "get-board"}`);
	}

	function handleLeaveGame() {
		connection().send(`{"type": "disconnect"}`);
		connection().close();
		goto("/play");
	}
</script>

<div class="flex items-center gap-2 gap-x-4 lg:flex-col lg:items-start">
	<p class="flex items-center justify-center gap-2 text-base font-medium text-gray-600">
		{isOwnMove ? ($pending_move ? "Sending" : "Your Turn Now!") : "Opponent's Move"}
		{#if !isOwnMove || $pending_move}
			<Diamonds color="#4d5536" size="24" duration="2s" />
		{/if}
	</p>

	<div class="sr-focus-layout rounded-md bg-gray-100 p-2">
		<p class="mb-3 text-base text-gray-600">
			{isOwnMove
				? "Make a move, it's your turn."
				: "It's your opponents turn, make a move here later."}
		</p>
		<label for="move-from">Move from:</label>
		<input
			type="text"
			bind:value={moveFrom}
			on:keyup={(e) => handleFocusNext(e, 2)}
			id="move-from"
			class="mt-1 mb-2 rounded-md"
			maxlength="2" />
		<label for="move-to">Move to:</label>
		<input
			type="text"
			bind:value={moveTo}
			on:keyup={(e) => handleFocusNext(e, 2)}
			id="move-to"
			class="mt-1 rounded-md"
			maxlength="2" />
		<input
			type="submit"
			on:click={handleMakeMove}
			value="Submit Move"
			class="button-secondary mt-4 w-full" />
	</div>

	<button class="button-secondary" on:click={handleRefresh}>Refresh</button>
	<button class="button-secondary" on:click={handleLeaveGame}>Leave Game</button>
</div>
