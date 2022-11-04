<script lang="ts">
	import { goto } from '$app/navigation';
	import { playstate, client_id, reconnect_code, board_fen } from '$lib/store';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import 'chessboard-element';
	import { connection, determineIsGameId } from '$lib/chess/WebSocketConnection';

	onMount(async () => {
		if (get(playstate) !== 'playing') goto('/play');

		let board = document.querySelector('chess-board')!;

		if (determineIsGameId(get(client_id))) board.orientation = 'black';
		else board.orientation = 'white';

		board.setPosition(get(board_fen));

		board.addEventListener('drop', (e) => {
			// @ts-ignore
			const { source, target, newPosition } = e.detail;
			connection().sendMove(source, target);
		});

		connection().registerHandler('receive-move', (data: any) => {
			board.move(`${data.from.toLowerCase()}-${data.to.toLowerCase()}`);
			board_fen.set(board.fen() || "");
		});
		connection().registerHandler('reject-move', (data: any) => {
			board.setPosition(get(board_fen));
		});
		connection().registerHandler('accept-move', (data: any) => {
			board_fen.set(board.fen() || "");
		});
	});
</script>

<div class="flex justify-center mt-8">
	<chess-board
		draggable-pieces
		style="width: 80vh; --light-color: #f9fafb; --dark-color: #e2e7fe; --highlight-color: #554de2; border: none;"
	/>
</div>

<p class="text-base text-gray-600 font-medium text-center">
	You're matched to another player. Your id is <span class="font-bold">{$client_id}</span>
</p>
<p class="text-base text-gray-500 font-medium text-center mt-4">
	Reconnect Code: {$reconnect_code}
</p>
