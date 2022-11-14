import { expect, test } from "vitest";
import { positionInFen, positionToFen } from "$lib/chess/ChessUtils";
import { current_player_white } from "$lib/store";

// Position to FEN

test("position + white to simple fen", () => {
  const positionString = "2r1k2r/3b1ppp/pq2pn2/2b4P/5B2/2N3Q1/PPP2PP1/R4KNR";
  const simplefen =
    "2r1k2r/3b1ppp/pq2pn2/2b4P/5B2/2N3Q1/PPP2PP1/R4KNR w KQkq - 0 1";
  current_player_white.set(true);

  expect(positionToFen(positionString)).toBe(simplefen);
});

test("position + black to simple fen", () => {
  const positionString = "2r1k2r/3b1ppp/pq2pn2/2b4P/5B2/2N3Q1/PPP2PP1/R4KNR";
  const simplefen =
    "2r1k2r/3b1ppp/pq2pn2/2b4P/5B2/2N3Q1/PPP2PP1/R4KNR b KQkq - 0 1";
  current_player_white.set(false);

  expect(positionToFen(positionString)).toBe(simplefen);
});

// Position in FEN

const fen = "2r1k2r/3b1ppp/pq2pn2/2b4P/5B2/2N3Q1/PPP2PP1/R4KNR";
test("piece G3 from fen", () => {
  expect(positionInFen(fen, "G3")).toBe("Q");
});

test("piece D7 from fen", () => {
  expect(positionInFen(fen, "d7")).toBe("b");
});

test("nonexistent piece from fen", () => {
  expect(positionInFen(fen, "D4")).toBe(null);
});

test("out of bounds x piece from fen", () => {
  expect(positionInFen(fen, "I3")).toBe(null);
});

test("out of bounds y piece from fen", () => {
  expect(positionInFen(fen, "G9")).toBe(null);
});

test("out of bounds y=0 piece from fen", () => {
  expect(positionInFen(fen, "A0")).toBe(null);
});
