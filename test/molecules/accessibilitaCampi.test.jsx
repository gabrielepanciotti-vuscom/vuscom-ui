import { afterEach, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CampoData, Field, Input, Select, Textarea } from "../../src/index.js";

const lettere = [
  { value: "a", label: "Alfa" },
  { value: "b", label: "Beta" },
  { value: "br", label: "Bravo" },
  { value: "c", label: "Charlie" },
];

const ID_ROSSO = "aria-[invalid=true]:border-destructive";
const RING_ROSSO = "aria-[invalid=true]:focus-visible:ring-destructive";

afterEach(() => {
  vi.useRealTimers();
});

// Select: combobox + aria-labelledby

test("select trigger is a combobox, not a button", () => {
  render(<Select aria-label="Lettera" value="a" options={lettere} />);
  expect(screen.getByRole("combobox", { name: "Lettera" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Lettera" })).not.toBeInTheDocument();
});

test("select trigger reaches 44 px on small screens", () => {
  render(<Select aria-label="Lettera" value="a" options={lettere} />);
  expect(screen.getByRole("combobox", { name: "Lettera" })).toHaveClass(
    "max-sm:min-h-11",
  );
});

test("select listbox is labelled by the trigger id", async () => {
  render(<Select aria-label="Lettera" value="a" options={lettere} />);
  const trigger = screen.getByRole("combobox", { name: "Lettera" });
  expect(trigger.id).toBeTruthy();
  await userEvent.click(trigger);
  expect(screen.getByRole("listbox")).toHaveAttribute("aria-labelledby", trigger.id);
});

test("select keeps the id passed by the caller and labels the listbox with it", async () => {
  render(<Select id="mia-select" aria-label="Lettera" value="a" options={lettere} />);
  const trigger = screen.getByRole("combobox", { name: "Lettera" });
  expect(trigger).toHaveAttribute("id", "mia-select");
  await userEvent.click(trigger);
  expect(screen.getByRole("listbox")).toHaveAttribute("aria-labelledby", "mia-select");
});

// Select: Home / End

test("select Home and End go to the first and last enabled option and open the list", async () => {
  const opts = [
    { value: "x", label: "Xeno", disabled: true },
    { value: "a", label: "Alfa" },
    { value: "b", label: "Beta" },
    { value: "z", label: "Zeta" },
    { value: "y", label: "Yota", disabled: true },
  ];
  render(<Select aria-label="Lettera" value="b" options={opts} />);
  const trigger = screen.getByRole("combobox", { name: "Lettera" });
  trigger.focus();
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

  await userEvent.keyboard("{End}");
  expect(screen.getByRole("listbox")).toBeInTheDocument();
  expect(trigger).toHaveAttribute(
    "aria-activedescendant",
    screen.getByRole("option", { name: "Zeta" }).id,
  );

  await userEvent.keyboard("{Home}");
  expect(trigger).toHaveAttribute(
    "aria-activedescendant",
    screen.getByRole("option", { name: "Alfa" }).id,
  );
});

// Select: typeahead

test("select typeahead highlights the first option starting with the typed letter", async () => {
  render(<Select aria-label="Lettera" value="a" options={lettere} />);
  const trigger = screen.getByRole("combobox", { name: "Lettera" });
  trigger.focus();
  await userEvent.keyboard("c");
  expect(trigger).toHaveAttribute(
    "aria-activedescendant",
    screen.getByRole("option", { name: "Charlie" }).id,
  );
});

test("select typeahead is case-insensitive", async () => {
  render(<Select aria-label="Lettera" value="a" options={lettere} />);
  const trigger = screen.getByRole("combobox", { name: "Lettera" });
  trigger.focus();
  await userEvent.keyboard("C");
  expect(trigger).toHaveAttribute(
    "aria-activedescendant",
    screen.getByRole("option", { name: "Charlie" }).id,
  );
});

test("select typeahead accumulates a multi-letter prefix", async () => {
  render(<Select aria-label="Lettera" value="a" options={lettere} />);
  const trigger = screen.getByRole("combobox", { name: "Lettera" });
  trigger.focus();
  await userEvent.keyboard("b");
  expect(trigger).toHaveAttribute(
    "aria-activedescendant",
    screen.getByRole("option", { name: "Beta" }).id,
  );
  await userEvent.keyboard("r");
  expect(trigger).toHaveAttribute(
    "aria-activedescendant",
    screen.getByRole("option", { name: "Bravo" }).id,
  );
});

test("select typeahead buffer resets after the pause", async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  render(<Select aria-label="Lettera" value="c" options={lettere} />);
  const trigger = screen.getByRole("combobox", { name: "Lettera" });
  trigger.focus();
  await user.keyboard("b");
  vi.advanceTimersByTime(600);
  // Without the reset the prefix would be "ba" and match nothing.
  await user.keyboard("a");
  expect(trigger).toHaveAttribute(
    "aria-activedescendant",
    screen.getByRole("option", { name: "Alfa" }).id,
  );
});

test("select typeahead skips disabled options", async () => {
  const opts = [
    { value: "g", label: "Gamma", disabled: true },
    { value: "gi", label: "Giallo" },
    { value: "a", label: "Alfa" },
  ];
  render(<Select aria-label="Lettera" value="a" options={opts} />);
  const trigger = screen.getByRole("combobox", { name: "Lettera" });
  trigger.focus();
  await userEvent.keyboard("g");
  expect(trigger).toHaveAttribute(
    "aria-activedescendant",
    screen.getByRole("option", { name: "Giallo" }).id,
  );
});

// CampoData

test("CampoData forwards aria attributes and the other props to the input", () => {
  render(
    <CampoData
      aria-label="Scadenza"
      aria-describedby="aiuto"
      aria-invalid="true"
      data-testid="campo"
      name="scadenza"
    />,
  );
  const input = screen.getByRole("textbox", { name: "Scadenza" });
  expect(input).toHaveAttribute("aria-describedby", "aiuto");
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(input).toHaveAttribute("data-testid", "campo");
  expect(input).toHaveAttribute("name", "scadenza");
});

test("CampoData field and calendar button reach 44 px on small screens", () => {
  render(<CampoData aria-label="Scadenza" />);
  expect(screen.getByRole("textbox", { name: "Scadenza" })).toHaveClass(
    "max-sm:min-h-11",
  );
  expect(screen.getByRole("button", { name: "Apri calendario" })).toHaveClass(
    "max-sm:min-h-11",
    "max-sm:min-w-11",
  );
});

test("CampoData aria-invalid=true gives the invalid style", () => {
  render(<CampoData aria-label="Scadenza" aria-invalid="true" />);
  expect(screen.getByRole("textbox", { name: "Scadenza" })).toHaveClass("border-destructive");
});

test("CampoData unparseable text shows an sr-only message appended to describedby", async () => {
  render(
    <div>
      <CampoData aria-label="Scadenza" aria-describedby="aiuto" />
      <p id="aiuto">Aiuto</p>
    </div>,
  );
  const input = screen.getByRole("textbox", { name: "Scadenza" });
  await userEvent.type(input, "31/02/2026");
  expect(screen.queryByText(/Data non valida/)).not.toBeInTheDocument();
  await userEvent.tab();
  const msg = screen.getByText("Data non valida, usa il formato gg/mm/aaaa");
  expect(msg).toHaveClass("sr-only");
  expect(msg.id).toBeTruthy();
  expect(input).toHaveAttribute("aria-invalid", "true");
  const ids = input.getAttribute("aria-describedby").split(" ");
  expect(ids).toEqual(["aiuto", msg.id]);
});

test("CampoData out-of-range date is invalid but has no message", async () => {
  render(<CampoData aria-label="Scadenza" min="2026-01-01" max="2026-12-31" />);
  const input = screen.getByRole("textbox", { name: "Scadenza" });
  await userEvent.type(input, "01/01/2025");
  await userEvent.tab();
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(screen.queryByText(/Data non valida/)).not.toBeInTheDocument();
  expect(input).not.toHaveAttribute("aria-describedby");
});

test("CampoData calls the caller's onBlur and onKeyDown", async () => {
  const onBlur = vi.fn();
  const onKeyDown = vi.fn();
  render(<CampoData aria-label="Scadenza" onBlur={onBlur} onKeyDown={onKeyDown} />);
  const input = screen.getByRole("textbox", { name: "Scadenza" });
  await userEvent.type(input, "a");
  expect(onKeyDown).toHaveBeenCalled();
  await userEvent.tab();
  expect(onBlur).toHaveBeenCalledTimes(1);
});

// Input / Textarea inside Field

test("Input inside Field with an error carries the aria-invalid style classes", () => {
  render(
    <Field label="Nome" error="Obbligatorio">
      <Input />
    </Field>,
  );
  const input = screen.getByLabelText("Nome");
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(input).toHaveClass(ID_ROSSO);
  expect(input).toHaveClass(RING_ROSSO);
});

test("Textarea inside Field with an error carries the aria-invalid style classes", () => {
  render(
    <Field label="Note" error="Obbligatorio">
      <Textarea />
    </Field>,
  );
  const area = screen.getByLabelText("Note");
  expect(area).toHaveAttribute("aria-invalid", "true");
  expect(area).toHaveClass(ID_ROSSO);
  expect(area).toHaveClass(RING_ROSSO);
});

// Field hint

test("Field hint id is in aria-describedby and the element exists", () => {
  render(
    <Field label="Nome" hint="Nome e cognome">
      <Input />
    </Field>,
  );
  const input = screen.getByLabelText("Nome");
  const id = input.getAttribute("aria-describedby");
  expect(id).toMatch(/-hint$/);
  expect(document.getElementById(id)).toHaveTextContent("Nome e cognome");
});

test("Field with hint and error describes only the error", () => {
  render(
    <Field label="Nome" hint="Nome e cognome" error="Obbligatorio">
      <Input />
    </Field>,
  );
  const input = screen.getByLabelText("Nome");
  const ids = input.getAttribute("aria-describedby").split(" ");
  expect(ids).toHaveLength(1);
  expect(ids[0]).toMatch(/-error$/);
  expect(screen.queryByText("Nome e cognome")).not.toBeInTheDocument();
  expect(document.getElementById(ids[0])).toHaveTextContent("Obbligatorio");
});

test("Field without hint or error leaves aria-describedby unset", () => {
  render(
    <Field label="Nome">
      <Input />
    </Field>,
  );
  expect(screen.getByLabelText("Nome")).not.toHaveAttribute("aria-describedby");
});
