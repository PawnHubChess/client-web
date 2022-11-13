import { current_player_white } from "$lib/store";
import { get } from "svelte/store";

export function positionToFen(positionString: string) {
  return positionString + (get(current_player_white) ? " w" : " b") +
    " KQkq - 0 1";
}
