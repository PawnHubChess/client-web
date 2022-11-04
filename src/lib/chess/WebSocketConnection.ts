import { goto } from "$app/navigation";
import { board_fen, client_id, debug_local_server, playstate, reconnect_code } from "$lib/store";
import { get } from "svelte/store";

export class WebSocketConnection {
  ws: WebSocket | undefined = undefined;
  messageHandlers: Map<string, ((message: string) => void)[]> = new Map();

  constructor() {
    this.registerHandler("connected-id", (data) => this.handleIdMessage(data));
    this.registerHandler("matched", (data) => this.handleMatchedMessage(data));
    this.registerHandler(
      "reconnected",
      (data) => this.handleReconnectedMessage(data),
    );
  }

  prepare(): Promise<void> {
    return new Promise((resolve) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      this.ws = new WebSocket(!get(debug_local_server) ? "wss://api.pawn-hub.de" : "ws://localhost:3000");
      this.ws.onopen = () => resolve();
      this.ws.onmessage = (message) => this.handleMessage(message);
      this.ws.onclose = () => {
        if (get(reconnect_code)) this.handleConnectionClosed();
      };

      if (get(debug_local_server)) console.warn("Using local server");
    });
  }

  async handleConnectionClosed() {
    // Reconnect using provided code
    await this.prepare();

    const code = get(reconnect_code);
    reconnect_code.set(undefined);

    this.send(JSON.stringify({
      "type": "reconnect",
      "id": get(client_id),
      "reconnect-code": code,
    }));

  }

  // Message handlers

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

  handleIdMessage(data: any) {
    client_id.set(data.id);
    reconnect_code.set(data["reconnect-code"]);
  }

  handleMatchedMessage(data: any) {
    playstate.set("playing");
    const fen = data.fen as string;
    board_fen.set(fen.substring(0, fen.indexOf(" ")));
    goto("/play/game");
  }

  handleReconnectedMessage(data: any) {
    reconnect_code.set(data["reconnect-code"]);
    console.log("Reconnected");
  }

  // Emit messages

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

  sendMove(from: string, to: string) {
    this.send(JSON.stringify({
      type: "send-move",
      from: from,
      to: to,
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

export function determineIsGameId(input: string) {
  return Number(input) < 1000;
}
