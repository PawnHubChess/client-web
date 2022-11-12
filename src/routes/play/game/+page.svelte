<script lang="ts">
	import { playstate, client_id, current_player_white, unread_move } from "$lib/store";
	import { get } from "svelte/store";
	import "chessboard-element";
	import { determineIsGameId } from "$lib/chess/WebSocketConnection";
	import GameSidebar from "$components/GameSidebar.svelte";
	import OpponentDisconnectedModal from "$components/GameEndedModal.svelte";
	import ChessBoard from "$components/ChessBoard.svelte";

	let waiting_for_response = false;
	let opponent_disconnected = false;

	// Immediately remove unread move marker whilst on this page
	unread_move.set(false);
	$: $unread_move, resetUnread();
	function resetUnread() {
		unread_move.set(false);
	}

	// fixme Complete ChessBoard handleMakeMove refactoring to reenable accessible input (see below)
</script>

<main>
	<div class="mt-2 flex justify-center tall:mt-8">
		<div class="grid gap-4 lg:grid-cols-chessgrid ">
			<ChessBoard bind:waiting_for_response bind:opponent_disconnected />

			<div class="order-first lg:order-none">
				<GameSidebar
					isOwnMove={$current_player_white === !determineIsGameId(get(client_id))}
					moveCallback={() => {/*handleMakeMove accessible input will work once handleMakeMove refactor is complete */}} />
			</div>
		</div>
	</div>

	<OpponentDisconnectedModal
		isOpen={$playstate !== "playing"}
		title={opponent_disconnected ? "You're the Winner!" : "Disconnected"}
		description={"The game has ended because " +
			(opponent_disconnected ? "your opponent has disconnected." : "you lost connection.")} />
</main>
