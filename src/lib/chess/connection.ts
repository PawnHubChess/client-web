import { webSocket } from "$lib/store";

let ws: WebSocket;
webSocket.subscribe((value) => ws = value as WebSocket);

const messageHandlers: Map<string, ((message: string) => void)[]> = new Map();

export function registerMessageHandler(
  type: string,
  handler: (message: string) => void,
) {
  let handlers = messageHandlers.get(type);
  if (!handlers) {
    handlers = [];
    messageHandlers.set(type, handlers);
  }
  handlers.push(handler);
}

function handleMessage(message: MessageEvent) {
  const data = JSON.parse(message.data);
  const handlers = messageHandlers.get(data.type);
  if (handlers) {
    for (const handler of handlers) {
      handler(data);
    }
  }
}

export function prepareWebSocket(): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    if (ws?.readyState === WebSocket.OPEN) {
      resolve(ws);
      return;
    }

    webSocket.set(new WebSocket("wss://api.pawn-hub.de"));
    ws.onopen = () => resolve(ws);
    ws.onmessage = (message) => handleMessage(message);
  });
}



// wip
export function sendAttendeeConnectRequest(hostId: string, code: string) {
    const msg = `{"type": "connect-attendee", "host": "${hostId}", "code": "${code}"}`;
    ws.send(msg);
}