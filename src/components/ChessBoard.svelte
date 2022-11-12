<script lang="ts">
	import { onMount } from "svelte";
	import { board_fen, client_id, current_player_white } from "$lib/store";
	import { objToFen, type ChessBoardElement } from "chessboard-element";
	import { get } from "svelte/store";
	import { connection, determineIsGameId } from "$lib/chess/WebSocketConnection";
	import { Chess } from "chess.js";
	import { srSpeak } from "$lib/Accessibility";

	let waiting_for_response: boolean;
	let opponent_disconnected: boolean;

	let handleMakeMove: (from: string, to: string) => void;
	let board: ChessBoardElement;

	// Subscibe to board updates from state
	$: $board_fen, updateBoard();
	function updateBoard() {
		if (!board) {
			console.warn("Board was updated but is not initialized");
			return;
		}
		board.setPosition(get(board_fen));
	}

	onMount(async () => {
		board = document.querySelector("chess-board")!;

		if (determineIsGameId(get(client_id))) board.orientation = "black";
		else board.orientation = "white";

		updateBoard();
		const game = new Chess("");

		// API Integration

		handleMakeMove = (from: string, to: string, updateBoard = false) => {
			// todo clean this up, smells like multiple functions in one
			connection().sendMove(from, to);
			waiting_for_response = true;

			if (updateBoard) board.move(`${from}-${to}`);

			const piece = board.position[to.toLowerCase()];
			srSpeak(`You moved ${piece} from ${from} to ${to}`, "assertive", document);
		};

		board.addEventListener("drop", (e) => {
			// @ts-ignore
			const { source, target, oldPosition, setAction } = e.detail;

			// Load current board state to Chess.js
			game.load(
				objToFen(oldPosition) + (get(current_player_white) ? " w" : " b") + " KQkq - 0 1" || ""
			);
			// Snap back if move is illegal
			if (game.move({ from: source, to: target }) === null) {
				setAction("snapback");
				return;
			}
			if (target === "offboard") return;

			handleMakeMove(source, target);

			removeGreySquares();
		});

		// Subscribe to opponent's moves
		connection().registerHandler("receive-move", (data: any) => {
			board.move(`${data.from.toLowerCase()}-${data.to.toLowerCase()}`);
			board_fen.set(board.fen() || "");
			current_player_white.set(!get(current_player_white));
			srReadMove(data.from, data.to);
		});

		// Reset board if server deems move illegal
		connection().registerHandler("reject-move", (data: any) => {
			board.setPosition(get(board_fen));
			waiting_for_response = false;
		});

		// Update board in state if move was accepted by API
		connection().registerHandler("accept-move", (data: any) => {
			board_fen.set(board.fen() || "");
			current_player_white.set(!get(current_player_white));
			waiting_for_response = false;
		});

		connection().registerHandler("opponent-disconnected", (data: any) => {
			opponent_disconnected = true;
		});

		function srReadMove(from: string, to: string) {
			const piece = board.position[to.toLowerCase()];
			srSpeak(`Opponent moved ${piece} from ${from} to ${to}`, "assertive", document);
		}

		// Disallow moving if not own turn
		board.addEventListener("drag-start", (e) => {
			// @ts-ignore
			if ((e.detail.piece.search(/^b/) !== -1) !== determineIsGameId(get(client_id))) {
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

		// Valid move highlighting

		const highlightStyles = document.createElement("style");
		document.head.append(highlightStyles);

		function removeGreySquares() {
			highlightStyles.textContent = "";
		}

		function greySquare(square: string) {
			// Choose highlight color based on light/dark square
			const highlightColor =
				square.charCodeAt(0) % 2 ^ square.charCodeAt(1) % 2 ? "#a5b4fc" : "#818cf8";

			highlightStyles.textContent += `
    			chess-board::part(${square}) {
      			background-color: ${highlightColor};
    		}
  		`;
		}

		board.addEventListener("mouseover-square", (e) => {
			// @ts-ignore
			const { square, piece } = e.detail;

			// Return if not own turn
			if ((piece.search(/^b/) !== -1) !== determineIsGameId(get(client_id))) {
				return;
			}

			// Load current board state to Chess.js
			game.load(board.fen() + (get(current_player_white) ? " w" : " b") + " KQkq - 0 1" || "");

			// Get possible moves for this square from Chess.js
			const moves = game.moves({ square: square, verbose: true });
			if (moves.length === 0) return;

			// Hightlight hovered square and all possible moves
			greySquare(square);
			for (const move of moves) {
				// @ts-ignore
				greySquare(move.to);
			}
		});

		board.addEventListener("mouseout-square", (e) => {
			removeGreySquares();
		});
	});
</script>

<chess-board
	draggable-pieces
	style="width: 80vh; max-width: 90vw; --light-color: #f9fafb; --dark-color: #e2e7fe; --highlight-color: #554de2; border: none;" />

<style>
	chess-board::part(board) {
		border: none;
	}
	chess-board::part(piece)::before {
		content: attr(piece);
		display: block;
		@apply sr-only;
	}
</style>
