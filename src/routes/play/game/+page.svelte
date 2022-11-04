<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		playstate,
		client_id,
		reconnect_code,
		board_fen,
		current_player_white
	} from '$lib/store';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import 'chessboard-element';
	import { connection, determineIsGameId } from '$lib/chess/WebSocketConnection';

	let waiting_for_response = false;

	onMount(async () => {
		if (get(playstate) !== 'playing') goto('/play');

		let board = document.querySelector('chess-board')!;

		if (determineIsGameId(get(client_id))) board.orientation = 'black';
		else board.orientation = 'white';

		board.setPosition(get(board_fen));

		// API Integration

		board.addEventListener('drop', (e) => {
			// @ts-ignore
			const { source, target, newPosition } = e.detail;
			if (target === 'offboard') return;
			connection().sendMove(source, target);
			waiting_for_response = true;
		});

		connection().registerHandler('receive-move', (data: any) => {
			board.move(`${data.from.toLowerCase()}-${data.to.toLowerCase()}`);
			board_fen.set(board.fen() || '');

			current_player_white.set(!get(current_player_white));
		});
		connection().registerHandler('reject-move', (data: any) => {
			board.setPosition(get(board_fen));
			waiting_for_response = false;
		});
		connection().registerHandler('accept-move', (data: any) => {
			board_fen.set(board.fen() || '');
			current_player_white.set(!get(current_player_white));
			waiting_for_response = false;
		});

		// Disallow moving if not own turn
		board.addEventListener('drag-start', (e) => {
			// @ts-ignore
			if (e.detail.piece.startsWith('b') !== determineIsGameId(get(client_id))) {
				e.preventDefault();
				return;
			}
			if (get(current_player_white) === determineIsGameId(get(client_id))) {
				e.preventDefault();
				return;
			}
			if (waiting_for_response) {
				e.preventDefault();
				return;
			}
		});
	});
</script>

<div class="flex justify-center mt-8">
	<chess-board
		draggable-pieces
		style="width: 80vh; max-width: 90vw; --light-color: #f9fafb; --dark-color: #e2e7fe; --highlight-color: #554de2; border: none;"
	/>
</div>

<p class="text-base text-gray-600 font-medium text-center">
	You're matched to another player. Your id is <span class="font-bold">{$client_id}</span>
</p>
<p class="text-base text-gray-500 font-medium text-center mt-4">
	Reconnect Code: {$reconnect_code}
</p>
