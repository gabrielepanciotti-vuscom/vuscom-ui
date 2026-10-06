import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Plus } from "lucide-react";
import {
  Button,
  IconButton,
  Badge,
  ProgressBar,
  Input,
  Textarea,
  Spinner,
  StatusDot,
  Kbd,
} from "../../src/index.js";

test("loading disables the button even if disabled={false} is passed", async () => {
  const onClick = vi.fn();
  render(
    <Button loading disabled={false} onClick={onClick}>
      Invia
    </Button>,
  );
  const b = screen.getByRole("button", { name: /invia/i });
  expect(b).toBeDisabled();
  expect(b).toHaveAttribute("aria-busy", "true");
  await userEvent.click(b);
  expect(onClick).not.toHaveBeenCalled();
});

test("button defaults to type=button and forwards ref and click", async () => {
  const onClick = vi.fn();
  const ref = createRef();
  render(
    <Button
      ref={ref}
      onClick={onClick}
      icon={Plus}
      variant="outline"
      size="sm"
      fullWidth
    >
      Ok
    </Button>,
  );
  const b = screen.getByRole("button");
  expect(b).toHaveAttribute("type", "button");
  expect(ref.current).toBe(b);
  await userEvent.click(b);
  expect(onClick).toHaveBeenCalledTimes(1);
});

test("icon button exposes its label", () => {
  render(<IconButton icon={Plus} label="Aggiungi" />);
  expect(screen.getByRole("button", { name: "Aggiungi" })).toBeInTheDocument();
});

test("badge tones render text", () => {
  render(
    <Badge tone="success" dot>
      Attivo
    </Badge>,
  );
  expect(screen.getByText("Attivo")).toBeInTheDocument();
});

test("status dot is labelled when a label is given", () => {
  render(<StatusDot tone="success" label="Online" pulse />);
  expect(screen.getByLabelText("Online")).toBeInTheDocument();
});

test("progressbar clamps and exposes aria", () => {
  render(<ProgressBar value={150} max={100} label="Credito" showValue />);
  const p = screen.getByRole("progressbar", { name: "Credito" });
  expect(p).toHaveAttribute("aria-valuenow", "100");
  expect(p).toHaveAttribute("aria-valuemin", "0");
  expect(p).toHaveAttribute("aria-valuemax", "100");
});

test("progressbar with max 0 does not divide by zero", () => {
  render(<ProgressBar value={5} max={0} label="Vuoto" />);
  expect(screen.getByRole("progressbar", { name: "Vuoto" })).toHaveAttribute(
    "aria-valuenow",
    "0",
  );
});

test("input invalid sets aria-invalid", () => {
  render(<Input invalid aria-label="Telefono" />);
  expect(screen.getByLabelText("Telefono")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
});

test("textarea invalid sets aria-invalid", () => {
  render(<Textarea invalid aria-label="Note" />);
  expect(screen.getByLabelText("Note")).toHaveAttribute("aria-invalid", "true");
});

test("spinner has status role", () => {
  render(<Spinner />);
  expect(screen.getByRole("status")).toBeInTheDocument();
});

test("kbd renders", () => {
  render(<Kbd>Ctrl</Kbd>);
  expect(screen.getByText("Ctrl").tagName).toBe("KBD");
});
