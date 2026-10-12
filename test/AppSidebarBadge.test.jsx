import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AppSidebar from "../src/AppSidebar.jsx";

const TREE = [
  { to: "/dashboard?tab=leads", label: "Segnalazioni" },
  { to: "/dashboard?tab=controlli", label: "Da controllare", badge: 3 },
  { to: "/dashboard?tab=altro", label: "Altro", badge: 0 },
];

function monta(url, props = {}) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <AppSidebar appName="Segnalatori" mainTree={TREE} {...props} />
    </MemoryRouter>,
  );
}

describe("AppSidebar: badge, query e headerSlot", () => {
  it("mostra il badge solo se il numero è maggiore di zero", () => {
    monta("/dashboard?tab=leads");
    expect(screen.getAllByText("3").length).toBeGreaterThan(0);
    expect(screen.queryByText("0")).toBeNull();
  });

  it("evidenzia la voce il cui parametro coincide con l'indirizzo", () => {
    monta("/dashboard?tab=controlli&sub=frodi");
    const attivi = screen
      .getAllByRole("link", { name: /Da controllare/ })
      .map((l) => l.className);
    expect(attivi.every((c) => c.includes("border-brand-500"))).toBe(true);
    const altra = screen.getAllByRole("link", { name: /Segnalazioni/ })[0];
    expect(altra.className).not.toContain("border-brand-500");
  });

  it("rende headerSlot sotto l'intestazione", () => {
    monta("/dashboard?tab=leads", { headerSlot: <button>Bonifico</button> });
    expect(screen.getAllByText("Bonifico").length).toBeGreaterThan(0);
  });
});
