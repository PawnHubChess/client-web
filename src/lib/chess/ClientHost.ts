import { connection } from "$lib/store";
import type { WebSocketConnection } from "./WebSocketConnection";

export class ClientHost {
  ws: WebSocketConnection | undefined;
  code: string;
  id: string | undefined;

  constructor() {
    connection.subscribe((value: WebSocketConnection) => this.ws = value);
    this.code = "0000";
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws?.prepare().then(() => {
        this.ws?.registerHandler("connected-id", (data) => {
          this.id = data.id;
          resolve();
        });
        this.sendConnectMessage();
      });
    });
  }

  sendConnectMessage() {
    this.ws!.send(JSON.stringify({
      type: "connect-host",
    }));
  }
}
