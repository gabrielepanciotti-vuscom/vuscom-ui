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
  footerSlot,
  navClassName = ""
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
        /* @__PURE__ */ jsxs(
          "nav",
          {
            className: `flex-1 overflow-y-auto overflow-x-hidden px-2.5 py-2 ${navClassName}`.trim(),
            children: [
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
            ]
          }
        ),
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

// node_modules/clsx/dist/clsx.mjs
function r(e) {
  var t, f, n = "";
  if ("string" == typeof e || "number" == typeof e) n += e;
  else if ("object" == typeof e) if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
  } else for (f in e) e[f] && (n && (n += " "), n += f);
  return n;
}
function clsx() {
  for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
  return n;
}

// node_modules/tailwind-merge/dist/bundle-mjs.mjs
var CLASS_PART_SEPARATOR = "-";
var createClassGroupUtils = (config) => {
  const classMap = createClassMap(config);
  const {
    conflictingClassGroups,
    conflictingClassGroupModifiers
  } = config;
  const getClassGroupId = (className) => {
    const classParts = className.split(CLASS_PART_SEPARATOR);
    if (classParts[0] === "" && classParts.length !== 1) {
      classParts.shift();
    }
    return getGroupRecursive(classParts, classMap) || getGroupIdForArbitraryProperty(className);
  };
  const getConflictingClassGroupIds = (classGroupId, hasPostfixModifier) => {
    const conflicts = conflictingClassGroups[classGroupId] || [];
    if (hasPostfixModifier && conflictingClassGroupModifiers[classGroupId]) {
      return [...conflicts, ...conflictingClassGroupModifiers[classGroupId]];
    }
    return conflicts;
  };
  return {
    getClassGroupId,
    getConflictingClassGroupIds
  };
};
var getGroupRecursive = (classParts, classPartObject) => {
  if (classParts.length === 0) {
    return classPartObject.classGroupId;
  }
  const currentClassPart = classParts[0];
  const nextClassPartObject = classPartObject.nextPart.get(currentClassPart);
  const classGroupFromNextClassPart = nextClassPartObject ? getGroupRecursive(classParts.slice(1), nextClassPartObject) : void 0;
  if (classGroupFromNextClassPart) {
    return classGroupFromNextClassPart;
  }
  if (classPartObject.validators.length === 0) {
    return void 0;
  }
  const classRest = classParts.join(CLASS_PART_SEPARATOR);
  return classPartObject.validators.find(({
    validator
  }) => validator(classRest))?.classGroupId;
};
var arbitraryPropertyRegex = /^\[(.+)\]$/;
var getGroupIdForArbitraryProperty = (className) => {
  if (arbitraryPropertyRegex.test(className)) {
    const arbitraryPropertyClassName = arbitraryPropertyRegex.exec(className)[1];
    const property = arbitraryPropertyClassName?.substring(0, arbitraryPropertyClassName.indexOf(":"));
    if (property) {
      return "arbitrary.." + property;
    }
  }
};
var createClassMap = (config) => {
  const {
    theme,
    prefix
  } = config;
  const classMap = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  const prefixedClassGroupEntries = getPrefixedClassGroupEntries(Object.entries(config.classGroups), prefix);
  prefixedClassGroupEntries.forEach(([classGroupId, classGroup]) => {
    processClassesRecursively(classGroup, classMap, classGroupId, theme);
  });
  return classMap;
};
var processClassesRecursively = (classGroup, classPartObject, classGroupId, theme) => {
  classGroup.forEach((classDefinition) => {
    if (typeof classDefinition === "string") {
      const classPartObjectToEdit = classDefinition === "" ? classPartObject : getPart(classPartObject, classDefinition);
      classPartObjectToEdit.classGroupId = classGroupId;
      return;
    }
    if (typeof classDefinition === "function") {
      if (isThemeGetter(classDefinition)) {
        processClassesRecursively(classDefinition(theme), classPartObject, classGroupId, theme);
        return;
      }
      classPartObject.validators.push({
        validator: classDefinition,
        classGroupId
      });
      return;
    }
    Object.entries(classDefinition).forEach(([key, classGroup2]) => {
      processClassesRecursively(classGroup2, getPart(classPartObject, key), classGroupId, theme);
    });
  });
};
var getPart = (classPartObject, path) => {
  let currentClassPartObject = classPartObject;
  path.split(CLASS_PART_SEPARATOR).forEach((pathPart) => {
    if (!currentClassPartObject.nextPart.has(pathPart)) {
      currentClassPartObject.nextPart.set(pathPart, {
        nextPart: /* @__PURE__ */ new Map(),
        validators: []
      });
    }
    currentClassPartObject = currentClassPartObject.nextPart.get(pathPart);
  });
  return currentClassPartObject;
};
var isThemeGetter = (func) => func.isThemeGetter;
var getPrefixedClassGroupEntries = (classGroupEntries, prefix) => {
  if (!prefix) {
    return classGroupEntries;
  }
  return classGroupEntries.map(([classGroupId, classGroup]) => {
    const prefixedClassGroup = classGroup.map((classDefinition) => {
      if (typeof classDefinition === "string") {
        return prefix + classDefinition;
      }
      if (typeof classDefinition === "object") {
        return Object.fromEntries(Object.entries(classDefinition).map(([key, value]) => [prefix + key, value]));
      }
      return classDefinition;
    });
    return [classGroupId, prefixedClassGroup];
  });
};
var createLruCache = (maxCacheSize) => {
  if (maxCacheSize < 1) {
    return {
      get: () => void 0,
      set: () => {
      }
    };
  }
  let cacheSize = 0;
  let cache = /* @__PURE__ */ new Map();
  let previousCache = /* @__PURE__ */ new Map();
  const update = (key, value) => {
    cache.set(key, value);
    cacheSize++;
    if (cacheSize > maxCacheSize) {
      cacheSize = 0;
      previousCache = cache;
      cache = /* @__PURE__ */ new Map();
    }
  };
  return {
    get(key) {
      let value = cache.get(key);
      if (value !== void 0) {
        return value;
      }
      if ((value = previousCache.get(key)) !== void 0) {
        update(key, value);
        return value;
      }
    },
    set(key, value) {
      if (cache.has(key)) {
        cache.set(key, value);
      } else {
        update(key, value);
      }
    }
  };
};
var IMPORTANT_MODIFIER = "!";
var createParseClassName = (config) => {
  const {
    separator,
    experimentalParseClassName
  } = config;
  const isSeparatorSingleCharacter = separator.length === 1;
  const firstSeparatorCharacter = separator[0];
  const separatorLength = separator.length;
  const parseClassName = (className) => {
    const modifiers = [];
    let bracketDepth = 0;
    let modifierStart = 0;
    let postfixModifierPosition;
    for (let index = 0; index < className.length; index++) {
      let currentCharacter = className[index];
      if (bracketDepth === 0) {
        if (currentCharacter === firstSeparatorCharacter && (isSeparatorSingleCharacter || className.slice(index, index + separatorLength) === separator)) {
          modifiers.push(className.slice(modifierStart, index));
          modifierStart = index + separatorLength;
          continue;
        }
        if (currentCharacter === "/") {
          postfixModifierPosition = index;
          continue;
        }
      }
      if (currentCharacter === "[") {
        bracketDepth++;
      } else if (currentCharacter === "]") {
        bracketDepth--;
      }
    }
    const baseClassNameWithImportantModifier = modifiers.length === 0 ? className : className.substring(modifierStart);
    const hasImportantModifier = baseClassNameWithImportantModifier.startsWith(IMPORTANT_MODIFIER);
    const baseClassName = hasImportantModifier ? baseClassNameWithImportantModifier.substring(1) : baseClassNameWithImportantModifier;
    const maybePostfixModifierPosition = postfixModifierPosition && postfixModifierPosition > modifierStart ? postfixModifierPosition - modifierStart : void 0;
    return {
      modifiers,
      hasImportantModifier,
      baseClassName,
      maybePostfixModifierPosition
    };
  };
  if (experimentalParseClassName) {
    return (className) => experimentalParseClassName({
      className,
      parseClassName
    });
  }
  return parseClassName;
};
var sortModifiers = (modifiers) => {
  if (modifiers.length <= 1) {
    return modifiers;
  }
  const sortedModifiers = [];
  let unsortedModifiers = [];
  modifiers.forEach((modifier) => {
    const isArbitraryVariant = modifier[0] === "[";
    if (isArbitraryVariant) {
      sortedModifiers.push(...unsortedModifiers.sort(), modifier);
      unsortedModifiers = [];
    } else {
      unsortedModifiers.push(modifier);
    }
  });
  sortedModifiers.push(...unsortedModifiers.sort());
  return sortedModifiers;
};
var createConfigUtils = (config) => ({
  cache: createLruCache(config.cacheSize),
  parseClassName: createParseClassName(config),
  ...createClassGroupUtils(config)
});
var SPLIT_CLASSES_REGEX = /\s+/;
var mergeClassList = (classList, configUtils) => {
  const {
    parseClassName,
    getClassGroupId,
    getConflictingClassGroupIds
  } = configUtils;
  const classGroupsInConflict = [];
  const classNames = classList.trim().split(SPLIT_CLASSES_REGEX);
  let result = "";
  for (let index = classNames.length - 1; index >= 0; index -= 1) {
    const originalClassName = classNames[index];
    const {
      modifiers,
      hasImportantModifier,
      baseClassName,
      maybePostfixModifierPosition
    } = parseClassName(originalClassName);
    let hasPostfixModifier = Boolean(maybePostfixModifierPosition);
    let classGroupId = getClassGroupId(hasPostfixModifier ? baseClassName.substring(0, maybePostfixModifierPosition) : baseClassName);
    if (!classGroupId) {
      if (!hasPostfixModifier) {
        result = originalClassName + (result.length > 0 ? " " + result : result);
        continue;
      }
      classGroupId = getClassGroupId(baseClassName);
      if (!classGroupId) {
        result = originalClassName + (result.length > 0 ? " " + result : result);
        continue;
      }
      hasPostfixModifier = false;
    }
    const variantModifier = sortModifiers(modifiers).join(":");
    const modifierId = hasImportantModifier ? variantModifier + IMPORTANT_MODIFIER : variantModifier;
    const classId = modifierId + classGroupId;
    if (classGroupsInConflict.includes(classId)) {
      continue;
    }
    classGroupsInConflict.push(classId);
    const conflictGroups = getConflictingClassGroupIds(classGroupId, hasPostfixModifier);
    for (let i = 0; i < conflictGroups.length; ++i) {
      const group = conflictGroups[i];
      classGroupsInConflict.push(modifierId + group);
    }
    result = originalClassName + (result.length > 0 ? " " + result : result);
  }
  return result;
};
function twJoin() {
  let index = 0;
  let argument;
  let resolvedValue;
  let string = "";
  while (index < arguments.length) {
    if (argument = arguments[index++]) {
      if (resolvedValue = toValue(argument)) {
        string && (string += " ");
        string += resolvedValue;
      }
    }
  }
  return string;
}
var toValue = (mix) => {
  if (typeof mix === "string") {
    return mix;
  }
  let resolvedValue;
  let string = "";
  for (let k = 0; k < mix.length; k++) {
    if (mix[k]) {
      if (resolvedValue = toValue(mix[k])) {
        string && (string += " ");
        string += resolvedValue;
      }
    }
  }
  return string;
};
function createTailwindMerge(createConfigFirst, ...createConfigRest) {
  let configUtils;
  let cacheGet;
  let cacheSet;
  let functionToCall = initTailwindMerge;
  function initTailwindMerge(classList) {
    const config = createConfigRest.reduce((previousConfig, createConfigCurrent) => createConfigCurrent(previousConfig), createConfigFirst());
    configUtils = createConfigUtils(config);
    cacheGet = configUtils.cache.get;
    cacheSet = configUtils.cache.set;
    functionToCall = tailwindMerge;
    return tailwindMerge(classList);
  }
  function tailwindMerge(classList) {
    const cachedResult = cacheGet(classList);
    if (cachedResult) {
      return cachedResult;
    }
    const result = mergeClassList(classList, configUtils);
    cacheSet(classList, result);
    return result;
  }
  return function callTailwindMerge() {
    return functionToCall(twJoin.apply(null, arguments));
  };
}
var fromTheme = (key) => {
  const themeGetter = (theme) => theme[key] || [];
  themeGetter.isThemeGetter = true;
  return themeGetter;
};
var arbitraryValueRegex = /^\[(?:([a-z-]+):)?(.+)\]$/i;
var fractionRegex = /^\d+\/\d+$/;
var stringLengths = /* @__PURE__ */ new Set(["px", "full", "screen"]);
var tshirtUnitRegex = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/;
var lengthUnitRegex = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/;
var colorFunctionRegex = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/;
var shadowRegex = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
var imageRegex = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
var isLength = (value) => isNumber(value) || stringLengths.has(value) || fractionRegex.test(value);
var isArbitraryLength = (value) => getIsArbitraryValue(value, "length", isLengthOnly);
var isNumber = (value) => Boolean(value) && !Number.isNaN(Number(value));
var isArbitraryNumber = (value) => getIsArbitraryValue(value, "number", isNumber);
var isInteger = (value) => Boolean(value) && Number.isInteger(Number(value));
var isPercent = (value) => value.endsWith("%") && isNumber(value.slice(0, -1));
var isArbitraryValue = (value) => arbitraryValueRegex.test(value);
var isTshirtSize = (value) => tshirtUnitRegex.test(value);
var sizeLabels = /* @__PURE__ */ new Set(["length", "size", "percentage"]);
var isArbitrarySize = (value) => getIsArbitraryValue(value, sizeLabels, isNever);
var isArbitraryPosition = (value) => getIsArbitraryValue(value, "position", isNever);
var imageLabels = /* @__PURE__ */ new Set(["image", "url"]);
var isArbitraryImage = (value) => getIsArbitraryValue(value, imageLabels, isImage);
var isArbitraryShadow = (value) => getIsArbitraryValue(value, "", isShadow);
var isAny = () => true;
var getIsArbitraryValue = (value, label, testValue) => {
  const result = arbitraryValueRegex.exec(value);
  if (result) {
    if (result[1]) {
      return typeof label === "string" ? result[1] === label : label.has(result[1]);
    }
    return testValue(result[2]);
  }
  return false;
};
var isLengthOnly = (value) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  lengthUnitRegex.test(value) && !colorFunctionRegex.test(value)
);
var isNever = () => false;
var isShadow = (value) => shadowRegex.test(value);
var isImage = (value) => imageRegex.test(value);
var getDefaultConfig = () => {
  const colors = fromTheme("colors");
  const spacing = fromTheme("spacing");
  const blur = fromTheme("blur");
  const brightness = fromTheme("brightness");
  const borderColor = fromTheme("borderColor");
  const borderRadius = fromTheme("borderRadius");
  const borderSpacing = fromTheme("borderSpacing");
  const borderWidth = fromTheme("borderWidth");
  const contrast = fromTheme("contrast");
  const grayscale = fromTheme("grayscale");
  const hueRotate = fromTheme("hueRotate");
  const invert = fromTheme("invert");
  const gap = fromTheme("gap");
  const gradientColorStops = fromTheme("gradientColorStops");
  const gradientColorStopPositions = fromTheme("gradientColorStopPositions");
  const inset = fromTheme("inset");
  const margin = fromTheme("margin");
  const opacity = fromTheme("opacity");
  const padding = fromTheme("padding");
  const saturate = fromTheme("saturate");
  const scale = fromTheme("scale");
  const sepia = fromTheme("sepia");
  const skew = fromTheme("skew");
  const space = fromTheme("space");
  const translate = fromTheme("translate");
  const getOverscroll = () => ["auto", "contain", "none"];
  const getOverflow = () => ["auto", "hidden", "clip", "visible", "scroll"];
  const getSpacingWithAutoAndArbitrary = () => ["auto", isArbitraryValue, spacing];
  const getSpacingWithArbitrary = () => [isArbitraryValue, spacing];
  const getLengthWithEmptyAndArbitrary = () => ["", isLength, isArbitraryLength];
  const getNumberWithAutoAndArbitrary = () => ["auto", isNumber, isArbitraryValue];
  const getPositions = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"];
  const getLineStyles = () => ["solid", "dashed", "dotted", "double", "none"];
  const getBlendModes = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"];
  const getAlign = () => ["start", "end", "center", "between", "around", "evenly", "stretch"];
  const getZeroAndEmpty = () => ["", "0", isArbitraryValue];
  const getBreaks = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"];
  const getNumberAndArbitrary = () => [isNumber, isArbitraryValue];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [isAny],
      spacing: [isLength, isArbitraryLength],
      blur: ["none", "", isTshirtSize, isArbitraryValue],
      brightness: getNumberAndArbitrary(),
      borderColor: [colors],
      borderRadius: ["none", "", "full", isTshirtSize, isArbitraryValue],
      borderSpacing: getSpacingWithArbitrary(),
      borderWidth: getLengthWithEmptyAndArbitrary(),
      contrast: getNumberAndArbitrary(),
      grayscale: getZeroAndEmpty(),
      hueRotate: getNumberAndArbitrary(),
      invert: getZeroAndEmpty(),
      gap: getSpacingWithArbitrary(),
      gradientColorStops: [colors],
      gradientColorStopPositions: [isPercent, isArbitraryLength],
      inset: getSpacingWithAutoAndArbitrary(),
      margin: getSpacingWithAutoAndArbitrary(),
      opacity: getNumberAndArbitrary(),
      padding: getSpacingWithArbitrary(),
      saturate: getNumberAndArbitrary(),
      scale: getNumberAndArbitrary(),
      sepia: getZeroAndEmpty(),
      skew: getNumberAndArbitrary(),
      space: getSpacingWithArbitrary(),
      translate: getSpacingWithArbitrary()
    },
    classGroups: {
      // Layout
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", "video", isArbitraryValue]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       */
      container: ["container"],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [isTshirtSize]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": getBreaks()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": getBreaks()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: [...getPositions(), isArbitraryValue]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: getOverflow()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": getOverflow()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": getOverflow()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: getOverscroll()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": getOverscroll()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": getOverscroll()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Top / Right / Bottom / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: [inset]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": [inset]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": [inset]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [inset]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [inset]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [inset]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [inset]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [inset]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [inset]
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: ["auto", isInteger, isArbitraryValue]
      }],
      // Flexbox and Grid
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: getSpacingWithAutoAndArbitrary()
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["wrap", "wrap-reverse", "nowrap"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: ["1", "auto", "initial", "none", isArbitraryValue]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: getZeroAndEmpty()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: getZeroAndEmpty()
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: ["first", "last", "none", isInteger, isArbitraryValue]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [isAny]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", isInteger, isArbitraryValue]
        }, isArbitraryValue]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": [isAny]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [isInteger, isArbitraryValue]
        }, isArbitraryValue]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": ["auto", "min", "max", "fr", isArbitraryValue]
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": ["auto", "min", "max", "fr", isArbitraryValue]
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: [gap]
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": [gap]
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": [gap]
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: ["normal", ...getAlign()]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": ["start", "end", "center", "stretch"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", "start", "end", "center", "stretch"]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...getAlign(), "baseline"]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", "start", "end", "center", "stretch", "baseline"]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": [...getAlign(), "baseline"]
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", "start", "end", "center", "stretch"]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: [padding]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [padding]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [padding]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [padding]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [padding]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [padding]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [padding]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [padding]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [padding]
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: [margin]
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: [margin]
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: [margin]
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: [margin]
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: [margin]
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: [margin]
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: [margin]
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: [margin]
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: [margin]
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/space
       */
      "space-x": [{
        "space-x": [space]
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/space
       */
      "space-y": [{
        "space-y": [space]
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-y-reverse": ["space-y-reverse"],
      // Sizing
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", isArbitraryValue, spacing]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [isArbitraryValue, spacing, "min", "max", "fit"]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [isArbitraryValue, spacing, "none", "full", "min", "max", "fit", "prose", {
          screen: [isTshirtSize]
        }, isTshirtSize]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [isArbitraryValue, spacing, "auto", "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": [isArbitraryValue, spacing, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": [isArbitraryValue, spacing, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */
      size: [{
        size: [isArbitraryValue, spacing, "auto", "min", "max", "fit"]
      }],
      // Typography
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", isTshirtSize, isArbitraryLength]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", isArbitraryNumber]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [isAny]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest", isArbitraryValue]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": ["none", isNumber, isArbitraryNumber]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", isLength, isArbitraryValue]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", isArbitraryValue]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["none", "disc", "decimal", isArbitraryValue]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: [colors]
      }],
      /**
       * Placeholder Opacity
       * @see https://tailwindcss.com/docs/placeholder-opacity
       */
      "placeholder-opacity": [{
        "placeholder-opacity": [opacity]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: [colors]
      }],
      /**
       * Text Opacity
       * @see https://tailwindcss.com/docs/text-opacity
       */
      "text-opacity": [{
        "text-opacity": [opacity]
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...getLineStyles(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", isLength, isArbitraryLength]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", isLength, isArbitraryValue]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: [colors]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: getSpacingWithArbitrary()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", isArbitraryValue]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", isArbitraryValue]
      }],
      // Backgrounds
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Opacity
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/background-opacity
       */
      "bg-opacity": [{
        "bg-opacity": [opacity]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: [...getPositions(), isArbitraryPosition]
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: ["no-repeat", {
          repeat: ["", "x", "y", "round", "space"]
        }]
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: ["auto", "cover", "contain", isArbitrarySize]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, isArbitraryImage]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: [colors]
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: [gradientColorStopPositions]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [gradientColorStopPositions]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [gradientColorStopPositions]
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: [gradientColorStops]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: [gradientColorStops]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: [gradientColorStops]
      }],
      // Borders
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: [borderRadius]
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": [borderRadius]
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": [borderRadius]
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": [borderRadius]
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": [borderRadius]
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": [borderRadius]
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": [borderRadius]
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": [borderRadius]
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": [borderRadius]
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": [borderRadius]
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": [borderRadius]
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": [borderRadius]
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": [borderRadius]
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": [borderRadius]
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": [borderRadius]
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: [borderWidth]
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": [borderWidth]
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": [borderWidth]
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": [borderWidth]
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": [borderWidth]
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": [borderWidth]
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": [borderWidth]
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": [borderWidth]
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": [borderWidth]
      }],
      /**
       * Border Opacity
       * @see https://tailwindcss.com/docs/border-opacity
       */
      "border-opacity": [{
        "border-opacity": [opacity]
      }],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...getLineStyles(), "hidden"]
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x": [{
        "divide-x": [borderWidth]
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y": [{
        "divide-y": [borderWidth]
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Divide Opacity
       * @see https://tailwindcss.com/docs/divide-opacity
       */
      "divide-opacity": [{
        "divide-opacity": [opacity]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      "divide-style": [{
        divide: getLineStyles()
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: [borderColor]
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": [borderColor]
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": [borderColor]
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": [borderColor]
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": [borderColor]
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": [borderColor]
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": [borderColor]
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": [borderColor]
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": [borderColor]
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: [borderColor]
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: ["", ...getLineStyles()]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [isLength, isArbitraryValue]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [isLength, isArbitraryLength]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: [colors]
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w": [{
        ring: getLengthWithEmptyAndArbitrary()
      }],
      /**
       * Ring Width Inset
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/ring-color
       */
      "ring-color": [{
        ring: [colors]
      }],
      /**
       * Ring Opacity
       * @see https://tailwindcss.com/docs/ring-opacity
       */
      "ring-opacity": [{
        "ring-opacity": [opacity]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [isLength, isArbitraryLength]
      }],
      /**
       * Ring Offset Color
       * @see https://tailwindcss.com/docs/ring-offset-color
       */
      "ring-offset-color": [{
        "ring-offset": [colors]
      }],
      // Effects
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: ["", "inner", "none", isTshirtSize, isArbitraryShadow]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [isAny]
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [opacity]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...getBlendModes(), "plus-lighter", "plus-darker"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": getBlendModes()
      }],
      // Filters
      /**
       * Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: ["", "none"]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: [blur]
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [brightness]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [contrast]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": ["", "none", isTshirtSize, isArbitraryValue]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: [grayscale]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [hueRotate]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: [invert]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [saturate]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: [sepia]
      }],
      /**
       * Backdrop Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": ["", "none"]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": [blur]
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [brightness]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [contrast]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": [grayscale]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [hueRotate]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": [invert]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [opacity]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [saturate]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": [sepia]
      }],
      // Tables
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": [borderSpacing]
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": [borderSpacing]
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": [borderSpacing]
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // Transitions and Animation
      /**
       * Tranisition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", isArbitraryValue]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: getNumberAndArbitrary()
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "in", "out", "in-out", isArbitraryValue]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: getNumberAndArbitrary()
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", "spin", "ping", "pulse", "bounce", isArbitraryValue]
      }],
      // Transforms
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: ["", "gpu", "none"]
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: [scale]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [scale]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [scale]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [isInteger, isArbitraryValue]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": [translate]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [translate]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [skew]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [skew]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", isArbitraryValue]
      }],
      // Interactivity
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: ["auto", colors]
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", isArbitraryValue]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: [colors]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["none", "auto"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "y", "x", ""]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", isArbitraryValue]
      }],
      // SVG
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: [colors, "none"]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [isLength, isArbitraryLength, isArbitraryNumber]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: [colors, "none"]
      }],
      // Accessibility
      /**
       * Screen Readers
       * @see https://tailwindcss.com/docs/screen-readers
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
      mx: ["mr", "ml"],
      my: ["mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-s", "border-w-e", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": ["border-color-s", "border-color-e", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    }
  };
};
var twMerge = /* @__PURE__ */ createTailwindMerge(getDefaultConfig);

