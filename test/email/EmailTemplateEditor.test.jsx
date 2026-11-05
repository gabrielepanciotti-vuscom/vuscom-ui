import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmailTemplateEditor } from "../../src/email/index.js";

const catalog = {
  variables: [
    { name: "cliente", label: "Ragione sociale" },
    { name: "cerved", label: "Report Cerved" },
  ],
  dataBlocks: [{ name: "riepilogo", label: "Riepilogo", description: "Operatore, cliente, consumo", kind: "Coppie" }],
};
const template = () => ({
  version: 1,
  subject: "Cliente {{cliente}}",
  blocks: [
    { id: "b1", type: "text", html: "Il cliente <b>{{cliente}}</b>" },
    { id: "b2", type: "data", ref: "riepilogo", missing: "warn" },
    { id: "b3", type: "heading", level: 2, text: "Situazione" },
    { id: "b4", type: "html", html: "<p>vecchio</p>" },
  ],
});
const preview = { subject: "Cliente Rossi", html: "<p>ciao Rossi</p>", parts: { b2: "<table><tr><td>Laura Bianchi</td></tr></table>" } };

function setup(props = {}) {
  const onChange = vi.fn();
  render(<EmailTemplateEditor value={template()} onChange={onChange} catalog={catalog} preview={preview} sourceLabel="Hub" {...props} />);
  return onChange;
}
const block = (n) => screen.getAllByRole("group")[n - 1];

