// src/utenti/GestioneUtenti.jsx
import { useMemo, useState as useState13 } from "react";
import { AlertCircle as AlertCircle2, Search as Search2, UserPlus, Users } from "lucide-react";

// src/utenti/TabellaUtenti.jsx
import { KeyRound, Pencil, RotateCcw, Trash2, UserMinus, UserX } from "lucide-react";

// src/utenti/BadgePortale.jsx
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

// src/utenti/ruoli.js
var RUOLI = ["viewer", "manager", "billing", "admin", "superadmin"];
var LIVELLO = { viewer: 1, manager: 2, admin: 3, superadmin: 4, billing: 1 };
var RUOLI_LATERALI = ["billing"];
var ETICHETTE_RUOLO = { billing: "Fatturazione" };
function eLaterale(ruolo) {
  return RUOLI_LATERALI.includes(ruolo);
}
function etichettaRuolo(ruolo) {
  return ETICHETTE_RUOLO[ruolo] || ruolo;
}
var ETICHETTE_PORTALE = {
  offerte: "Hub Offerte",
  cruscotto: "Cruscotto",
  outbound: "Campagne"
};
function livello(ruolo) {
  return LIVELLO[ruolo] || 0;
}
function ruoliAssegnabili(ruoloAttore) {
  const lv = livello(ruoloAttore);
  if (lv >= LIVELLO.superadmin) return [...RUOLI];
  const tetto = Math.min(lv, LIVELLO.admin);
  return RUOLI.filter((r2) => livello(r2) <= tetto && (!eLaterale(r2) || lv >= LIVELLO.admin));
}
function etichettaPortale(portale) {
  return ETICHETTE_PORTALE[portale] || portale;
}

// src/utenti/BadgePortale.jsx
import { jsx, jsxs } from "react/jsx-runtime";
var RUOLO_COLORE = {
  superadmin: "bg-purple-50 text-purple-700 ring-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:ring-purple-500/30",
  admin: "bg-brand-50 text-brand-700 ring-brand-200 dark:bg-brand-500/10 dark:text-brand-300 dark:ring-brand-500/30",
  manager: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30",
  billing: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30",
  viewer: "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-white/[0.06] dark:text-slate-300 dark:ring-white/10"
};
var pillola = "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset";
function BadgeRuolo({ ruolo }) {
  if (!ruolo) return /* @__PURE__ */ jsx("span", { className: "text-slate-400 dark:text-slate-500", children: "\u2014" });
  return /* @__PURE__ */ jsx("span", { className: `${pillola} capitalize ${RUOLO_COLORE[ruolo] || RUOLO_COLORE.viewer}`, children: etichettaRuolo(ruolo) });
}
function BadgePortale({ portale, ruolo }) {
  return /* @__PURE__ */ jsxs("span", { className: `${pillola} ${RUOLO_COLORE[ruolo] || RUOLO_COLORE.viewer}`, children: [
    etichettaPortale(portale),
    ruolo && /* @__PURE__ */ jsxs("span", { className: "opacity-70", children: [
      "\xB7 ",
      etichettaRuolo(ruolo)
    ] })
  ] });
}
function ElencoPortali({ portali }) {
  if (!portali?.length) return /* @__PURE__ */ jsx("span", { className: "text-slate-400 dark:text-slate-500", children: "\u2014" });
  return /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1", children: portali.map((p) => /* @__PURE__ */ jsx(BadgePortale, { portale: p.portale, ruolo: p.ruolo }, p.portale)) });
}
function AltriPortali({ portali }) {
  const [aperto, setAperto] = useState(false);
  if (!portali?.length) return /* @__PURE__ */ jsx("span", { className: "text-slate-400 dark:text-slate-500", children: "\u2014" });
  const Freccia = aperto ? ChevronDown : ChevronRight;
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start gap-1", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        "aria-expanded": aperto,
        onClick: () => setAperto((a) => !a),
        className: "inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-200/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:bg-white/[0.06] dark:text-slate-300 dark:ring-white/10 dark:hover:bg-white/10",
        children: [
          /* @__PURE__ */ jsx(Freccia, { className: "h-3 w-3", "aria-hidden": "true" }),
          portali.length === 1 ? "1 portale" : `${portali.length} portali`
        ]
      }
    ),
    aperto && /* @__PURE__ */ jsx(ElencoPortali, { portali })
  ] });
}

// src/utenti/stili.js
var base = "inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
var BOTTONE = {
  primario: `${base} bg-brand-600 text-white shadow-sm hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400`,
  secondario: `${base} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]`,
  pericolo: `${base} bg-red-600 text-white shadow-sm hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400`
};
var ICONA_AZIONE = "inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 dark:text-slate-500 dark:hover:bg-white/[0.06] dark:hover:text-slate-200";
var INPUT = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-800 placeholder:text-slate-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-brand-400";
var ETICHETTA = "mb-1 block text-[12px] font-medium text-slate-600 dark:text-slate-300";

// src/utenti/formato.js
function messaggioErrore(err) {
  const detail = err?.body?.detail;
  if (typeof detail === "string") return detail;
  if (detail && typeof detail.messaggio === "string") return detail.messaggio;
  if (Array.isArray(detail) && detail.length) {
    return detail.map((d) => d?.msg || String(d)).join("; ");
  }
  return err?.message || "Errore imprevisto";
}
function nomeCompleto(utente) {
  const n = [utente?.nome, utente?.cognome].filter(Boolean).join(" ");
  return n || "\u2014";
}
function testoONull(valore) {
  const v = (valore || "").trim();
  return v || null;
}
function vuoto(valore) {
  return !(valore || "").trim();
}
function testoEsitoAccesso({ email_inviata, utente }) {
  if (email_inviata)
    return `Accesso concesso. Email inviata a ${utente?.email}.`;
  return "Accesso concesso. Email non inviata.";
}

// src/atoms/DataOra.jsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var VUOTO = /* @__PURE__ */ jsx2("span", { className: "text-muted-foreground", children: "\u2014" });
function DataOra({ value, soloData = false }) {
  if (!value) return VUOTO;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return VUOTO;
  return /* @__PURE__ */ jsxs2("span", { className: "inline-block whitespace-nowrap tabular-nums leading-tight", children: [
    /* @__PURE__ */ jsx2("span", { className: "block", children: d.toLocaleDateString("it-IT") }),
    !soloData && /* @__PURE__ */ jsx2("span", { className: "block text-xs text-muted-foreground", children: d.toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit"
    }) })
  ] });
}

// src/molecules/TopScrollX.jsx
import { useEffect, useRef, useState as useState2 } from "react";

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

// src/molecules/TopScrollX.jsx
import { Fragment, jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
function TopScrollX({
  children,
  className,
  ariaLabel = "Tabella scorrevole"
}) {
  const topRef = useRef(null);
  const bodyRef = useRef(null);
  const syncing = useRef(false);
  const [scrollWidth, setScrollWidth] = useState2(0);
  const [overflow, setOverflow] = useState2(false);
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return void 0;
    const measure = () => {
      setScrollWidth(body.scrollWidth);
      setOverflow(body.scrollWidth > body.clientWidth + 1);
    };
    measure();
    if (typeof ResizeObserver === "undefined") return void 0;
    const ro = new ResizeObserver(measure);
    ro.observe(body);
    if (body.firstElementChild) ro.observe(body.firstElementChild);
    return () => ro.disconnect();
  }, [children]);
  const follow = (from, to) => {
    if (syncing.current) {
      syncing.current = false;
      return;
    }
    if (to.current && from.current && to.current.scrollLeft !== from.current.scrollLeft) {
      syncing.current = true;
      to.current.scrollLeft = from.current.scrollLeft;
    }
  };
  return /* @__PURE__ */ jsxs3(Fragment, { children: [
    overflow && /* @__PURE__ */ jsx3(
      "div",
      {
        ref: topRef,
        "data-testid": "top-scroll-x",
        onScroll: () => follow(topRef, bodyRef),
        className: "overflow-x-auto overflow-y-hidden border-b",
        "aria-hidden": "true",
        children: /* @__PURE__ */ jsx3("div", { style: { width: scrollWidth, height: 1 } })
      }
    ),
    /* @__PURE__ */ jsx3(
      "div",
      {
        ref: bodyRef,
        onScroll: () => follow(bodyRef, topRef),
        tabIndex: overflow ? 0 : void 0,
        role: overflow ? "region" : void 0,
        "aria-label": overflow ? ariaLabel : void 0,
        className: cn(
          "overflow-x-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
          className
        ),
        children
      }
    )
  ] });
}

