// @vitest-environment jsdom
import { it, expect, vi, afterEach } from "vitest";
import { rpc, createAccountStore } from "../account.js";
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

it.each([200, 204])(
  "accepts an empty successful HTTP %s write response",
  async (status) => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(null, { status })),
    );
    await expect(rpc("rejstream_write", {})).resolves.toBeNull();
  },
);
it("preserves successful JSON responses and HTTP error status/code", async () => {
  const fetcher = vi
    .fn()
    .mockResolvedValueOnce(
      new Response('[{"kind":"favorite"}]', { status: 200 }),
    )
    .mockResolvedValueOnce(
      new Response('{"message":"Rejected", "code":"P0001"}', { status: 400 }),
    );
  vi.stubGlobal("fetch", fetcher);
  await expect(rpc("rejstream_read", {})).resolves.toEqual([
    { kind: "favorite" },
  ]);
  await expect(rpc("rejstream_write", {})).rejects.toMatchObject({
    status: 400,
    code: "P0001",
    message: "Rejected",
  });
});
it("handles non-JSON server errors without losing their HTTP status", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response("Gateway unavailable", { status: 503 })),
  );
  await expect(rpc("rejstream_write", {})).rejects.toMatchObject({
    status: 503,
  });
});
it("clears the real transport queue after void writes instead of reporting a false sync failure", async () => {
  vi.useFakeTimers();
  const fetcher = vi.fn(async (url) => {
    if (url.endsWith("community_whoami"))
      return new Response('{"username":"test"}');
    if (url.endsWith("rejstream_read")) return new Response("[]");
    return new Response(null, { status: 204 });
  });
  vi.stubGlobal("fetch", fetcher);
  const store = createAccountStore(rpc, null);
  await store.restore({ token: "test-fixture-not-a-real-token" });
  store.storage().setItem("rej-favorites", '["drones"]');
  await store.flush();
  expect(store.state().error).toBe("");
  await vi.advanceTimersByTimeAsync(60000);
  await store.flush();
  expect(
    fetcher.mock.calls.filter(([url]) => url.endsWith("rejstream_write")),
  ).toHaveLength(1);
});
