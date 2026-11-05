import {
  Heading,
  Image,
  Minus,
  MousePointerClick,
  PanelBottom,
  Table,
  Type,
} from "lucide-react";

export const FOOTER_HTML = "Sede legale: {{sede}}<br>{{cap_citta}}<br>{{email}}";

// Base blocks offered by the palette ("html" is legacy and never offered).
export const BASE_BLOCKS = [
  { type: "text", label: "Testo", icon: Type },
  { type: "heading", label: "Titolo", icon: Heading },
  { type: "table", label: "Tabella", icon: Table },
  { type: "button", label: "Pulsante", icon: MousePointerClick },
  { type: "divider", label: "Separatore", icon: Minus },
  { type: "image", label: "Logo", icon: Image },
  { type: "footer", label: "Piè di pagina", icon: PanelBottom },
];

export const TYPE_LABEL = {
  ...Object.fromEntries(BASE_BLOCKS.map((b) => [b.type, b.label])),
  data: "Dati",
  html: "HTML",
};

const DEFAULTS = {
  text: () => ({ html: "Nuovo paragrafo." }),
  heading: () => ({ level: 2, text: "Nuovo titolo" }),
  table: () => ({
    columns: ["Voce", "Valore"],
    rows: [
      ["", ""],
      ["", ""],
    ],
  }),
  button: () => ({ label: "Apri la pratica", url: "", style: "primary" }),
  divider: () => ({}),
  image: () => ({ asset: "logo_vuscom_blu.png", width: 160 }),
  footer: () => ({ html: FOOTER_HTML }),
  data: () => ({ missing: "warn" }),
};

// "b" + the next free number: unique inside the template, stable to read.
export function nextId(blocks) {
  const used = new Set(blocks.map((b) => b.id));
  let n = blocks.length + 1;
  while (used.has(`b${n}`)) n += 1;
  return `b${n}`;
}

export const newBlock = (type, blocks, extra = {}) => ({
  id: nextId(blocks),
  type,
  ...DEFAULTS[type](),
  ...extra,
});

export function insertAfter(blocks, selectedId, block) {
  const i = blocks.findIndex((b) => b.id === selectedId);
  const at = i < 0 ? blocks.length : i + 1;
  return [...blocks.slice(0, at), block, ...blocks.slice(at)];
}

export function moveBy(blocks, id, delta) {
  const i = blocks.findIndex((b) => b.id === id);
  const j = i + delta;
  if (i < 0 || j < 0 || j >= blocks.length) return blocks;
  const out = [...blocks];
  [out[i], out[j]] = [out[j], out[i]];
  return out;
}

// Drag and drop: the dragged block lands where the target was.
export function moveTo(blocks, fromId, toId) {
  if (fromId === toId) return blocks;
  const moving = blocks.find((b) => b.id === fromId);
  if (!moving) return blocks;
  const rest = blocks.filter((b) => b.id !== fromId);
  const at = rest.findIndex((b) => b.id === toId);
  if (at < 0) return blocks;
  return [...rest.slice(0, at), moving, ...rest.slice(at)];
}

export function duplicate(blocks, id) {
  const i = blocks.findIndex((b) => b.id === id);
  if (i < 0) return { blocks, id: null };
  const copy = { ...structuredClone(blocks[i]), id: nextId(blocks) };
  return { blocks: [...blocks.slice(0, i + 1), copy, ...blocks.slice(i + 1)], id: copy.id };
}

export const patchBlock = (blocks, id, patch) =>
  blocks.map((b) => {
    if (b.id !== id) return b;
    const next = { ...b, ...patch };
    for (const k of Object.keys(next)) if (next[k] === undefined) delete next[k];
    return next;
  });
