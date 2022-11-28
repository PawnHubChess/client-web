import { expect, test, vi } from "vitest";
import { WebSocketConnection } from "$lib/chess/WebSocketConnection";
import {
  board_fen,
  client_id,
  current_player_white,
  reconnect_code,
} from "$lib/store";
import { get } from "svelte/store";


test("send connection requests", () => {
  assert(false)

  const connection = new WebSocketConnection();
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