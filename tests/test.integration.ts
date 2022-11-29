// @vitest-environment jsdom

import { expect, test, vi } from "vitest";
import { WebSocketConnection } from "$lib/chess/WebSocketConnection";
import {
  debug_local_server,
} from "$lib/store";


test("match players", async () => {
  debug_local_server.set(true);
  const connection = new WebSocketConnection();
  await connection.prepare();
  const matchedSpy = vi.fn();
  connection.on("matched", matchedSpy);

  connection.sendConnectRequest("0000", "1234");

  await new Promise(r => setTimeout(r, 100));

  expect(matchedSpy).toHaveBeenCalledOnce();
});