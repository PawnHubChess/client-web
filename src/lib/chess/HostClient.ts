import { client_id, playstate } from "$lib/store";
import { get, writable } from "svelte/store";
import { connection } from "./WebSocketConnection";

export class HostClient {
  code: string | undefined;
  id: string | undefined;

  constructor() {
    client_id.subscribe((value: string) => this.id = value);
  }

  async connect(): Promise<void> {
    if (get(playstate) !== "closed") return;
    playstate.set("hosting");

    await connection().prepare();

    this.registerConnectRequestHandler();
    this.sendConnectMessage();
    this.startCodeGenerator();
  }

  sendConnectMessage() {
    connection().send(JSON.stringify({
      type: "connect-host",
    }));
  }

  registerConnectRequestHandler() {
    connection().on("verify-attendee-request", (data) => {
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
