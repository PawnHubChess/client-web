import { get, writable } from "svelte/store";

let ws: WebSocket;
export const hostOpenState = writable(false);
export const hostId = writable();
export const lastRequest = writable();

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
    } else if (data.type === "verify-attendee-request") {
        lastRequest.set(data.clientId)
    }
  })
}

export function stopHost() {
  ws.close();
  hostOpenState.set(false);
  hostId.set(undefined)
}

export function sendJson(message: string, callback: (output: string) => void) {
  if (!get(hostOpenState)) throw new Error("Host is not open");
  ws.send(message);
  callback(">> " + message);
}

export function acceptLastRequest(callback: (output: string) => void) {
  const msg = `{"type": "accept-attendee-request", "clientId": "${get(lastRequest)}"}`
  sendJson(msg, callback)
  lastRequest.set(undefined)
}

export function declineLastRequest(callback: (output: string) => void) {
  const msg = `{"type": "decline-attendee-request", "clientId": "${get(lastRequest)}"}`
  sendJson(msg, callback)
  lastRequest.set(undefined)
}
