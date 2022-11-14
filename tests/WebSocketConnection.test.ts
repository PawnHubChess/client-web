import { expect, test } from "vitest";
import { WebSocketConnection } from "$lib/chess/WebSocketConnection";

test("register message handler", () => {
  const connection = new WebSocketConnection();
  const handler1 = () => {
    true;
  };
  const handler2 = () => {
    true;
  };

  connection.messageHandlers.clear();
  connection.registerHandler("message-1", handler1);
  connection.registerHandler("message-1", handler2);
  connection.registerHandler("message-2", handler1);

  const expectedHandlers = new Map<string, ((data: any) => void)[]>([
    ["message-1", [handler1, handler2]],
    ["message-2", [handler1]],
  ]);

  expect(connection.messageHandlers).toEqual(expectedHandlers);
});
