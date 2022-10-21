import { get, writable } from "svelte/store";

let ws: WebSocket;
export const hostOpenState = writable(false);
export const hostId = writable("");

export function startHost(
  useProd: boolean,
  callback: (output: string) => void,
) {
  ws = new WebSocket(
    useProd ? "wss://api.pawn-hub.de" : "ws://localhost:3000",
  );

  ws.addEventListener("open", () => {
    callback(`Host Websocket open to ${ws.url}`);
    hostOpenState.set(true);

    sendJson('{"type": "connect-host"}', callback);
  });

  ws.addEventListener("close", () => {
    callback("Host Websocket closed");
    hostOpenState.set(false);
  });

  ws.addEventListener("message", message => {
    callback("<< " + message.data)
    const data = JSON.parse(message.data)

    if (data.type === "connected-id") {
        callback(`Host ID is ${data.id}`)
        hostId.set(data.id)
    }
  })
}

export function stopHost() {
  ws.close();
  hostOpenState.set(false);
  hostId.set()
}

export function sendJson(message: string, callback: (output: string) => void) {
  if (!get(hostOpenState)) throw new Error("Host is not open");
  ws.send(message);
  callback(">> " + message);
}