// src/lib/cn.js
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/lib/format.js
var LOCALE = "it-IT";
var valida = (v) => {
  if (v === null || v === void 0 || v === "") return null;
  const d = v instanceof Date ? v : new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};
function formatNumero(v, opts = {}) {
  const maximumFractionDigits = opts.style === "percent" ? 0 : 2;
  return Number(v ?? 0).toLocaleString(LOCALE, {
    maximumFractionDigits,
    // it-IT skips the thousands separator on 4-digit numbers (1581); we want 1.581.
    useGrouping: "always",
    ...opts
  });
}
function formatData(v) {
  const d = valida(v);
  return d ? d.toLocaleDateString(LOCALE, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }) : "\u2014";
}
function formatDataOra(v) {
  const d = valida(v);
  return d ? d.toLocaleString(LOCALE, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }) : "\u2014";
}
function formatRelativo(v, ora = /* @__PURE__ */ new Date()) {
  const d = valida(v);
  if (!d) return "\u2014";
  const sec = Math.round((ora - d) / 1e3);
  if (sec < 60) return "adesso";
  const min = Math.round(sec / 60);
  if (min < 60) return `${min} min fa`;
  const ore = Math.round(min / 60);
  if (ore < 24) return ore === 1 ? "1 ora fa" : `${ore} ore fa`;
  const giorni = Math.round(ore / 24);
  return giorni === 1 ? "ieri" : `${giorni} giorni fa`;
}

