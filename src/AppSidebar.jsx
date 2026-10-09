import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogoV } from "./brand/Brand.jsx";
import PulsanteGuida from "./PulsanteGuida.jsx";
import {
  ChevronRight,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
} from "lucide-react";

/**
 * Sidebar applicativa condivisa tra i frontend VUS COM.
 *
 * Navigazione a due livelli: le foglie hanno `to`, i gruppi hanno `children[]`
 * e si aprono a fisarmonica. Da compressa (60px) i gruppi diventano icone con
 * un popout al passaggio del mouse, così nessuna voce resta irraggiungibile.
 *
 * Il tema e le azioni di pagina entrano come slot (`themeSlot`, `footerSlot`)
 * invece che come dipendenze: il pacchetto non deve sapere come ogni app
 * gestisce il tema, e soprattutto non deve portarsi dietro un secondo React.
 *
 * Props principali:
 *  - mainTree[], adminTree[]: alberi già normalizzati (vedi normalizeNavTree)
 *  - expandedGroups: Set<string> degli id gruppo aperti · onToggleGroup(id)
 *  - collapsed / onToggleCollapse: modalità stretta
 *  - isOpen / onClose: overlay mobile
 *  - iconaPortale: chiave di COLORI_PORTALE ("outbound"…): la V sul colore del portale,
 *    in sidebar e nella scheda del browser.
 *  - guida: guida generale del portale ("/guida", URL, o { href, label }): pulsante
 *    accanto a «comprimi». Obbligatoria per il tester di conformità.
 *  - navClassName: classi extra sulla <nav> scrollabile. Serve alle utility che
 *    il pacchetto non puo' dichiarare, perche' vivono nel CSS dell'app che lo
 *    ospita (es. `scrollbar-thin` in Hub Offerte): il pacchetto non sa quali
 *    esistano, quindi le riceve invece di indovinarle.
 */
