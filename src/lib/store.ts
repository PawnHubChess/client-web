import { readable, writable, type Writable } from 'svelte/store';
import type { ClientHost } from './chess/ClientHost';
import { WebSocketConnection } from './chess/WebSocketConnection';

export const connection = readable(new WebSocketConnection());
export const hostClient: Writable<ClientHost> = writable();