// src/utenti/TabellaUtenti.jsx
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var COLONNE = ["Nome", "Email", "Ruolo", "Altri portali", "Ultimo accesso", "Stato", ""];
var CELLA = "px-3 py-2.5 align-middle";
function Azione({ titolo, icona: Icona, onClick, pericolo }) {
  return /* @__PURE__ */ jsx4(
    "button",
    {
      type: "button",
      title: titolo,
      "aria-label": titolo,
      onClick,
      className: `${ICONA_AZIONE} ${pericolo ? "hover:!bg-red-50 hover:!text-red-600 dark:hover:!bg-red-500/10 dark:hover:!text-red-400" : ""}`,
      children: /* @__PURE__ */ jsx4(Icona, { className: "h-4 w-4" })
    }
  );
}
function Stato({ attivo }) {
  return /* @__PURE__ */ jsxs4("span", { className: "inline-flex items-center gap-1.5 text-[12px] text-slate-600 dark:text-slate-300", children: [
    /* @__PURE__ */ jsx4("span", { className: `h-1.5 w-1.5 rounded-full ${attivo ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}` }),
    attivo ? "Attivo" : "Disattivato"
  ] });
}
function RigaScheletro() {
  return /* @__PURE__ */ jsx4("tr", { className: "animate-pulse", children: COLONNE.map((c, i) => /* @__PURE__ */ jsx4("td", { className: CELLA, children: /* @__PURE__ */ jsx4("div", { className: "h-3.5 rounded bg-slate-100 dark:bg-white/[0.06]", style: { width: `${50 + i * 17 % 40}%` } }) }, i)) });
}
function TabellaUtenti({ utenti, caricando, attore, onAzione }) {
  const adminPlus = livello(attore?.ruolo) >= LIVELLO.admin;
  return /* @__PURE__ */ jsx4("div", { className: "rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900", children: /* @__PURE__ */ jsx4(TopScrollX, { ariaLabel: "Tabella utenti scorrevole", children: /* @__PURE__ */ jsxs4("table", { className: "min-w-full text-left text-[13px]", children: [
    /* @__PURE__ */ jsx4("thead", { className: "border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-slate-400", children: /* @__PURE__ */ jsx4("tr", { children: COLONNE.map((c, i) => /* @__PURE__ */ jsx4("th", { scope: "col", className: `${CELLA} ${i === COLONNE.length - 1 ? "text-right" : ""}`, children: c || /* @__PURE__ */ jsx4("span", { className: "sr-only", children: "Azioni" }) }, i)) }) }),
    /* @__PURE__ */ jsxs4("tbody", { className: "divide-y divide-slate-100 dark:divide-white/[0.06]", children: [
      caricando && utenti.length === 0 && [0, 1, 2, 3].map((i) => /* @__PURE__ */ jsx4(RigaScheletro, {}, i)),
      utenti.map((u) => {
        const io = u.id === attore?.id;
        return /* @__PURE__ */ jsxs4(
          "tr",
          {
            className: `transition-colors hover:bg-slate-50/80 dark:hover:bg-white/[0.02] ${u.is_active ? "" : "opacity-60"}`,
            children: [
              /* @__PURE__ */ jsxs4("td", { className: `${CELLA} font-medium text-slate-800 dark:text-slate-100`, children: [
                nomeCompleto(u),
                io && /* @__PURE__ */ jsx4("span", { className: "ml-1.5 text-[11px] font-normal text-slate-400", children: "(tu)" })
              ] }),
              /* @__PURE__ */ jsx4("td", { className: `${CELLA} text-slate-600 dark:text-slate-300`, children: u.email || "\u2014" }),
              /* @__PURE__ */ jsx4("td", { className: CELLA, children: /* @__PURE__ */ jsx4(BadgeRuolo, { ruolo: u.ruolo }) }),
              /* @__PURE__ */ jsx4("td", { className: CELLA, children: /* @__PURE__ */ jsx4(AltriPortali, { portali: u.altri_portali }) }),
              /* @__PURE__ */ jsx4("td", { className: `${CELLA} text-slate-500 dark:text-slate-400`, children: u.last_login ? /* @__PURE__ */ jsx4(DataOra, { value: u.last_login }) : "mai" }),
              /* @__PURE__ */ jsx4("td", { className: CELLA, children: /* @__PURE__ */ jsx4(Stato, { attivo: u.is_active }) }),
              /* @__PURE__ */ jsx4("td", { className: `${CELLA} whitespace-nowrap text-right`, children: /* @__PURE__ */ jsxs4("div", { className: "inline-flex gap-0.5", children: [
                /* @__PURE__ */ jsx4(Azione, { titolo: "Modifica", icona: Pencil, onClick: () => onAzione("modifica", u) }),
                /* @__PURE__ */ jsx4(Azione, { titolo: "Password", icona: KeyRound, onClick: () => onAzione("password", u) }),
                !io && /* @__PURE__ */ jsx4(Azione, { titolo: "Togli accesso", icona: UserMinus, onClick: () => onAzione("togli", u) }),
                !io && adminPlus && u.is_active && /* @__PURE__ */ jsx4(Azione, { titolo: "Disattiva", icona: UserX, onClick: () => onAzione("disattiva", u) }),
                !io && adminPlus && !u.is_active && /* @__PURE__ */ jsx4(Azione, { titolo: "Riattiva", icona: RotateCcw, onClick: () => onAzione("riattiva", u) }),
                !io && adminPlus && /* @__PURE__ */ jsx4(Azione, { titolo: "Elimina", icona: Trash2, pericolo: true, onClick: () => onAzione("elimina", u) })
              ] }) })
            ]
          },
          u.id
        );
      })
    ] })
  ] }) }) });
}

