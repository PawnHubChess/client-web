import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { playstate } from "$lib/store";
import { onMount } from "svelte";

export class WebSocketConnection {
  ws: WebSocket | undefined = undefined;
  messageHandlers: Map<string, ((message: string) => void)[]> = new Map();

  constructor() {
    this.registerHandler("matched", (data) => this.handleMatchedMessage(data));
  }

  prepare(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      this.ws = new WebSocket("wss://api.pawn-hub.de");
      this.ws.onopen = () => resolve();
      this.ws.onmessage = (message) => this.handleMessage(message);
    });
  }

  registerHandler(
    type: string,
    handler: (message: any) => void,
  ) {
    let handlers = this.messageHandlers.get(type);
    if (!handlers) {
      handlers = [];
      this.messageHandlers.set(type, handlers);
    }
    handlers.push(handler);
  }

  private handleMessage(message: MessageEvent) {
    const data = JSON.parse(message.data);
    console.log("Received message: " + message.data); 

    const handlers = this.messageHandlers.get(data.type);
    if (handlers) {
      for (const handler of handlers) {
        handler(data);
      }
    }
  }

  handleMatchedMessage(data: any) {
    playstate.set("playing")
    goto("/play/game");
  }

  send(message: string) {
    console.log("Sending message: " + message);
    if (this.ws?.readyState !== WebSocket.OPEN) {
      throw new Error("Host is not open");
    }
    this.ws.send(message);
  }

  sendConnectRequest(hostId: string, code: string) {
    this.send(JSON.stringify({
      type: "connect-attendee",
      host: hostId,
      code: code,
    }));
  }
}

let _connection: WebSocketConnection | undefined = undefined;

export function connection(): WebSocketConnection {
  if (!_connection) {
    _connection = new WebSocketConnection();
  }
  return _connection;
}
