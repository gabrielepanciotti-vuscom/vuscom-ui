import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AppSidebar from "../src/AppSidebar.jsx";
import { collectGroupIds, normalizeNavTree } from "../src/navTree.js";

const TREE = normalizeNavTree([
  { section: "I miei task", children: [{ to: "/task", label: "Task", badge: 2 }] },
  {
    section: "Clienti segnalati",
    children: [
      { to: "/nuovi", label: "Nuovi", badge: 5 },
      { to: "/lavorazione", label: "In lavorazione" },
    ],
  },
]);

function monta(props = {}) {
  return render(
    <MemoryRouter initialEntries={["/task"]}>
      <AppSidebar appName="Segnalazioni" mainTree={TREE} {...props} />
    </MemoryRouter>,
  );
}

describe("AppSidebar: sezioni", () => {
  it("normalizeNavTree tiene la sezione con un figlio solo e toglie quella vuota", () => {
    const tree = normalizeNavTree([
      { section: "Sola", children: [{ to: "/a", label: "A" }] },
      { section: "Vuota", children: [{ to: "/b", label: "B", visible: false }] },
    ]);
    expect(tree).toHaveLength(1);
    expect(tree[0].section).toBe("Sola");
    expect(tree[0].children).toHaveLength(1);
  });

  it("collectGroupIds ignora le sezioni ma trova i gruppi dentro", () => {
    const ids = collectGroupIds([
      {
        section: "S",
        children: [{ id: "g", label: "G", children: [{ to: "/a" }, { to: "/b" }] }],
      },
    ]);
    expect(ids).toEqual(["g"]);
  });

  it("a sidebar aperta mostra il titolo e le voci con i badge, senza pulsante", () => {
    monta();
    expect(screen.getAllByText("Clienti segnalati").length).toBeGreaterThan(0);
    expect(screen.getAllByText("5").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /In lavorazione/ }).length).toBeGreaterThan(0);
    expect(screen.queryByRole("button", { name: /Clienti segnalati/ })).toBeNull();
  });

  it("da compressa il titolo diventa un divisore ma le voci restano", () => {
    monta({ collapsed: true });
    // La sidebar mobile resta estesa: il titolo testuale sopravvive solo lì.
    expect(screen.getAllByText("Clienti segnalati")).toHaveLength(1);
    // Il pannello mobile chiuso e' aria-hidden: per ruolo si vede solo il desktop,
    // la copia mobile c'e' comunque (hidden: true le conta entrambe).
    expect(screen.getAllByRole("group", { name: "Clienti segnalati" })).toHaveLength(1);
    expect(
      screen.getAllByRole("group", { name: "Clienti segnalati", hidden: true }),
    ).toHaveLength(2);
    expect(screen.getAllByText("5").length).toBe(2);
  });
});
