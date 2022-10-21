import { get, writable } from "svelte/store";

let ws: WebSocket;
export const hostRunningState = writable(false);

export function startHost(
  useProd: boolean,
  callback: (output: string) => void,
) {
  ws = new WebSocket(
    useProd ? "wss://api.pawn-hub.de" : "ws://localhost:3000",
  );

  ws.addEventListener("open", () => {
    callback(`Host Websocket open to ${ws.url}`);
    hostRunningState.set(true);

    sendJson('{"type": "connect-host"}', callback);
  });

  ws.addEventListener("close", () => {
    callback("Host Websocket closed");
    hostRunningState.set(false);
  });
}

export function stopHost() {
  ws.close();
  hostRunningState.set(false);
}

export function sendJson(message: string, callback: (output: string) => void) {
  if (!get(hostRunningState)) throw new Error("Host is not running");
  ws.send(message);
  callback(">> " + message);
}