// src/utenti/Interruttore.jsx
import { jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
function Interruttore({
  attivo,
  onCambia,
  etichetta,
  disabilitato = false
}) {
  return /* @__PURE__ */ jsxs5(
    "button",
    {
      type: "button",
      role: "switch",
      "aria-checked": attivo,
      disabled: disabilitato,
      onClick: () => onCambia(!attivo),
      className: "group inline-flex items-center gap-2 text-[13px] text-slate-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-300",
      children: [
        /* @__PURE__ */ jsx5(
          "span",
          {
            className: `relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors duration-200 group-focus-visible:ring-2 group-focus-visible:ring-brand-500/60 ${attivo ? "bg-brand-600 dark:bg-brand-500" : "bg-slate-300 dark:bg-white/15"}`,
            children: /* @__PURE__ */ jsx5(
              "span",
              {
                className: `inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${attivo ? "translate-x-[18px]" : "translate-x-0.5"}`
              }
            )
          }
        ),
        etichetta
      ]
    }
  );
}

// src/utenti/FinestraNuovoUtente.jsx
import { useState as useState6 } from "react";
import { UserCheck } from "lucide-react";

// src/utenti/Finestra.jsx
import { useEffect as useEffect2, useId, useRef as useRef2, useState as useState3 } from "react";
import { X } from "lucide-react";
import { jsx as jsx6, jsxs as jsxs6 } from "react/jsx-runtime";
var FOCUSABILI = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
function Finestra({ titolo, onChiudi, children, piede, larghezza = "max-w-lg", bloccata = false }) {
  const pannello = useRef2(null);
  const idTitolo = useId();
  const chiudiRef = useRef2(onChiudi);
  chiudiRef.current = onChiudi;
  const [apritore] = useState3(() => typeof document !== "undefined" ? document.activeElement : null);
  useEffect2(() => {
    const nodo = pannello.current;
    if (nodo && !nodo.contains(document.activeElement)) {
      const iniziale = nodo.querySelector("[data-autofocus]") || nodo.querySelector(FOCUSABILI);
      (iniziale || nodo).focus();
    }
    return () => {
      if (apritore && apritore !== document.body && document.contains(apritore)) apritore.focus();
    };
  }, [apritore]);
  const chiudibile = !bloccata;
  function tasto(e) {
    if (e.key === "Escape") {
      e.stopPropagation();
      if (chiudibile) chiudiRef.current?.();
      return;
    }
    if (e.key !== "Tab") return;
    const elementi = Array.from(pannello.current?.querySelectorAll(FOCUSABILI) || []);
    if (!elementi.length) return;
    const primo = elementi[0];
    const ultimo = elementi[elementi.length - 1];
    if (e.shiftKey && document.activeElement === primo) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primo.focus();
    }
  }
  return /* @__PURE__ */ jsxs6(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      onKeyDown: tasto,
      children: [
        /* @__PURE__ */ jsx6(
          "div",
          {
            className: "absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] dark:bg-black/60",
            onMouseDown: () => chiudibile && chiudiRef.current?.(),
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxs6(
          "div",
          {
            ref: pannello,
            role: "dialog",
            "aria-modal": "true",
            "aria-labelledby": idTitolo,
            tabIndex: -1,
            className: `relative flex max-h-[90vh] w-full ${larghezza} flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl focus:outline-none dark:border-white/10 dark:bg-slate-900`,
            children: [
              /* @__PURE__ */ jsxs6("div", { className: "flex items-center justify-between border-b border-slate-100 px-5 py-3.5 dark:border-white/[0.06]", children: [
                /* @__PURE__ */ jsx6("h2", { id: idTitolo, className: "text-[15px] font-semibold text-slate-800 dark:text-slate-100", children: titolo }),
                chiudibile && /* @__PURE__ */ jsx6(
                  "button",
                  {
                    type: "button",
                    onClick: () => chiudiRef.current?.(),
                    "aria-label": "Chiudi finestra",
                    className: "rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/[0.06] dark:hover:text-slate-200",
                    children: /* @__PURE__ */ jsx6(X, { className: "h-4 w-4" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsx6("div", { className: "flex-1 space-y-4 overflow-y-auto px-5 py-4", children }),
              piede && /* @__PURE__ */ jsx6("div", { className: "flex justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-3 dark:border-white/[0.06] dark:bg-white/[0.02]", children: piede })
            ]
          }
        )
      ]
    }
  );
}

// src/utenti/SelettoreRuolo.jsx
import { useRef as useRef3 } from "react";
import { jsx as jsx7, jsxs as jsxs7 } from "react/jsx-runtime";
function SelettoreRuolo({ ruoli, valore, onCambia, etichetta = "Ruolo" }) {
  const gruppo = useRef3(null);
  function tasto(e, indice) {
    const passo = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!passo) return;
    e.preventDefault();
    const prossimo = (indice + passo + ruoli.length) % ruoli.length;
    onCambia(ruoli[prossimo]);
    gruppo.current?.querySelectorAll('[role="radio"]')[prossimo]?.focus();
  }
  return /* @__PURE__ */ jsxs7("div", { children: [
    /* @__PURE__ */ jsx7("span", { className: "mb-1 block text-[12px] font-medium text-slate-600 dark:text-slate-300", children: etichetta }),
    /* @__PURE__ */ jsx7(
      "div",
      {
        ref: gruppo,
        role: "radiogroup",
        "aria-label": etichetta,
        className: "inline-flex flex-wrap gap-0.5 rounded-lg bg-slate-100 p-0.5 dark:bg-white/[0.06]",
        children: ruoli.map((r2, i) => {
          const scelto = r2 === valore;
          return /* @__PURE__ */ jsx7(
            "button",
            {
              type: "button",
              role: "radio",
              "aria-checked": scelto,
              tabIndex: scelto || !valore && i === 0 ? 0 : -1,
              onClick: () => onCambia(r2),
              onKeyDown: (e) => tasto(e, i),
              className: `rounded-md px-3 py-1.5 text-[12.5px] font-medium capitalize transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 ${scelto ? "bg-white text-brand-700 shadow-sm dark:bg-slate-800 dark:text-brand-300" : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"}`,
              children: etichettaRuolo(r2)
            },
            r2
          );
        })
      }
    )
  ] });
}

// src/utenti/PasswordMostrata.jsx
import { useEffect as useEffect3, useRef as useRef4, useState as useState4 } from "react";
import { Check, Copy, KeyRound as KeyRound2 } from "lucide-react";
import { jsx as jsx8, jsxs as jsxs8 } from "react/jsx-runtime";
function copiaDaSelezione(nodo) {
  try {
    const selezione = window.getSelection();
    const intervallo = document.createRange();
    intervallo.selectNodeContents(nodo);
    selezione.removeAllRanges();
    selezione.addRange(intervallo);
    return typeof document.execCommand === "function" && document.execCommand("copy") === true;
  } catch {
    return false;
  }
}
async function copia(testo, nodo) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(testo);
      return true;
    } catch {
    }
  }
  return copiaDaSelezione(nodo);
}
function PasswordMostrata({ password }) {
  const [stato, setStato] = useState4(null);
  const codice = useRef4(null);
  const timer = useRef4(null);
  useEffect3(() => () => clearTimeout(timer.current), []);
  async function alClick() {
    const ok = await copia(password, codice.current);
    setStato(ok ? "copiata" : "impossibile");
    if (ok) {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setStato(null), 2e3);
    }
  }
  const copiata = stato === "copiata";
  return /* @__PURE__ */ jsxs8("div", { className: "space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-500/30 dark:bg-amber-500/10", children: [
    /* @__PURE__ */ jsxs8("p", { className: "flex items-center gap-1.5 text-[12.5px] font-medium text-amber-800 dark:text-amber-300", children: [
      /* @__PURE__ */ jsx8(KeyRound2, { className: "h-4 w-4" }),
      "Password generata: viene mostrata una sola volta, consegnala tu alla persona."
    ] }),
    /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx8(
        "code",
        {
          ref: codice,
          className: "flex-1 select-all rounded-md bg-white px-3 py-2 font-mono text-[13px] text-slate-800 ring-1 ring-amber-200 dark:bg-slate-900 dark:text-slate-100 dark:ring-amber-500/30",
          children: password
        }
      ),
      /* @__PURE__ */ jsxs8("button", { type: "button", onClick: alClick, className: BOTTONE.secondario, children: [
        copiata ? /* @__PURE__ */ jsx8(Check, { className: "h-4 w-4 text-emerald-600" }) : /* @__PURE__ */ jsx8(Copy, { className: "h-4 w-4" }),
        copiata ? "Copiata" : "Copia"
      ] })
    ] }),
    stato === "impossibile" && /* @__PURE__ */ jsx8("p", { role: "status", className: "text-[12px] text-amber-800 dark:text-amber-300", children: "Copia non disponibile: seleziona e copia a mano" })
  ] });
}

