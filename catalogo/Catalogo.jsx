import { LayoutDashboard, Users, Settings } from "lucide-react";
import {
  AppShell,
  PageHeader,
  ThemeToggle,
  ToastProvider,
} from "../src/index.js";
import Azioni from "./sezioni/Azioni.jsx";
import Moduli from "./sezioni/Moduli.jsx";
import Dati from "./sezioni/Dati.jsx";
import Feedback from "./sezioni/Feedback.jsx";
import {
  azioniSegnalazioni,
  SegnalazioniProvider,
} from "../src/segnalazioni/index.js";

// Demo portal: reports on, every send answers with a fake ticket.
const finto = (status, corpo) =>
  new Response(JSON.stringify(corpo), {
    status,
    headers: { "Content-Type": "application/json" },
  });
let ticket = 1000;
// The last body sent stays on window, to inspect it from the devtools.
const fetchDemo = async (url, opzioni = {}) => {
  if (url.endsWith("/config"))
    return finto(200, { abilitato: true, durata_video_sec: 30 });
  window.__ultimaSegnalazione = opzioni.body;
  return finto(201, { ticket_id: ++ticket, url: "#", duplicato: false });
};

const SIDEBAR = {
  appName: "Catalogo",
  appSubtitle: "@vuscom/ui",
  nav: [
    { id: "home", label: "Componenti", to: "/", icon: LayoutDashboard },
    {
      id: "g",
      label: "Gruppo",
      icon: Settings,
      children: [
        { id: "g1", label: "Voce uno", to: "/uno" },
        { id: "g2", label: "Voce due", to: "/due" },
      ],
    },
  ],
  adminNav: [{ id: "u", label: "Utenti", to: "/utenti", icon: Users }],
  user: { username: "demo", ruolo: "admin" },
  onLogout: () => {},
  themeSlot: <ThemeToggle />,
};

export default function Catalogo() {
  return (
    <SegnalazioniProvider fetchImpl={fetchDemo}>
      <ToastProvider>
        <AppShell
          sidebar={SIDEBAR}
          topbarRight={<ThemeToggle />}
          azioniSidebar={azioniSegnalazioni}
        >
          <PageHeader
            title="Catalogo componenti"
            description="Ogni componente di @vuscom/ui con varianti e stati. Cambia tema dall'interruttore."
            icon={LayoutDashboard}
          />
          <div className="space-y-12 pb-16">
            <Azioni />
            <Moduli />
            <Dati />
            <Feedback />
          </div>
        </AppShell>
      </ToastProvider>
    </SegnalazioniProvider>
  );
}
