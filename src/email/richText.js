// Text <-> editable DOM for the email editor.
// Stored form: the inline subset the backend accepts (b i a[href] br span[data-tone]) with
// `{{name}}` variables. Editable form: the same, but every variable is a non-editable chip.

const TONES = ["bad", "warn", "muted"];
const SAFE_HREF = /^(https?:\/\/|mailto:)|^\{\{\s*\w+\s*\}\}$/i;
const VAR_RE = /\{\{\s*(\w+)\s*\}\}/g;
const CHIP_CLASS =
  "mx-0.5 inline-flex items-center rounded bg-blue-100 px-1.5 text-xs font-semibold text-blue-800 select-none";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (s) => esc(s).replace(/"/g, "&quot;");

export const chipHtml = (name, label) =>
  `<span data-var="${escAttr(name)}" contenteditable="false" class="${CHIP_CLASS}">${esc(label || name)}</span>`;

const withChips = (escaped, labels) =>
  escaped.replace(VAR_RE, (_, v) => chipHtml(v, labels[v] ?? v));

// edit=true: stored -> editable (text variables become chips); edit=false: DOM -> stored.
function walk(root, edit, labels) {
  let out = "";
  for (const n of root.childNodes) {
    if (n.nodeType === 3) {
      const t = esc(n.nodeValue.replace(/ /g, " "));
      out += edit ? withChips(t, labels) : t;
      continue;
    }
    if (n.nodeType !== 1) continue;
    const tag = n.tagName.toLowerCase();
    if (!edit && n.dataset?.var) {
      out += `{{${n.dataset.var}}}`;
      continue;
    }
    if (tag === "script" || tag === "style") continue;
    const inner = () => walk(n, edit, labels);
    if (tag === "b" || tag === "strong") out += `<b>${inner()}</b>`;
    else if (tag === "i" || tag === "em") out += `<i>${inner()}</i>`;
    else if (tag === "br") out += "<br>";
    else if (tag === "a") {
      const href = n.getAttribute("href") || "";
      out += SAFE_HREF.test(href) ? `<a href="${escAttr(href)}">${inner()}</a>` : inner();
    } else if (tag === "span" && TONES.includes(n.dataset?.tone)) {
      out += `<span data-tone="${n.dataset.tone}">${inner()}</span>`;
    } else if (tag === "div" || tag === "p") {
      // Browsers put a new line in a <div>: back to <br>.
      out += (out && !out.endsWith("<br>") ? "<br>" : "") + inner();
    } else out += inner();
  }
  return out;
}

function parse(html) {
  const t = document.createElement("template"); // inert: nothing runs or loads
  t.innerHTML = html;
  return t.content;
}

export const toEditable = (html, labels = {}) => walk(parse(html || ""), true, labels);
export const fromEditable = (el) => walk(el, false, {});
export const toEditablePlain = (text, labels = {}) => withChips(esc(text || ""), labels);

export function fromEditablePlain(el) {
  let s = "";
  for (const c of el.childNodes) {
    if (c.nodeType === 3) s += c.nodeValue;
    else if (c.nodeType === 1) s += c.dataset?.var ? `{{${c.dataset.var}}}` : fromEditablePlain(c);
  }
  return s.replace(/ /g, " ").replace(/\n/g, " ");
}

const fire = (el) => el.dispatchEvent(new Event("input", { bubbles: true }));

function rangeIn(el, range) {
  if (range && el.contains(range.commonAncestorContainer)) return range;
  const r = el.ownerDocument.createRange();
  r.selectNodeContents(el);
  r.collapse(false);
  return r;
}

// Puts a variable chip at the caret (or at the end when there is no usable caret).
export function insertVariable(el, range, name, label) {
  const r = rangeIn(el, range);
  r.deleteContents();
  const tpl = el.ownerDocument.createElement("template");
  tpl.innerHTML = `${chipHtml(name, label)} `;
  const frag = tpl.content;
  const last = frag.lastChild;
  r.insertNode(frag);
  r.setStartAfter(last);
  r.collapse(true);
  const sel = el.ownerDocument.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(r);
  fire(el);
}

// Formatting on the last saved selection: b/i through the browser, red and link by wrapping.
export function applyFormat({ el, range }, cmd, arg) {
  if (!el?.isConnected || !range) return false;
  const doc = el.ownerDocument;
  const sel = doc.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  if (cmd === "bold" || cmd === "italic") doc.execCommand?.(cmd);
  else if (!range.collapsed) {
    let w;
    if (cmd === "tone") {
      w = doc.createElement("span");
      w.dataset.tone = "bad";
    } else if (cmd === "link" && SAFE_HREF.test(arg || "")) {
      w = doc.createElement("a");
      w.setAttribute("href", arg);
    } else return false;
    w.append(range.extractContents());
    range.insertNode(w);
  } else return false;
  fire(el);
  return true;
}

export function insertPlainText(text) {
  document.execCommand?.("insertText", false, text);
}
