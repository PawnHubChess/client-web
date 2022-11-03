import { client_id } from "$lib/store";
import { get, writable } from "svelte/store";
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
    if (this.state === WebSocket.OPEN) return;

    this.state = WebSocket.CONNECTING;
    await connection().prepare();

    this.registerIdHandler();
    this.registerConnectRequestHandler();
    this.sendConnectMessage();
  }

  sendConnectMessage() {
    connection().send(JSON.stringify({
      type: "connect-host",
    }));
  }

  registerIdHandler() {
    connection().registerHandler("connected-id", (data) => {
      client_id.set(data.id);
      this.startCodeGenerator();

      this.state = WebSocket.OPEN;
    });
  }

  registerConnectRequestHandler() {
    connection().registerHandler("verify-attendee-request", (data) => {
      console.log(data.code);
      console.log(get(host_code));
      const accept = data.code === get(host_code);
      const reply_type = accept
        ? "accept-attendee-request"
        : "decline-attendee-request";

      connection().send(JSON.stringify({
        "type": reply_type,
        "clientId": data.clientId,
      }));
    });
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
