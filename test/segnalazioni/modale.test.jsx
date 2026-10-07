import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  SegnalazioniProvider,
  PulsanteSegnala,
  segnalaAttr,
  useSegnalazioni,
} from "../../src/segnalazioni/index.js";

vi.mock("rrweb", () => ({ record: vi.fn(() => () => {}) }));
vi.mock("../../src/segnalazioni/cattura.js", () => ({
  catturaSchermata: vi.fn(async () => ({
    mascherato: new Blob(["m"], { type: "image/png" }),
    privato: new Blob(["p"], { type: "image/png" }),
  })),
}));

const json = (status, corpo) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => corpo,
});

// Fake portal: config first, then one answer per POST in order.
function portale({
  config = { abilitato: true, durata_video_sec: 30 },
  risposte = [],
} = {}) {
  const coda = [...risposte];
  const invii = [];
  const fetchImpl = vi.fn(async (url, opzioni = {}) => {
    if (url.endsWith("/config")) return json(200, config);
    invii.push(opzioni);
    const prossima = coda.shift();
    if (prossima instanceof Error) throw prossima;
    return prossima;
  });
  return { fetchImpl, invii };
}

function Pagina({ fetchImpl }) {
  return (
    <SegnalazioniProvider
      endpoint="/api/segnalazioni"
      configEndpoint="/api/segnalazioni/config"
      fetchImpl={fetchImpl}
    >
      <PulsanteSegnala />
      <div
        {...segnalaAttr({
          tipo: "kpi",
          id: "kpi_clienti",
          nome: "Clienti attivi",
        })}
      >
        <span>1.234</span>
      </div>
    </SegnalazioniProvider>
  );
}

const reportDi = (invio) => JSON.parse(invio.body.get("report"));

async function apriSenzaElemento(user) {
  await user.click(
    await screen.findByRole("button", { name: /segnala un problema/i }),
  );
  await user.click(
    await screen.findByRole("button", { name: /segnala senza elemento/i }),
  );
  return screen.findByRole("dialog");
}

test("PulsanteSegnala renders nothing when config says abilitato false", async () => {
  const { fetchImpl } = portale({
    config: { abilitato: false, durata_video_sec: 30 },
  });
  const { container } = render(<Pagina fetchImpl={fetchImpl} />);
  await waitFor(() => expect(fetchImpl).toHaveBeenCalled());
  await new Promise((r) => setTimeout(r, 0));
  expect(
    screen.queryByRole("button", { name: /segnala un problema/i }),
  ).toBeNull();
  expect(container.querySelector("[data-segnala-ignora]")).toBeNull();
  expect(fetchImpl.mock.calls[0][1]).toMatchObject({ credentials: "include" });
});

test("PulsanteSegnala renders nothing outside a provider", () => {
  const { container } = render(<PulsanteSegnala />);
  expect(container).toBeEmptyDOMElement();
});

test("retry after 503 reuses the same segnalazione_id", async () => {
  const user = userEvent.setup();
  const { fetchImpl, invii } = portale({
    risposte: [
      json(503, {
        detail: "Servizio temporaneamente non disponibile",
        riprova: true,
      }),
      new TypeError("Failed to fetch"),
      json(201, {
        ticket_id: 4321,
        url: "https://redmine/issues/4321",
        duplicato: false,
      }),
    ],
  });
  render(<Pagina fetchImpl={fetchImpl} />);
  await apriSenzaElemento(user);

  await user.type(
    screen.getByRole("textbox", { name: /cosa non va/i }),
    "Il totale è sbagliato",
  );
  await user.click(screen.getByRole("button", { name: /^invia$/i }));
  expect(
    await screen.findByText("Non sono riuscito a inviarla. Riprova."),
  ).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /riprova/i }));
  expect(
    await screen.findByText("Non sono riuscito a inviarla. Riprova."),
  ).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: /riprova/i }));

  expect(
    await screen.findByText("Segnalazione #4321 inviata"),
  ).toBeInTheDocument();
  expect(invii).toHaveLength(3);
  const ids = invii.map((i) => reportDi(i).report_id);
  expect(ids[0]).toMatch(/^[0-9a-f-]{36}$/);
  expect(new Set(ids).size).toBe(1);
  expect(reportDi(invii[0])).toMatchObject({
    comment: "Il totale è sbagliato",
    element: null,
  });
  expect(typeof reportDi(invii[0]).page_url).toBe("string");
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
});

