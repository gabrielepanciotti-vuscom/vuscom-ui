import { createRequire } from "node:module";
import { render, screen, act } from "@testing-library/react";
import { TrendingUp } from "lucide-react";
import {
  Badge,
  Field,
  Input,
  KpiCard,
  ProgressBar,
  ToastProvider,
  useToast,
} from "../../src/index.js";
import { TESTO } from "../../src/atoms/tones.js";

const require = createRequire(import.meta.url);

test("preset maps the bare border color to the token", () => {
  const preset = require("../../src/theme/preset.cjs");
  expect(preset.theme.extend.borderColor.DEFAULT).toBe("hsl(var(--border))");
});

test("package.json has no prepare script and declares css side effects", () => {
  const pkg = require("../../package.json");
  expect(pkg.scripts.prepare).toBeUndefined();
  expect(pkg.scripts.build).toBeDefined();
  expect(pkg.sideEffects).toEqual(["*.css"]);
});

test("tone text is darker in light mode and token-based in dark", () => {
  expect(TESTO.success).toBe("text-green-700 dark:text-success");
  expect(TESTO.warning).toBe("text-amber-800 dark:text-warning");
  expect(TESTO.info).toBe("text-sky-800 dark:text-info");
  expect(TESTO.danger).toBe("text-red-700 dark:text-red-400");
  expect(TESTO.primary).toBe("text-blue-700 dark:text-primary");
});

test("badge uses the accessible tone text", () => {
  render(<Badge tone="success">Attivo</Badge>);
  expect(screen.getByText("Attivo")).toHaveClass(
    "text-green-700",
    "dark:text-success",
  );
});

test("field error uses the accessible danger text", () => {
  render(
    <Field label="Telefono" error="Obbligatorio">
      <Input />
    </Field>,
  );
  expect(screen.getByText("Obbligatorio")).toHaveClass("text-red-700");
});

test("kpi supports info tone, accessible negative delta, dash for missing", () => {
  const { container, rerender } = render(
    <KpiCard
      label="A"
      value={3}
      tone="info"
      icon={TrendingUp}
      delta={{ value: -2 }}
    />,
  );
  expect(container.querySelector(".text-sky-800")).not.toBeNull();
  expect(screen.getByText("-2")).toHaveClass("text-red-700");
  rerender(<KpiCard label="A" value={NaN} />);
  expect(screen.getByText("—")).toBeInTheDocument();
  rerender(<KpiCard label="A" value={null} />);
  expect(screen.getByText("—")).toBeInTheDocument();
});

test("progressbar shows tiny values and accepts aria-label", () => {
  const { container } = render(
    <ProgressBar value={0.4} max={100} aria-label="Credito RPO" showValue />,
  );
  expect(
    screen.getByRole("progressbar", { name: "Credito RPO" }),
  ).toBeInTheDocument();
  expect(screen.getByText("<1%")).toBeInTheDocument();
  const fill = container.querySelector("[role=progressbar] > div");
  expect(fill.style.width).toBe("2%");
});

test("toast live regions exist before any toast and split by tone", () => {
  let api;
  function Probe() {
    api = useToast();
    return null;
  }
  render(
    <ToastProvider>
      <Probe />
    </ToastProvider>,
  );
  const polite = document.querySelector('[aria-live="polite"]');
  const assertive = document.querySelector('[aria-live="assertive"]');
  expect(polite).not.toBeNull();
  expect(assertive).not.toBeNull();
  act(() => {
    api.toast({ title: "Salvato", duration: 0 });
    api.toast({ title: "Errore", tone: "danger", duration: 0 });
  });
  expect(polite).toHaveTextContent("Salvato");
  expect(assertive).toHaveTextContent("Errore");
  expect(polite).not.toHaveTextContent("Errore");
  expect(screen.getByText("Salvato").closest("[role]")).toBeNull();
});
