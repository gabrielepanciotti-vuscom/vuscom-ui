// src/AppSidebar.jsx
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronRight,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Settings
} from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function AppSidebar({
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
  footerSlot
}) {
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [hoveredGroup, setHoveredGroup] = useState(null);
  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest?.("[data-user-menu]")) setShowUserMenu(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const isActive = (item) => {
    if (!item?.to) return false;
    if (item.matchPrefix) {
      return location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
    }
    return location.pathname === item.to;
  };
  const isGroupActive = (group) => (group.children || []).some(
    (c) => c.children ? isGroupActive(c) : isActive(c)
  );
  const renderLeaf = (item, isCollapsed, indent = false) => {
    const active = isActive(item);
    const Icon = item.icon;
    return /* @__PURE__ */ jsxs(
      Link,
      {
        to: item.to,
        onClick: onClose,
        className: `group relative flex items-center gap-2.5 py-2 rounded-[7px] mb-0.5 text-[13px] transition-colors border-l-[3px] ${isCollapsed ? "justify-center px-2.5" : indent ? "pl-7 pr-2.5" : "px-2.5"} ${active ? "border-blue-500 bg-blue-50 dark:bg-blue-500/[0.12] text-blue-700 dark:text-blue-300 font-semibold" : "border-transparent text-slate-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/[0.04]"}`,
        children: [
          Icon && /* @__PURE__ */ jsx(
            Icon,
            {
              className: `w-4 h-4 flex-shrink-0 ${active ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-600"}`
            }
          ),
          !isCollapsed && /* @__PURE__ */ jsx("span", { className: "truncate", children: item.label }),
          isCollapsed && /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute left-full ml-2 px-2 py-1 rounded-md bg-slate-900 dark:bg-slate-700 text-white text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg", children: item.label })
        ]
      },
      item.id || item.to
    );
  };
  const renderGroup = (group, isCollapsed) => {
    const Icon = group.icon;
    const groupId = group.id || group.label;
    const expanded = expandedGroups?.has(groupId);
    const groupActive = isGroupActive(group);
    if (isCollapsed) {
      const isHover = hoveredGroup === groupId;
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: "relative",
          onMouseEnter: () => setHoveredGroup(groupId),
          onMouseLeave: () => setHoveredGroup(null),
          children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: `group relative flex items-center justify-center gap-2.5 px-2.5 py-2 rounded-[7px] mb-0.5 text-[13px] border-l-[3px] w-full transition-colors ${groupActive ? "border-blue-500 bg-blue-50 dark:bg-blue-500/[0.12] text-blue-700 dark:text-blue-300" : "border-transparent text-slate-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/[0.04]"}`,
                onClick: () => onToggleGroup?.(groupId),
                title: group.label,
                children: Icon && /* @__PURE__ */ jsx(
                  Icon,
                  {
                    className: `w-4 h-4 ${groupActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-600"}`
                  }
                )
              }
            ),
            isHover && /* @__PURE__ */ jsxs("div", { className: "absolute left-full top-0 ml-2 z-50 min-w-[200px] bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-lg shadow-xl py-1.5 px-1.5", children: [
              /* @__PURE__ */ jsx("div", { className: "px-2 py-1 text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500", children: group.label }),
              group.children.map((child) => renderLeaf(child, false, false))
            ] })
          ]
        },
        groupId
      );
    }
    return /* @__PURE__ */ jsxs("div", { className: "mb-0.5", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => onToggleGroup?.(groupId),
          "aria-expanded": !!expanded,
          className: `w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13px] transition-colors border-l-[3px] border-transparent ${groupActive ? "text-slate-900 dark:text-slate-100 font-semibold" : "text-slate-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/[0.04]"}`,
          children: [
            Icon && /* @__PURE__ */ jsx(
              Icon,
              {
                className: `w-4 h-4 flex-shrink-0 ${groupActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-600"}`
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "flex-1 text-left truncate", children: group.label }),
            /* @__PURE__ */ jsx(
              ChevronRight,
              {
                className: `w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${expanded ? "rotate-90" : ""}`
              }
            )
          ]
        }
      ),
      expanded && /* @__PURE__ */ jsx("div", { className: "mt-0.5", children: group.children.map((child) => renderLeaf(child, false, true)) })
    ] }, groupId);
  };
  const renderItem = (item, isCollapsed) => item.children ? renderGroup(item, isCollapsed) : renderLeaf(item, isCollapsed, false);
  const buildSidebar = (isCollapsed, showCollapseButton) => /* @__PURE__ */ jsxs(
    "div",
    {
      className: `flex flex-col h-full bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-800 border-r border-gray-200 dark:border-white/[0.06] shadow-[2px_0_12px_rgba(0,0,0,0.04)] dark:shadow-none transition-[width] duration-200 ease-out ${isCollapsed ? "w-[60px]" : "w-60"}`,
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `flex items-center border-b border-gray-100 dark:border-white/[0.06] ${isCollapsed ? "flex-col gap-2 py-3 px-2" : "gap-2.5 px-4 pt-5 pb-4"}`,
            children: [
              appIcon ? /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: appIcon }) : /* @__PURE__ */ jsx("div", { className: "w-[34px] h-[34px] bg-gradient-to-br from-blue-500 to-blue-600 dark:to-violet-500 rounded-[9px] flex items-center justify-center flex-shrink-0 dark:shadow-[0_0_16px_rgba(59,130,246,0.2)]", children: /* @__PURE__ */ jsx("span", { className: "text-white text-[15px] font-bold", children: "V" }) }),
              !isCollapsed && /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsx("div", { className: "text-slate-900 dark:text-slate-100 text-[13px] font-bold leading-tight truncate", children: appName }),
                appSubtitle && /* @__PURE__ */ jsx("div", { className: "text-slate-400 dark:text-slate-500 text-[10px] tracking-wide truncate", children: appSubtitle })
              ] }),
              showCollapseButton && onToggleCollapse && /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: onToggleCollapse,
                  "aria-label": isCollapsed ? "Espandi menu" : "Comprimi menu",
                  className: "flex items-center justify-center w-7 h-7 rounded-md text-slate-400 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:text-slate-700 dark:hover:text-slate-300 transition-colors",
                  title: isCollapsed ? "Espandi menu" : "Comprimi menu",
                  children: isCollapsed ? /* @__PURE__ */ jsx(PanelLeftOpen, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(PanelLeftClose, { className: "w-4 h-4" })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs("nav", { className: "flex-1 overflow-y-auto overflow-x-hidden px-2.5 py-2", children: [
          mainTree.map((item) => renderItem(item, isCollapsed)),
          adminTree.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `mt-4 mb-2 ${isCollapsed ? "px-0 flex justify-center" : "px-2.5"}`,
                children: /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `border-t border-slate-200 dark:border-white/[0.08] ${isCollapsed ? "w-6" : "w-full"}`
                  }
                )
              }
            ),
            adminTree.map((item) => renderItem(item, isCollapsed))
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `border-t border-gray-100 dark:border-white/[0.06] space-y-2 ${isCollapsed ? "px-2 py-3" : "px-4 py-3"}`,
            children: [
              !isCollapsed && footerSlot,
              themeSlot && (isCollapsed ? /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: themeSlot }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-2 py-1.5 bg-gray-50 dark:bg-white/[0.04] rounded-md", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[11px] text-slate-500 dark:text-slate-500", children: "Tema" }),
                themeSlot
              ] })),
              /* @__PURE__ */ jsxs("div", { className: "relative", "data-user-menu": true, children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => setShowUserMenu(!showUserMenu),
                    className: `w-full flex items-center hover:bg-gray-50 dark:hover:bg-white/[0.04] rounded-md transition-colors ${isCollapsed ? "justify-center p-1" : "gap-2.5 px-2 py-1.5"}`,
                    title: isCollapsed ? user?.username : void 0,
                    children: [
                      /* @__PURE__ */ jsx("div", { className: "w-[30px] h-[30px] bg-blue-50 dark:bg-blue-500/[0.15] rounded-full flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx("span", { className: "text-blue-600 dark:text-blue-400 text-[11px] font-semibold", children: user?.initials || user?.username?.substring(0, 2).toUpperCase() || "??" }) }),
                      !isCollapsed && /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 text-left", children: [
                          /* @__PURE__ */ jsx("div", { className: "text-slate-900 dark:text-slate-200 text-xs font-medium truncate", children: user?.username }),
                          /* @__PURE__ */ jsx("div", { className: "text-slate-400 dark:text-slate-500 text-[10px]", children: user?.ruolo })
                        ] }),
                        /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" })
                      ] })
                    ]
                  }
                ),
                showUserMenu && /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: `absolute bottom-full mb-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-white/10 z-[9999] py-1 ${isCollapsed ? "left-full ml-2 w-48" : "left-0 w-full"}`,
                    children: [
                      /* @__PURE__ */ jsxs(
                        "button",
                        {
                          onMouseDown: (e) => {
                            e.stopPropagation();
                            setShowUserMenu(false);
                            onOpenProfile?.();
                          },
                          className: "w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/[0.06] flex items-center gap-2",
                          children: [
                            /* @__PURE__ */ jsx(Settings, { className: "w-4 h-4" }),
                            "Gestione Profilo"
                          ]
                        }
                      ),
                      userMenuExtras.map((entry) => {
                        const EntryIcon = entry.icon;
                        return /* @__PURE__ */ jsxs(
                          "button",
                          {
                            onMouseDown: (e) => {
                              e.stopPropagation();
                              setShowUserMenu(false);
                              entry.onClick?.();
                            },
                            className: "w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/[0.06] flex items-center gap-2",
                            children: [
                              EntryIcon && /* @__PURE__ */ jsx(EntryIcon, { className: "w-4 h-4" }),
                              entry.label
                            ]
                          },
                          entry.id || entry.label
                        );
                      }),
                      /* @__PURE__ */ jsx("div", { className: "border-t border-gray-100 dark:border-white/[0.06]" }),
                      /* @__PURE__ */ jsxs(
                        "button",
                        {
                          onMouseDown: (e) => {
                            e.stopPropagation();
                            setShowUserMenu(false);
                            onLogout?.();
                          },
                          className: "w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2",
                          children: [
                            /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4" }),
                            "Esci"
                          ]
                        }
                      )
                    ]
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  );
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("aside", { className: "hidden md:flex flex-shrink-0", children: buildSidebar(collapsed, true) }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`,
        children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/50", onClick: onClose }),
          /* @__PURE__ */ jsx(
            "aside",
            {
              className: `relative z-50 h-full transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`,
              children: buildSidebar(false, false)
            }
          )
        ]
      }
    )
  ] });
}

// src/navTree.js
function normalizeNavTree(nodes = []) {
  const out = [];
  for (const node of nodes) {
    if (node?.visible === false) continue;
    if (!node?.children) {
      out.push(node);
      continue;
    }
    const children = normalizeNavTree(node.children);
    if (children.length === 0) continue;
    if (children.length === 1) {
      const only = children[0];
      out.push({ ...only, icon: only.icon || node.icon });
      continue;
    }
    out.push({ ...node, id: node.id || node.label, children });
  }
  return out;
}
function collectGroupIds(nodes = []) {
  const ids = [];
  for (const node of nodes) {
    if (node?.children) {
      ids.push(node.id || node.label);
      ids.push(...collectGroupIds(node.children));
    }
  }
  return ids;
}
export {
  AppSidebar,
  collectGroupIds,
  normalizeNavTree
};
