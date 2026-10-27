import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText } from "lucide-react";
import { AppShell } from "../../src/index.js";

const future = { v7_startTransition: true, v7_relativeSplatPath: true };

const NAV = [
  { id: "home", label: "Panoramica", to: "/", icon: LayoutDashboard },
  { id: "report", label: "Report", to: "/report", icon: FileText },
];

function Navigatori() {
  const navigate = useNavigate();
  return (
    <>
      <button type="button" onClick={() => navigate("/report")}>
        vai ai report
      </button>
      <button type="button" onClick={() => navigate(-1)}>
        indietro
      </button>
    </>
  );
}

function Portale({ voci = ["/"], indice, ...props }) {
  return (
    <MemoryRouter initialEntries={voci} initialIndex={indice} future={future}>
      <AppShell
        sidebar={{ appName: "Cruscotto", nav: NAV, user: { username: "g" } }}
        {...props}
      >
        <Navigatori />
      </AppShell>
    </MemoryRouter>
  );
}

const burger = () => screen.getByRole("button", { name: "Apri menu" });
const pannelloMobile = () => document.querySelector(".md\\:hidden aside");

describe("AppShell — menu mobile", () => {
  it("il burger espone aria-expanded e aria-controls verso il pannello mobile", async () => {
    render(<Portale />);
    expect(burger()).toHaveAttribute("aria-expanded", "false");

    const id = pannelloMobile().id;
    expect(id).not.toBe("");
    expect(burger()).toHaveAttribute("aria-controls", id);

    await userEvent.click(burger());
    expect(burger()).toHaveAttribute("aria-expanded", "true");
    expect(burger()).toHaveAttribute("aria-controls", pannelloMobile().id);
  });

  it("il pannello e' inert e aria-hidden da chiuso, libero da aperto", async () => {
    render(<Portale />);
    expect(pannelloMobile()).toHaveAttribute("inert");
    expect(pannelloMobile()).toHaveAttribute("aria-hidden", "true");

    await userEvent.click(burger());
    expect(pannelloMobile()).not.toHaveAttribute("inert");
    expect(pannelloMobile()).not.toHaveAttribute("aria-hidden");
  });

  it("Esc chiude il menu e riporta il focus sul burger", async () => {
    render(<Portale />);
    await userEvent.click(burger());
    // il focus e' altrove (sul link del pannello), non sul burger
    within(pannelloMobile()).getByRole("link", { name: "Report" }).focus();
    expect(burger()).not.toHaveFocus();

    await userEvent.keyboard("{Escape}");
    expect(burger()).toHaveAttribute("aria-expanded", "false");
    expect(pannelloMobile()).toHaveAttribute("inert");
    expect(burger()).toHaveFocus();
  });

  it("Esc a menu chiuso non sposta il focus", async () => {
    render(<Portale />);
    screen.getByRole("button", { name: "vai ai report" }).focus();
    await userEvent.keyboard("{Escape}");
    expect(screen.getByRole("button", { name: "vai ai report" })).toHaveFocus();
  });

  it("un navigate() richiude il menu aperto", async () => {
    render(<Portale />);
    await userEvent.click(burger());
    expect(burger()).toHaveAttribute("aria-expanded", "true");

    await userEvent.click(screen.getByRole("button", { name: "vai ai report" }));
    expect(burger()).toHaveAttribute("aria-expanded", "false");
    expect(pannelloMobile()).toHaveAttribute("inert");
  });

  it("il tasto indietro (navigate(-1)) richiude il menu aperto", async () => {
    render(<Portale voci={["/", "/report"]} indice={1} />);
    await userEvent.click(burger());
    expect(burger()).toHaveAttribute("aria-expanded", "true");

    await userEvent.click(screen.getByRole("button", { name: "indietro" }));
    expect(burger()).toHaveAttribute("aria-expanded", "false");
  });

  it("un click su un link della sidebar richiude il menu", async () => {
    render(<Portale />);
    await userEvent.click(burger());
    await userEvent.click(
      within(pannelloMobile()).getByRole("link", { name: "Report" }),
    );
    expect(burger()).toHaveAttribute("aria-expanded", "false");
    expect(pannelloMobile()).toHaveAttribute("inert");
  });
});

describe("AppShell — salto al contenuto", () => {
  it("il primo elemento focalizzabile e' «Vai al contenuto», verso #contenuto", async () => {
    render(<Portale />);
    const salto = screen.getByRole("link", { name: "Vai al contenuto" });
    expect(salto).toHaveAttribute("href", "#contenuto");
    expect(salto).toHaveClass("sr-only", "focus:not-sr-only");

    await userEvent.tab();
    expect(salto).toHaveFocus();
  });

  it("il link di salto e' il primo figlio dell'app", () => {
    render(<Portale />);
    const salto = screen.getByRole("link", { name: "Vai al contenuto" });
    expect(salto.parentElement.firstElementChild).toBe(salto);
  });

  it("il main ha id contenuto e tabIndex -1 (focalizzabile ma fuori dal Tab)", () => {
    render(<Portale />);
    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "contenuto");
    expect(main).toHaveAttribute("tabindex", "-1");
    expect(main).toHaveClass("focus:outline-none");
    main.focus();
    expect(main).toHaveFocus();
  });

  it("idContenuto personalizzato e' rispettato da link e main", () => {
    render(<Portale idContenuto="principale" />);
    expect(screen.getByRole("link", { name: "Vai al contenuto" })).toHaveAttribute(
      "href",
      "#principale",
    );
    expect(screen.getByRole("main")).toHaveAttribute("id", "principale");
  });
});
