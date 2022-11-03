import { client_id } from "$lib/store";
import { writable } from "svelte/store";
import { connection } from "./WebSocketConnection";

export class HostClient {
  code: string | undefined;
  counter = 1;
  id: string | undefined;
  state = WebSocket.CLOSED;

  constructor() {
    client_id.subscribe((value: string) => this.id = value);
  }

  async connect(): Promise<void> {
    this.state = WebSocket.CONNECTING;
    await connection().prepare();

    connection().registerHandler("connected-id", (data) => {
      client_id.set(data.id);
      this.startCodeGenerator();

      this.state = WebSocket.OPEN;
    });

    this.sendConnectMessage();
  }

  sendConnectMessage() {
    connection().send(JSON.stringify({
      type: "connect-host",
    }));
  }

  startCodeGenerator() {
    host_code.set(this.generateCode());
    setInterval(() => {
      host_code.set(this.generateCode());
    }, 5 * 60 * 1000);
  }

  generateCode() {
    return (Math.floor(Math.random() * 8998) + 1001).toString();
  }
}

export const host_code = writable<string>();

let _hostClient: HostClient | undefined = undefined;
export function hostClient(): HostClient {
  if (!_hostClient) {
    _hostClient = new HostClient();
  }
  return _hostClient;
}
