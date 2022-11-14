import { expect, test, vi } from "vitest";
import { WebSocketConnection } from "$lib/chess/WebSocketConnection";
import {
  board_fen,
  client_id,
  current_player_white,
  reconnect_code,
} from "$lib/store";
import { get } from "svelte/store";

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

test("id message handler", () => {
  const connection = new WebSocketConnection() as any;

  connection.handleIdMessage({
    type: "connected-id",
    id: "0987",
    "reconnect-code": "reconnectcode",
  });

  expect(get(client_id)).toBe("0987");
  expect(get(reconnect_code)).toBe("reconnectcode");
});

test("read fen to store", () => {
  const connection = new WebSocketConnection() as any;

  connection.readFEN(
    "r4bn1/ppb1pp1p/1P1kq3/3nQP2/2rp1PB1/1N2p3/P1P1P2P/R1B1K1NR w",
  );

  expect(get(board_fen)).toBe(
    "r4bn1/ppb1pp1p/1P1kq3/3nQP2/2rp1PB1/1N2p3/P1P1P2P/R1B1K1NR",
  );
  expect(get(current_player_white)).toBe(true);
});

test("read fen to store black full fen", () => {
  const connection = new WebSocketConnection() as any;

  connection.readFEN(
    "r4bn1/ppb1pp1p/1P1kq3/3nQP2/2rp1PB1/1N2p3/P1P1P2P/R1B1K1NR b KQkq - 0 1",
  );

  expect(get(board_fen)).toBe(
    "r4bn1/ppb1pp1p/1P1kq3/3nQP2/2rp1PB1/1N2p3/P1P1P2P/R1B1K1NR",
  );
  expect(get(current_player_white)).toBe(false);
});

test("send connection requests", () => {
  const connection = new WebSocketConnection() as any;

  connection.send = vi.fn();

  connection.sendConnectRequest("0987", "1234");

  expect(connection.send).toHaveBeenCalledWith(
    JSON.stringify({
      type: "connect-attendee",
      host: "0987",
      code: "1234",
    }),
  );
});
