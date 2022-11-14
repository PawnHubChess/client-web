<script lang="ts">
	import { playstate, client_id, current_player_white, unread_move } from "$lib/store";
	import { get } from "svelte/store";
	import "chessboard-element";
	import { connection, determineIsGameId } from "$lib/chess/WebSocketConnection";
	import GameSidebar from "$components/GameSidebar.svelte";
	import OpponentDisconnectedModal from "$components/GameEndedModal.svelte";
	import ChessBoard from "$components/ChessBoard.svelte";
	import { onDestroy } from "svelte";

	// Immediately remove unread move marker whilst on this page
	unread_move.set(false);
	$: $unread_move, resetUnread();
	function resetUnread() {
		unread_move.set(false);
	}

	let opponent_disconnected = false;
	const destroyConnected = connection().on("opponent-disconnected", () => {
		opponent_disconnected = true;
	});
	onDestroy(destroyConnected);
</script>

<main>
	<div class="mt-2 flex justify-center tall:mt-8">
		<div class="grid gap-4 lg:grid-cols-chessgrid ">
			<ChessBoard />

			<div class="order-first lg:order-none">
				<GameSidebar isOwnMove={$current_player_white === !determineIsGameId(get(client_id))} />
			</div>
		</div>
	</div>

	<OpponentDisconnectedModal
		isOpen={$playstate !== "playing"}
		title={opponent_disconnected ? "You're the Winner!" : "Disconnected"}
		description={"The game has ended because " +
			(opponent_disconnected ? "your opponent has disconnected." : "you lost connection.")} />
</main>
