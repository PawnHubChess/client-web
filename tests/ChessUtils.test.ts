import { expect, test } from "vitest";
import { positionToFen } from "$lib/chess/ChessUtils";
import { current_player_white } from "$lib/store";

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
