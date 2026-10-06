import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import AppSidebar from "../AppSidebar.jsx";
import { normalizeNavTree } from "../navTree.js";
import ThemeToggle from "../theme/ThemeToggle.jsx";
import IconButton from "../atoms/IconButton.jsx";
import { cn } from "../lib/cn.js";

const STORAGE_KEY = "vuscom.sidebar.collapsed";
const WIDTHS = { "7xl": "max-w-7xl", full: "max-w-none" };

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
 */
export default function AppShell({
  sidebar = {},
  topbarRight,
  maxWidth = "7xl",
  children,
}) {
  const { nav = [], adminNav = [], ...sidebarProps } = sidebar;
  const { pathname } = useLocation();
  const mainTree = useMemo(() => normalizeNavTree(nav), [nav]);
  const adminTree = useMemo(() => normalizeNavTree(adminNav), [adminNav]);

  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState(
    () => new Set(activeGroupIds([...mainTree, ...adminTree], pathname)),
  );

  const mainRef = useRef(null);

  // Navigating into a collapsed group opens it (never closes the user's
  // others), and a new page starts from the top, not where the last one was.
  useEffect(() => {
    const attivi = activeGroupIds([...mainTree, ...adminTree], pathname);
    if (attivi.length > 0)
      setExpanded((prev) =>
        attivi.every((id) => prev.has(id))
          ? prev
          : new Set([...prev, ...attivi]),
      );
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [pathname, mainTree, adminTree]);

  const toggleCollapse = () =>
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        /* storage unavailable: the preference just won't persist */
      }
      return next;
    });

  const toggleGroup = (id) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="flex h-screen bg-app">
      <AppSidebar
        {...sidebarProps}
        mainTree={mainTree}
        adminTree={adminTree}
        expandedGroups={expanded}
        onToggleGroup={toggleGroup}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={toggleCollapse}
        themeSlot={<ThemeToggle />}
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
  );
}