export default function AppSidebar({
  appName = "App",
  appSubtitle = "",
  appIcon,
  mainTree = [],
  adminTree = [],
  expandedGroups,
  onToggleGroup,
  user,
  onOpenProfile,
  onLogout,
  userMenuExtras = [],
  isOpen,
  onClose,
  collapsed = false,
  onToggleCollapse,
  themeSlot,
  footerSlot,
  navClassName = "",
  guida,
  iconaPortale,
}) {
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [hoveredGroup, setHoveredGroup] = useState(null);

  useEffect(() => {
    // La sidebar viene renderizzata due volte (desktop + overlay mobile), quindi
    // un ref singolo non basta: si riconosce il "dentro" dall'attributo dati.
    function handleClickOutside(e) {
      if (!e.target.closest?.("[data-user-menu]")) setShowUserMenu(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (item) => {
    if (!item?.to) return false;
    // matchPrefix serve alle sezioni con sottopagine (es. /offerte/123), che
    // altrimenti spengono l'evidenziazione appena si entra nel dettaglio.
    if (item.matchPrefix) {
      return (
        location.pathname === item.to ||
        location.pathname.startsWith(`${item.to}/`)
      );
    }
    return location.pathname === item.to;
  };

  const isGroupActive = (group) =>
    (group.children || []).some((c) =>
      c.children ? isGroupActive(c) : isActive(c),
    );

  const renderLeaf = (item, isCollapsed, indent = false) => {
    const active = isActive(item);
    const Icon = item.icon;
    return (
      <Link
        key={item.id || item.to}
        to={item.to}
        onClick={onClose}
        className={`group relative flex items-center gap-2.5 py-2 rounded-[7px] mb-0.5 text-[13px] transition-colors border-l-[3px] ${
          isCollapsed
            ? "justify-center px-2.5"
            : indent
              ? "pl-7 pr-2.5"
              : "px-2.5"
        } ${
          active
            ? "border-brand-500 bg-brand-50 dark:bg-brand-500/[0.12] text-brand-700 dark:text-brand-300 font-semibold"
            : "border-transparent text-slate-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/[0.04]"
        }`}
      >
        {Icon && (
          <Icon
            className={`w-4 h-4 flex-shrink-0 ${active ? "text-brand-600 dark:text-brand-400" : "text-slate-400 dark:text-slate-600"}`}
          />
        )}
        {!isCollapsed && <span className="truncate">{item.label}</span>}
        {isCollapsed && (
          <span className="pointer-events-none absolute left-full ml-2 px-2 py-1 rounded-md bg-slate-900 dark:bg-slate-700 text-white text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg">
            {item.label}
          </span>
        )}
      </Link>
    );
  };

  const renderGroup = (group, isCollapsed) => {
    const Icon = group.icon;
    const groupId = group.id || group.label;
    const expanded = expandedGroups?.has(groupId);
    const groupActive = isGroupActive(group);

    if (isCollapsed) {
      const isHover = hoveredGroup === groupId;
      return (
        <div
          key={groupId}
          className="relative"
          onMouseEnter={() => setHoveredGroup(groupId)}
          onMouseLeave={() => setHoveredGroup(null)}
        >
          <button
            type="button"
            className={`group relative flex items-center justify-center gap-2.5 px-2.5 py-2 rounded-[7px] mb-0.5 text-[13px] border-l-[3px] w-full transition-colors ${
              groupActive
                ? "border-brand-500 bg-brand-50 dark:bg-brand-500/[0.12] text-brand-700 dark:text-brand-300"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/[0.04]"
            }`}
            onClick={() => onToggleGroup?.(groupId)}
            title={group.label}
          >
            {Icon && (
              <Icon
                className={`w-4 h-4 ${groupActive ? "text-brand-600 dark:text-brand-400" : "text-slate-400 dark:text-slate-600"}`}
              />
            )}
          </button>
          {isHover && (
            <div className="absolute left-full top-0 ml-2 z-50 min-w-[200px] bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-lg shadow-xl py-1.5 px-1.5">
              <div className="px-2 py-1 text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
                {group.label}
              </div>
              {group.children.map((child) => renderLeaf(child, false, false))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div key={groupId} className="mb-0.5">
        <button
          type="button"
          onClick={() => onToggleGroup?.(groupId)}
          aria-expanded={!!expanded}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13px] transition-colors border-l-[3px] border-transparent ${
            groupActive
              ? "text-slate-900 dark:text-slate-100 font-semibold"
              : "text-slate-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/[0.04]"
          }`}
        >
          {Icon && (
            <Icon
              className={`w-4 h-4 flex-shrink-0 ${groupActive ? "text-brand-600 dark:text-brand-400" : "text-slate-400 dark:text-slate-600"}`}
            />
          )}
          <span className="flex-1 text-left truncate">{group.label}</span>
          <ChevronRight
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${expanded ? "rotate-90" : ""}`}
          />
        </button>
        {expanded && (
          <div className="mt-0.5">
            {group.children.map((child) => renderLeaf(child, false, true))}
          </div>
        )}
      </div>
    );
  };

  const renderItem = (item, isCollapsed) =>
    item.children
      ? renderGroup(item, isCollapsed)
      : renderLeaf(item, isCollapsed, false);

  const buildSidebar = (isCollapsed, showCollapseButton) => (
    <div
      className={`flex flex-col h-full bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-800 border-r border-gray-200 dark:border-white/[0.06] shadow-[2px_0_12px_rgba(0,0,0,0.04)] dark:shadow-none transition-[width] duration-200 ease-out ${
        isCollapsed ? "w-[60px]" : "w-60"
      }`}
    >
      <div
        className={`flex items-center border-b border-gray-100 dark:border-white/[0.06] ${
          isCollapsed ? "flex-col gap-2 py-3 px-2" : "gap-2.5 px-4 pt-5 pb-4"
        }`}
      >
        {/* No appIcon = the official V: a portal never shows a home-made logo. */}
        <div className="flex-shrink-0">{appIcon ?? <LogoV portale={iconaPortale} />}</div>
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <div className="text-slate-900 dark:text-slate-100 text-[13px] font-bold leading-tight truncate">
              {appName}
            </div>
            {appSubtitle && (
              <div className="text-slate-400 dark:text-slate-500 text-[10px] tracking-wide truncate">
                {appSubtitle}
              </div>
            )}
          </div>
        )}
        <PulsanteGuida guida={guida} compressa={isCollapsed} />
        {showCollapseButton && onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? "Espandi menu" : "Comprimi menu"}
            // Collapsed, the reopen button is the only way back to the labels:
            // a filled primary button, not a grey icon lost in the header.
            className={
              isCollapsed
                ? "flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground shadow-md ring-2 ring-primary/25 hover:brightness-110 hover:shadow-lg active:scale-95 focus-visible:outline-none focus-visible:ring-4 transition-all"
                : "flex items-center justify-center w-7 h-7 rounded-md text-slate-400 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            }
            title={isCollapsed ? "Espandi menu" : "Comprimi menu"}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      <nav
        className={`flex-1 overflow-y-auto overflow-x-hidden px-2.5 py-2 ${navClassName}`.trim()}
      >
        {mainTree.map((item) => renderItem(item, isCollapsed))}

        {adminTree.length > 0 && (
          <>
            <div
              className={`mt-4 mb-2 ${isCollapsed ? "px-0 flex justify-center" : "px-2.5"}`}
            >
              <div
                className={`border-t border-slate-200 dark:border-white/[0.08] ${isCollapsed ? "w-6" : "w-full"}`}
              />
            </div>
            {adminTree.map((item) => renderItem(item, isCollapsed))}
          </>
        )}
      </nav>

      <div
        className={`border-t border-gray-100 dark:border-white/[0.06] space-y-2 ${isCollapsed ? "px-2 py-3" : "px-4 py-3"}`}
      >
        {/* Azioni di pagina (es. "Aggiorna Dati"): non hanno senso da compressa. */}
        {!isCollapsed && footerSlot}

        {themeSlot &&
          (isCollapsed ? (
            <div className="flex justify-center">{themeSlot}</div>
          ) : (
            <div className="flex items-center justify-between px-2 py-1.5 bg-gray-50 dark:bg-white/[0.04] rounded-md">
              <span className="text-[11px] text-slate-500 dark:text-slate-500">
                Tema
              </span>
              {themeSlot}
            </div>
          ))}

        <div className="relative" data-user-menu>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`w-full flex items-center hover:bg-gray-50 dark:hover:bg-white/[0.04] rounded-md transition-colors ${
              isCollapsed ? "justify-center p-1" : "gap-2.5 px-2 py-1.5"
            }`}
            title={isCollapsed ? user?.username : undefined}
          >
            <div className="w-[30px] h-[30px] bg-brand-50 dark:bg-brand-500/[0.15] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-brand-600 dark:text-brand-400 text-[11px] font-semibold">
                {user?.initials ||
                  user?.username?.substring(0, 2).toUpperCase() ||
                  "??"}
              </span>
            </div>
            {!isCollapsed && (
              <>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-slate-900 dark:text-slate-200 text-xs font-medium truncate">
                    {user?.username}
                  </div>
                  <div className="text-slate-400 dark:text-slate-500 text-[10px]">
                    {user?.ruolo}
                  </div>
                </div>
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
              </>
            )}
          </button>

          {showUserMenu && (
            <div
              className={`absolute bottom-full mb-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-white/10 z-[9999] py-1 ${
                isCollapsed ? "left-full ml-2 w-48" : "left-0 w-full"
              }`}
            >
              <button
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setShowUserMenu(false);
                  onOpenProfile?.();
                }}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/[0.06] flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Gestione Profilo
              </button>
              {userMenuExtras.map((entry) => {
                const EntryIcon = entry.icon;
                return (
                  <button
                    key={entry.id || entry.label}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setShowUserMenu(false);
                      entry.onClick?.();
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/[0.06] flex items-center gap-2"
                  >
                    {EntryIcon && <EntryIcon className="w-4 h-4" />}
                    {entry.label}
                  </button>
                );
              })}
              <div className="border-t border-gray-100 dark:border-white/[0.06]" />
              <button
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setShowUserMenu(false);
                  onLogout?.();
                }}
                className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Esci
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex flex-shrink-0">
        {buildSidebar(collapsed, true)}
      </aside>

      {/* Su mobile la sidebar è sempre estesa: comprimerla non darebbe spazio. */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <aside
          className={`relative z-50 h-full transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          {buildSidebar(false, false)}
        </aside>
      </div>
    </>
  );
}
