import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import {
  Dialog,
  ConfirmDialog,
  ToastProvider,
  useToast,
} from "../../src/index.js";

test("dialog closes on Escape and restores focus", async () => {
  function Demo() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>Apri</button>
        <Dialog open={open} onClose={() => setOpen(false)} title="Titolo">
          <button>Dentro</button>
        </Dialog>
      </>
    );
  }
  render(<Demo />);
  const apri = screen.getByRole("button", { name: "Apri" });
  await userEvent.click(apri);
  expect(screen.getByRole("dialog", { name: "Titolo" })).toBeInTheDocument();
  await userEvent.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(apri).toHaveFocus();
});

test("dialog moves focus inside and traps Tab", async () => {
  render(
    <Dialog open onClose={() => {}} title="T">
      <button>Uno</button>
      <button>Due</button>
    </Dialog>,
  );
  const dialog = screen.getByRole("dialog");
  expect(dialog).toContainElement(document.activeElement);
  expect(dialog).toHaveAttribute("aria-modal", "true");
  const due = screen.getByRole("button", { name: "Due" });
  due.focus();
  await userEvent.tab();
  expect(dialog).toContainElement(document.activeElement);
  expect(document.activeElement).not.toBe(due);
  await userEvent.tab({ shift: true });
  expect(dialog).toContainElement(document.activeElement);
});

test("dialog backdrop click closes unless disabled", async () => {
  const onClose = vi.fn();
  const { rerender } = render(
    <Dialog open onClose={onClose} title="T">
      x
    </Dialog>,
  );
  await userEvent.click(screen.getByTestId("dialog-backdrop"));
  expect(onClose).toHaveBeenCalledTimes(1);
  rerender(
    <Dialog open onClose={onClose} title="T" closeOnBackdrop={false}>
      x
    </Dialog>,
  );
  await userEvent.click(screen.getByTestId("dialog-backdrop"));
  expect(onClose).toHaveBeenCalledTimes(1);
});

test("confirm requires typed text", async () => {
  const onConfirm = vi.fn();
  render(
    <ConfirmDialog
      open
      onClose={() => {}}
      onConfirm={onConfirm}
      title="Reinvia"
      requireText="REINVIA"
    >
      Sicuro?
    </ConfirmDialog>,
  );
  const ok = screen.getByRole("button", { name: "Conferma" });
  expect(ok).toBeDisabled();
  await userEvent.type(screen.getByLabelText(/scrivi reinvia/i), "reinvia");
  expect(ok).toBeDisabled();
  await userEvent.clear(screen.getByLabelText(/scrivi reinvia/i));
  await userEvent.type(screen.getByLabelText(/scrivi reinvia/i), "REINVIA");
  expect(ok).toBeEnabled();
});

test("confirm calls once even on double click, closes on success", async () => {
  let risolvi;
  const onConfirm = vi.fn(
    () =>
      new Promise((r) => {
        risolvi = r;
      }),
  );
  const onClose = vi.fn();
  render(
    <ConfirmDialog open onClose={onClose} onConfirm={onConfirm} title="Spendi">
      x
    </ConfirmDialog>,
  );
  const ok = screen.getByRole("button", { name: "Conferma" });
  await userEvent.dblClick(ok);
  expect(onConfirm).toHaveBeenCalledTimes(1);
  risolvi();
  await waitFor(() => expect(onClose).toHaveBeenCalled());
});

test("confirm ignores a second call while pending", async () => {
  let risolvi;
  const onConfirm = vi.fn(
    () =>
      new Promise((r) => {
        risolvi = r;
      }),
  );
  render(
    <ConfirmDialog open onClose={() => {}} onConfirm={onConfirm} title="Spendi">
      x
    </ConfirmDialog>,
  );
  const ok = screen.getByRole("button", { name: "Conferma" });
  await userEvent.click(ok);
  expect(ok).toBeDisabled();
  act(() => {
    ok.click();
  });
  expect(onConfirm).toHaveBeenCalledTimes(1);
  await act(async () => {
    risolvi();
  });
});

