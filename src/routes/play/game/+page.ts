import { playstate } from "$lib/store";
import { redirect } from "@sveltejs/kit";
import { get } from "svelte/store";

export function load() {
  if (get(playstate) !== "playing") {
    console.log("redir from page.ts")
    throw redirect(307, "/play");
  }
}
