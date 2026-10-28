import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import {
  ProgressBar,
  Tabs,
  MatriceCalore,
  coloreTesto,
  SOGLIA_TESTO_CHIARO,
  tabPanelId,
} from "../src/index.js";
import AppSidebar from "../src/AppSidebar.jsx";

const VOCI = [
  { id: "a", label: "Uno" },
  { id: "b", label: "Due" },
];

describe("ProgressBar — nome accessibile", () => {
  test("senza etichetta il nome è «Avanzamento» e il valore è testuale", () => {
    render(<ProgressBar value={80} />);
    const p = screen.getByRole("progressbar", { name: "Avanzamento" });
    expect(p).toHaveAttribute("aria-valuetext", "80%");
  });

  test("label e aria-label diventano il nome", () => {
    const { rerender } = render(<ProgressBar value={10} label="Credito" />);
    expect(screen.getByRole("progressbar", { name: "Credito" })).toBeTruthy();
    rerender(<ProgressBar value={10} label="Credito" aria-label="Budget" />);
    expect(screen.getByRole("progressbar", { name: "Budget" })).toBeTruthy();
  });

  test("labelledBy usa aria-labelledby al posto di aria-label", () => {
    render(
      <>
        <h3 id="titolo-pb">Pratiche chiuse</h3>
        <ProgressBar value={50} labelledBy="titolo-pb" />
      </>,
    );
    const p = screen.getByRole("progressbar", { name: "Pratiche chiuse" });
    expect(p).toHaveAttribute("aria-labelledby", "titolo-pb");
    expect(p).not.toHaveAttribute("aria-label");
  });
});

describe("Tabs — aria-controls solo verso un pannello esistente", () => {
  test("senza pannello nella pagina non c'è aria-controls", () => {
    render(<Tabs value="a" items={VOCI} />);
    expect(screen.getByRole("tab", { name: "Uno" })).not.toHaveAttribute(
      "aria-controls",
    );
  });

  test("con il pannello reso dal portale aria-controls resta", () => {
    render(
      <>
        <Tabs value="a" items={VOCI} idPrefix="t1" />
        <div role="tabpanel" id={tabPanelId("a", "t1")}>
          contenuto
        </div>
      </>,
    );
    expect(screen.getByRole("tab", { name: "Uno" })).toHaveAttribute(
      "aria-controls",
      "t1-panel-a",
    );
    expect(screen.getByRole("tab", { name: "Due" })).not.toHaveAttribute(
      "aria-controls",
    );
  });

  test("controllaPannello forza o spegne il collegamento", () => {
    const { rerender } = render(
      <Tabs value="a" items={VOCI} controllaPannello />,
    );
    const tab = () => screen.getByRole("tab", { name: "Uno" });
    expect(tab()).toHaveAttribute("aria-controls", "panel-a");
    rerender(
      <>
        <Tabs value="a" items={VOCI} controllaPannello={false} />
        <div id="panel-a" />
      </>,
    );
    expect(tab()).not.toHaveAttribute("aria-controls");
  });
});

describe("AppSidebar — testi piccoli leggibili", () => {
  test("sottotitolo e ruolo usano slate-500/400 e almeno 11px", () => {
    render(
      <MemoryRouter>
        <AppSidebar
          appName="Cruscotto"
          appSubtitle="Direzionale"
          mainTree={[]}
          user={{ username: "gabriele", ruolo: "admin" }}
        />
      </MemoryRouter>,
    );
    for (const testo of ["Direzionale", "admin"]) {
      for (const el of screen.getAllByText(testo)) {
        expect(el).toHaveClass("text-slate-500", "dark:text-slate-400", "text-[11px]");
        expect(el).not.toHaveClass("text-slate-400", "text-[10px]");
      }
    }
  });
});

describe("MatriceCalore — colore del testo dall'intensità", () => {
  test("soglia deterministica", () => {
    expect(SOGLIA_TESTO_CHIARO).toBe(0.65);
    expect(coloreTesto(0)).toBe("text-foreground");
    expect(coloreTesto(0.55)).toBe("text-foreground");
    expect(coloreTesto(0.649)).toBe("text-foreground");
    expect(coloreTesto(0.65)).toBe("text-primary-foreground");
    expect(coloreTesto(0.9)).toBe("text-primary-foreground");
  });

  test("le celle a media intensità hanno testo scuro, le piene chiaro", () => {
    // 100 → alfa 0.90; 36 → sqrt 0.6 → alfa 0.572 (era bianco, contrasto 2.23)
    const { container } = render(
      <MatriceCalore
        righe={[
          { id: "r", label: "R", valori: { "2026-01": 100, "2026-02": 36 } },
        ]}
        periodi={["2026-01", "2026-02"]}
      />,
    );
    const piena = container.querySelector('td[data-intensita="1.000"]');
    const media = container.querySelector('td[data-intensita="0.600"]');
    expect(piena).toHaveClass("text-primary-foreground");
    expect(media).toHaveClass("text-foreground");
    expect(media).not.toHaveClass("text-primary-foreground");
  });
});
