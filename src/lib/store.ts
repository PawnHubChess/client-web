import { readable, writable } from 'svelte/store';
import { WebSocketConnection } from './chess/WebSocketConnection';

export const connection = readable(new WebSocketConnection());