// src/theme/useTheme.js
import { useCallback, useEffect as useEffect2, useState as useState2 } from "react";
var leggi = () => typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "dark" : "light";
function useTheme() {
  const [theme, setThemeState] = useState2(leggi);
  useEffect2(() => {
    const obs = new MutationObserver(() => setThemeState(leggi()));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });
    return () => obs.disconnect();
  }, []);
  const setTheme = useCallback((t) => {
    document.documentElement.classList.toggle("dark", t === "dark");
    try {
      localStorage.setItem("theme", t);
    } catch {
    }
    setThemeState(t);
  }, []);
  const toggleTheme = useCallback(
    () => setTheme(leggi() === "dark" ? "light" : "dark"),
    [setTheme]
  );
  return { theme, setTheme, toggleTheme };
}

// src/theme/ThemeToggle.jsx
import { Moon, Sun } from "lucide-react";
import { jsx as jsx2 } from "react/jsx-runtime";
function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";
  return /* @__PURE__ */ jsx2(
    "button",
    {
      type: "button",
      role: "switch",
      "aria-checked": dark,
      "aria-label": "Tema scuro",
      onClick: toggleTheme,
      className: cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
        "bg-slate-200 hover:bg-slate-300 active:bg-slate-400/70",
        "dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:active:bg-indigo-700",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      ),
      children: /* @__PURE__ */ jsx2(
        "span",
        {
          className: cn(
            "absolute top-0.5 flex h-5 w-5 items-center justify-center rounded-full shadow-sm transition-all duration-200",
            dark ? "left-[22px] bg-indigo-950" : "left-0.5 bg-white"
          ),
          children: dark ? /* @__PURE__ */ jsx2(Sun, { className: "h-3 w-3 text-amber-400" }) : /* @__PURE__ */ jsx2(Moon, { className: "h-3 w-3 text-slate-500" })
        }
      )
    }
  );
}