// src/utenti/Campo.jsx
import { useId as useId2 } from "react";
import { AlertCircle, Info } from "lucide-react";
import { jsx as jsx9, jsxs as jsxs9 } from "react/jsx-runtime";
function Campo({
  etichetta,
  valore,
  onCambia,
  tipo = "text",
  nota,
  autoFocus,
  obbligatorio,
  ...resto
}) {
  const id = useId2();
  return /* @__PURE__ */ jsxs9("div", { children: [
    /* @__PURE__ */ jsxs9("label", { htmlFor: id, className: ETICHETTA, children: [
      etichetta,
      obbligatorio && /* @__PURE__ */ jsx9("span", { className: "text-red-500 dark:text-red-400", children: " *" })
    ] }),
    /* @__PURE__ */ jsx9(
      "input",
      {
        id,
        type: tipo,
        value: valore,
        onChange: (e) => onCambia(e.target.value),
        "data-autofocus": autoFocus ? "" : void 0,
        "aria-required": obbligatorio || void 0,
        className: INPUT,
        ...resto
      }
    ),
    nota && /* @__PURE__ */ jsx9("p", { className: "mt-1 text-[11px] text-slate-500 dark:text-slate-400", children: nota })
  ] });
}
function MessaggioErrore({ children }) {
  if (!children) return null;
  return /* @__PURE__ */ jsxs9(
    "div",
    {
      role: "alert",
      className: "flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12.5px] text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300",
      children: [
        /* @__PURE__ */ jsx9(AlertCircle, { className: "mt-0.5 h-4 w-4 flex-shrink-0" }),
        /* @__PURE__ */ jsx9("span", { children })
      ]
    }
  );
}
function Nota({ children }) {
  return /* @__PURE__ */ jsxs9("div", { className: "flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2 text-[12px] text-slate-600 dark:bg-white/[0.04] dark:text-slate-400", children: [
    /* @__PURE__ */ jsx9(Info, { className: "mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-400 dark:text-slate-500" }),
    /* @__PURE__ */ jsx9("span", { children })
  ] });
}

// src/utenti/InterruttoreAvvisa.jsx
import { jsx as jsx10, jsxs as jsxs10 } from "react/jsx-runtime";
function InterruttoreAvvisa({ attivo, onCambia, haEmail }) {
  return /* @__PURE__ */ jsxs10("div", { className: "space-y-1", children: [
    /* @__PURE__ */ jsx10(
      Interruttore,
      {
        attivo: haEmail && attivo,
        onCambia,
        etichetta: "Avvisa via email",
        disabilitato: !haEmail
      }
    ),
    !haEmail && /* @__PURE__ */ jsx10(Nota, { children: "Nessuna email in anagrafica: non \xE8 possibile avvisare." })
  ] });
}

// src/utenti/useAzione.js
import { useCallback, useEffect as useEffect4, useRef as useRef5, useState as useState5 } from "react";
function useAzione() {
  const [inCorso, setInCorso] = useState5(false);
  const [errore, setErrore] = useState5(null);
  const montato = useRef5(true);
  useEffect4(() => {
    montato.current = true;
    return () => {
      montato.current = false;
    };
  }, []);
  const esegui = useCallback(async (fn, gestisci) => {
    setInCorso(true);
    setErrore(null);
    try {
      return { ok: true, valore: await fn() };
    } catch (err) {
      if (montato.current && !gestisci?.(err)) setErrore(messaggioErrore(err));
      return { ok: false, err };
    } finally {
      if (montato.current) setInCorso(false);
    }
  }, []);
  return { inCorso, errore, setErrore, esegui };
}

// src/utenti/FinestraNuovoUtente.jsx
import { Fragment as Fragment2, jsx as jsx11, jsxs as jsxs11 } from "react/jsx-runtime";
var NOTA_SESSIONI = "Dare l'accesso chiude le sessioni della persona su tutti i portali: dovr\xE0 rifare il login.";
function PersonaEsistente({
  utente,
  nomePortale,
  onDaiAccesso,
  inCorso,
  selettore,
  avvisa,
  onCambiaAvvisa
}) {
  let stato = null;
  if (utente.ruolo) stato = "Ha gi\xE0 accesso a questo portale.";
  else if (!utente.is_active)
    stato = "L'account \xE8 disattivato: riattivalo prima di dargli accesso.";
  return /* @__PURE__ */ jsxs11("div", { className: "space-y-3 rounded-lg border border-brand-200 bg-brand-50/60 p-4 dark:border-brand-500/30 dark:bg-brand-500/10", children: [
    /* @__PURE__ */ jsxs11("p", { className: "flex items-center gap-2 text-[14px] font-semibold text-slate-800 dark:text-slate-100", children: [
      /* @__PURE__ */ jsx11(UserCheck, { className: "h-4 w-4 text-brand-600 dark:text-brand-400" }),
      `${nomeCompleto(utente) === "\u2014" ? utente.username : nomeCompleto(utente)} esiste gi\xE0`
    ] }),
    /* @__PURE__ */ jsx11(ElencoPortali, { portali: utente.altri_portali }),
    stato ? /* @__PURE__ */ jsx11("p", { className: "text-[13px] text-slate-600 dark:text-slate-300", children: stato }) : /* @__PURE__ */ jsxs11(Fragment2, { children: [
      selettore,
      /* @__PURE__ */ jsx11(
        InterruttoreAvvisa,
        {
          attivo: avvisa,
          onCambia: onCambiaAvvisa,
          haEmail: Boolean(utente.email)
        }
      ),
      /* @__PURE__ */ jsx11(Nota, { children: NOTA_SESSIONI }),
      /* @__PURE__ */ jsx11(
        "button",
        {
          type: "button",
          onClick: onDaiAccesso,
          disabled: inCorso,
          className: BOTTONE.primario,
          children: `Dai accesso a ${nomePortale}`
        }
      )
    ] })
  ] });
}
function FinestraNuovoUtente({
  client,
  basePath,
  nomePortale,
  attore,
  onChiudi,
  onFatto
}) {
  const ruoli = ruoliAssegnabili(attore?.ruolo);
  const [campi, setCampi] = useState6({
    username: "",
    email: "",
    nome: "",
    cognome: "",
    password: ""
  });
  const [ruolo, setRuolo] = useState6("viewer");
  const [esistente, setEsistente] = useState6(null);
  const [avvisa, setAvvisa] = useState6(true);
  const [esito, setEsito] = useState6(null);
  const { inCorso, errore, esegui } = useAzione();
  const imposta = (k) => (v) => setCampi((c) => ({ ...c, [k]: v }));
  const nomeIncompleto = vuoto(campi.nome) || vuoto(campi.cognome);
  async function crea(e) {
    e.preventDefault();
    const corpo = {
      username: campi.username.trim(),
      email: testoONull(campi.email),
      nome: campi.nome.trim(),
      cognome: campi.cognome.trim(),
      ruolo,
      password: campi.password ? campi.password : null
    };
    const r2 = await esegui(
      () => client.post(basePath, corpo),
      (err) => {
        const d = err?.body?.detail;
        if (err?.status === 409 && d?.codice === "esiste" && d.utente) {
          setEsistente(d.utente);
          return true;
        }
        return false;
      }
    );
    if (!r2.ok) return;
    onFatto?.();
    setEsito({
      password_generata: r2.valore?.password_generata,
      email_inviata: r2.valore?.email_inviata
    });
  }
  async function daiAccesso() {
    const r2 = await esegui(
      () => client.post(`${basePath}/${esistente.id}/accesso`, {
        ruolo,
        avvisa: Boolean(esistente.email) && avvisa
      })
    );
    if (!r2.ok) return;
    onFatto?.();
    setEsito({ accesso: true, testo: testoEsitoAccesso(r2.valore) });
  }
  const chiudi = /* @__PURE__ */ jsx11("button", { type: "button", onClick: onChiudi, className: BOTTONE.secondario, children: "Chiudi" });
  if (esito) {
    return /* @__PURE__ */ jsxs11(
      Finestra,
      {
        titolo: "Nuovo utente",
        onChiudi,
        piede: chiudi,
        bloccata: Boolean(esito.password_generata),
        children: [
          esito.accesso && /* @__PURE__ */ jsx11("p", { className: "text-[13px] text-slate-700 dark:text-slate-300", children: esito.testo }),
          !esito.accesso && /* @__PURE__ */ jsx11("p", { className: "text-[13px] text-slate-700 dark:text-slate-300", children: "Utente creato." }),
          esito.password_generata && /* @__PURE__ */ jsx11(PasswordMostrata, { password: esito.password_generata }),
          !esito.password_generata && esito.email_inviata && /* @__PURE__ */ jsx11("p", { className: "text-[13px] text-slate-600 dark:text-slate-400", children: "Le credenziali sono state inviate per email." })
        ]
      }
    );
  }
  if (esistente) {
    return /* @__PURE__ */ jsxs11(Finestra, { titolo: "Nuovo utente", onChiudi, piede: chiudi, children: [
      /* @__PURE__ */ jsx11(
        PersonaEsistente,
        {
          utente: esistente,
          nomePortale,
          onDaiAccesso: daiAccesso,
          inCorso,
          selettore: /* @__PURE__ */ jsx11(SelettoreRuolo, { ruoli, valore: ruolo, onCambia: setRuolo }),
          avvisa,
          onCambiaAvvisa: setAvvisa
        }
      ),
      /* @__PURE__ */ jsx11(MessaggioErrore, { children: errore })
    ] });
  }
  return /* @__PURE__ */ jsx11(
    Finestra,
    {
      titolo: "Nuovo utente",
      onChiudi,
      piede: /* @__PURE__ */ jsxs11(Fragment2, { children: [
        /* @__PURE__ */ jsx11(
          "button",
          {
            type: "button",
            onClick: onChiudi,
            className: BOTTONE.secondario,
            children: "Annulla"
          }
        ),
        /* @__PURE__ */ jsx11(
          "button",
          {
            type: "submit",
            form: "vuscom-nuovo-utente",
            disabled: inCorso || campi.username.trim().length < 3 || nomeIncompleto,
            className: BOTTONE.primario,
            children: "Crea utente"
          }
        )
      ] }),
      children: /* @__PURE__ */ jsxs11("form", { id: "vuscom-nuovo-utente", onSubmit: crea, className: "space-y-3", children: [
        /* @__PURE__ */ jsx11(
          Campo,
          {
            etichetta: "Username",
            valore: campi.username,
            onCambia: imposta("username"),
            autoFocus: true,
            autoComplete: "off"
          }
        ),
        /* @__PURE__ */ jsx11(
          Campo,
          {
            etichetta: "Email",
            tipo: "email",
            valore: campi.email,
            onCambia: imposta("email"),
            autoComplete: "off"
          }
        ),
        /* @__PURE__ */ jsxs11("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsx11(
            Campo,
            {
              etichetta: "Nome",
              valore: campi.nome,
              onCambia: imposta("nome"),
              obbligatorio: true
            }
          ),
          /* @__PURE__ */ jsx11(
            Campo,
            {
              etichetta: "Cognome",
              valore: campi.cognome,
              onCambia: imposta("cognome"),
              obbligatorio: true
            }
          )
        ] }),
        /* @__PURE__ */ jsx11(SelettoreRuolo, { ruoli, valore: ruolo, onCambia: setRuolo }),
        /* @__PURE__ */ jsx11(
          Campo,
          {
            etichetta: "Password (facoltativa)",
            tipo: "password",
            valore: campi.password,
            onCambia: imposta("password"),
            autoComplete: "new-password",
            nota: "Se vuota viene generata e inviata per email. Almeno 8 caratteri."
          }
        ),
        /* @__PURE__ */ jsx11(MessaggioErrore, { children: errore })
      ] })
    }
  );
}

