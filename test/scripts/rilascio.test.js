import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  buildDimenticata,
  compila,
  consumatoriIndietro,
  moduliCambiati,
  pianoAggiornamenti,
  selezionaConsumatori,
  tagPrecedente,
  validaConsumatori,
  versioneNelLock,
} from "../../scripts/lib/rilascio.mjs";

// Fake consumers that look nothing like the real portals.
const FINTI = [
  {
    nome: "Alfa",
    agente: "alfa-dev",
    repo: "x/alfa",
    frontend: "Alfa/web",
    usa: ["index", "segnalazioni"],
  },
  {
    nome: "Beta",
    agente: "beta-dev",
    repo: "x/beta",
    frontend: "Beta/web",
    usa: ["index", "grafici"],
  },
  {
    nome: "Gamma",
    agente: "gamma-dev",
    repo: "x/gamma",
    frontend: "Gamma/web",
    usa: ["theme", "conformita"],
  },
];

describe("moduliCambiati", () => {
  it("maps built files and the tester to modules, ignoring the rest", () => {
    expect(
      moduliCambiati([
        "dist/segnalazioni.js",
        "dist/theme.css",
        "bin/conformita-regole.json",
        "README.md",
        "src/atoms/Button.jsx",
        "test/x.test.js",
      ]),
    ).toEqual(["segnalazioni", "theme", "conformita"]);
  });

  it("returns nothing for a docs-only release", () => {
    expect(
      moduliCambiati([
        "README.md",
        ".claude/docs/deployment.md",
        "package.json",
      ]),
    ).toEqual([]);
  });
});

describe("selezionaConsumatori", () => {
  it("picks only consumers using a changed module, with the modules that touch them", () => {
    const scelti = selezionaConsumatori(FINTI, ["segnalazioni"]);
    expect(scelti.map((c) => c.agente)).toEqual(["alfa-dev"]);
    expect(scelti[0].toccati).toEqual(["segnalazioni"]);
  });

  it("selects nobody when the changed module is used by none", () => {
    expect(selezionaConsumatori(FINTI, ["utenti", "preset"])).toEqual([]);
  });

  it("selects every user of a shared module once", () => {
    const scelti = selezionaConsumatori(FINTI, ["index", "conformita"]);
    expect(scelti.map((c) => c.agente)).toEqual([
      "alfa-dev",
      "beta-dev",
      "gamma-dev",
    ]);
    expect(scelti[2].toccati).toEqual(["conformita"]);
  });

  it("goes from a diff to the consumers end to end", () => {
    const scelti = selezionaConsumatori(
      FINTI,
      moduliCambiati(["dist/grafici.js", "docs/x.md"]),
    );
    expect(scelti.map((c) => c.nome)).toEqual(["Beta"]);
  });
});

describe("buildDimenticata", () => {
  it("flags src changes without dist changes", () => {
    expect(
      buildDimenticata(["package.json", "src/segnalazioni/Modale.jsx"]),
    ).toBe(true);
    expect(buildDimenticata(["src/x.jsx", "dist/index.js"])).toBe(false);
    expect(buildDimenticata(["README.md"])).toBe(false);
  });
});

describe("validaConsumatori", () => {
  it("accepts the fake list and the real consumatori.json", () => {
    expect(validaConsumatori({ consumatori: FINTI })).toEqual([]);
    const reale = JSON.parse(
      readFileSync(resolve(__dirname, "../../consumatori.json"), "utf8"),
    );
    expect(validaConsumatori(reale)).toEqual([]);
  });

  it("rejects unknown modules, empty usa and duplicate agents", () => {
    const errori = validaConsumatori({
      consumatori: [
        { ...FINTI[0], usa: ["AppShel"] },
        { ...FINTI[1], usa: [] },
        { ...FINTI[2], agente: "alfa-dev" },
      ],
    });
    expect(errori).toEqual([
      "Alfa: modulo sconosciuto 'AppShel'",
      "Beta: 'usa' vuoto",
      "Gamma: agente 'alfa-dev' ripetuto",
    ]);
  });
});