// src/theme/initScript.js
var THEME_INIT_SCRIPT = "try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',!!d);}catch(e){}";

// src/atoms/Button.jsx
import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
var VARIANTI = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
  link: "text-primary underline-offset-4 hover:underline"
};
var TAGLIE = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2"
};
var buttonClasses = (variant = "primary", size = "md") => cn(
  "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  VARIANTI[variant],
  TAGLIE[size]
);
var Button = forwardRef(function Button2({
  variant = "primary",
  size = "md",
  loading = false,
  icon: Icon,
  iconRight: IconRight,
  fullWidth,
  className,
  children,
  type = "button",
  disabled,
  ...props
}, ref) {
  return /* @__PURE__ */ jsxs2(
    "button",
    {
      ref,
      type,
      ...props,
      disabled: disabled || loading,
      "aria-busy": loading || void 0,
      className: cn(
        buttonClasses(variant, size),
        fullWidth && "w-full",
        className
      ),
      children: [
        loading ? /* @__PURE__ */ jsx3(Loader2, { className: "h-4 w-4 animate-spin", "aria-hidden": true }) : Icon && /* @__PURE__ */ jsx3(Icon, { className: "h-4 w-4", "aria-hidden": true }),
        children,
        !loading && IconRight && /* @__PURE__ */ jsx3(IconRight, { className: "h-4 w-4", "aria-hidden": true })
      ]
    }
  );
});
var Button_default = Button;

// src/atoms/IconButton.jsx
import { forwardRef as forwardRef2 } from "react";
import { jsx as jsx4 } from "react/jsx-runtime";
var QUADRATI = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-12 w-12" };
var IconButton = forwardRef2(function IconButton2({
  icon: Icon,
  label,
  variant = "ghost",
  size = "md",
  className,
  type = "button",
  ...props
}, ref) {
  return /* @__PURE__ */ jsx4(
    "button",
    {
      ref,
      type,
      "aria-label": label,
      ...props,
      className: cn(
        buttonClasses(variant, size),
        "px-0 gap-0",
        QUADRATI[size],
        className
      ),
      children: Icon && /* @__PURE__ */ jsx4(Icon, { className: "h-4 w-4", "aria-hidden": true })
    }
  );
});
var IconButton_default = IconButton;

// src/atoms/Input.jsx
import { forwardRef as forwardRef3 } from "react";
import { jsx as jsx5, jsxs as jsxs3 } from "react/jsx-runtime";
var CAMPO = "w-full rounded-lg border bg-background text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50";
var campoClasses = (invalid) => cn(
  CAMPO,
  invalid ? "border-destructive focus-visible:ring-destructive/40" : "border-input hover:border-ring/60 focus-visible:border-ring focus-visible:ring-ring/40"
);
var Input = forwardRef3(function Input2({ invalid, icon: Icon, className, ...props }, ref) {
  const input = /* @__PURE__ */ jsx5(
    "input",
    {
      ref,
      "aria-invalid": invalid ? "true" : void 0,
      ...props,
      className: cn(
        campoClasses(invalid),
        "h-10 px-3",
        Icon && "pl-9",
        className
      )
    }
  );
  if (!Icon) return input;
  return /* @__PURE__ */ jsxs3("div", { className: "relative w-full", children: [
    /* @__PURE__ */ jsx5(
      Icon,
      {
        className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",
        "aria-hidden": true
      }
    ),
    input
  ] });
});
var Input_default = Input;

// src/atoms/Textarea.jsx
import { forwardRef as forwardRef4 } from "react";
import { jsx as jsx6 } from "react/jsx-runtime";
var Textarea = forwardRef4(function Textarea2({ invalid, className, rows = 3, ...props }, ref) {
  return /* @__PURE__ */ jsx6(
    "textarea",
    {
      ref,
      rows,
      "aria-invalid": invalid ? "true" : void 0,
      ...props,
      className: cn(
        campoClasses(invalid),
        "min-h-[80px] resize-y px-3 py-2",
        className
      )
    }
  );
});
var Textarea_default = Textarea;

// src/atoms/tones.js
var TINTE = {
  neutral: "bg-muted text-muted-foreground",
  primary: "bg-primary/15 text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-destructive/15 text-destructive",
  info: "bg-info/15 text-info"
};
var PIENI = {
  neutral: "bg-muted-foreground",
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
  info: "bg-info"
};

// src/atoms/Badge.jsx
import { jsx as jsx7, jsxs as jsxs4 } from "react/jsx-runtime";
function Badge({
  tone = "neutral",
  dot = false,
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs4(
    "span",
    {
      ...props,
      className: cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        TINTE[tone],
        className
      ),
      children: [
        dot && /* @__PURE__ */ jsx7(
          "span",
          {
            className: cn("h-1.5 w-1.5 rounded-full", PIENI[tone]),
            "aria-hidden": true
          }
        ),
        children
      ]
    }
  );
}

// src/atoms/StatusDot.jsx
import { jsx as jsx8, jsxs as jsxs5 } from "react/jsx-runtime";
function StatusDot({
  tone = "neutral",
  label,
  pulse = false,
  className
}) {
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true };
  return /* @__PURE__ */ jsxs5(
    "span",
    {
      ...a11y,
      className: cn("relative inline-flex h-2.5 w-2.5", className),
      children: [
        pulse && /* @__PURE__ */ jsx8(
          "span",
          {
            className: cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
              PIENI[tone]
            )
          }
        ),
        /* @__PURE__ */ jsx8(
          "span",
          {
            className: cn(
              "relative inline-flex h-2.5 w-2.5 rounded-full",
              PIENI[tone]
            )
          }
        )
      ]
    }
  );
}