test("confirm cannot be dismissed while pending", async () => {
  let risolvi;
  const onClose = vi.fn();
  render(
    <ConfirmDialog
      open
      onClose={onClose}
      onConfirm={() =>
        new Promise((r) => {
          risolvi = r;
        })
      }
      title="Spendi"
    >
      x
    </ConfirmDialog>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Conferma" }));
  await userEvent.keyboard("{Escape}");
  expect(onClose).not.toHaveBeenCalled();
  await act(async () => {
    risolvi();
  });
  expect(onClose).toHaveBeenCalledTimes(1);
});

test("confirm stays open and shows error on failure, then can retry", async () => {
  const onClose = vi.fn();
  const onConfirm = vi.fn(() => Promise.reject(new Error("Credito esaurito")));
  render(
    <ConfirmDialog open onClose={onClose} onConfirm={onConfirm} title="Spendi">
      x
    </ConfirmDialog>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Conferma" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Credito esaurito",
  );
  expect(onClose).not.toHaveBeenCalled();
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Conferma" })).toBeEnabled(),
  );
  await userEvent.click(screen.getByRole("button", { name: "Conferma" }));
  await waitFor(() => expect(onConfirm).toHaveBeenCalledTimes(2));
  await screen.findByRole("alert");
});

test("confirm failure without message falls back, and sync onConfirm closes", async () => {
  const onClose = vi.fn();
  const { rerender } = render(
    <ConfirmDialog
      open
      onClose={onClose}
      onConfirm={() => Promise.reject({})}
      title="S"
    >
      x
    </ConfirmDialog>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Conferma" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Operazione non riuscita",
  );
  rerender(
    <ConfirmDialog open onClose={onClose} onConfirm={() => {}} title="S">
      x
    </ConfirmDialog>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Conferma" }));
  await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
});

test("confirm resets error and typed text when closed", async () => {
  const props = {
    onClose: () => {},
    onConfirm: () => Promise.reject(new Error("boom")),
    title: "T",
    requireText: "OK",
  };
  const { rerender } = render(
    <ConfirmDialog open {...props}>
      x
    </ConfirmDialog>,
  );
  await userEvent.type(screen.getByLabelText(/scrivi ok/i), "OK");
  await userEvent.click(screen.getByRole("button", { name: "Conferma" }));
  await screen.findByRole("alert");
  rerender(
    <ConfirmDialog open={false} {...props}>
      x
    </ConfirmDialog>,
  );
  rerender(
    <ConfirmDialog open {...props}>
      x
    </ConfirmDialog>,
  );
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(screen.getByLabelText(/scrivi ok/i)).toHaveValue("");
});

test("toast shows and dismisses", async () => {
  function Demo() {
    const { toast } = useToast();
    return <button onClick={() => toast({ title: "Salvato" })}>Vai</button>;
  }
  render(
    <ToastProvider>
      <Demo />
    </ToastProvider>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Vai" }));
  expect(screen.getByText("Salvato")).toBeInTheDocument();
  await userEvent.click(
    screen.getByRole("button", { name: /chiudi notifica/i }),
  );
  expect(screen.queryByText("Salvato")).not.toBeInTheDocument();
});

test("toast auto-dismisses after duration", () => {
  vi.useFakeTimers();
  try {
    function Demo() {
      const { toast } = useToast();
      return (
        <button
          onClick={() =>
            toast({ title: "Ciao", description: "dettaglio", duration: 1000 })
          }
        >
          Vai
        </button>
      );
    }
    render(
      <ToastProvider>
        <Demo />
      </ToastProvider>,
    );
    act(() => {
      screen.getByRole("button", { name: "Vai" }).click();
    });
    expect(screen.getByRole("status")).toHaveTextContent("dettaglio");
    act(() => {
      vi.advanceTimersByTime(1001);
    });
    expect(screen.queryByText("Ciao")).not.toBeInTheDocument();
  } finally {
    vi.useRealTimers();
  }
});
