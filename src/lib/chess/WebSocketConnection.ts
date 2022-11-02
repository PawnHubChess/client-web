export class WebSocketConnection {
  ws: WebSocket | undefined = undefined;
  messageHandlers: Map<string, ((message: string) => void)[]> = new Map();

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
    handler: (message: string) => void,
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
    const handlers = this.messageHandlers.get(data.type);
    if (handlers) {
      for (const handler of handlers) {
        handler(data);
      }
    }
  }

  private send(message: string) {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      throw new Error("Host is not open");
    }
    this.ws.send(message);
  }
}
