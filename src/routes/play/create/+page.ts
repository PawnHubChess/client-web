import { playstate } from "$lib/store";
import { redirect } from "@sveltejs/kit";
import { get } from "svelte/store";

export function load() {
  if (get(playstate) === "playing") throw redirect(307, "/play/game");
}