// src/atoms/Spinner.jsx
import { Loader2 as Loader22 } from "lucide-react";
import { jsx as jsx9, jsxs as jsxs6 } from "react/jsx-runtime";
var TAGLIE2 = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-10 w-10" };
function Spinner({
  size = "sm",
  label = "Caricamento",
  className
}) {
  return /* @__PURE__ */ jsxs6(
    "span",
    {
      role: "status",
      className: cn("inline-flex items-center text-primary", className),
      children: [
        /* @__PURE__ */ jsx9(Loader22, { className: cn("animate-spin", TAGLIE2[size]), "aria-hidden": true }),
        /* @__PURE__ */ jsx9("span", { className: "sr-only", children: label })
      ]
    }
  );
}

// src/atoms/ProgressBar.jsx
import { jsx as jsx10, jsxs as jsxs7 } from "react/jsx-runtime";
function ProgressBar({
  value,
  max = 100,
  tone = "primary",
  label,
  showValue = false,
  className
}) {
  const tetto = max > 0 ? max : 0;
  const now = tetto > 0 ? Math.min(Math.max(Number(value) || 0, 0), tetto) : 0;
  const pct = tetto > 0 ? now / tetto * 100 : 0;
  return /* @__PURE__ */ jsxs7("div", { className: cn("w-full", className), children: [
    (label || showValue) && /* @__PURE__ */ jsxs7("div", { className: "mb-1 flex items-center justify-between text-xs", children: [
      /* @__PURE__ */ jsx10("span", { className: "font-medium text-foreground", children: label }),
      showValue && /* @__PURE__ */ jsxs7("span", { className: "tabular-nums text-muted-foreground", children: [
        Math.round(pct),
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsx10(
      "div",
      {
        role: "progressbar",
        "aria-label": label,
        "aria-valuenow": now,
        "aria-valuemin": 0,
        "aria-valuemax": tetto,
        className: "h-2 w-full overflow-hidden rounded-full bg-muted",
        children: /* @__PURE__ */ jsx10(
          "div",
          {
            className: cn(
              "h-full rounded-full transition-all duration-300",
              PIENI[tone]
            ),
            style: { width: `${pct}%` }
          }
        )
      }
    )
  ] });
}

// src/atoms/Kbd.jsx
import { jsx as jsx11 } from "react/jsx-runtime";
function Kbd({ children, className }) {
  return /* @__PURE__ */ jsx11(
    "kbd",
    {
      className: cn(
        "inline-flex h-5 min-w-[20px] items-center justify-center rounded border border-border bg-muted px-1.5",
        "font-sans text-[11px] font-medium text-muted-foreground",
        className
      ),
      children
    }
  );
}

// src/molecules/Field.jsx
import { Children, cloneElement, isValidElement, useId } from "react";
import { jsx as jsx12, jsxs as jsxs8 } from "react/jsx-runtime";
function Field({
  label,
  hint,
  error,
  required,
  id,
  className,
  children
}) {
  const auto = useId();
  const child = Children.only(children);
  const fieldId = id || child.props?.id || auto;
  const hintId = hint ? `${fieldId}-hint` : null;
  const errorId = error ? `${fieldId}-error` : null;
  const describedBy = [child.props?.["aria-describedby"], hintId, errorId].filter(Boolean).join(" ") || void 0;
  const control = isValidElement(child) ? cloneElement(child, {
    id: fieldId,
    "aria-describedby": describedBy,
    ...error ? { "aria-invalid": "true" } : {}
  }) : child;
  return /* @__PURE__ */ jsxs8("div", { className: cn("flex flex-col gap-1.5", className), children: [
    label && /* @__PURE__ */ jsxs8(
      "label",
      {
        htmlFor: fieldId,
        className: "text-sm font-medium text-foreground",
        children: [
          label,
          required && /* @__PURE__ */ jsx12("span", { className: "ml-0.5 text-destructive", "aria-hidden": true, children: "*" })
        ]
      }
    ),
    control,
    hint && !error && /* @__PURE__ */ jsx12("p", { id: hintId, className: "text-xs text-muted-foreground", children: hint }),
    error && /* @__PURE__ */ jsx12("p", { id: errorId, role: "alert", className: "text-xs text-destructive", children: error })
  ] });
}

// src/molecules/Select.jsx
import { useEffect as useEffect3, useId as useId2, useRef, useState as useState3 } from "react";
import { Check, ChevronDown } from "lucide-react";
import { jsx as jsx13, jsxs as jsxs9 } from "react/jsx-runtime";
var CLEAR = "__clear__";
function Select({
  value,
  onChange,
  options = [],
  placeholder = "Seleziona\u2026",
  allowClear = false,
  disabled = false,
  invalid,
  "aria-label": ariaLabel,
  className,
  ...rest
}) {
  const [open, setOpen] = useState3(false);
  const [active, setActive] = useState3(-1);
  const rootRef = useRef(null);
  const uid = useId2();
  const entries = [
    ...allowClear ? [{ value: CLEAR, label: "Nessuno", clear: true }] : [],
    ...options
  ];
  const selected = options.find((o) => o.value === value);
  const optId = (i) => `${uid}-opt-${i}`;
  useEffect3(() => {
    if (!open) return void 0;
    const fuori = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", fuori);
    return () => document.removeEventListener("mousedown", fuori);
  }, [open]);
  const apri = () => {
    if (disabled) return;
    const i = entries.findIndex(
      (o) => !o.clear && o.value === value && !o.disabled
    );
    setActive(i >= 0 ? i : entries.findIndex((o) => !o.disabled));
    setOpen(true);
  };
  const scegli = (o) => {
    if (!o || o.disabled) return;
    onChange?.(o.clear ? null : o.value);
    setOpen(false);
  };
  const muovi = (dir) => {
    let i = active;
    for (let n = 0; n < entries.length; n += 1) {
      i = (i + dir + entries.length) % entries.length;
      if (!entries[i].disabled) {
        setActive(i);
        return;
      }
    }
  };
  const onKeyDown = (e) => {
    if (disabled) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) apri();
      else muovi(e.key === "ArrowDown" ? 1 : -1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!open) apri();
      else scegli(entries[active]);
    } else if (e.key === "Escape" && open) {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };
  return /* @__PURE__ */ jsxs9("div", { ref: rootRef, className: cn("relative", className), children: [
    /* @__PURE__ */ jsxs9(
      "button",
      {
        type: "button",
        disabled,
        "aria-label": ariaLabel,
        "aria-haspopup": "listbox",
        "aria-expanded": open,
        "aria-controls": open ? `${uid}-list` : void 0,
        "aria-activedescendant": open && active >= 0 ? optId(active) : void 0,
        "aria-invalid": invalid ? "true" : void 0,
        onClick: () => open ? setOpen(false) : apri(),
        onKeyDown,
        onKeyUp: (e) => e.key === " " && e.preventDefault(),
        className: cn(
          campoClasses(invalid),
          "flex h-10 items-center justify-between gap-2 px-3 text-left"
        ),
        ...rest,
        children: [
          /* @__PURE__ */ jsx13("span", { className: cn("truncate", !selected && "text-muted-foreground"), children: selected ? selected.label : placeholder }),
          /* @__PURE__ */ jsx13(
            ChevronDown,
            {
              className: cn(
                "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                open && "rotate-180"
              ),
              "aria-hidden": true
            }
          )
        ]
      }
    ),
    open && /* @__PURE__ */ jsx13(
      "ul",
      {
        id: `${uid}-list`,
        role: "listbox",
        "aria-label": ariaLabel,
        className: "absolute z-30 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-border bg-card py-1 shadow-lg",
        children: entries.map((o, i) => {
          const sel = !o.clear && o.value === value;
          return /* @__PURE__ */ jsxs9(
            "li",
            {
              id: optId(i),
              role: "option",
              "aria-selected": sel,
              "aria-disabled": o.disabled || void 0,
              onMouseEnter: () => !o.disabled && setActive(i),
              onClick: () => scegli(o),
              className: cn(
                "flex cursor-pointer items-start gap-2 px-3 py-2 text-sm transition-colors",
                o.disabled && "cursor-not-allowed opacity-50",
                i === active && "bg-muted",
                sel ? "text-primary" : "text-foreground",
                o.clear && "italic text-muted-foreground"
              ),
              children: [
                /* @__PURE__ */ jsxs9("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsx13("div", { className: "font-medium", children: o.label }),
                  o.description && /* @__PURE__ */ jsx13("div", { className: "mt-0.5 text-xs text-muted-foreground", children: o.description })
                ] }),
                sel && /* @__PURE__ */ jsx13(Check, { className: "mt-0.5 h-4 w-4 shrink-0", "aria-hidden": true })
              ]
            },
            o.value
          );
        })
      }
    )
  ] });
}

// src/molecules/Toggle.jsx
import { useId as useId3 } from "react";
import { jsx as jsx14, jsxs as jsxs10 } from "react/jsx-runtime";
function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled,
  className
}) {
  const uid = useId3();
  return /* @__PURE__ */ jsxs10("div", { className: cn("flex items-start gap-3", className), children: [
    /* @__PURE__ */ jsx14(
      "button",
      {
        type: "button",
        role: "switch",
        "aria-checked": !!checked,
        "aria-labelledby": label ? `${uid}-l` : void 0,
        "aria-describedby": description ? `${uid}-d` : void 0,
        disabled,
        onClick: () => onChange?.(!checked),
        className: cn(
          "relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "active:scale-95 disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-primary hover:bg-primary/90" : "bg-muted-foreground/30 hover:bg-muted-foreground/40"
        ),
        children: /* @__PURE__ */ jsx14(
          "span",
          {
            "aria-hidden": true,
            className: cn(
              "inline-block h-4 w-4 rounded-full bg-background shadow transition-transform",
              checked ? "translate-x-[18px]" : "translate-x-0.5"
            )
          }
        )
      }
    ),
    (label || description) && /* @__PURE__ */ jsxs10("div", { className: "min-w-0", children: [
      label && /* @__PURE__ */ jsx14(
        "div",
        {
          id: `${uid}-l`,
          className: "text-sm font-medium text-foreground",
          children: label
        }
      ),
      description && /* @__PURE__ */ jsx14("div", { id: `${uid}-d`, className: "text-xs text-muted-foreground", children: description })
    ] })
  ] });
}

// src/molecules/Checkbox.jsx
import { useId as useId4 } from "react";
import { Check as Check2, Minus } from "lucide-react";
import { jsx as jsx15, jsxs as jsxs11 } from "react/jsx-runtime";
function Checkbox({
  checked,
  indeterminate,
  onChange,
  label,
  disabled,
  className
}) {
  const uid = useId4();
  const on = indeterminate || checked;
  return /* @__PURE__ */ jsxs11("div", { className: cn("flex items-center gap-2", className), children: [
    /* @__PURE__ */ jsx15(
      "button",
      {
        type: "button",
        role: "checkbox",
        "aria-checked": indeterminate ? "mixed" : !!checked,
        "aria-labelledby": label ? uid : void 0,
        disabled,
        onClick: () => onChange?.(indeterminate ? true : !checked),
        className: cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "active:scale-90 disabled:cursor-not-allowed disabled:opacity-50",
          on ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90" : "border-input bg-background hover:border-ring/60"
        ),
        children: indeterminate ? /* @__PURE__ */ jsx15(Minus, { className: "h-3 w-3", strokeWidth: 3, "aria-hidden": true }) : checked && /* @__PURE__ */ jsx15(Check2, { className: "h-3 w-3", strokeWidth: 3, "aria-hidden": true })
      }
    ),
    label && /* @__PURE__ */ jsx15(
      "span",
      {
        id: uid,
        className: cn("text-sm text-foreground", disabled && "opacity-50"),
        children: label
      }
    )
  ] });
}

