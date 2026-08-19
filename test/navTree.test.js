import { describe, expect, it } from "vitest";
import { collectGroupIds, normalizeNavTree } from "../src/navTree.js";

describe("normalizeNavTree", () => {
  it("toglie le voci non visibili per il ruolo", () => {
    const tree = normalizeNavTree([
      {
        id: "g",
        label: "Gruppo",
        children: [
          { to: "/a", label: "A" },
          { to: "/b", label: "B", visible: false },
          { to: "/c", label: "C" },
        ],
      },
    ]);
    expect(tree[0].children.map((c) => c.to)).toEqual(["/a", "/c"]);
  });

  it("elimina il gruppo che resta senza figli visibili", () => {
    const tree = normalizeNavTree([
      {
        id: "g",
        label: "Gruppo",
        children: [{ to: "/a", label: "A", visible: false }],
      },
      { to: "/z", label: "Z" },
    ]);
    expect(tree).toHaveLength(1);
    expect(tree[0].to).toBe("/z");
  });

  it("appiattisce il gruppo con un figlio solo e gli passa l'icona", () => {
    const Icona = () => null;
    const tree = normalizeNavTree([
      {
        id: "g",
        label: "Gruppo",
        icon: Icona,
        children: [{ to: "/a", label: "A" }],
      },
    ]);
    expect(tree).toEqual([{ to: "/a", label: "A", icon: Icona }]);
  });

  it("non sovrascrive l'icona che il figlio ha già", () => {
    const Gruppo = () => null;
    const Figlio = () => null;
    const tree = normalizeNavTree([
      {
        id: "g",
        label: "Gruppo",
        icon: Gruppo,
        children: [{ to: "/a", label: "A", icon: Figlio }],
      },
    ]);
    expect(tree[0].icon).toBe(Figlio);
  });

  it("usa la label come id quando il gruppo non ne ha uno", () => {
    const tree = normalizeNavTree([
      {
        label: "Offerte",
        children: [
          { to: "/a", label: "A" },
          { to: "/b", label: "B" },
        ],
      },
    ]);
    expect(tree[0].id).toBe("Offerte");
  });
});

describe("collectGroupIds", () => {
  it("raccoglie gli id dei soli gruppi, non delle foglie", () => {
    const ids = collectGroupIds([
      { to: "/solo", label: "Solo" },
      {
        id: "offerte",
        label: "Offerte",
        children: [
          { to: "/a", label: "A" },
          { to: "/b", label: "B" },
        ],
      },
    ]);
    expect(ids).toEqual(["offerte"]);
  });
});
