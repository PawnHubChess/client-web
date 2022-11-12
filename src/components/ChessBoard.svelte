<script lang="ts">
	import { onMount } from "svelte";
	import { board_fen, client_id, current_player_white, pending_move } from "$lib/store";
	import { objToFen, type ChessBoardElement } from "chessboard-element";
	import { get } from "svelte/store";
	import { connection, determineIsGameId } from "$lib/chess/WebSocketConnection";
	import { Chess } from "chess.js";
	import { srSpeak } from "$lib/Accessibility";

	let opponent_disconnected: boolean;

	let board: ChessBoardElement;

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
	}

	function srSpeakMove(from: string, to: string, piecePosition: string, wasSelf: boolean) {
		const piece = board.position[piecePosition.toLowerCase()];
		srSpeak(
			`${wasSelf ? "You" : "Opponent"} moved ${piece} from ${from} to ${to}`,
			"assertive",
			document
		);
	}

	onMount(async () => {
		// Black on bottom if player is host
		board.orientation = determineIsGameId(get(client_id)) ? "black" : "white";
        // Set up board with current state
		updateBoard();

		// API Integration

		board.addEventListener("drop", (e) => {
			// @ts-ignore
			const { source, target, oldPosition, setAction } = e.detail;

			updateChessJs(objToFen(oldPosition));

			// Snap back if move is illegal
			if (chessJs.move({ from: source, to: target }) === null) {
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
			if (get(pending_move)) {
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

			updateChessJs(board.fen());

			// Get possible moves for this square from Chess.js
			const moves = chessJs.moves({ square: square, verbose: true });
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
