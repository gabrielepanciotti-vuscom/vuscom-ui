import { describe, expect, it, vi } from "vitest";
import {
  applyFormat,
  fromEditable,
  fromEditablePlain,
  insertVariable,
  toEditable,
  toEditablePlain,
} from "../../src/email/richText.js";

const labels = { cliente: "Ragione sociale", link: "Link" };
const el = (html) => {
  const d = document.createElement("div");
  d.innerHTML = html;
  document.body.append(d);
  return d;
};

describe("richText", () => {
  it("round-trips text with variables through chips", () => {
    const stored = 'Il cliente <b>{{cliente}}</b> e <i>altro</i><br>riga <span data-tone="bad">rosso</span>';
    const editable = toEditable(stored, labels);
    expect(editable).toContain('data-var="cliente"');
    expect(editable).toContain("Ragione sociale");
    expect(editable).not.toContain("{{");
    expect(fromEditable(el(editable))).toBe(stored);
  });

  it("keeps only the inline subset", () => {
    const out = fromEditable(el('<strong>a</strong><script>x()</script><div onclick="x()">b</div><a href="javascript:x()">c</a><a href="https://v.it">d</a><u>e</u>'));
    expect(out).toBe('<b>a</b><br>b' + 'c<a href="https://v.it">d</a>e');
    expect(toEditable('<img src=x onerror=1><span data-tone="evil">t</span>')).toBe("t");
  });

  it("allows a lone variable as href", () => {
    expect(fromEditable(el('<a href="{{link}}">vai</a>'))).toBe('<a href="{{link}}">vai</a>');
  });

  it("escapes text and keeps unknown variables readable", () => {
    expect(toEditablePlain("a < b {{ignoto}}", {})).toContain("&lt;");
    const d = el(toEditablePlain("Oggetto {{cliente}} & co", labels));
    expect(fromEditablePlain(d)).toBe("Oggetto {{cliente}} & co");
  });

  it("inserts a chip at the caret and reports the change", () => {
    const d = el("ab");
    const range = document.createRange();
    range.setStart(d.firstChild, 1);
    range.collapse(true);
    const onInput = vi.fn();
    d.addEventListener("input", onInput);
    insertVariable(d, range, "cliente", labels.cliente);
    expect(fromEditablePlain(d)).toBe("a{{cliente}} b");
    expect(onInput).toHaveBeenCalled();
  });

  it("inserts at the end without a caret", () => {
    const d = el("ab");
    insertVariable(d, null, "cliente", "Ragione sociale");
    expect(fromEditablePlain(d)).toBe("ab{{cliente}} ");
  });

  it("wraps the selection as red or as a link, refusing unsafe urls", () => {
    const d = el("uno due");
    const range = document.createRange();
    range.setStart(d.firstChild, 0);
    range.setEnd(d.firstChild, 3);
    expect(applyFormat({ el: d, range }, "tone")).toBe(true);
    expect(fromEditable(d)).toBe('<span data-tone="bad">uno</span> due');
    const r2 = document.createRange();
    r2.setStart(d.lastChild, 1);
    r2.setEnd(d.lastChild, 4);
    expect(applyFormat({ el: d, range: r2 }, "link", "javascript:x()")).toBe(false);
    expect(applyFormat({ el: d, range: r2 }, "link", "https://v.it")).toBe(true);
    expect(fromEditable(d)).toBe('<span data-tone="bad">uno</span> <a href="https://v.it">due</a>');
  });
});
