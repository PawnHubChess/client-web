import { onMount } from 'svelte';
import { readable, writable, type Writable } from 'svelte/store';

export const client_id: Writable<string> = writable();