import { onMount } from 'svelte';
import { readable, writable, type Writable } from 'svelte/store';

export const debug_local_server = writable<boolean>(false);

export const client_id: Writable<string> = writable();
export const reconnect_code: Writable<string | undefined> = writable();

// todo use idle instead of closed
export const playstate: Writable<string> = writable("closed");
export const board_fen: Writable<string> = writable("");
export const current_player_white: Writable<boolean> = writable(true);