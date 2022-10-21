import { get, writable } from "svelte/store";

let ws: WebSocket;
export const clientOpenState = writable(false);

export function startClient(
  useProd: boolean,
  callback: (output: string) => void,
) {
  ws = new WebSocket(
    useProd ? "wss://api.pawn-hub.de" : "ws://localhost:3000",
  );

  ws.addEventListener("open", () => {
    callback(`Attendee Websocket open to ${ws.url}`);
    clientOpenState.set(true);
  });

  ws.addEventListener("close", () => {
    callback("Attendee Websocket closed");
    clientOpenState.set(false);
  });

  ws.addEventListener("message", (message) => {
    callback("<< " + message.data);
    const data = JSON.parse(message.data);

    if (data.type === "connected-id") {
      callback(`Attendee ID is ${data.id}`);
    }
  });
}

export function stopClient() {
  ws.close();
  clientOpenState.set(false);
}

export function sendConnectionRequest(
  host: string,
  code: string,
  callback: (output: string) => void,
) {
  const msg =
    `{"type": "connect-attendee", "host": "${host}", "code": "${code}"}`;
  sendJson(msg, callback);
}

export function sendJson(message: string, callback: (output: string) => void) {
  if (!get(clientOpenState)) throw new Error("Host is not open");
  ws.send(message);
  callback(">> " + message);
}
