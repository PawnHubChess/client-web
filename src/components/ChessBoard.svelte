<script lang="ts">
	import { onMount } from "svelte";
	import { board_fen, client_id, current_player_white, pending_move } from "$lib/store";
	import { objToFen, type ChessBoardElement } from "chessboard-element";
	import { get } from "svelte/store";
	import { connection, determineIsGameId } from "$lib/chess/WebSocketConnection";
	import { Chess, type Move, type Square } from "chess.js";
	import { srSpeak } from "$lib/Accessibility";

	let opponent_disconnected: boolean;

	let board: ChessBoardElement;
	let highlightStyles: HTMLElement;
	const chessJs = new Chess("");

	// Subscibe to board updates from state
	$: $board_fen, updateBoard();
	function updateBoard() {
		if (!board) {
			console.warn("Board was updated but is not initialized");
			return;
		}
		board.setPosition(get(board_fen));
	}

	// Load current board state to Chess.js
	function updateChessJs(positionFen: string | false) {
		chessJs.load(positionFen + (get(current_player_white) ? " w" : " b") + " KQkq - 0 1" || "");
	}

	function handleMakeMove(from: string, to: string) {
		connection().sendMove(from, to);
		srSpeakMove(from, to, to, true);
		clearHighlights();
	}

	function srSpeakMove(from: string, to: string, piecePosition: string, wasSelf: boolean) {
		const piece = board.position[piecePosition.toLowerCase()];
		srSpeak(
			`${wasSelf ? "You" : "Opponent"} moved ${piece} from ${from} to ${to}`,
			"assertive",
			document
		);
	}

	function highlightValidMoves(fen: string | false, square: Square) {
		updateChessJs(fen);

		// Get valid moves from Chess.js
		const moves = chessJs.moves({ square: square, verbose: true });
		if (moves.length === 0) return;

		// Highlight hovered and possible squares
		applyHighlight(square);
		for (const move of moves) {
			if (typeof move === "string") applyHighlight(move);
			else applyHighlight(move.to);
		}
	}

	function applyHighlight(square: string) {
		// Choose highlight color based on light/dark square
		const highlightColor =
			square.charCodeAt(0) % 2 ^ square.charCodeAt(1) % 2 ? "#a5b4fc" : "#818cf8";

		highlightStyles.textContent += `
    			chess-board::part(${square}) {
      			background-color: ${highlightColor};
    		}`;
	}

	function clearHighlights() {
		if (highlightStyles) {
			highlightStyles.textContent = "";
		}
	}

	onMount(async () => {
		// Black on bottom if player is host
		board.orientation = determineIsGameId(get(client_id)) ? "black" : "white";
		// Set up board with current state
		updateBoard();

		highlightStyles = document.createElement("style");
		document.head.append(highlightStyles);

		// Drop a piece to make a move
		board.addEventListener("drop", (e: any) => {
			const { source, target, oldPosition, setAction } = e.detail;

			// Check for illegal moves
			updateChessJs(objToFen(oldPosition));
			if (chessJs.move({ from: source, to: target }) === null) {
				setAction("snapback");
				return;
			}
			if (target === "offboard") return;

			handleMakeMove(source, target);
		});

		// Subscribe to opponent's moves to speak them
		connection().registerHandler("receive-move", (data: any) => {
			srSpeakMove(data.from, data.to, data.to, false);
		});

		// Reset board if server deems move illegal
		connection().registerHandler("reject-move", (data: any) => {
			board.setPosition(get(board_fen));
			pending_move.set(false);
		});

		connection().registerHandler("opponent-disconnected", (data: any) => {
			opponent_disconnected = true;
		});

		// Disallow moving if not own turn
		board.addEventListener("drag-start", (e: any) => {
			if ((e.detail.piece.search(/^b/) !== -1) !== determineIsGameId(get(client_id))) {
				e.preventDefault();
				return;
			}
			if (get(current_player_white) === determineIsGameId(get(client_id))) {
				e.preventDefault();
				return;
			}
			if (get(pending_move)) {
				e.preventDefault();
				return;
			}
		});

		// Highlight valid moves on hover
		board.addEventListener("mouseover-square", (e: any) => {
			const { square, piece } = e.detail;
			// Only if own turn
			if ((piece.search(/^b/) !== -1) !== determineIsGameId(get(client_id))) return;
			highlightValidMoves(board.fen(), square);
		});

		board.addEventListener("mouseout-square", (e) => {
			clearHighlights();
		});

		// todo onUnmount
	});
</script>

<chess-board
	bind:this={board}
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
