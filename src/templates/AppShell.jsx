import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import AppSidebar from "../AppSidebar.jsx";
import { normalizeNavTree } from "../navTree.js";
import ThemeToggle from "../theme/ThemeToggle.jsx";
import IconButton from "../atoms/IconButton.jsx";
import { cn } from "../lib/cn.js";

const STORAGE_KEY = "vuscom.sidebar.collapsed";
const WIDTHS = { "7xl": "max-w-7xl", full: "max-w-none" };
// Stable defaults: a fresh `[]` per render would re-run every memo below.
const NESSUNA_VOCE = [];

// Pages that want room (a report builder, a wide table) ask for a compact
// sidebar while they are mounted; outside an AppShell the request is a no-op.
const CompattaContext = createContext(null);

/**
 * Keeps the sidebar compact while the calling page is mounted (`attiva`), and
 * gives it back to the user's saved preference when the page goes away. The
 * preference itself is never overwritten: only a click on the toggle does.
 */
export function useSidebarCompatta(attiva = true) {
  const richiedi = useContext(CompattaContext);
  useEffect(() => {
    if (!attiva || !richiedi) return undefined;
    return richiedi();
  }, [attiva, richiedi]);
}

function readCollapsed() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function matches(node, pathname) {
  if (!node.to) return false;
  return node.to === "/"
    ? pathname === "/"
    : pathname === node.to || pathname.startsWith(`${node.to}/`);
}

// Ids of the groups that contain the active route, at any depth.
function activeGroupIds(nodes, pathname) {
  const ids = [];
  for (const node of nodes) {
    if (!node?.children) continue;
    const inner = activeGroupIds(node.children, pathname);
    const hit =
      inner.length > 0 || node.children.some((c) => matches(c, pathname));
    if (hit) ids.push(node.id || node.label, ...inner);
  }
  return ids;
}

/**
 * Standard page frame for every VUS COM portal: shared sidebar, top bar and
 * scrolling content area. Must be rendered inside a Router.
 * `compattaAdOgniPagina` makes every navigation start with a compact sidebar
 * (opt-in per portal: the default keeps the user's saved preference).
 * `azioniSidebar` is a node, or `({ compressa }) => node` so it can change
 * shape with the sidebar (e.g. `azioniSegnalazioni`): open, it gets its own
 * row in the footer above the theme toggle; collapsed, it stacks over the
 * toggle. The shell takes it from outside, so this entry never imports
 * `@vuscom/ui/segnalazioni`.
 */
export default function AppShell({
  sidebar = {},
  topbarRight,
  azioniSidebar,
  maxWidth = "7xl",
  compattaAdOgniPagina = false,
  children,
}) {
  const {
    nav = NESSUNA_VOCE,
    adminNav = NESSUNA_VOCE,
    ...sidebarProps
  } = sidebar;
  const { pathname } = useLocation();
  const mainTree = useMemo(() => normalizeNavTree(nav), [nav]);
  const adminTree = useMemo(() => normalizeNavTree(adminNav), [adminNav]);

  const [collapsed, setCollapsed] = useState(readCollapsed);
  // Pages currently asking for a compact sidebar, and whether the user
  // reopened it anyway (reset when the last request goes away).
  const [richieste, setRichieste] = useState(0);
  const [riaperta, setRiaperta] = useState(false);
  const forzata = richieste > 0 && !riaperta;
  const richiediCompatta = useMemo(
    () => () => {
      setRichieste((n) => n + 1);
      return () => setRichieste((n) => n - 1);
    },
    [],
  );
  useEffect(() => {
    if (richieste === 0) setRiaperta(false);
  }, [richieste]);
  // `compattaAdOgniPagina`: every page opens with the sidebar compact; the
  // toggle reopens it for the current page only, and the next one starts
  // compact again. The saved preference is not used in this mode.
  const [apertaQui, setApertaQui] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState(
    () => new Set(activeGroupIds([...mainTree, ...adminTree], pathname)),
  );

  const mainRef = useRef(null);
  // The effect below must fire on navigation only: callers may pass `nav`
  // inline (a new array each render), and re-running on that would scroll
  // the page to the top and reopen groups the user closed on every render.
  const treesRef = useRef(null);
  treesRef.current = [...mainTree, ...adminTree];

  // Navigating into a collapsed group opens it (never closes the user's
  // others), and a new page starts from the top, not where the last one was.
  useEffect(() => {
    const attivi = activeGroupIds(treesRef.current, pathname);
    if (attivi.length > 0)
      setExpanded((prev) =>
        attivi.every((id) => prev.has(id))
          ? prev
          : new Set([...prev, ...attivi]),
      );
    if (mainRef.current) mainRef.current.scrollTop = 0;
    setApertaQui(false);
  }, [pathname]);

  const toggleCollapse = () => {
    if (compattaAdOgniPagina) {
      setApertaQui((v) => !v);
      return;
    }
    // Forced compact by a page: the click opens it for this page only, and
    // the saved preference (whatever it was) becomes «open».
    if (forzata) {
      setRiaperta(true);
      if (!collapsed) return;
    }
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        /* storage unavailable: the preference just won't persist */
      }
      return next;
    });
  };

  const toggleGroup = (id) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const compressa = compattaAdOgniPagina ? !apertaQui : collapsed || forzata;
  const azioni =
    typeof azioniSidebar === "function"
      ? azioniSidebar({ compressa })
      : azioniSidebar;

  return (
    <CompattaContext.Provider value={richiediCompatta}>
      <div className="flex h-screen bg-app">
        <AppSidebar
          {...sidebarProps}
          mainTree={mainTree}
          adminTree={adminTree}
          expandedGroups={expanded}
          onToggleGroup={toggleGroup}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          collapsed={compressa}
          onToggleCollapse={toggleCollapse}
          footerSlot={
            azioni && !compressa ? (
              <>
                {sidebarProps.footerSlot}
                {azioni}
              </>
            ) : (
              sidebarProps.footerSlot
            )
          }
          themeSlot={
            azioni && compressa ? (
              // Collapsed (60px): no footer rows, so it stacks over the toggle.
              <div className="flex flex-col items-center gap-1.5">
                {azioni}
                <ThemeToggle />
              </div>
            ) : (
              <ThemeToggle />
            )
          }
          navClassName="scrollbar-thin"
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b bg-background/80 px-4 backdrop-blur">
            <IconButton
              icon={Menu}
              label="Apri menu"
              className="md:hidden"
              onClick={() => setIsOpen(true)}
            />
            <div className="ml-auto flex items-center gap-2">{topbarRight}</div>
          </header>
          <main
            ref={mainRef}
            className="flex-1 overflow-y-auto scrollbar-thin p-4 md:p-6"
          >
            <div className={cn("mx-auto", WIDTHS[maxWidth] ?? WIDTHS["7xl"])}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </CompattaContext.Provider>
  );
}
