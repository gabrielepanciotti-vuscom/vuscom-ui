import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import {
  AccessoMicrosoft,
  AltriPortali,
  PortaliSidebar,
  altriPortali,
  portaliRicordati,
  ricordaPortali,
} from "../../src/index.js";

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState(null, "", "/login");
});

afterEach(() => {
  vi.unstubAllGlobals();
});

test("dalla rete interna: indirizzi .vuscom.dev con ?accedi=microsoft, senza il portale corrente", () => {
  const p = altriPortali({
    corrente: "offerte",
    hostname: "offerte.vuscom.dev",
  });
  expect(p.map((x) => x.codice)).toEqual([
    "cruscotto",
    "outbound",
    "configuratore",
    "dataapi",
  ]);
  expect(p[0].url).toBe("https://cruscotto.vuscom.dev/?accedi=microsoft");
  expect(p.find((x) => x.codice === "dataapi").url).toBe(
    "https://api.vuscom.dev/admin/?accedi=microsoft",
  );
});

test("da un dominio pubblico: solo i portali che hanno un indirizzo pubblico", () => {
  const p = altriPortali({
    corrente: "offerte",
    hostname: "offerte.vuscom.it",
  });
  expect(p).toEqual([
    expect.objectContaining({
      codice: "cruscotto",
      url: "https://cruscotto.vuscom.it",
    }),
  ]);
});

test("filtra sui portali dell'utente", () => {
  const p = altriPortali({
    corrente: "dataapi",
    codici: ["dataapi", "cruscotto"],
    hostname: "api.vuscom.dev",
  });
  expect(p.map((x) => x.codice)).toEqual(["cruscotto"]);
});

test("ricorda i portali e li rilegge; storage illeggibile = nessun ricordo", () => {
  expect(portaliRicordati()).toBeNull();
  ricordaPortali(["offerte", "dataapi"]);
  expect(portaliRicordati()).toEqual(["offerte", "dataapi"]);
  localStorage.setItem("vuscom.portali", "{rotto");
  expect(portaliRicordati()).toBeNull();
});

test("sotto il login: tutti i portali se nessuno è ricordato, poi solo quelli dell'ultimo utente", () => {
  const { unmount } = render(<AltriPortali corrente="offerte" />);
  expect(screen.getAllByRole("link")).toHaveLength(4);
  unmount();
  ricordaPortali(["offerte", "cruscotto"]);
  render(<AltriPortali corrente="offerte" />);
  expect(screen.getAllByRole("link").map((a) => a.textContent)).toEqual([
    "Cruscotto",
  ]);
});

test("nella sidebar: tessere degli altri portali, e i codici restano ricordati", () => {
  render(
    <MemoryRouter>
      <PortaliSidebar corrente="dataapi" codici={["dataapi", "offerte"]} />
    </MemoryRouter>,
  );
  expect(
    screen.getByRole("link", { name: "Apri Hub Offerte" }),
  ).toBeInTheDocument();
  expect(screen.queryByRole("link", { name: /Admin Data API/ })).toBeNull();
  expect(portaliRicordati()).toEqual(["dataapi", "offerte"]);
});

test("arrivando con ?accedi=microsoft parte da solo il login Microsoft, una volta", async () => {
  window.history.replaceState(null, "", "/login?accedi=microsoft");
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ disponibile: true }),
    })),
  );
  const assign = vi.fn();
  const originale = window.location;
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { ...originale, assign },
  });
  try {
    render(<AccessoMicrosoft onAccesso={() => {}} />);
    await waitFor(() =>
      expect(assign).toHaveBeenCalledWith("/api/auth/microsoft/login"),
    );
    expect(assign).toHaveBeenCalledTimes(1);
  } finally {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originale,
    });
  }
});

test("senza Microsoft disponibile ?accedi=microsoft non fa niente", async () => {
  window.history.replaceState(null, "", "/login?accedi=microsoft");
  const fetch = vi.fn(async () => ({
    ok: true,
    status: 200,
    json: async () => ({ disponibile: false }),
  }));
  vi.stubGlobal("fetch", fetch);
  const assign = vi.fn();
  const originale = window.location;
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { ...originale, assign },
  });
  try {
    render(<AccessoMicrosoft onAccesso={() => {}} />);
    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(assign).not.toHaveBeenCalled();
  } finally {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originale,
    });
  }
});