// src/utenti/FinestraAggiungiEsistente.jsx
import { useState as useState8 } from "react";
import { Check as Check2, Loader2, Search } from "lucide-react";

// src/utenti/useRicerca.js
import { useEffect as useEffect5, useState as useState7 } from "react";
var RITARDO_RICERCA_MS = 300;
var MINIMO_CARATTERI = 2;
function useRicerca({ client, basePath, testo }) {
  const [risultati, setRisultati] = useState7(null);
  const [cercando, setCercando] = useState7(false);
  const [errore, setErrore] = useState7(null);
  useEffect5(() => {
    const q = testo.trim();
    if (q.length < MINIMO_CARATTERI) {
      setRisultati(null);
      setCercando(false);
      setErrore(null);
      return void 0;
    }
    let annullata = false;
    setCercando(true);
    const timer = setTimeout(async () => {
      try {
        const dati = await client.get(`${basePath}/cerca?q=${encodeURIComponent(q)}`);
        if (annullata) return;
        setRisultati(Array.isArray(dati) ? dati : []);
        setErrore(null);
      } catch (err) {
        if (!annullata) setErrore(messaggioErrore(err));
      } finally {
        if (!annullata) setCercando(false);
      }
    }, RITARDO_RICERCA_MS);
    return () => {
      annullata = true;
      clearTimeout(timer);
    };
  }, [client, basePath, testo]);
  return { risultati, cercando, errore };
}