// src/molecules/Tabs.jsx
import { useRef as useRef2 } from "react";
import { jsx as jsx16, jsxs as jsxs12 } from "react/jsx-runtime";
function Tabs({
  value,
  onChange,
  items = [],
  "aria-label": ariaLabel,
  className
}) {
  const refs = useRef2([]);
  const vai = (i) => {
    const n = (i + items.length) % items.length;
    onChange?.(items[n].id);
    refs.current[n]?.focus();
  };
  return /* @__PURE__ */ jsx16(
    "div",
    {
      role: "tablist",
      "aria-label": ariaLabel,
      className: cn(
        "flex gap-6 overflow-x-auto overflow-y-hidden border-b border-border [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      ),
      children: items.map((t, i) => {
        const attiva = t.id === value;
        const Icon = t.icon;
        return /* @__PURE__ */ jsxs12(
          "button",
          {
            ref: (el) => {
              refs.current[i] = el;
            },
            type: "button",
            role: "tab",
            id: `tab-${t.id}`,
            "aria-selected": attiva,
            "aria-controls": attiva ? `panel-${t.id}` : void 0,
            tabIndex: attiva ? 0 : -1,
            onClick: () => onChange?.(t.id),
            onKeyDown: (e) => {
              if (e.key === "ArrowRight") {
                e.preventDefault();
                vai(i + 1);
              } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                vai(i - 1);
              }
            },
            className: cn(
              "-mb-px inline-flex items-center gap-2 whitespace-nowrap border-b-2 py-2.5 text-sm font-medium transition-colors",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              attiva ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            ),
            children: [
              Icon && /* @__PURE__ */ jsx16(Icon, { className: "h-4 w-4", "aria-hidden": true }),
              t.label,
              t.count != null && /* @__PURE__ */ jsx16("span", { className: "rounded-full bg-muted px-1.5 text-xs tabular-nums text-muted-foreground", children: t.count })
            ]
          },
          t.id
        );
      })
    }
  );
}

// src/molecules/SegmentedControl.jsx
import { useRef as useRef3 } from "react";
import { jsx as jsx17, jsxs as jsxs13 } from "react/jsx-runtime";
var SIZE = { sm: "h-7 px-3 text-xs", md: "h-9 px-4 text-sm" };
function SegmentedControl({
  value,
  onChange,
  options = [],
  size = "sm",
  "aria-label": ariaLabel,
  className
}) {
  const refs = useRef3([]);
  const vai = (i) => {
    const n = (i + options.length) % options.length;
    onChange?.(options[n].value);
    refs.current[n]?.focus();
  };
  return /* @__PURE__ */ jsx17(
    "div",
    {
      role: "radiogroup",
      "aria-label": ariaLabel,
      className: cn("inline-flex rounded-lg bg-muted p-1", className),
      children: options.map((o, i) => {
        const attivo = o.value === value;
        const Icon = o.icon;
        return /* @__PURE__ */ jsxs13(
          "button",
          {
            ref: (el) => {
              refs.current[i] = el;
            },
            type: "button",
            role: "radio",
            "aria-checked": attivo,
            tabIndex: attivo ? 0 : -1,
            onClick: () => onChange?.(o.value),
            onKeyDown: (e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                vai(i + 1);
              } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                vai(i - 1);
              }
            },
            className: cn(
              "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              SIZE[size] || SIZE.sm,
              attivo ? "bg-background text-primary shadow" : "text-muted-foreground hover:text-foreground"
            ),
            children: [
              Icon && /* @__PURE__ */ jsx17(Icon, { className: "h-3.5 w-3.5", "aria-hidden": true }),
              o.label
            ]
          },
          o.value
        );
      })
    }
  );
}

// src/molecules/Tooltip.jsx
import {
  Children as Children2,
  cloneElement as cloneElement2,
  useCallback as useCallback2,
  useEffect as useEffect4,
  useId as useId5,
  useRef as useRef4,
  useState as useState4
} from "react";
import { jsx as jsx18, jsxs as jsxs14 } from "react/jsx-runtime";
var DELAY_MS = 150;
var SIDE = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
  left: "right-full top-1/2 mr-2 -translate-y-1/2",
  right: "left-full top-1/2 ml-2 -translate-y-1/2"
};
function Tooltip({
  content,
  side = "top",
  wide = false,
  children
}) {
  const id = useId5();
  const [open, setOpen] = useState4(false);
  const timer = useRef4(null);
  const child = Children2.only(children);
  const show = useCallback2(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), DELAY_MS);
  }, []);
  const hide = useCallback2(() => {
    clearTimeout(timer.current);
    setOpen(false);
  }, []);
  useEffect4(() => () => clearTimeout(timer.current), []);
  const chain = (name, fn) => (e) => {
    child.props[name]?.(e);
    fn(e);
  };
  const trigger = cloneElement2(child, {
    "aria-describedby": open ? id : child.props["aria-describedby"],
    onMouseEnter: chain("onMouseEnter", show),
    onMouseLeave: chain("onMouseLeave", hide),
    onFocus: chain("onFocus", show),
    onBlur: chain("onBlur", hide),
    onKeyDown: chain("onKeyDown", (e) => e.key === "Escape" && hide())
  });
  return /* @__PURE__ */ jsxs14("span", { className: "relative inline-flex", children: [
    trigger,
    open && content != null && /* @__PURE__ */ jsx18(
      "span",
      {
        id,
        role: "tooltip",
        className: cn(
          "pointer-events-none absolute z-50 rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-md",
          wide ? "w-max max-w-xs whitespace-normal text-left" : "whitespace-nowrap",
          SIDE[side] || SIDE.top
        ),
        children: content
      }
    )
  ] });
}

