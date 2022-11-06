import { playstate } from "$lib/store";
import { redirect } from "@sveltejs/kit";
import { get } from "svelte/store";

export function load() {
console.log(get(playstate));
  if (get(playstate) === "hosting") throw redirect(307, "/play/create");
  if (get(playstate) === "playing") throw redirect(307, "/play/game");
}