// src/utenti/FinestraAggiungiEsistente.jsx
import { Fragment as Fragment3, jsx as jsx12, jsxs as jsxs12 } from "react/jsx-runtime";
function Risultato({ utente, scelto, onScegli }) {
  return /* @__PURE__ */ jsx12("li", { children: /* @__PURE__ */ jsxs12(
    "button",
    {
      type: "button",
      "aria-pressed": scelto,
      onClick: onScegli,
      className: `flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 ${scelto ? "border-brand-400 bg-brand-50 dark:border-brand-400/60 dark:bg-brand-500/10" : "border-slate-200 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/[0.04]"}`,
      children: [
        /* @__PURE__ */ jsxs12("span", { className: "min-w-0 flex-1 space-y-1", children: [
          /* @__PURE__ */ jsx12("span", { className: "block text-[13px] font-medium text-slate-800 dark:text-slate-100", children: nomeCompleto(utente) }),
          /* @__PURE__ */ jsxs12("span", { className: "block truncate text-[12px] text-slate-500 dark:text-slate-400", children: [
            utente.username,
            utente.email ? ` \xB7 ${utente.email}` : ""
          ] }),
          /* @__PURE__ */ jsx12(ElencoPortali, { portali: utente.altri_portali })
        ] }),
        scelto && /* @__PURE__ */ jsx12(Check2, { className: "mt-0.5 h-4 w-4 flex-shrink-0 text-brand-600 dark:text-brand-400" })
      ]
    }
  ) });
}
function FinestraAggiungiEsistente({
  client,
  basePath,
  nomePortale,
  attore,
  onChiudi,
  onFatto
}) {
  const ruoli = ruoliAssegnabili(attore?.ruolo);
  const [testo, setTesto] = useState8("");
  const [scelto, setScelto] = useState8(null);
  const [ruolo, setRuolo] = useState8("viewer");
  const [avvisa, setAvvisa] = useState8(true);
  const [esito, setEsito] = useState8(null);
  const ricerca = useRicerca({ client, basePath, testo });
  const { inCorso, errore, esegui } = useAzione();
  async function conferma() {
    const r2 = await esegui(
      () => client.post(`${basePath}/${scelto.id}/accesso`, {
        ruolo,
        avvisa: Boolean(scelto.email) && avvisa
      })
    );
    if (!r2.ok) return;
    onFatto?.();
    setEsito(testoEsitoAccesso(r2.valore));
  }
  if (esito) {
    return /* @__PURE__ */ jsx12(
      Finestra,
      {
        titolo: `Aggiungi utente esistente a ${nomePortale}`,
        onChiudi,
        piede: /* @__PURE__ */ jsx12(
          "button",
          {
            type: "button",
            onClick: onChiudi,
            className: BOTTONE.secondario,
            children: "Chiudi"
          }
        ),
        children: /* @__PURE__ */ jsx12("p", { className: "text-[13px] text-slate-700 dark:text-slate-300", children: esito })
      }
    );
  }
  return /* @__PURE__ */ jsxs12(
    Finestra,
    {
      titolo: `Aggiungi utente esistente a ${nomePortale}`,
      onChiudi,
      piede: /* @__PURE__ */ jsxs12(Fragment3, { children: [
        /* @__PURE__ */ jsx12(
          "button",
          {
            type: "button",
            onClick: onChiudi,
            className: BOTTONE.secondario,
            children: "Annulla"
          }
        ),
        /* @__PURE__ */ jsx12(
          "button",
          {
            type: "button",
            onClick: conferma,
            disabled: !scelto || inCorso,
            className: BOTTONE.primario,
            children: "Dai accesso"
          }
        )
      ] }),
      children: [
        /* @__PURE__ */ jsx12(
          Campo,
          {
            etichetta: "Cerca persona",
            valore: testo,
            onCambia: (v) => {
              setTesto(v);
              setScelto(null);
            },
            placeholder: "Nome, cognome, username o email",
            autoFocus: true,
            autoComplete: "off",
            nota: testo.trim().length < MINIMO_CARATTERI ? `Almeno ${MINIMO_CARATTERI} caratteri.` : void 0
          }
        ),
        ricerca.cercando && /* @__PURE__ */ jsxs12("p", { className: "flex items-center gap-2 text-[12.5px] text-slate-500 dark:text-slate-400", children: [
          /* @__PURE__ */ jsx12(Loader2, { className: "h-3.5 w-3.5 animate-spin" }),
          " Ricerca in corso\u2026"
        ] }),
        /* @__PURE__ */ jsx12(MessaggioErrore, { children: ricerca.errore }),
        !ricerca.cercando && ricerca.risultati?.length === 0 && /* @__PURE__ */ jsxs12("p", { className: "flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400", children: [
          /* @__PURE__ */ jsx12(Search, { className: "h-4 w-4" }),
          " Nessun risultato"
        ] }),
        ricerca.risultati?.length > 0 && /* @__PURE__ */ jsx12("ul", { className: "max-h-64 space-y-1.5 overflow-y-auto pr-1", children: ricerca.risultati.map((u) => /* @__PURE__ */ jsx12(
          Risultato,
          {
            utente: u,
            scelto: scelto?.id === u.id,
            onScegli: () => setScelto(u)
          },
          u.id
        )) }),
        scelto && /* @__PURE__ */ jsxs12(Fragment3, { children: [
          /* @__PURE__ */ jsx12(
            SelettoreRuolo,
            {
              ruoli,
              valore: ruolo,
              onCambia: setRuolo,
              etichetta: `Ruolo su ${nomePortale}`
            }
          ),
          /* @__PURE__ */ jsx12(
            InterruttoreAvvisa,
            {
              attivo: avvisa,
              onCambia: setAvvisa,
              haEmail: Boolean(scelto.email)
            }
          ),
          /* @__PURE__ */ jsx12(Nota, { children: "Dare l'accesso chiude le sessioni della persona su tutti i portali: dovr\xE0 rifare il login." })
        ] }),
        /* @__PURE__ */ jsx12(MessaggioErrore, { children: errore })
      ]
    }
  );
}

// src/utenti/FinestraModifica.jsx
import { useState as useState9 } from "react";
import { Fragment as Fragment4, jsx as jsx13, jsxs as jsxs13 } from "react/jsx-runtime";
var ANAGRAFICA = ["nome", "cognome", "email"];
function campiCambiati(utente, bozza) {
  const cambiati = {};
  for (const k of ANAGRAFICA) {
    if ((bozza[k] || "").trim() !== (utente[k] || ""))
      cambiati[k] = bozza[k].trim();
  }
  if (bozza.ruolo !== utente.ruolo) cambiati.ruolo = bozza.ruolo;
  return cambiati;
}
function FinestraModifica({
  client,
  basePath,
  attore,
  utente,
  SezioneExtra,
  onChiudi,
  onFatto
}) {
  const [bozza, setBozza] = useState9({
    nome: utente.nome || "",
    cognome: utente.cognome || "",
    email: utente.email || "",
    ruolo: utente.ruolo
  });
  const { inCorso, errore, esegui } = useAzione();
  const imposta = (k) => (v) => setBozza((b) => ({ ...b, [k]: v }));
  const io = utente.id === attore?.id;
  const assegnabili = ruoliAssegnabili(attore?.ruolo);
  const ruoli = RUOLI.filter(
    (r2) => (assegnabili.includes(r2) || r2 === utente.ruolo) && (!io || livello(r2) >= livello(utente.ruolo))
  );
  const cambiati = campiCambiati(utente, bozza);
  const nessunCambio = Object.keys(cambiati).length === 0;
  const nomeIncompleto = vuoto(bozza.nome) || vuoto(bozza.cognome);
  async function salva(e) {
    e.preventDefault();
    if (nessunCambio || nomeIncompleto) return;
    const r2 = await esegui(
      () => client.put(`${basePath}/${utente.id}`, cambiati)
    );
    if (!r2.ok) return;
    onFatto?.();
    onChiudi();
  }
  return /* @__PURE__ */ jsxs13(
    Finestra,
    {
      titolo: `Modifica ${utente.username}`,
      onChiudi,
      piede: /* @__PURE__ */ jsxs13(Fragment4, { children: [
        /* @__PURE__ */ jsx13(
          "button",
          {
            type: "button",
            onClick: onChiudi,
            className: BOTTONE.secondario,
            children: "Annulla"
          }
        ),
        /* @__PURE__ */ jsx13(
          "button",
          {
            type: "submit",
            form: "vuscom-modifica-utente",
            disabled: inCorso || nessunCambio || nomeIncompleto,
            className: BOTTONE.primario,
            children: "Salva"
          }
        )
      ] }),
      children: [
        /* @__PURE__ */ jsxs13("form", { id: "vuscom-modifica-utente", onSubmit: salva, className: "space-y-3", children: [
          /* @__PURE__ */ jsxs13("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsx13(
              Campo,
              {
                etichetta: "Nome",
                valore: bozza.nome,
                onCambia: imposta("nome"),
                autoFocus: true,
                obbligatorio: true
              }
            ),
            /* @__PURE__ */ jsx13(
              Campo,
              {
                etichetta: "Cognome",
                valore: bozza.cognome,
                onCambia: imposta("cognome"),
                obbligatorio: true
              }
            )
          ] }),
          /* @__PURE__ */ jsx13(
            Campo,
            {
              etichetta: "Email",
              tipo: "email",
              valore: bozza.email,
              onCambia: imposta("email")
            }
          ),
          bozza.ruolo && /* @__PURE__ */ jsx13(
            SelettoreRuolo,
            {
              ruoli,
              valore: bozza.ruolo,
              onCambia: imposta("ruolo")
            }
          ),
          io && /* @__PURE__ */ jsx13(Nota, { children: "\xC8 il tuo account: non puoi abbassarti il ruolo." }),
          /* @__PURE__ */ jsx13(Nota, { children: "Cambiare il ruolo chiude le sessioni della persona su tutti i portali." }),
          /* @__PURE__ */ jsxs13("div", { children: [
            /* @__PURE__ */ jsx13("span", { className: ETICHETTA, children: "Altri portali (sola lettura)" }),
            /* @__PURE__ */ jsx13(ElencoPortali, { portali: utente.altri_portali })
          ] }),
          /* @__PURE__ */ jsx13(MessaggioErrore, { children: errore })
        ] }),
        SezioneExtra && /* @__PURE__ */ jsx13("div", { className: "border-t border-slate-100 pt-4 dark:border-white/[0.06]", children: /* @__PURE__ */ jsx13(SezioneExtra, { utente }) })
      ]
    }
  );
}