// src/molecules/InfoTip.jsx
import { HelpCircle } from "lucide-react";
import { jsx as jsx19 } from "react/jsx-runtime";
var LONG = 40;
function InfoTip({
  children,
  label = "Maggiori informazioni",
  side = "top"
}) {
  const long = typeof children === "string" && children.length > LONG;
  return /* @__PURE__ */ jsx19(Tooltip, { content: children, side, wide: long, children: /* @__PURE__ */ jsx19(
    "button",
    {
      type: "button",
      "aria-label": label,
      className: "inline-flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
      children: /* @__PURE__ */ jsx19(HelpCircle, { className: "h-4 w-4", "aria-hidden": true })
    }
  ) });
}

// src/organisms/Card.jsx
import { jsx as jsx20, jsxs as jsxs15 } from "react/jsx-runtime";
function Card({ className, interactive = false, children, ...props }) {
  return /* @__PURE__ */ jsx20(
    "div",
    {
      ...props,
      className: cn(
        "rounded-xl border bg-card text-card-foreground shadow-sm",
        interactive && "transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40",
        className
      ),
      children
    }
  );
}
function CardHeader({
  title,
  description,
  actions,
  className,
  children
}) {
  return /* @__PURE__ */ jsxs15(
    "div",
    {
      className: cn(
        "flex items-start justify-between gap-4 p-5 pb-0",
        className
      ),
      children: [
        /* @__PURE__ */ jsxs15("div", { className: "min-w-0 space-y-1", children: [
          title && /* @__PURE__ */ jsx20(CardTitle, { children: title }),
          description && /* @__PURE__ */ jsx20(CardDescription, { children: description }),
          children
        ] }),
        actions && /* @__PURE__ */ jsx20("div", { className: "flex shrink-0 items-center gap-2", children: actions })
      ]
    }
  );
}
function CardTitle({ className, children, ...props }) {
  return /* @__PURE__ */ jsx20(
    "h3",
    {
      ...props,
      className: cn("text-base font-semibold leading-tight", className),
      children
    }
  );
}
function CardDescription({ className, children, ...props }) {
  return /* @__PURE__ */ jsx20("p", { ...props, className: cn("text-sm text-muted-foreground", className), children });
}
function CardContent({ className, children, ...props }) {
  return /* @__PURE__ */ jsx20("div", { ...props, className: cn("p-5", className), children });
}
function CardFooter({ className, children, ...props }) {
  return /* @__PURE__ */ jsx20(
    "div",
    {
      ...props,
      className: cn("flex items-center gap-2 border-t p-4", className),
      children
    }
  );
}

// src/organisms/KpiCard.jsx
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

// src/organisms/Skeleton.jsx
import { jsx as jsx21, jsxs as jsxs16 } from "react/jsx-runtime";
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsx21(
    "div",
    {
      "aria-hidden": true,
      ...props,
      className: cn("animate-pulse rounded-md bg-muted", className)
    }
  );
}
function SkeletonText({ lines = 3 }) {
  return /* @__PURE__ */ jsx21("div", { className: "space-y-2", role: "status", "aria-label": "Caricamento", children: Array.from({ length: lines }, (_, i) => /* @__PURE__ */ jsx21(
    Skeleton,
    {
      className: cn(
        "h-4",
        i === lines - 1 && lines > 1 ? "w-2/3" : "w-full"
      )
    },
    i
  )) });
}
function SkeletonCard() {
  return /* @__PURE__ */ jsxs16("div", { className: "rounded-xl border bg-card p-5 shadow-sm space-y-4", children: [
    /* @__PURE__ */ jsx21(Skeleton, { className: "h-4 w-1/3" }),
    /* @__PURE__ */ jsx21(Skeleton, { className: "h-8 w-1/2" }),
    /* @__PURE__ */ jsx21(SkeletonText, { lines: 2 })
  ] });
}
function SkeletonTable({ rows = 5, cols = 4 }) {
  return /* @__PURE__ */ jsxs16("div", { className: "space-y-3", role: "status", "aria-label": "Caricamento", children: [
    /* @__PURE__ */ jsx21("div", { className: "flex gap-4", children: Array.from({ length: cols }, (_, c) => /* @__PURE__ */ jsx21(Skeleton, { className: "h-4 flex-1" }, c)) }),
    Array.from({ length: rows }, (_, r2) => /* @__PURE__ */ jsx21("div", { className: "flex gap-4", children: Array.from({ length: cols }, (_2, c) => /* @__PURE__ */ jsx21(Skeleton, { className: "h-6 flex-1" }, c)) }, r2))
  ] });
}

// src/organisms/KpiCard.jsx
import { jsx as jsx22, jsxs as jsxs17 } from "react/jsx-runtime";
var ICONE = {
  neutral: "bg-muted text-muted-foreground",
  primary: "bg-primary/15 text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-destructive/15 text-destructive"
};
function Delta({ delta }) {
  const su = delta.value > 0;
  const giu = delta.value < 0;
  const Icona = giu ? ArrowDownRight : ArrowUpRight;
  return /* @__PURE__ */ jsxs17(
    "span",
    {
      className: cn(
        "inline-flex items-center gap-0.5 text-xs font-medium",
        su && "text-success",
        giu && "text-destructive",
        !su && !giu && "text-muted-foreground"
      ),
      children: [
        (su || giu) && /* @__PURE__ */ jsx22(Icona, { className: "h-3.5 w-3.5", "aria-hidden": true }),
        su ? "+" : "",
        formatNumero(delta.value),
        delta.label && /* @__PURE__ */ jsx22("span", { className: "ml-1 font-normal text-muted-foreground", children: delta.label })
      ]
    }
  );
}
function KpiCard({
  label,
  value,
  hint,
  delta,
  tone = "neutral",
  icon: Icon,
  loading = false,
  help,
  className
}) {
  const mostrato = typeof value === "number" ? formatNumero(value) : value;
  return /* @__PURE__ */ jsxs17(Card, { className: cn("p-5", className), children: [
    /* @__PURE__ */ jsxs17("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs17("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxs17("div", { className: "flex items-center gap-1 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsx22("span", { className: "truncate", children: label }),
          help && /* @__PURE__ */ jsx22(InfoTip, { children: help })
        ] }),
        loading ? /* @__PURE__ */ jsx22(Skeleton, { className: "mt-2 h-8 w-24" }) : /* @__PURE__ */ jsx22("p", { className: "mt-1 text-3xl font-bold tabular-nums tracking-tight", children: mostrato })
      ] }),
      Icon && /* @__PURE__ */ jsx22(
        "span",
        {
          className: cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            ICONE[tone] ?? ICONE.neutral
          ),
          children: /* @__PURE__ */ jsx22(Icon, { className: "h-5 w-5", "aria-hidden": true })
        }
      )
    ] }),
    !loading && (delta || hint) && /* @__PURE__ */ jsxs17("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
      delta && /* @__PURE__ */ jsx22(Delta, { delta }),
      hint && /* @__PURE__ */ jsx22("span", { className: "text-xs text-muted-foreground", children: hint })
    ] })
  ] });
}

// src/organisms/EmptyState.jsx
import { jsx as jsx23, jsxs as jsxs18 } from "react/jsx-runtime";
function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className
}) {
  return /* @__PURE__ */ jsxs18(
    "div",
    {
      className: cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-12 text-center",
        className
      ),
      children: [
        /* @__PURE__ */ jsx23("span", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground", children: /* @__PURE__ */ jsx23(Icon, { className: "h-6 w-6", "aria-hidden": true }) }),
        /* @__PURE__ */ jsxs18("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx23("p", { className: "text-base font-semibold", children: title }),
          description && /* @__PURE__ */ jsx23("p", { className: "max-w-sm text-sm text-muted-foreground", children: description })
        ] }),
        action && /* @__PURE__ */ jsx23("div", { className: "mt-1", children: action })
      ]
    }
  );
}

