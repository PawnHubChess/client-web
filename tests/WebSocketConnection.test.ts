import { expect, test, vi } from "vitest";
import { WebSocketConnection } from "$lib/chess/WebSocketConnection";
import { json } from "stream/consumers";

test("register message handler", () => {
  const connection = new WebSocketConnection();
  const handler1 = vi.fn();
  const handler2 = vi.fn();

  connection.messageHandlers.clear();
  connection.on("message-1", handler1);
  connection.on("message-1", handler2);
  connection.on("message-2", handler1);

  const expectedHandlers = new Map<string, ((data: any) => void)[]>([
    ["message-1", [handler1, handler2]],
    ["message-2", [handler1]],
  ]);

  expect(connection.messageHandlers).toEqual(expectedHandlers);
});

test("deregister message handler", () => {
  const connection = new WebSocketConnection();
  const handler = vi.fn();

  connection.messageHandlers.clear();
  const destroy1 = connection.on("message-1", handler);
  const destroy2 = connection.on("message-1", handler);

  destroy1();

  const expectedHandlers = new Map<string, ((data: any) => void)[]>([
    ["message-1", [handler]],
  ]);

  expect(connection.messageHandlers).toEqual(expectedHandlers);
});

test("uses correct message handler", () => {
  // Cast class to any to access private methods
  const connection = new WebSocketConnection() as any;
  const handler1 = vi.fn();
  const handler2 = vi.fn();
  const handler3 = vi.fn();

  connection.messageHandlers = new Map<string, ((data: any) => void)[]>([
    ["message-1", [handler1, handler3]],
    ["message-2", [handler2]],
  ]);

  const messageEvent = new MessageEvent("message", {
    data: JSON.stringify({
      type: "message-1",
    }),
  });

  connection.handleMessage(messageEvent);
  expect(handler1).toHaveBeenCalled();
  expect(handler2).not.toHaveBeenCalled();
  expect(handler3).toHaveBeenCalled();
});
