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
    <ToastProvider>
      <AppShell sidebar={SIDEBAR} topbarRight={<ThemeToggle />}>
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
  );
}
