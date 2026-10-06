import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Select,
  Toggle,
  Tabs,
  Field,
  Input,
  InfoTip,
  SegmentedControl,
  Checkbox,
  Tooltip,
} from "../../src/index.js";

const opzioni = [
  { value: "a", label: "Alta" },
  { value: "m", label: "Media" },
  { value: "b", label: "Bassa" },
];

test("select opens, navigates with keyboard and picks", async () => {
  const onChange = vi.fn();
  render(
    <Select
      aria-label="Priorità"
      value="m"
      onChange={onChange}
      options={opzioni}
    />,
  );
  const trigger = screen.getByRole("button", { name: /priorità/i });
  trigger.focus();
  await userEvent.keyboard("{Enter}");
  expect(screen.getByRole("listbox")).toBeInTheDocument();
  await userEvent.keyboard("{ArrowDown}{Enter}");
  expect(onChange).toHaveBeenCalledWith("b");
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
});

test("select closes on Escape without changing", async () => {
  const onChange = vi.fn();
  render(
    <Select
      aria-label="Priorità"
      value="m"
      onChange={onChange}
      options={opzioni}
    />,
  );
  await userEvent.click(screen.getByRole("button", { name: /priorità/i }));
  await userEvent.keyboard("{Escape}");
  expect(onChange).not.toHaveBeenCalled();
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
});

test("select exposes aria state, picks by click, closes on outside click", async () => {
  const onChange = vi.fn();
  render(
    <div>
      <Select
        aria-label="Priorità"
        value="m"
        onChange={onChange}
        options={opzioni}
      />
      <p>fuori</p>
    </div>,
  );
  const trigger = screen.getByRole("button", { name: /priorità/i });
  expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
  expect(trigger).toHaveAttribute("aria-expanded", "false");
  await userEvent.click(trigger);
  expect(trigger).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByRole("option", { name: /media/i })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await userEvent.click(screen.getByText("fuori"));
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  await userEvent.click(trigger);
  await userEvent.click(screen.getByRole("option", { name: /alta/i }));
  expect(onChange).toHaveBeenCalledWith("a");
});

test("select allowClear emits null", async () => {
  const onChange = vi.fn();
  render(
    <Select
      aria-label="P"
      value="m"
      allowClear
      onChange={onChange}
      options={opzioni}
    />,
  );
  await userEvent.click(screen.getByRole("button", { name: "P" }));
  await userEvent.click(screen.getByRole("option", { name: /nessuno/i }));
  expect(onChange).toHaveBeenCalledWith(null);
});

test("select skips disabled options", async () => {
  const onChange = vi.fn();
  const opts = [
    { value: "a", label: "A" },
    { value: "b", label: "B", disabled: true },
    { value: "c", label: "C" },
  ];
  render(
    <Select aria-label="X" value="a" onChange={onChange} options={opts} />,
  );
  screen.getByRole("button", { name: "X" }).focus();
  await userEvent.keyboard("{Enter}{ArrowDown}{Enter}");
  expect(onChange).toHaveBeenCalledWith("c");
});

test("toggle is a switch", async () => {
  const onChange = vi.fn();
  render(<Toggle checked={false} onChange={onChange} label="Reinvia" />);
  await userEvent.click(screen.getByRole("switch", { name: "Reinvia" }));
  expect(onChange).toHaveBeenCalledWith(true);
});

test("toggle disabled does not fire", async () => {
  const onChange = vi.fn();
  render(<Toggle checked onChange={onChange} label="Reinvia" disabled />);
  await userEvent.click(screen.getByRole("switch", { name: "Reinvia" }));
  expect(onChange).not.toHaveBeenCalled();
});

test("checkbox indeterminate is mixed", () => {
  render(
    <Checkbox
      checked={false}
      indeterminate
      onChange={() => {}}
      label="Tutti"
    />,
  );
  expect(screen.getByRole("checkbox", { name: "Tutti" })).toHaveAttribute(
    "aria-checked",
    "mixed",
  );
});

test("checkbox toggles", async () => {
  const onChange = vi.fn();
  render(<Checkbox checked onChange={onChange} label="Uno" />);
  await userEvent.click(screen.getByRole("checkbox", { name: "Uno" }));
  expect(onChange).toHaveBeenCalledWith(false);
});

test("tabs switch with arrows", async () => {
  const onChange = vi.fn();
  render(
    <Tabs
      value="a"
      onChange={onChange}
      items={[
        { id: "a", label: "Uno" },
        { id: "b", label: "Due" },
      ]}
    />,
  );
  screen.getByRole("tab", { name: "Uno" }).focus();
  await userEvent.keyboard("{ArrowRight}");
  expect(onChange).toHaveBeenCalledWith("b");
});

test("segmented control is a radiogroup", async () => {
  const onChange = vi.fn();
  render(
    <SegmentedControl
      value="x"
      onChange={onChange}
      options={[
        { value: "x", label: "X" },
        { value: "y", label: "Y" },
      ]}
    />,
  );
  expect(screen.getByRole("radiogroup")).toBeInTheDocument();
  expect(screen.getByRole("radio", { name: "X" })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await userEvent.click(screen.getByRole("radio", { name: "Y" }));
  expect(onChange).toHaveBeenCalledWith("y");
});

test("field wires label, hint and error", () => {
  render(
    <Field label="Telefono" hint="Con prefisso" error="Obbligatorio">
      <Input />
    </Field>,
  );
  const input = screen.getByLabelText("Telefono");
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(input.getAttribute("aria-describedby")).toBeTruthy();
  expect(screen.getByText("Obbligatorio")).toBeInTheDocument();
});

test("tooltip shows on hover after delay and hides on leave", async () => {
  render(
    <Tooltip content="Aiuto">
      <button>Bersaglio</button>
    </Tooltip>,
  );
  const b = screen.getByRole("button", { name: "Bersaglio" });
  await userEvent.hover(b);
  const tip = await screen.findByRole("tooltip");
  expect(tip).toHaveTextContent("Aiuto");
  expect(b.getAttribute("aria-describedby")).toBe(tip.id);
  await userEvent.unhover(b);
  expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
});

test("infotip shows on focus", async () => {
  render(<InfoTip>Spiegazione</InfoTip>);
  await userEvent.tab();
  expect(await screen.findByRole("tooltip")).toHaveTextContent("Spiegazione");
});