describe("EmailTemplateEditor", () => {
  it("renders blocks, chips, data preview and the legacy html block", () => {
    setup();
    expect(screen.getAllByRole("group")).toHaveLength(4);
    expect(within(block(1)).getByText("Ragione sociale")).toBeInTheDocument();
    expect(within(block(2)).getByText("Laura Bianchi")).toBeInTheDocument();
    expect(within(block(2)).getByText(/Calcolato da Hub/)).toBeInTheDocument();
    expect(within(block(4)).getByText("Blocco HTML da un template vecchio")).toBeInTheDocument();
    expect(within(block(4)).getByTitle(/blocco HTML/)).toHaveAttribute("sandbox", "");
  });

  it("shows the catalog description when the backend sent no part", () => {
    setup({ preview: { ...preview, parts: {} } });
    expect(within(block(2)).getByText("Operatore, cliente, consumo")).toBeInTheDocument();
  });

  it("selecting a block shows its properties", async () => {
    setup();
    await userEvent.click(block(3));
    expect(screen.getByRole("radiogroup", { name: "Grandezza" })).toBeInTheDocument();
    await userEvent.click(block(2));
    expect(screen.getByRole("radiogroup", { name: "Se i dati mancano" })).toBeInTheDocument();
  });

  it("adds a base block after the selected one", async () => {
    const onChange = setup();
    await userEvent.click(block(1));
    await userEvent.click(screen.getByRole("button", { name: "Piè di pagina" }));
    const next = onChange.mock.calls.at(-1)[0];
    expect(next.blocks.map((b) => b.type)).toEqual(["text", "footer", "data", "heading", "html"]);
    expect(next.blocks[1]).toMatchObject({ html: "Sede legale: {{sede}}<br>{{cap_citta}}<br>{{email}}" });
    expect(new Set(next.blocks.map((b) => b.id)).size).toBe(5);
  });

  it("adds a data block from the palette", async () => {
    const onChange = setup();
    await userEvent.click(screen.getByRole("button", { name: /Riepilogo/ }));
    expect(onChange.mock.calls.at(-1)[0].blocks.at(-1)).toMatchObject({ type: "data", ref: "riepilogo", missing: "warn" });
  });

  it("never offers the legacy html block", () => {
    setup();
    expect(screen.queryByRole("button", { name: /^HTML$/ })).toBeNull();
  });

  it("moves, duplicates and deletes", async () => {
    const onChange = setup();
    await userEvent.click(within(block(3)).getByRole("button", { name: "Sposta su" }));
    expect(onChange.mock.calls.at(-1)[0].blocks.map((b) => b.id)).toEqual(["b1", "b3", "b2", "b4"]);
    await userEvent.click(within(block(1)).getByRole("button", { name: "Duplica" }));
    expect(onChange.mock.calls.at(-1)[0].blocks).toHaveLength(5);
    await userEvent.click(within(block(4)).getByRole("button", { name: "Elimina" }));
    expect(onChange.mock.calls.at(-1)[0].blocks.map((b) => b.id)).toEqual(["b1", "b2", "b3"]);
  });

  it("reorders by drag and drop from the handle", () => {
    const onChange = setup();
    const dt = { setData: vi.fn(), effectAllowed: "" };
    fireEvent.mouseDown(within(block(3)).getByRole("button", { name: "Trascina per spostare" }));
    fireEvent.dragStart(block(3), { dataTransfer: dt });
    fireEvent.dragOver(block(1), { dataTransfer: dt });
    fireEvent.drop(block(1), { dataTransfer: dt });
    expect(onChange.mock.calls.at(-1)[0].blocks.map((b) => b.id)).toEqual(["b3", "b1", "b2", "b4"]);
  });

  it("writes show_if from the dropdown, and clears it with Sempre", async () => {
    const onChange = setup();
    await userEvent.click(block(1));
    await userEvent.click(screen.getByRole("combobox", { name: "Mostra solo se" }));
    await userEvent.click(screen.getByRole("option", { name: /Report Cerved/ }));
    expect(onChange.mock.calls.at(-1)[0].blocks[0].show_if).toBe("cerved");
  });

  it("clears show_if when Sempre is chosen", async () => {
    const t = template();
    t.blocks[0].show_if = "cerved";
    const onChange = vi.fn();
    render(<EmailTemplateEditor value={t} onChange={onChange} catalog={catalog} />);
    await userEvent.click(screen.getAllByRole("group")[0]);
    await userEvent.click(screen.getByRole("combobox", { name: "Mostra solo se" }));
    await userEvent.click(screen.getByRole("option", { name: "Sempre" }));
    expect("show_if" in onChange.mock.calls.at(-1)[0].blocks[0]).toBe(false);
  });

  it("writes the data-block missing policy", async () => {
    const onChange = setup();
    await userEvent.click(block(2));
    await userEvent.click(screen.getByRole("radio", { name: "Nascondi il blocco" }));
    expect(onChange.mock.calls.at(-1)[0].blocks[1].missing).toBe("hide");
  });

  it("typing in a text serialises variables back to {{name}}", () => {
    const onChange = setup();
    const ed = within(block(1)).getByRole("textbox");
    ed.append(" fine");
    fireEvent.input(ed);
    expect(onChange.mock.calls.at(-1)[0].blocks[0].html).toBe("Il cliente <b>{{cliente}}</b> fine");
  });

  it("a palette variable lands at the end of the selected block when there is no caret", async () => {
    const onChange = setup();
    await userEvent.click(block(3));
    await userEvent.click(screen.getByRole("button", { name: "Ragione sociale" }));
    expect(onChange.mock.calls.at(-1)[0].blocks[2].text).toBe("Situazione{{cliente}} ");
  });

  it("edits the subject", () => {
    const onChange = setup();
    const ed = screen.getByRole("textbox", { name: "Oggetto" });
    ed.append("!");
    fireEvent.input(ed);
    expect(onChange.mock.calls.at(-1)[0].subject).toBe("Cliente {{cliente}}!");
  });

  it("Anteprima shows preview.html in a sandboxed iframe, not the canvas", async () => {
    setup();
    await userEvent.click(screen.getByRole("radio", { name: "Anteprima" }));
    const frame = screen.getByTitle("Anteprima dell'email");
    expect(frame).toHaveAttribute("sandbox", "");
    expect(frame).toHaveAttribute("srcdoc", "<p>ciao Rossi</p>");
    expect(screen.queryAllByRole("group")).toHaveLength(0);
    await userEvent.click(screen.getByRole("radio", { name: "Telefono" }));
    expect(frame.className).toContain("max-w-[375px]");
  });

  it("shows the toolbar slot and Prova a me only with onSendTest", async () => {
    const onSendTest = vi.fn();
    setup({ toolbar: <span>Pratica 4127</span>, onSendTest });
    expect(screen.getByText("Pratica 4127")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Prova a me" }));
    expect(onSendTest).toHaveBeenCalled();
  });

  it("has no Prova a me without onSendTest", () => {
    setup();
    expect(screen.queryByRole("button", { name: "Prova a me" })).toBeNull();
  });
});
