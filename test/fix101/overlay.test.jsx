import { render, screen, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  ConfirmDialog,
  Dialog,
  InfoTip,
  Select,
  Tooltip,
} from "../../src/index.js";

const opzioni = [
  { value: "a", label: "Alta" },
  { value: "b", label: "Bassa" },
];

test("Escape on an open Select inside a Dialog closes only the list", async () => {
  const onClose = vi.fn();
  render(
    <Dialog open onClose={onClose} title="Modifica">
      <Select aria-label="Priorità" value="a" options={opzioni} />
    </Dialog>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Priorità" }));
  expect(screen.getByRole("listbox")).toBeInTheDocument();
  await userEvent.keyboard("{Escape}");
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  expect(onClose).not.toHaveBeenCalled();
  await userEvent.keyboard("{Escape}");
  expect(onClose).toHaveBeenCalledTimes(1);
});

test("Escape on a visible tooltip inside a Dialog closes only the tooltip", async () => {
  const onClose = vi.fn();
  render(
    <Dialog open onClose={onClose} title="T">
      <InfoTip>Spiegazione</InfoTip>
    </Dialog>,
  );
  act(() => {
    screen.getByRole("button", { name: "Maggiori informazioni" }).focus();
  });
  expect(await screen.findByRole("tooltip")).toBeInTheDocument();
  await userEvent.keyboard("{Escape}");
  expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  expect(onClose).not.toHaveBeenCalled();
});

test("select list is portalled with fixed position out of clipping parents", async () => {
  render(
    <div data-testid="clip" style={{ overflow: "hidden" }}>
      <Select aria-label="Priorità" value="a" options={opzioni} />
    </div>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Priorità" }));
  const list = screen.getByRole("listbox");
  expect(screen.getByTestId("clip")).not.toContainElement(list);
  expect(list.style.position).toBe("fixed");
  // Clicking an option inside the portal still picks it.
  await userEvent.click(screen.getByRole("option", { name: "Bassa" }));
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
});

function rect(top, height = 40) {
  return {
    top,
    bottom: top + height,
    left: 10,
    right: 210,
    width: 200,
    height,
    x: 10,
    y: top,
    toJSON() {},
  };
}

test("select list flips upward near the viewport bottom and follows scroll", async () => {
  render(<Select aria-label="Priorità" value="a" options={opzioni} />);
  const trigger = screen.getByRole("button", { name: "Priorità" });
  const r = { current: rect(window.innerHeight - 50) };
  trigger.getBoundingClientRect = () => r.current;
  await userEvent.click(trigger);
  const list = screen.getByRole("listbox");
  expect(list.style.bottom).toBe(`${50 + 4}px`);
  expect(list.style.top).toBe("");
  r.current = rect(100);
  act(() => {
    fireEvent.scroll(window);
  });
  expect(list.style.top).toBe(`${140 + 4}px`);
  expect(list.style.bottom).toBe("");
});

test("tooltip keeps the child's own aria-describedby", async () => {
  render(
    <Tooltip content="Aiuto">
      <button aria-describedby="nota">Bersaglio</button>
    </Tooltip>,
  );
  const b = screen.getByRole("button", { name: "Bersaglio" });
  await userEvent.hover(b);
  const tip = await screen.findByRole("tooltip");
  expect(b.getAttribute("aria-describedby")).toBe(`nota ${tip.id}`);
});

test("infotip wide prop wraps JSX content", async () => {
  render(
    <InfoTip wide>
      <span>Contenuto lungo</span>
    </InfoTip>,
  );
  await userEvent.tab();
  expect(await screen.findByRole("tooltip")).toHaveClass("whitespace-normal");
});

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

test("confirm trims typed text and shows string rejections as-is", async () => {
  const onConfirm = vi.fn().mockRejectedValue("Credito esaurito");
  render(
    <ConfirmDialog
      open
      onClose={() => {}}
      onConfirm={onConfirm}
      title="T"
      requireText="OK"
    >
      x
    </ConfirmDialog>,
  );
  await userEvent.type(screen.getByLabelText(/scrivi ok/i), " OK ");
  await userEvent.click(screen.getByRole("button", { name: "Conferma" }));
  expect(onConfirm).toHaveBeenCalledTimes(1);
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Credito esaurito",
  );
});

test("confirm disables the header close button while pending", async () => {
  const d = deferred();
  render(
    <ConfirmDialog
      open
      onClose={() => {}}
      onConfirm={() => d.promise}
      title="T"
    >
      x
    </ConfirmDialog>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Conferma" }));
  expect(screen.getByRole("button", { name: "Chiudi" })).toBeDisabled();
  await act(async () => {
    d.resolve();
    await d.promise;
  });
});

test("a stale pending confirm does not affect the next opening", async () => {
  const d = deferred();
  const onClose = vi.fn();
  const props = { onClose, onConfirm: () => d.promise, title: "T" };
  const { rerender } = render(
    <ConfirmDialog open {...props}>
      x
    </ConfirmDialog>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Conferma" }));
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
  expect(screen.getByRole("button", { name: "Conferma" })).not.toBeDisabled();
  await act(async () => {
    d.reject(new Error("tardi"));
    await d.promise.catch(() => {});
  });
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(onClose).not.toHaveBeenCalled();
});
