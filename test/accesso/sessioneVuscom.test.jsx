import { renderHook, waitFor } from "@testing-library/react";
import { esciSessioneVuscom, scambiaSessioneVuscom, useSessioneVuscom } from "../../src/index.js";

function risposta(status, body = {}) {
  return vi.fn(async () => ({ ok: status < 400, status, json: async () => body }));
}

afterEach(() => vi.unstubAllGlobals());

test("sessione valida: onAccesso riceve la risposta di login", async () => {
  vi.stubGlobal("fetch", risposta(200, { token: "t" }));
  const onAccesso = vi.fn();
  const { result } = renderHook(() => useSessioneVuscom({ autenticato: false, onAccesso }));
  expect(result.current.verificando).toBe(true);
  await waitFor(() => expect(result.current.verificando).toBe(false));
  expect(onAccesso).toHaveBeenCalledWith({ token: "t" });
  expect(fetch).toHaveBeenCalledWith("/api/auth/sso/scambia", { method: "POST", credentials: "same-origin" });
});

test("nessuna sessione (401): niente onAccesso, si mostra il login", async () => {
  vi.stubGlobal("fetch", risposta(401));
  const onAccesso = vi.fn();
  const { result } = renderHook(() => useSessioneVuscom({ autenticato: false, onAccesso }));
  await waitFor(() => expect(result.current.verificando).toBe(false));
  expect(onAccesso).not.toHaveBeenCalled();
});

test("già autenticato: nessuna chiamata", () => {
  vi.stubGlobal("fetch", risposta(200));
  const { result } = renderHook(() => useSessioneVuscom({ autenticato: true }));
  expect(result.current.verificando).toBe(false);
  expect(fetch).not.toHaveBeenCalled();
});

test("401 contemporanei condividono un solo scambio", async () => {
  vi.stubGlobal("fetch", risposta(200, { token: "t" }));
  const [a, b] = await Promise.all([scambiaSessioneVuscom(), scambiaSessioneVuscom()]);
  expect(a).toEqual({ token: "t" });
  expect(b).toEqual({ token: "t" });
  expect(fetch).toHaveBeenCalledTimes(1);
});

test("rete giù: null, ed esci non solleva", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("offline"); }));
  expect(await scambiaSessioneVuscom()).toBeNull();
  await expect(esciSessioneVuscom()).resolves.toBeUndefined();
});