// src/organisms/Alert.jsx
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { jsx as jsx24, jsxs as jsxs19 } from "react/jsx-runtime";
var TONI = {
  info: {
    box: "border-info/30 bg-info/10 text-sky-900 dark:text-sky-100",
    icon: "text-info",
    Icona: Info
  },
  success: {
    box: "border-success/30 bg-success/10 text-green-900 dark:text-green-100",
    icon: "text-success",
    Icona: CheckCircle2
  },
  warning: {
    box: "border-warning/40 bg-warning/10 text-amber-900 dark:text-amber-100",
    icon: "text-warning",
    Icona: AlertTriangle
  },
  danger: {
    box: "border-destructive/30 bg-destructive/10 text-red-900 dark:text-red-100",
    icon: "text-destructive",
    Icona: XCircle
  }
};
function Alert({
  tone = "info",
  title,
  children,
  onClose,
  className
}) {
  const t = TONI[tone] ?? TONI.info;
  const urgente = tone === "danger" || tone === "warning";
  return /* @__PURE__ */ jsxs19(
    "div",
    {
      role: urgente ? "alert" : "status",
      className: cn(
        "flex gap-3 rounded-lg border p-4 text-sm",
        t.box,
        className
      ),
      children: [
        /* @__PURE__ */ jsx24(t.Icona, { className: cn("mt-0.5 h-5 w-5 shrink-0", t.icon), "aria-hidden": true }),
        /* @__PURE__ */ jsxs19("div", { className: "min-w-0 flex-1", children: [
          title && /* @__PURE__ */ jsx24("p", { className: "font-semibold", children: title }),
          children && /* @__PURE__ */ jsx24("div", { className: cn(title && "mt-0.5"), children })
        ] }),
        onClose && /* @__PURE__ */ jsx24(
          IconButton_default,
          {
            icon: X,
            label: "Chiudi",
            size: "sm",
            onClick: onClose,
            className: "-my-1 -mr-1 shrink-0"
          }
        )
      ]
    }
  );
}

// src/organisms/Pagination.jsx
import { ChevronLeft, ChevronRight as ChevronRight2 } from "lucide-react";
import { jsx as jsx25, jsxs as jsxs20 } from "react/jsx-runtime";
function Pagination({ page, pageSize, total, onPageChange }) {
  if (total <= pageSize) return null;
  const pagine = Math.ceil(total / pageSize);
  const da = (page - 1) * pageSize + 1;
  const a = Math.min(page * pageSize, total);
  return /* @__PURE__ */ jsxs20(
    "nav",
    {
      "aria-label": "Paginazione",
      className: "flex items-center justify-between gap-3",
      children: [
        /* @__PURE__ */ jsx25("p", { className: "text-sm text-muted-foreground tabular-nums", children: `${formatNumero(da)}\u2013${formatNumero(a)} di ${formatNumero(total)}` }),
        /* @__PURE__ */ jsxs20("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx25(
            Button_default,
            {
              variant: "outline",
              size: "sm",
              icon: ChevronLeft,
              disabled: page <= 1,
              onClick: () => onPageChange(page - 1),
              "aria-label": "Pagina precedente",
              children: "Precedente"
            }
          ),
          /* @__PURE__ */ jsx25(
            Button_default,
            {
              variant: "outline",
              size: "sm",
              iconRight: ChevronRight2,
              disabled: page >= pagine,
              onClick: () => onPageChange(page + 1),
              "aria-label": "Pagina successiva",
              children: "Successiva"
            }
          )
        ] })
      ]
    }
  );
}

// src/organisms/DataTable.jsx
import { ChevronDown as ChevronDown2, ChevronUp, ChevronsUpDown, Inbox } from "lucide-react";

// src/organisms/useSort.js
import { useCallback as useCallback3, useMemo, useState as useState5 } from "react";
var isNil = (v) => v === null || v === void 0;
function compare(a, b) {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), "it", { sensitivity: "base" });
}
function useSort(rows, { initial = null, accessors = {} } = {}) {
  const [sort, setSort] = useState5(initial);
  const toggle = useCallback3((key) => {
    setSort(
      (prev) => prev && prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
    );
  }, []);
  const sorted = useMemo(() => {
    if (!sort) return rows;
    const get = accessors[sort.key] || ((row) => row[sort.key]);
    const sign = sort.dir === "desc" ? -1 : 1;
    return [...rows].sort((ra, rb) => {
      const a = get(ra);
      const b = get(rb);
      if (isNil(a) && isNil(b)) return 0;
      if (isNil(a)) return 1;
      if (isNil(b)) return -1;
      return sign * compare(a, b);
    });
  }, [rows, sort]);
  return { sorted, sort, toggle };
}

// src/organisms/DataTable.jsx
import { jsx as jsx26, jsxs as jsxs21 } from "react/jsx-runtime";
var ALIGN = { left: "text-left", right: "text-right", center: "text-center" };
var JUSTIFY = {
  left: "justify-start",
  right: "justify-end",
  center: "justify-center"
};
function SortIcon({ dir }) {
  const Icon = dir === "asc" ? ChevronUp : dir === "desc" ? ChevronDown2 : ChevronsUpDown;
  return /* @__PURE__ */ jsx26(Icon, { className: cn("h-3.5 w-3.5", !dir && "opacity-40"), "aria-hidden": true });
}
function DataTable({
  columns,
  rows,
  rowKey,
  onRowClick,
  loading = false,
  empty,
  initialSort,
  dense = false,
  caption
}) {
  const accessors = {};
  columns.forEach((c) => {
    if (c.sortAccessor) accessors[c.key] = c.sortAccessor;
  });
  const { sorted, sort, toggle } = useSort(rows, {
    initial: initialSort,
    accessors
  });
  const pad = dense ? "px-3 py-1.5" : "px-4 py-3";
  let body;
  if (loading && rows.length === 0) {
    body = /* @__PURE__ */ jsx26("div", { className: "p-4", children: /* @__PURE__ */ jsx26(SkeletonTable, { rows: 5, cols: columns.length }) });
  } else if (rows.length === 0) {
    body = empty === void 0 ? /* @__PURE__ */ jsx26(EmptyState, { icon: Inbox, title: "Nessun dato" }) : typeof empty === "string" ? /* @__PURE__ */ jsx26("p", { className: "px-6 py-12 text-center text-sm text-muted-foreground", children: empty }) : empty;
  }
  return /* @__PURE__ */ jsx26(Card, { className: "p-0", children: /* @__PURE__ */ jsx26("div", { className: "overflow-x-auto", children: body ? body : /* @__PURE__ */ jsxs21("table", { className: "w-full text-sm", children: [
    caption && /* @__PURE__ */ jsx26("caption", { className: "sr-only", children: caption }),
    /* @__PURE__ */ jsx26("thead", { className: "border-b bg-muted/50 font-medium text-muted-foreground", children: /* @__PURE__ */ jsx26("tr", { children: columns.map((c) => {
      const active = sort && sort.key === c.key ? sort.dir : null;
      const align = ALIGN[c.align] || ALIGN.left;
      return /* @__PURE__ */ jsx26(
        "th",
        {
          scope: "col",
          style: c.width ? { width: c.width } : void 0,
          "aria-sort": c.sortable ? active === "asc" ? "ascending" : active === "desc" ? "descending" : "none" : void 0,
          className: cn(
            pad,
            "whitespace-nowrap font-medium",
            align,
            c.className
          ),
          children: c.sortable ? /* @__PURE__ */ jsxs21(
            "button",
            {
              type: "button",
              onClick: () => toggle(c.key),
              className: cn(
                "inline-flex items-center gap-1 rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                JUSTIFY[c.align] || JUSTIFY.left,
                active && "text-foreground"
              ),
              children: [
                c.header,
                /* @__PURE__ */ jsx26(SortIcon, { dir: active })
              ]
            }
          ) : c.header
        },
        c.key
      );
    }) }) }),
    /* @__PURE__ */ jsx26("tbody", { className: "divide-y", children: sorted.map((row) => /* @__PURE__ */ jsx26(
      "tr",
      {
        tabIndex: onRowClick ? 0 : void 0,
        onClick: onRowClick ? () => onRowClick(row) : void 0,
        onKeyDown: onRowClick ? (e) => {
          if (e.key === "Enter" && e.target === e.currentTarget)
            onRowClick(row);
        } : void 0,
        className: cn(
          "transition-colors hover:bg-muted/40",
          onRowClick && "cursor-pointer focus-visible:outline-none focus-visible:bg-muted/60 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        ),
        children: columns.map((c) => /* @__PURE__ */ jsx26(
          "td",
          {
            className: cn(
              pad,
              ALIGN[c.align] || ALIGN.left,
              c.className
            ),
            children: c.cell ? c.cell(row) : row[c.key] ?? ""
          },
          c.key
        ))
      },
      rowKey(row)
    )) })
  ] }) }) });
}
export {
  Alert,
  AppSidebar,
  Badge,
  Button_default as Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  DataTable,
  EmptyState,
  Field,
  IconButton_default as IconButton,
  InfoTip,
  Input_default as Input,
  Kbd,
  KpiCard,
  Pagination,
  ProgressBar,
  SegmentedControl,
  Select,
  Skeleton,
  SkeletonCard,
  SkeletonTable,
  SkeletonText,
  Spinner,
  StatusDot,
  THEME_INIT_SCRIPT,
  Tabs,
  Textarea_default as Textarea,
  ThemeToggle,
  Toggle,
  Tooltip,
  cn,
  collectGroupIds,
  formatData,
  formatDataOra,
  formatNumero,
  formatRelativo,
  normalizeNavTree,
  useSort,
  useTheme
};