// src/utenti/FinestraPassword.jsx
import { useState as useState10 } from "react";
import { MailCheck } from "lucide-react";
import { Fragment as Fragment5, jsx as jsx14, jsxs as jsxs14 } from "react/jsx-runtime";
function FinestraPassword({ client, basePath, utente, onChiudi, onFatto }) {
  const [password, setPassword] = useState10("");
  const [esito, setEsito] = useState10(null);
  const { inCorso, errore, esegui } = useAzione();
  async function conferma(e) {
    e.preventDefault();
    const r2 = await esegui(() => client.put(`${basePath}/${utente.id}/password`, { password: password || null }));
    if (!r2.ok) return;
    onFatto?.();
    setEsito(r2.valore || {});
  }
  if (esito) {
    return /* @__PURE__ */ jsx14(
      Finestra,
      {
        titolo: `Password di ${utente.username}`,
        onChiudi,
        bloccata: Boolean(esito.password_generata),
        piede: /* @__PURE__ */ jsx14("button", { type: "button", onClick: onChiudi, className: BOTTONE.secondario, children: "Chiudi" }),
        children: esito.password_generata ? /* @__PURE__ */ jsx14(PasswordMostrata, { password: esito.password_generata }) : /* @__PURE__ */ jsxs14("p", { className: "flex items-center gap-2 text-[13px] text-slate-700 dark:text-slate-300", children: [
          /* @__PURE__ */ jsx14(MailCheck, { className: "h-4 w-4 text-emerald-600 dark:text-emerald-400" }),
          esito.email_inviata ? "Email inviata" : "Password aggiornata"
        ] })
      }
    );
  }
  return /* @__PURE__ */ jsx14(
    Finestra,
    {
      titolo: `Reimposta password di ${utente.username}`,
      onChiudi,
      piede: /* @__PURE__ */ jsxs14(Fragment5, { children: [
        /* @__PURE__ */ jsx14("button", { type: "button", onClick: onChiudi, className: BOTTONE.secondario, children: "Annulla" }),
        /* @__PURE__ */ jsx14("button", { type: "submit", form: "vuscom-password-utente", disabled: inCorso, className: BOTTONE.primario, children: "Reimposta" })
      ] }),
      children: /* @__PURE__ */ jsxs14("form", { id: "vuscom-password-utente", onSubmit: conferma, className: "space-y-3", children: [
        /* @__PURE__ */ jsx14(
          Campo,
          {
            etichetta: "Nuova password (facoltativa)",
            tipo: "password",
            valore: password,
            onCambia: setPassword,
            autoFocus: true,
            autoComplete: "new-password",
            nota: "Se vuota viene generata e inviata per email. Almeno 8 caratteri."
          }
        ),
        /* @__PURE__ */ jsx14(Nota, { children: "Vale per l'account su tutti i portali: le sessioni aperte vengono chiuse e al prossimo accesso la persona dovr\xE0 cambiarla." }),
        /* @__PURE__ */ jsx14(MessaggioErrore, { children: errore })
      ] })
    }
  );
}

// src/utenti/FinestraElimina.jsx
import { useEffect as useEffect6, useState as useState11 } from "react";
import { Loader2 as Loader22 } from "lucide-react";
import { Fragment as Fragment6, jsx as jsx15, jsxs as jsxs15 } from "react/jsx-runtime";
function descriviRiferimenti(riferimenti) {
  return Object.entries(riferimenti || {}).map(([chiave, n]) => `${chiave.split(".")[0]}: ${n}`).join(", ");
}
function Anteprima({ anteprima }) {
  if (anteprima.esito === "eliminato") {
    return /* @__PURE__ */ jsx15("p", { className: "text-[13px] text-slate-700 dark:text-slate-300", children: "L'account non \xE8 mai stato usato: verr\xE0 cancellato definitivamente." });
  }
  return /* @__PURE__ */ jsx15("p", { className: "text-[13px] leading-relaxed text-slate-700 dark:text-slate-300", children: `L'account ha dati collegati (${descriviRiferimenti(anteprima.riferimenti)}): i dati personali verranno cancellati e l'account disattivato. I dati collegati restano.` });
}
function FinestraElimina({ client, basePath, utente, onChiudi, onFatto }) {
  const [anteprima, setAnteprima] = useState11(null);
  const [erroreAnteprima, setErroreAnteprima] = useState11(null);
  const [digitato, setDigitato] = useState11("");
  const { inCorso, errore, esegui } = useAzione();
  useEffect6(() => {
    let annullata = false;
    client.get(`${basePath}/${utente.id}/eliminazione`).then((d) => !annullata && setAnteprima(d)).catch((err) => !annullata && setErroreAnteprima(messaggioErrore(err)));
    return () => {
      annullata = true;
    };
  }, [client, basePath, utente.id]);
  async function elimina() {
    const r2 = await esegui(() => client.del(`${basePath}/${utente.id}`));
    if (!r2.ok) return;
    onFatto?.();
    onChiudi();
  }
  const pronto = anteprima && digitato === utente.username;
  return /* @__PURE__ */ jsxs15(
    Finestra,
    {
      titolo: `Elimina ${utente.username}`,
      onChiudi,
      piede: /* @__PURE__ */ jsxs15(Fragment6, { children: [
        /* @__PURE__ */ jsx15("button", { type: "button", onClick: onChiudi, className: BOTTONE.secondario, children: "Annulla" }),
        /* @__PURE__ */ jsx15("button", { type: "button", onClick: elimina, disabled: !pronto || inCorso, className: BOTTONE.pericolo, children: "Elimina account" })
      ] }),
      children: [
        /* @__PURE__ */ jsx15("p", { className: "text-[12.5px] text-slate-500 dark:text-slate-400", children: "Vale per l'account su tutti i portali." }),
        !anteprima && !erroreAnteprima && /* @__PURE__ */ jsxs15("p", { className: "flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400", children: [
          /* @__PURE__ */ jsx15(Loader22, { className: "h-4 w-4 animate-spin" }),
          " Verifica dei dati collegati\u2026"
        ] }),
        /* @__PURE__ */ jsx15(MessaggioErrore, { children: erroreAnteprima }),
        anteprima && /* @__PURE__ */ jsx15(Anteprima, { anteprima }),
        anteprima && /* @__PURE__ */ jsx15(
          Campo,
          {
            etichetta: `Digita lo username (${utente.username}) per confermare`,
            valore: digitato,
            onCambia: setDigitato,
            autoComplete: "off"
          }
        ),
        /* @__PURE__ */ jsx15(MessaggioErrore, { children: errore })
      ]
    }
  );
}

// src/utenti/FinestraConferma.jsx
import { Fragment as Fragment7, jsx as jsx16, jsxs as jsxs16 } from "react/jsx-runtime";
function FinestraConferma({
  titolo,
  messaggio,
  nota,
  etichettaConferma,
  pericolo = false,
  azione,
  onChiudi,
  onFatto
}) {
  const { inCorso, errore, esegui } = useAzione();
  async function conferma() {
    const esito = await esegui(azione);
    if (esito.ok) {
      onFatto?.();
      onChiudi();
    }
  }
  return /* @__PURE__ */ jsxs16(
    Finestra,
    {
      titolo,
      onChiudi,
      piede: /* @__PURE__ */ jsxs16(Fragment7, { children: [
        /* @__PURE__ */ jsx16("button", { type: "button", onClick: onChiudi, className: BOTTONE.secondario, children: "Annulla" }),
        /* @__PURE__ */ jsx16(
          "button",
          {
            type: "button",
            onClick: conferma,
            disabled: inCorso,
            className: pericolo ? BOTTONE.pericolo : BOTTONE.primario,
            children: etichettaConferma
          }
        )
      ] }),
      children: [
        /* @__PURE__ */ jsx16("p", { className: "text-[13px] leading-relaxed text-slate-700 dark:text-slate-300", children: messaggio }),
        nota && /* @__PURE__ */ jsx16(Nota, { children: nota }),
        /* @__PURE__ */ jsx16(MessaggioErrore, { children: errore })
      ]
    }
  );
}

