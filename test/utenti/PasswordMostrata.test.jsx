import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import PasswordMostrata from "../../src/utenti/PasswordMostrata.jsx";

// fireEvent, not user-event: user-event installs its own navigator.clipboard stub.
const clipboardOriginale = Object.getOwnPropertyDescriptor(navigator, "clipboard");

function impostaClipboard(valore) {
  // `undefined` = plain HTTP (INTEGRA): the async clipboard API is not exposed.
  Object.defineProperty(navigator, "clipboard", { value: valore, configurable: true });
}

afterEach(() => {
  if (clipboardOriginale) Object.defineProperty(navigator, "clipboard", clipboardOriginale);
  else delete navigator.clipboard;
  delete document.execCommand;
  vi.restoreAllMocks();
});

describe("PasswordMostrata", () => {
  it("copies with the async clipboard API when available", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    impostaClipboard({ writeText });
    render(<PasswordMostrata password="segreta-123" />);
    fireEvent.click(screen.getByRole("button", { name: "Copia" }));
    expect(await screen.findByText("Copiata")).toBeInTheDocument();
    expect(writeText).toHaveBeenCalledWith("segreta-123");
  });

  it("falls back to execCommand('copy') over plain HTTP", async () => {
    impostaClipboard(undefined);
    document.execCommand = vi.fn().mockReturnValue(true);
    render(<PasswordMostrata password="segreta-123" />);
    fireEvent.click(screen.getByRole("button", { name: "Copia" }));
    expect(await screen.findByText("Copiata")).toBeInTheDocument();
    expect(document.execCommand).toHaveBeenCalledWith("copy");
    expect(window.getSelection().toString()).toBe("segreta-123");
  });

  it("tells the admin to copy by hand when no copy method works", async () => {
    impostaClipboard(undefined);
    document.execCommand = vi.fn().mockReturnValue(false);
    render(<PasswordMostrata password="segreta-123" />);
    fireEvent.click(screen.getByRole("button", { name: "Copia" }));
    expect(await screen.findByText("Copia non disponibile: seleziona e copia a mano")).toBeInTheDocument();
  });

  it("clears its reset timer on unmount", async () => {
    impostaClipboard({ writeText: vi.fn().mockResolvedValue(undefined) });
    const set = vi.spyOn(globalThis, "setTimeout");
    const clear = vi.spyOn(globalThis, "clearTimeout");
    const { unmount } = render(<PasswordMostrata password="x" />);
    fireEvent.click(screen.getByRole("button", { name: "Copia" }));
    await screen.findByText("Copiata");
    const i = set.mock.calls.findIndex(([, ms]) => ms === 2000);
    expect(i).toBeGreaterThanOrEqual(0);
    const id = set.mock.results[i].value;
    unmount();
    expect(clear).toHaveBeenCalledWith(id);
  });
});