describe("compila", () => {
  it("fills placeholders and refuses unknown ones", () => {
    expect(compila("da {{a}} a {{b}}", { a: "v1", b: "v2" })).toBe(
      "da v1 a v2",
    );
    expect(() => compila("{{manca}}", {})).toThrow("{{manca}}");
  });

  it("the real order template has every placeholder the script fills", () => {
    const template = readFileSync(
      resolve(__dirname, "../../scripts/ordine-aggiornamento.md"),
      "utf8",
    );
    const testo = compila(template, {
      versione: "v9.9.9",
      precedente: "v9.9.8",
      nome: "Alfa",
      frontend: "/x",
      toccati: "index",
      commit: "- c",
    });
    expect(testo).toContain(
      'npm install "@vuscom/ui@github:gabrielepanciotti-vuscom/vuscom-ui#v9.9.9"',
    );
    expect(testo).toContain("npx vuscom-ui-conformita");
  });
});

describe("tag e deriva", () => {
  it("finds the previous release with semver order, not string order", () => {
    const tags = ["v1.9.0", "v1.10.0", "v1.11.0", "v1.2.0", "non-un-tag"];
    expect(tagPrecedente(tags, "v1.11.0")).toBe("v1.10.0");
    expect(tagPrecedente(tags, "v1.10.0")).toBe("v1.9.0");
    expect(tagPrecedente(tags, "v1.2.0")).toBe(null);
  });

  it("reads the version from both lockfile layouts", () => {
    expect(
      versioneNelLock({
        packages: { "node_modules/@vuscom/ui": { version: "1.8.1" } },
      }),
    ).toBe("1.8.1");
    expect(
      versioneNelLock({ dependencies: { "@vuscom/ui": { version: "1.7.0" } } }),
    ).toBe("1.7.0");
    expect(versioneNelLock({})).toBe(null);
  });

  it("lists only consumers behind the latest tag", () => {
    const installate = [
      { nome: "Alfa", versione: "1.12.0" },
      { nome: "Beta", versione: "1.9.0" },
      { nome: "Gamma", versione: null },
    ];
    expect(
      consumatoriIndietro(installate, "v1.12.0").map((c) => c.nome),
    ).toEqual(["Beta"]);
    expect(consumatoriIndietro(installate.slice(0, 1), "v1.12.0")).toEqual([]);
  });
});

describe("pianoAggiornamenti", () => {
  const base = { consumatori: FINTI, ultima: "v2.0.0", adesso: Date.parse("2026-10-16T10:00:00Z") };
  const esiti = (extra) => Object.fromEntries(pianoAggiornamenti({ ...base, ...extra }).map((p) => [p.consumatore.nome, p.esito]));

  it("orders only portals whose used modules changed since THEIR version", () => {
    const r = esiti({ versioni: { "alfa-dev": "1.0.0", "beta-dev": "1.0.0", "gamma-dev": "2.0.0" }, moduliTra: () => ["grafici"] });
    expect(r).toEqual({ Alfa: "nessuna-novita", Beta: "notifica", Gamma: "allineato" });
  });

  it("leaves a portal alone for a week after an order, then orders again", () => {
    const versioni = { "alfa-dev": "1.0.0", "beta-dev": "1.0.0", "gamma-dev": "1.0.0" };
    const stato = { "beta-dev": { quando: "2026-10-12T10:00:00Z" } };
    expect(esiti({ versioni, moduliTra: () => ["grafici"], stato }).Beta).toBe("attesa");
    expect(esiti({ versioni, moduliTra: () => ["grafici"], stato: { "beta-dev": { quando: "2026-10-01T10:00:00Z" } } }).Beta).toBe("notifica");
  });

  it("skips a portal whose version is unknown on this device", () => {
    expect(esiti({ versioni: {}, moduliTra: () => ["index"] }).Alfa).toBe("allineato");
  });
});
