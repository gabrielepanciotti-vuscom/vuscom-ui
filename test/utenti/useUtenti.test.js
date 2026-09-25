import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useUtenti } from "../../src/utenti/useUtenti.js";
import { ruoliAssegnabili, livello } from "../../src/utenti/ruoli.js";

describe("useUtenti", () => {
  it("loads the list and reloads with the disabled flag", async () => {
    const client = { get: vi.fn().mockResolvedValue([{ id: 1, username: "mario" }]) };
    const { result, rerender } = renderHook((p) => useUtenti(p), {
      initialProps: { client, basePath: "/api/utenti", includiDisattivati: false },
    });
    expect(result.current.caricando).toBe(true);
    await waitFor(() => expect(result.current.caricando).toBe(false));
    expect(result.current.utenti).toHaveLength(1);
    expect(client.get).toHaveBeenCalledWith("/api/utenti?includi_disattivati=false");

    rerender({ client, basePath: "/api/utenti", includiDisattivati: true });
    await waitFor(() =>
      expect(client.get).toHaveBeenCalledWith("/api/utenti?includi_disattivati=true"),
    );
  });

  it("exposes the error message and recovers on ricarica", async () => {
    const err = Object.assign(new Error("boom"), { status: 403, body: { detail: "Serve almeno manager" } });
    const client = { get: vi.fn().mockRejectedValueOnce(err).mockResolvedValueOnce([]) };
    const { result } = renderHook(() =>
      useUtenti({ client, basePath: "/api/utenti", includiDisattivati: false }),
    );
    await waitFor(() => expect(result.current.errore).toBe("Serve almeno manager"));
    await act(() => result.current.ricarica());
    expect(result.current.errore).toBeNull();
    expect(result.current.utenti).toEqual([]);
  });
});

describe("ruoli", () => {
  it("limits assignable roles by actor level", () => {
    expect(ruoliAssegnabili("manager")).toEqual(["viewer", "manager"]);
    expect(ruoliAssegnabili("admin")).toEqual(["viewer", "manager", "admin"]);
    expect(ruoliAssegnabili("superadmin")).toEqual(["viewer", "manager", "admin", "superadmin"]);
    expect(livello("boh")).toBe(0);
  });
});
