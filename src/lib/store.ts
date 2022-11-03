import { onMount } from 'svelte';
import { readable, writable, type Writable } from 'svelte/store';

export const client_id: Writable<string> = writable();
export const reconnect_code: Writable<string> = writable();

export const playstate: Writable<string> = writable("closed");