test("draft (comment, element, flags) survives a failed send", async () => {
  const user = userEvent.setup();
  const { fetchImpl, invii } = portale({
    risposte: [
      json(503, {
        detail: "Servizio temporaneamente non disponibile",
        riprova: true,
      }),
    ],
  });
  render(<Pagina fetchImpl={fetchImpl} />);

  await user.click(
    await screen.findByRole("button", { name: /segnala un problema/i }),
  );
  // Crosshair mode: a click picks the element under the pointer.
  await user.click(screen.getByText("1.234"));
  await screen.findByRole("dialog");
  expect(screen.getByText("Clienti attivi")).toBeInTheDocument();

  const video = screen.getByRole("checkbox", { name: /allega il video/i });
  const maschera = screen.getByRole("checkbox", { name: /maschera i dati/i });
  expect(video).toHaveAttribute("aria-checked", "true");
  expect(maschera).toHaveAttribute("aria-checked", "true");
  await user.click(video);
  await user.click(maschera);
  await user.type(
    screen.getByRole("textbox", { name: /cosa non va/i }),
    "KPI fermo",
  );
  await user.click(screen.getByRole("button", { name: /^invia$/i }));

  expect(
    await screen.findByText("Non sono riuscito a inviarla. Riprova."),
  ).toBeInTheDocument();
  expect(screen.getByRole("textbox", { name: /cosa non va/i })).toHaveValue(
    "KPI fermo",
  );
  expect(
    screen.getByRole("checkbox", { name: /allega il video/i }),
  ).toHaveAttribute("aria-checked", "false");
  expect(
    screen.getByRole("checkbox", { name: /maschera i dati/i }),
  ).toHaveAttribute("aria-checked", "false");
  expect(screen.getByText("Clienti attivi")).toBeInTheDocument();

  const [invio] = invii;
  expect(reportDi(invio).element).toMatchObject({
    tipo: "kpi",
    id: "kpi_clienti",
  });
  // Video unticked: no video part. Screenshot and actions always go.
  expect(invio.body.get("video")).toBeNull();
  expect(invio.body.get("screenshot")).not.toBeNull();
  expect(invio.body.get("azioni")).not.toBeNull();
  expect(invio.body.get("screenshot").type).toBe("image/png");
  expect(invio.body.get("azioni").type).toBe("application/json");
});

test("503 not configured shows the unavailable message and no retry", async () => {
  const user = userEvent.setup();
  const { fetchImpl } = portale({
    risposte: [json(503, { detail: "non configurato", riprova: false })],
  });
  render(<Pagina fetchImpl={fetchImpl} />);
  await apriSenzaElemento(user);
  await user.type(
    screen.getByRole("textbox", { name: /cosa non va/i }),
    "Bozza",
  );
  await user.click(screen.getByRole("button", { name: /^invia$/i }));
  expect(
    await screen.findByText("Segnalazione non disponibile al momento"),
  ).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /riprova/i })).toBeNull();
  expect(screen.getByRole("textbox", { name: /cosa non va/i })).toHaveValue(
    "Bozza",
  );
});

test("the comment is required", async () => {
  const user = userEvent.setup();
  const { fetchImpl, invii } = portale();
  render(<Pagina fetchImpl={fetchImpl} />);
  await apriSenzaElemento(user);
  expect(screen.getByRole("button", { name: /^invia$/i })).toBeDisabled();
  await user.type(screen.getByRole("textbox", { name: /cosa non va/i }), "   ");
  expect(screen.getByRole("button", { name: /^invia$/i })).toBeDisabled();
  expect(invii).toHaveLength(0);
});

test("Esc in crosshair mode cancels without opening the modal", async () => {
  const user = userEvent.setup();
  const { fetchImpl } = portale();
  function Stato() {
    const { stato } = useSegnalazioni();
    return <output>{stato}</output>;
  }
  render(
    <SegnalazioniProvider
      endpoint="/api/segnalazioni"
      configEndpoint="/api/segnalazioni/config"
      fetchImpl={fetchImpl}
    >
      <PulsanteSegnala compatto />
      <Stato />
    </SegnalazioniProvider>,
  );
  await user.click(
    await screen.findByRole("button", { name: /segnala un problema/i }),
  );
  expect(screen.getByRole("status")).toHaveTextContent("mirino");
  await user.keyboard("{Escape}");
  expect(screen.getByRole("status")).toHaveTextContent("inattivo");
  expect(screen.queryByRole("dialog")).toBeNull();
});
