import { get, writable } from "svelte/store";

let ws: WebSocket;
export const hostOpenState = writable(false);
export const hostId = writable();
export const lastRequest = writable();

// This is not DRY because this test host will be removed in a later stage of development

export function startHost(
  useCloud: boolean,
  callback: (output: string) => void,
) {
  ws = new WebSocket(
    useCloud ? "wss://api.pawn-hub.de" : "ws://localhost:3000",
  );

  if (useCloud) callback("Attempting to connect to Google Cloud");

  ws.addEventListener("open", () => {
    callback(`Host Websocket open to ${ws.url}`);
    hostOpenState.set(true); // to trigger subscribe on connection error
    hostOpenState.set(true);

    send('{"type": "connect-host"}', callback);
  });

  ws.addEventListener("close", () => {
    callback("Host Websocket closed");
    hostOpenState.set(true); // to trigger subscribe on connection error
    hostOpenState.set(false);
  });

  ws.addEventListener("message", (message) => {
    callback("<< " + message.data);
    const data = JSON.parse(message.data);

    if (data.type === "connected-id") {
      callback(`Host ID is ${data.id}`);
      hostId.set(data.id);
    } else if (data.type === "verify-attendee-request") {
      lastRequest.set(data.clientId);
    }
  });
}

export function stopHost() {
  ws.close();
  hostOpenState.set(false);
  hostId.set(undefined);
}

export function send(message: string, callback: (output: string) => void) {
  if (!get(hostOpenState)) throw new Error("Host is not open");
  ws.send(message);
  callback(">> " + message);
}

export function acceptLastRequest(callback: (output: string) => void) {
  const msg = `{"type": "accept-attendee-request", "clientId": "${
    get(lastRequest)
  }"}`;
  send(msg, callback);
  lastRequest.set(undefined);
}

export function declineLastRequest(callback: (output: string) => void) {
  const msg = `{"type": "decline-attendee-request", "clientId": "${
    get(lastRequest)
  }"}`;
  send(msg, callback);
  lastRequest.set(undefined);
}