// src/utenti/useUtenti.js
import { useCallback as useCallback2, useEffect as useEffect7, useRef as useRef6, useState as useState12 } from "react";
function useUtenti({ client, basePath = "/api/utenti", includiDisattivati = false }) {
  const [utenti, setUtenti] = useState12([]);
  const [caricando, setCaricando] = useState12(true);
  const [errore, setErrore] = useState12(null);
  const ultima = useRef6(0);
  const ricarica = useCallback2(async () => {
    const numero = ++ultima.current;
    setCaricando(true);
    try {
      const dati = await client.get(`${basePath}?includi_disattivati=${includiDisattivati}`);
      if (numero !== ultima.current) return;
      setUtenti(Array.isArray(dati) ? dati : []);
      setErrore(null);
    } catch (err) {
      if (numero !== ultima.current) return;
      setErrore(messaggioErrore(err));
    } finally {
      if (numero === ultima.current) setCaricando(false);
    }
  }, [client, basePath, includiDisattivati]);
  useEffect7(() => {
    ricarica();
  }, [ricarica]);
  return { utenti, caricando, errore, ricarica };
}

// src/utenti/GestioneUtenti.jsx
import { jsx as jsx17, jsxs as jsxs17 } from "react/jsx-runtime";
var NOTA_SESSIONI2 = "La persona verr\xE0 disconnessa da tutti i portali e dovr\xE0 rifare il login.";
function corrisponde(u, filtro) {
  if (!filtro) return true;
  const testo = [u.nome, u.cognome, u.username, u.email].filter(Boolean).join(" ").toLowerCase();
  return testo.includes(filtro);
}
function conferme({ client, basePath, nomePortale }) {
  return {
    togli: (u) => ({
      titolo: "Togli accesso",
      messaggio: `${nomeCompleto(u)} (${u.username}) non potr\xE0 pi\xF9 entrare in ${nomePortale}. L'account resta attivo sugli altri portali.`,
      nota: NOTA_SESSIONI2,
      etichettaConferma: "Togli accesso",
      pericolo: true,
      azione: () => client.del(`${basePath}/${u.id}/accesso`)
    }),
    disattiva: (u) => ({
      titolo: "Disattiva account",
      messaggio: `L'account di ${nomeCompleto(u)} (${u.username}) verr\xE0 disattivato: vale per tutti i portali. Gli accessi restano com'erano e tornano validi se lo riattivi.`,
      nota: NOTA_SESSIONI2,
      etichettaConferma: "Disattiva",
      pericolo: true,
      azione: () => client.post(`${basePath}/${u.id}/disattiva`, {})
    }),
    riattiva: (u) => ({
      titolo: "Riattiva account",
      messaggio: `L'account di ${nomeCompleto(u)} (${u.username}) torner\xE0 attivo su tutti i portali a cui ha accesso.`,
      etichettaConferma: "Riattiva",
      azione: () => client.post(`${basePath}/${u.id}/riattiva`, {})
    })
  };
}
function GestioneUtenti({
  portale,
  nomePortale,
  client,
  attore,
  basePath = "/api/utenti",
  SezioneExtra
}) {
  const [mostraDisattivati, setMostraDisattivati] = useState13(false);
  const [filtro, setFiltro] = useState13("");
  const [finestra, setFinestra] = useState13(null);
  const { utenti, caricando, errore, ricarica } = useUtenti({ client, basePath, includiDisattivati: mostraDisattivati });
  const visibili = useMemo(() => {
    const f = filtro.trim().toLowerCase();
    return utenti.filter((u) => corrisponde(u, f));
  }, [utenti, filtro]);
  const nome = nomePortale || portale;
  const chiudi = () => setFinestra(null);
  const comuni = { client, basePath, attore, nomePortale: nome, onChiudi: chiudi, onFatto: ricarica };
  const conferma = finestra && conferme({ client, basePath, nomePortale: nome })[finestra.tipo];
  return /* @__PURE__ */ jsxs17("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs17("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs17("h1", { className: "flex items-center gap-2 text-[18px] font-semibold text-slate-800 dark:text-slate-100", children: [
        /* @__PURE__ */ jsx17(Users, { className: "h-5 w-5 text-brand-600 dark:text-brand-400" }),
        `Utenti \u2014 ${nome}`
      ] }),
      /* @__PURE__ */ jsxs17("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxs17("button", { type: "button", onClick: () => setFinestra({ tipo: "aggiungi" }), className: BOTTONE.secondario, children: [
          /* @__PURE__ */ jsx17(Search2, { className: "h-4 w-4" }),
          "Aggiungi utente esistente"
        ] }),
        /* @__PURE__ */ jsxs17("button", { type: "button", onClick: () => setFinestra({ tipo: "nuovo" }), className: BOTTONE.primario, children: [
          /* @__PURE__ */ jsx17(UserPlus, { className: "h-4 w-4" }),
          "Nuovo utente"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs17("div", { className: "flex flex-wrap items-center gap-4", children: [
      /* @__PURE__ */ jsxs17("div", { className: "relative w-full max-w-xs", children: [
        /* @__PURE__ */ jsx17(Search2, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" }),
        /* @__PURE__ */ jsx17(
          "input",
          {
            type: "search",
            "aria-label": "Filtra utenti",
            placeholder: "Filtra per nome, username, email",
            value: filtro,
            onChange: (e) => setFiltro(e.target.value),
            className: `${INPUT} pl-9`
          }
        )
      ] }),
      /* @__PURE__ */ jsx17(Interruttore, { attivo: mostraDisattivati, onCambia: setMostraDisattivati, etichetta: "Mostra disattivati" })
    ] }),
    errore && /* @__PURE__ */ jsxs17("div", { role: "alert", className: "flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300", children: [
      /* @__PURE__ */ jsxs17("span", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx17(AlertCircle2, { className: "h-4 w-4" }),
        errore
      ] }),
      /* @__PURE__ */ jsx17("button", { type: "button", onClick: ricarica, className: BOTTONE.secondario, children: "Riprova" })
    ] }),
    !errore && /* @__PURE__ */ jsx17(TabellaUtenti, { utenti: visibili, caricando, attore, onAzione: (tipo, utente) => setFinestra({ tipo, utente }) }),
    !errore && !caricando && visibili.length === 0 && /* @__PURE__ */ jsx17("p", { className: "py-8 text-center text-[13px] text-slate-500 dark:text-slate-400", children: filtro.trim() ? "Nessun utente corrisponde al filtro." : `Nessun utente ha accesso a ${nome}.` }),
    finestra?.tipo === "nuovo" && /* @__PURE__ */ jsx17(FinestraNuovoUtente, { ...comuni }),
    finestra?.tipo === "aggiungi" && /* @__PURE__ */ jsx17(FinestraAggiungiEsistente, { ...comuni }),
    finestra?.tipo === "modifica" && /* @__PURE__ */ jsx17(FinestraModifica, { ...comuni, utente: finestra.utente, SezioneExtra }),
    finestra?.tipo === "password" && /* @__PURE__ */ jsx17(FinestraPassword, { ...comuni, utente: finestra.utente }),
    finestra?.tipo === "elimina" && /* @__PURE__ */ jsx17(FinestraElimina, { ...comuni, utente: finestra.utente }),
    conferma && /* @__PURE__ */ jsx17(FinestraConferma, { ...conferma(finestra.utente), onChiudi: chiudi, onFatto: ricarica })
  ] });
}
export {
  ETICHETTE_PORTALE,
  ETICHETTE_RUOLO,
  GestioneUtenti,
  LIVELLO,
  RUOLI,
  eLaterale,
  etichettaRuolo,
  livello,
  ruoliAssegnabili,
  useUtenti
};
