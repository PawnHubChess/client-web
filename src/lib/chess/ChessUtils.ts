import { current_player_white } from "$lib/store";
import { get } from "svelte/store";

export function positionToFen(positionString: string) {
  return positionString + (get(current_player_white) ? " w" : " b") +
    " KQkq - 0 1";
}

// Get a specific position from a fen string
export function positionInFen(fen: string, position: string): string | null {
  if (!position.match(/^[a-hA-H][0-8]$/)) return null;
  const row = fen.split("/")[8 - parseInt(position[1])];

  const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H"];
  let indexLeft = alphabet.indexOf(position[0].toUpperCase()) + 1;

  for (const char in [...row]) {
    if (row[char].match(/\d/)) indexLeft -= parseInt(row[char]);
    else indexLeft--;

    if (indexLeft === 0) return row[char];
    else if (indexLeft < 0) return null;
  }

  return null;
}