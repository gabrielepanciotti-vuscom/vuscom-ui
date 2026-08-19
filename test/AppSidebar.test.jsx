import { useState } from "react";
import { MemoryRouter } from "react-router-dom";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AppSidebar from "../src/AppSidebar.jsx";

const TREE = [
  { to: "/", label: "Dashboard" },
  {
    id: "offerte",
    label: "Offerte",
    children: [
      { to: "/simulazione", label: "Simulazione Offerte" },
      { to: "/scadenze-offerte", label: "Scadenze Offerte" },
    ],
  },
];

/** Wrapper con lo stato che in produzione vive nel Layout dell'app. */
function Harness({
  initialCollapsed = false,
  initialExpanded = ["offerte"],
  ...props
}) {
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [expanded, setExpanded] = useState(new Set(initialExpanded));
  return (
    <MemoryRouter initialEntries={["/"]}>
      <AppSidebar
        appName="Cruscotto"
        mainTree={TREE}
        expandedGroups={expanded}
        onToggleGroup={(id) =>
          setExpanded((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
          })
        }
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
        user={{ username: "gabriele", ruolo: "admin" }}
        {...props}
      />
    </MemoryRouter>
  );
}

/** La sidebar desktop; l'overlay mobile ne renderizza una seconda copia. */
function desktopSidebar() {
  return document.querySelector("aside.hidden.md\\:flex");
}

describe("AppSidebar — collasso", () => {
  it("il pulsante comprime e riespande la sidebar", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const aside = desktopSidebar();

    expect(aside.querySelector(".w-60")).not.toBeNull();
    // Da estesa l'etichetta è testo normale, non un tooltip.
    expect(within(aside).getByText("Dashboard").className).not.toMatch(
      /opacity-0/,
    );

    await user.click(
      within(aside).getByRole("button", { name: "Comprimi menu" }),
    );
    // Da compressa restano le icone: l'etichetta sopravvive solo come tooltip.
    expect(aside.querySelector(".w-\\[60px\\]")).not.toBeNull();
    expect(within(aside).getByText("Dashboard").className).toMatch(/opacity-0/);

    await user.click(
      within(aside).getByRole("button", { name: "Espandi menu" }),
    );
    expect(aside.querySelector(".w-60")).not.toBeNull();
    expect(within(aside).getByText("Dashboard").className).not.toMatch(
      /opacity-0/,
    );
  });

  it("l'overlay mobile resta esteso anche a sidebar compressa", () => {
    render(<Harness initialCollapsed />);
    const mobile = document.querySelector(".md\\:hidden aside");
    expect(within(mobile).getByText("Dashboard")).toBeInTheDocument();
  });

  it("da compressa non compare il pulsante di collasso nell'overlay mobile", () => {
    render(<Harness initialCollapsed />);
    const mobile = document.querySelector(".md\\:hidden aside");
    expect(within(mobile).queryByRole("button", { name: /menu/ })).toBeNull();
  });
});

describe("AppSidebar — gruppi", () => {
  it("il gruppo chiuso nasconde le sue voci e riaperto le rimostra", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const aside = desktopSidebar();

    expect(within(aside).getByText("Scadenze Offerte")).toBeInTheDocument();

    await user.click(within(aside).getByRole("button", { name: /Offerte/ }));
    expect(
      within(aside).queryByText("Scadenze Offerte"),
    ).not.toBeInTheDocument();

    await user.click(within(aside).getByRole("button", { name: /Offerte/ }));
    expect(within(aside).getByText("Scadenze Offerte")).toBeInTheDocument();
  });

  it("da compressa il popout su hover raggiunge comunque le voci del gruppo", async () => {
    const user = userEvent.setup();
    render(<Harness initialCollapsed />);
    const aside = desktopSidebar();

    expect(
      within(aside).queryByText("Scadenze Offerte"),
    ).not.toBeInTheDocument();
    await user.hover(within(aside).getByTitle("Offerte"));
    expect(within(aside).getByText("Scadenze Offerte")).toBeInTheDocument();
  });
});

describe("AppSidebar — slot e menu utente", () => {
  it("mostra lo slot azioni da estesa e lo nasconde da compressa", async () => {
    const user = userEvent.setup();
    render(<Harness footerSlot={<button>Aggiorna Dati</button>} />);
    const aside = desktopSidebar();

    expect(within(aside).getByText("Aggiorna Dati")).toBeInTheDocument();
    await user.click(
      within(aside).getByRole("button", { name: "Comprimi menu" }),
    );
    expect(within(aside).queryByText("Aggiorna Dati")).not.toBeInTheDocument();
  });

  it("le voci extra del menu utente scattano al click", async () => {
    const user = userEvent.setup();
    const onCreateUser = vi.fn();
    render(
      <Harness
        userMenuExtras={[
          { id: "new-user", label: "Nuovo Utente", onClick: onCreateUser },
        ]}
      />,
    );
    const aside = desktopSidebar();

    await user.click(within(aside).getByRole("button", { name: /gabriele/ }));
    await user.click(within(aside).getByText("Nuovo Utente"));
    expect(onCreateUser).toHaveBeenCalledOnce();
  });
});
