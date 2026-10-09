// src/segnalazioni/SegnalazioniProvider.jsx
import { useCallback as useCallback2, useEffect as useEffect7, useMemo as useMemo3, useRef as useRef6, useState as useState4 } from "react";

// src/organisms/Toast.jsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";

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

// src/atoms/IconButton.jsx
import { forwardRef as forwardRef2 } from "react";

// src/atoms/Button.jsx
import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsxs(
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
        loading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin", "aria-hidden": true }) : Icon && /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4", "aria-hidden": true }),
        children,
        !loading && IconRight && /* @__PURE__ */ jsx(IconRight, { className: "h-4 w-4", "aria-hidden": true })
      ]
    }
  );
});
var Button_default = Button;

// src/atoms/IconButton.jsx
import { jsx as jsx2 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx2(
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
      children: Icon && /* @__PURE__ */ jsx2(Icon, { className: "h-4 w-4", "aria-hidden": true })
    }
  );
});
var IconButton_default = IconButton;

// src/atoms/tones.js
var TESTO = {
  neutral: "text-muted-foreground",
  primary: "text-brand-700 dark:text-primary",
  success: "text-green-800 dark:text-success",
  warning: "text-amber-800 dark:text-warning",
  danger: "text-red-700 dark:text-red-400",
  info: "text-sky-800 dark:text-info"
};
var SFONDI = {
  neutral: "bg-muted",
  primary: "bg-primary/15",
  success: "bg-success/15",
  warning: "bg-warning/15",
  danger: "bg-destructive/15",
  info: "bg-info/15"
};
var TINTE = Object.fromEntries(
  Object.keys(SFONDI).map((k) => [k, `${SFONDI[k]} ${TESTO[k]}`])
);

// src/organisms/Toast.jsx
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
var ToastContext = createContext(null);
var TONI = {
  success: {
    Icona: CheckCircle2,
    accent: "border-l-success",
    icon: TESTO.success
  },
  danger: {
    Icona: XCircle,
    accent: "border-l-destructive",
    icon: TESTO.danger
  },
  warning: {
    Icona: AlertTriangle,
    accent: "border-l-warning",
    icon: TESTO.warning
  },
  info: { Icona: Info, accent: "border-l-info", icon: TESTO.info }
};
function ToastItem({ t, onDismiss }) {
  const s = TONI[t.tone] ?? TONI.info;
  return /* @__PURE__ */ jsxs2(
    "div",
    {
      className: cn(
        "pointer-events-auto flex w-[360px] max-w-[calc(100vw-2rem)] items-start gap-3 rounded-lg border border-l-4 border-border bg-card p-3 text-card-foreground shadow-lg animate-slide-in",
        s.accent
      ),
      children: [
        /* @__PURE__ */ jsx3(s.Icona, { className: cn("mt-0.5 h-5 w-5 shrink-0", s.icon), "aria-hidden": true }),
        /* @__PURE__ */ jsxs2("div", { className: "min-w-0 flex-1 text-sm", children: [
          /* @__PURE__ */ jsx3("p", { className: "font-semibold", children: t.title }),
          t.description && /* @__PURE__ */ jsx3("p", { className: "mt-0.5 text-muted-foreground", children: t.description })
        ] }),
        /* @__PURE__ */ jsx3(
          IconButton_default,
          {
            icon: X,
            label: "Chiudi notifica",
            size: "sm",
            onClick: () => onDismiss(t.id),
            className: "-my-1 -mr-1 shrink-0"
          }
        )
      ]
    }
  );
}
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(/* @__PURE__ */ new Map());
  const seq = useRef(0);
  const dismiss = useCallback((id) => {
    setToasts((l) => l.filter((t) => t.id !== id));
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
  }, []);
  const toast = useCallback(
    ({ title, description, tone = "success", duration = 4e3 }) => {
      const id = ++seq.current;
      setToasts((l) => [...l, { id, title, description, tone }]);
      if (duration > 0) {
        timers.current.set(
          id,
          setTimeout(() => dismiss(id), duration)
        );
      }
      return id;
    },
    [dismiss]
  );
  useEffect(() => {
    const attivi = timers.current;
    return () => {
      attivi.forEach(clearTimeout);
      attivi.clear();
    };
  }, []);
  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);
  const urgenti = toasts.filter((t) => t.tone === "danger");
  const altri = toasts.filter((t) => t.tone !== "danger");
  return /* @__PURE__ */ jsxs2(ToastContext.Provider, { value, children: [
    children,
    /* @__PURE__ */ jsxs2("div", { className: "pointer-events-none fixed right-4 top-4 z-[60] flex flex-col", children: [
      /* @__PURE__ */ jsx3("div", { "aria-live": "assertive", className: "flex flex-col gap-2", children: urgenti.map((t) => /* @__PURE__ */ jsx3(ToastItem, { t, onDismiss: dismiss }, t.id)) }),
      /* @__PURE__ */ jsx3(
        "div",
        {
          "aria-live": "polite",
          className: cn(
            "flex flex-col gap-2",
            urgenti.length > 0 && altri.length > 0 && "mt-2"
          ),
          children: altri.map((t) => /* @__PURE__ */ jsx3(ToastItem, { t, onDismiss: dismiss }, t.id))
        }
      )
    ] })
  ] });
}
function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

// src/segnalazioni/maschera.js
var MASCHERA = "\u2022\u2022\u2022";
var PRIVATO = '[data-segnala-privato], input[type="password"]';
var IGNORA = "[data-segnala-ignora]";
var NODO_ELEMENTO = 2;
var NODO_TESTO = 3;
var EVENTO_FULL_SNAPSHOT = 2;
var EVENTO_INCREMENTALE = 3;
var SORGENTE_MUTAZIONE = 0;
var SORGENTE_INPUT = 5;
var TAG_CODICE = /* @__PURE__ */ new Set(["style", "script", "noscript"]);
var pieno = (v) => typeof v === "string" && v.trim() !== "";
var maschera = (v) => pieno(v) ? MASCHERA : v;
function privatoDaAttributi(tag, attributi = {}) {
  if (Object.prototype.hasOwnProperty.call(attributi, "data-segnala-privato"))
    return true;
  return tag === "input" && String(attributi.type ?? "").toLowerCase() === "password";
}
function mascheraEventi(eventi, { tutto = true } = {}) {
  const copia = JSON.parse(JSON.stringify(eventi ?? []));
  const privati = /* @__PURE__ */ new Set();
  const testiPrivati = /* @__PURE__ */ new Set();
  const testiCodice = /* @__PURE__ */ new Set();
  const visita = (nodo, ereditaPrivato, dentroCodice) => {
    if (!nodo || typeof nodo !== "object") return;
    if (nodo.type === NODO_ELEMENTO) {
      const tag = String(nodo.tagName ?? "").toLowerCase();
      const attributi = nodo.attributes ?? {};
      const privato = ereditaPrivato || privatoDaAttributi(tag, attributi);
      if (privato) privati.add(nodo.id);
      if ((tutto || privato) && "value" in attributi)
        attributi.value = maschera(attributi.value);
      const codice = dentroCodice || TAG_CODICE.has(tag);
      for (const figlio of nodo.childNodes ?? [])
        visita(figlio, privato, codice);
      return;
    }
    if (nodo.type === NODO_TESTO) {
      if (dentroCodice || nodo.isStyle) {
        testiCodice.add(nodo.id);
        return;
      }
      if (ereditaPrivato) testiPrivati.add(nodo.id);
      if (tutto || ereditaPrivato)
        nodo.textContent = maschera(nodo.textContent);
      return;
    }
    for (const figlio of nodo.childNodes ?? [])
      visita(figlio, ereditaPrivato, dentroCodice);
  };
  for (const evento of copia) {
    if (evento?.type === EVENTO_FULL_SNAPSHOT) {
      visita(evento.data?.node, false, false);
      continue;
    }
    if (evento?.type !== EVENTO_INCREMENTALE) continue;
    const dati = evento.data ?? {};
    if (dati.source === SORGENTE_INPUT) {
      if (tutto || privati.has(dati.id)) dati.text = maschera(dati.text);
      continue;
    }
    if (dati.source !== SORGENTE_MUTAZIONE) continue;
    for (const aggiunta of dati.adds ?? [])
      visita(aggiunta.node, privati.has(aggiunta.parentId), false);
    for (const testo of dati.texts ?? []) {
      if (testiCodice.has(testo.id)) continue;
      if (tutto || testiPrivati.has(testo.id))
        testo.value = maschera(testo.value);
    }
    for (const modifica of dati.attributes ?? []) {
      const attributi = modifica.attributes ?? {};
      if (typeof attributi["data-segnala-privato"] === "string")
        privati.add(modifica.id);
      if ((tutto || privati.has(modifica.id)) && "value" in attributi)
        attributi.value = maschera(attributi.value);
    }
  }
  return copia;
}
var CAMPI = /* @__PURE__ */ new Set(["input", "textarea", "select"]);
function mascheraDom(radice, { tutto = true } = {}) {
  const visita = (nodo, ereditaPrivato) => {
    if (nodo.nodeType === 3) {
      if ((tutto || ereditaPrivato) && pieno(nodo.nodeValue))
        nodo.nodeValue = MASCHERA;
      return;
    }
    if (nodo.nodeType !== 1) return;
    const tag = nodo.tagName.toLowerCase();
    if (TAG_CODICE.has(tag)) return;
    const privato = ereditaPrivato || typeof nodo.matches === "function" && nodo.matches(PRIVATO);
    if (CAMPI.has(tag) && (tutto || privato)) {
      if (tag === "textarea") nodo.textContent = MASCHERA;
      if (tag !== "select") {
        try {
          nodo.value = MASCHERA;
        } catch {
        }
        nodo.setAttribute("value", MASCHERA);
      }
    }
    for (const figlio of Array.from(nodo.childNodes)) visita(figlio, privato);
  };
  visita(radice, false);
}
function mascheraAzioni(azioni) {
  return (azioni ?? []).map((a) => {
    if (a.tipo === "click" && a.fonte !== "data-segnala")
      return { ...a, elemento: maschera(a.elemento) };
    if (a.tipo === "errore" && a.messaggio)
      return { ...a, messaggio: maschera(a.messaggio) };
    return { ...a };
  });
}
function mascheraElemento(elemento) {
  if (!elemento || !elemento.testo) return elemento ?? null;
  return { ...elemento, testo: maschera(elemento.testo) };
}

// src/segnalazioni/cattura.js
var MAX_BYTE = 3.5 * 1024 * 1024;
var SCROLL = "data-segnala-scroll";
var escluso = (nodo) => !(nodo.nodeType === 1 && typeof nodo.matches === "function" && nodo.matches(IGNORA));
function marcaScroll(radice) {
  const marcati = [];
  const marca = (el, x, y) => {
    el.setAttribute(SCROLL, `${x},${y}`);
    marcati.push(el);
  };
  for (const el of [radice, ...radice.querySelectorAll("*")]) {
    if (el.scrollTop || el.scrollLeft) marca(el, el.scrollLeft, el.scrollTop);
  }
  if (radice === document.body && (window.scrollX || window.scrollY))
    marca(radice, window.scrollX, window.scrollY);
  return () => marcati.forEach((el) => el.removeAttribute(SCROLL));
}
function applicaScroll(clone) {
  const sel = `[${SCROLL}]`;
  const nodi = [
    ...clone.matches?.(sel) ? [clone] : [],
    ...clone.querySelectorAll?.(sel) ?? []
  ];
  for (const nodo of nodi) {
    const [x, y] = nodo.getAttribute(SCROLL).split(",").map(Number);
    nodo.removeAttribute(SCROLL);
    nodo.style.overflow = "hidden";
    for (const figlio of Array.from(nodo.children))
      figlio.style.translate = `${-x}px ${-y}px`;
  }
}
async function catturaSchermata(nodo = document.body) {
  const { domToBlob } = await import("modern-screenshot");
  const vista = nodo === document.body ? { width: window.innerWidth, height: window.innerHeight } : {};
  const scatta = async (tutto) => {
    const opzioni = (scale) => ({
      ...vista,
      type: "image/png",
      scale,
      filter: escluso,
      onCloneNode: (clone) => {
        applicaScroll(clone);
        mascheraDom(clone, { tutto });
      }
    });
    const blob = await domToBlob(nodo, opzioni(1));
    return blob.size <= MAX_BYTE ? blob : domToBlob(nodo, opzioni(0.5));
  };
  const smarca = marcaScroll(nodo);
  try {
    const mascherato = await scatta(true);
    const privato = await scatta(false);
    return { mascherato, privato };
  } finally {
    smarca();
  }
}

// src/segnalazioni/contesto.js
import { createContext as createContext2, useContext as useContext2 } from "react";
var SegnalazioniContext = createContext2(null);
var SPENTO = Object.freeze({
  abilitato: false,
  apri: () => {
  },
  stato: "inattivo"
});
function useSegnalazioni() {
  return useContext2(SegnalazioniContext) ?? SPENTO;
}

// src/segnalazioni/useRegistrazione.js
import { useEffect as useEffect2, useRef as useRef2 } from "react";
var EVENTO_META = 4;
var CHECKOUT_MS = 1e4;
var TUTTI_GLI_INPUT = Object.fromEntries(
  [
    "color",
    "date",
    "datetime-local",
    "email",
    "month",
    "number",
    "range",
    "search",
    "tel",
    "text",
    "time",
    "url",
    "week",
    "textarea",
    "select",
    "password"
  ].map((t) => [t, true])
);
var mascheraPrivati = (testo, elemento) => elemento?.type === "password" || elemento?.closest?.(PRIVATO) ? MASCHERA : testo;
function creaFinestraVideo({ durataMs }) {
  let eventi = [];
  const pota = (adesso) => {
    const limite = adesso - durataMs;
    let inizio = 0;
    eventi.forEach((e, i) => {
      if (e.type === EVENTO_META && e.timestamp <= limite) inizio = i;
    });
    if (inizio > 0) eventi = eventi.slice(inizio);
  };
  return {
    aggiungi(evento) {
      eventi.push(evento);
      if (evento.type === EVENTO_META) pota(evento.timestamp);
    },
    estrai(adesso = Date.now()) {
      pota(adesso);
      return eventi.slice();
    }
  };
}
var misura = (valore) => new Blob([JSON.stringify(valore)]).size;
function troncaVideo(eventi, maxByte) {
  let resto = eventi;
  while (resto.length > 0 && misura(resto) > maxByte) {
    const prossimo = resto.findIndex((e, i) => i > 0 && e.type === EVENTO_META);
    if (prossimo === -1) return null;
    resto = resto.slice(prossimo);
  }
  return resto.length > 0 ? resto : null;
}
function useRegistrazione(attivo, durataSec) {
  const finestra = useRef2(null);
  useEffect2(() => {
    if (!attivo || typeof window === "undefined") return void 0;
    let ferma = null;
    let annullato = false;
    const f = creaFinestraVideo({ durataMs: durataSec * 1e3 });
    finestra.current = f;
    import("rrweb").then(({ record }) => {
      if (annullato) return;
      ferma = record({
        emit: (evento) => f.aggiungi(evento),
        checkoutEveryNms: CHECKOUT_MS,
        blockSelector: IGNORA,
        maskTextSelector: PRIVATO,
        maskInputOptions: TUTTI_GLI_INPUT,
        maskInputFn: mascheraPrivati
      });
    }).catch(() => {
    });
    return () => {
      annullato = true;
      ferma?.();
      finestra.current = null;
    };
  }, [attivo, durataSec]);
  const api = useRef2({ eventi: () => finestra.current?.estrai() ?? [] });
  return api.current;
}

// src/segnalazioni/invio.js
var MAX_ALLEGATO = 4 * 1024 * 1024;
var MAX_TOTALE = 5 * 1024 * 1024;
var MARGINE = 64 * 1024;
var MESSAGGI = {
  riprova: "Non sono riuscito a inviarla. Riprova.",
  non_disponibile: "Segnalazione non disponibile al momento",
  troppo_grande: "Gli allegati sono troppo grandi: togli il video e invia di nuovo.",
  sessione: "La sessione \xE8 scaduta: accedi di nuovo e invia la segnalazione.",
  non_valida: "Segnalazione non valida"
};
function nuovoId() {
  const c = globalThis.crypto;
  if (typeof c?.randomUUID === "function") return c.randomUUID();
  const b = new Uint8Array(16);
  if (typeof c?.getRandomValues === "function") c.getRandomValues(b);
  else for (let i = 0; i < 16; i += 1) b[i] = Math.floor(Math.random() * 256);
  b[6] = b[6] & 15 | 64;
  b[8] = b[8] & 63 | 128;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}
var jsonBlob = (valore) => new Blob([JSON.stringify(valore)], { type: "application/json" });
function urlPagina(href, maschera2) {
  if (!maschera2) return href;
  try {
    const u = new URL(href);
    return `${u.origin}${u.pathname}`;
  } catch {
    return String(href).split(/[?#]/)[0];
  }
}
function componiInvio(bozza, { commento, video, maschera: maschera2 }) {
  const form = new FormData();
  form.append(
    "report",
    JSON.stringify({
      report_id: bozza.segnalazione_id,
      element: maschera2 ? mascheraElemento(bozza.elemento) : bozza.elemento ?? null,
      comment: commento.trim(),
      page_url: urlPagina(bozza.page_url ?? "", maschera2)
    })
  );
  const schermata = bozza.catture ? maschera2 ? bozza.catture.mascherato : bozza.catture.privato : null;
  const azioni = jsonBlob(
    maschera2 ? mascheraAzioni(bozza.azioni) : bozza.azioni ?? []
  );
  let usato = azioni.size + MARGINE;
  if (schermata) {
    form.append(
      "screenshot",
      new Blob([schermata], { type: "image/png" }),
      "screenshot.png"
    );
    usato += schermata.size;
  }
  form.append("azioni", azioni, "azioni.json");
  if (video && (bozza.eventi?.length ?? 0) >= 2) {
    const eventi = troncaVideo(
      mascheraEventi(bozza.eventi, { tutto: maschera2 }),
      Math.min(MAX_ALLEGATO - MARGINE, MAX_TOTALE - usato)
    );
    if (eventi) form.append("video", jsonBlob(eventi), "video.rrweb.json");
  }
  return form;
}
async function leggiJson(risposta) {
  try {
    return await risposta.json();
  } catch {
    return {};
  }
}
async function inviaSegnalazione({ endpoint, fetchImpl, form }) {
  let risposta;
  try {
    risposta = await fetchImpl(endpoint, {
      method: "POST",
      body: form,
      credentials: "include"
    });
  } catch {
    return { esito: "riprova", messaggio: MESSAGGI.riprova };
  }
  const corpo = await leggiJson(risposta);
  const s = risposta.status;
  if (s >= 200 && s < 300)
    return {
      esito: "inviata",
      ticket_id: corpo.ticket_id,
      url: corpo.url,
      duplicato: Boolean(corpo.duplicato)
    };
  if (s === 503 && corpo.riprova === false)
    return { esito: "non_disponibile", messaggio: MESSAGGI.non_disponibile };
  if (s === 413) return { esito: "errore", messaggio: MESSAGGI.troppo_grande };
  if (s === 401 || s === 403)
    return { esito: "errore", messaggio: MESSAGGI.sessione };
  if (s === 422)
    return {
      esito: "errore",
      messaggio: typeof corpo.detail === "string" ? corpo.detail : MESSAGGI.non_valida
    };
  if (s === 404 || s === 405)
    return { esito: "non_disponibile", messaggio: MESSAGGI.non_disponibile };
  return { esito: "riprova", messaggio: MESSAGGI.riprova };
}

// src/segnalazioni/ModaleSegnalazione.jsx
import { useEffect as useEffect4, useMemo as useMemo2, useRef as useRef4, useState as useState2 } from "react";
import { Bug, ImageOff, MousePointerClick, RotateCw, Send } from "lucide-react";

// src/atoms/Textarea.jsx
import { forwardRef as forwardRef4 } from "react";

// src/atoms/Input.jsx
import { forwardRef as forwardRef3 } from "react";
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
var CAMPO = "w-full rounded-lg border bg-background text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50";
var campoClasses = (invalid) => cn(
  CAMPO,
  invalid ? "border-destructive focus-visible:ring-destructive/40" : "border-input hover:border-ring/60 focus-visible:border-ring focus-visible:ring-ring/40"
);
var Input = forwardRef3(function Input2({ invalid, icon: Icon, className, ...props }, ref) {
  const input = /* @__PURE__ */ jsx4(
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
    /* @__PURE__ */ jsx4(
      Icon,
      {
        className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",
        "aria-hidden": true
      }
    ),
    input
  ] });
});

// src/atoms/Textarea.jsx
import { jsx as jsx5 } from "react/jsx-runtime";
var Textarea = forwardRef4(function Textarea2({ invalid, className, rows = 3, ...props }, ref) {
  return /* @__PURE__ */ jsx5(
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

// src/molecules/Checkbox.jsx
import { useId } from "react";
import { Check, Minus } from "lucide-react";
import { jsx as jsx6, jsxs as jsxs4 } from "react/jsx-runtime";
function Checkbox({
  checked,
  indeterminate,
  onChange,
  label,
  disabled,
  className,
  id,
  ...rest
}) {
  const uid = useId();
  const on = indeterminate || checked;
  const cambia = () => {
    if (!disabled) onChange?.(indeterminate ? true : !checked);
  };
  return /* @__PURE__ */ jsxs4("div", { className: cn("flex items-center gap-2", className), children: [
    /* @__PURE__ */ jsx6(
      "button",
      {
        "aria-labelledby": label ? uid : void 0,
        ...rest,
        id,
        type: "button",
        role: "checkbox",
        "aria-checked": indeterminate ? "mixed" : !!checked,
        disabled,
        onClick: cambia,
        className: cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "active:scale-90 disabled:cursor-not-allowed disabled:opacity-50",
          on ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90" : "border-input bg-background hover:border-ring/60"
        ),
        children: indeterminate ? /* @__PURE__ */ jsx6(Minus, { className: "h-3 w-3", strokeWidth: 3, "aria-hidden": true }) : checked && /* @__PURE__ */ jsx6(Check, { className: "h-3 w-3", strokeWidth: 3, "aria-hidden": true })
      }
    ),
    label && /* @__PURE__ */ jsx6(
      "span",
      {
        id: uid,
        onClick: cambia,
        "data-no-row-click": true,
        className: cn(
          "select-none text-sm text-foreground",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        ),
        children: label
      }
    )
  ] });
}

// src/molecules/Field.jsx
import { Children, cloneElement, isValidElement, useId as useId2 } from "react";
import { jsx as jsx7, jsxs as jsxs5 } from "react/jsx-runtime";
function Field({
  label,
  hint,
  error,
  required,
  id,
  className,
  children
}) {
  const auto = useId2();
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
  return /* @__PURE__ */ jsxs5("div", { className: cn("flex flex-col gap-1.5", className), children: [
    label && /* @__PURE__ */ jsxs5(
      "label",
      {
        htmlFor: fieldId,
        className: "text-sm font-medium text-foreground",
        children: [
          label,
          required && /* @__PURE__ */ jsx7("span", { className: cn("ml-0.5", TESTO.danger), "aria-hidden": true, children: "*" })
        ]
      }
    ),
    control,
    hint && !error && /* @__PURE__ */ jsx7("p", { id: hintId, className: "text-xs text-muted-foreground", children: hint }),
    error && /* @__PURE__ */ jsx7("p", { id: errorId, role: "alert", className: cn("text-xs", TESTO.danger), children: error })
  ] });
}

// src/organisms/Alert.jsx
import { AlertTriangle as AlertTriangle2, CheckCircle2 as CheckCircle22, Info as Info2, X as X2, XCircle as XCircle2 } from "lucide-react";
import { jsx as jsx8, jsxs as jsxs6 } from "react/jsx-runtime";
var TONI2 = {
  info: {
    box: "border-info/30 bg-info/10 text-sky-900 dark:text-sky-100",
    icon: "text-info",
    Icona: Info2
  },
  success: {
    box: "border-success/30 bg-success/10 text-green-900 dark:text-green-100",
    icon: "text-success",
    Icona: CheckCircle22
  },
  warning: {
    box: "border-warning/40 bg-warning/10 text-amber-900 dark:text-amber-100",
    icon: "text-warning",
    Icona: AlertTriangle2
  },
  danger: {
    box: "border-destructive/30 bg-destructive/10 text-red-900 dark:text-red-100",
    icon: "text-destructive",
    Icona: XCircle2
  }
};
function Alert({
  tone = "info",
  title,
  children,
  onClose,
  className
}) {
  const t = TONI2[tone] ?? TONI2.info;
  const urgente = tone === "danger" || tone === "warning";
  return /* @__PURE__ */ jsxs6(
    "div",
    {
      role: urgente ? "alert" : "status",
      className: cn(
        "flex gap-3 rounded-lg border p-4 text-sm",
        t.box,
        className
      ),
      children: [
        /* @__PURE__ */ jsx8(t.Icona, { className: cn("mt-0.5 h-5 w-5 shrink-0", t.icon), "aria-hidden": true }),
        /* @__PURE__ */ jsxs6("div", { className: "min-w-0 flex-1", children: [
          title && /* @__PURE__ */ jsx8("p", { className: "font-semibold", children: title }),
          children && /* @__PURE__ */ jsx8("div", { className: cn(title && "mt-0.5"), children })
        ] }),
        onClose && /* @__PURE__ */ jsx8(
          IconButton_default,
          {
            icon: X2,
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

// src/organisms/Dialog.jsx
import { useEffect as useEffect3, useId as useId3, useRef as useRef3 } from "react";
import { createPortal } from "react-dom";
import { X as X3 } from "lucide-react";
import { jsx as jsx9, jsxs as jsxs7 } from "react/jsx-runtime";
var SIZES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-4xl"
};
var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
var pila = [];
var focusables = (root) => Array.from(root.querySelectorAll(FOCUSABLE)).filter(
  (el) => !el.hasAttribute("hidden") && el.getAttribute("aria-hidden") !== "true"
);
function Dialog({
  open,
  onClose,
  title,
  description,
  icon: Icon,
  size = "sm",
  footer,
  children,
  closeOnBackdrop = true,
  closeDisabled = false,
  className
}) {
  const titleId = useId3();
  const descId = useId3();
  const panelRef = useRef3(null);
  const onCloseRef = useRef3(onClose);
  onCloseRef.current = onClose;
  useEffect3(() => {
    if (!open) return void 0;
    const opener = document.activeElement;
    const token = {};
    pila.push(token);
    const panel = panelRef.current;
    const iniziale = panel.querySelector("[data-autofocus]") || focusables(panel)[0] || panel;
    iniziale.focus();
    const onKey = (e) => {
      if (pila[pila.length - 1] !== token) return;
      if (e.key === "Escape") {
        if (e.defaultPrevented) return;
        e.stopPropagation();
        onCloseRef.current?.();
        return;
      }
      if (e.key !== "Tab") return;
      const lista = focusables(panel);
      if (lista.length === 0) {
        e.preventDefault();
        panel.focus();
        return;
      }
      const primo = lista[0];
      const ultimo = lista[lista.length - 1];
      const attivo = document.activeElement;
      if (!panel.contains(attivo)) {
        e.preventDefault();
        primo.focus();
      } else if (e.shiftKey && attivo === primo) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && attivo === ultimo) {
        e.preventDefault();
        primo.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      const i = pila.indexOf(token);
      if (i !== -1) pila.splice(i, 1);
      if (opener && typeof opener.focus === "function") opener.focus();
    };
  }, [open]);
  if (!open) return null;
  return createPortal(
    /* @__PURE__ */ jsxs7("div", { className: "fixed inset-0 z-50 overflow-y-auto", children: [
      /* @__PURE__ */ jsx9(
        "div",
        {
          "data-testid": "dialog-backdrop",
          className: "fixed inset-0 bg-black/50 backdrop-blur-sm",
          onClick: closeOnBackdrop ? () => onClose?.() : void 0
        }
      ),
      /* @__PURE__ */ jsx9("div", { className: "flex min-h-full items-start justify-center p-3 sm:items-center sm:p-6", children: /* @__PURE__ */ jsxs7(
        "div",
        {
          ref: panelRef,
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": titleId,
          "aria-describedby": description ? descId : void 0,
          tabIndex: -1,
          className: cn(
            "relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-xl bg-card text-card-foreground shadow-2xl ring-1 ring-black/5 animate-fade-in focus:outline-none dark:ring-white/10",
            SIZES[size] ?? SIZES.sm,
            className
          ),
          children: [
            /* @__PURE__ */ jsxs7("div", { className: "flex items-start gap-3 border-b border-border px-6 py-4", children: [
              Icon && /* @__PURE__ */ jsx9("div", { className: "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15", children: /* @__PURE__ */ jsx9(Icon, { className: "h-5 w-5 text-primary", "aria-hidden": true }) }),
              /* @__PURE__ */ jsxs7("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsx9(
                  "h2",
                  {
                    id: titleId,
                    className: "text-base font-semibold leading-tight text-foreground sm:text-lg",
                    children: title
                  }
                ),
                description && /* @__PURE__ */ jsx9("p", { id: descId, className: "mt-0.5 text-sm text-muted-foreground", children: description })
              ] }),
              /* @__PURE__ */ jsx9(
                IconButton_default,
                {
                  icon: X3,
                  label: "Chiudi",
                  size: "sm",
                  onClick: () => onClose?.(),
                  disabled: closeDisabled,
                  className: "-mr-1 -mt-1 shrink-0"
                }
              )
            ] }),
            /* @__PURE__ */ jsx9("div", { className: "flex-1 overflow-y-auto px-6 py-5", children }),
            footer && /* @__PURE__ */ jsx9("div", { className: "flex items-center justify-end gap-2 border-t border-border bg-muted/40 px-6 py-3", children: footer })
          ]
        }
      ) })
    ] }),
    document.body
  );
}

// src/segnalazioni/ModaleSegnalazione.jsx
import { Fragment, jsx as jsx10, jsxs as jsxs8 } from "react/jsx-runtime";
var MAX_COMMENTO = 5e3;
function nomeElemento(elemento) {
  if (!elemento) return null;
  return elemento.nome || elemento.id || elemento.testo || elemento.selettore || null;
}
function useAnteprima(blob) {
  const url = useMemo2(() => {
    if (!blob || typeof URL?.createObjectURL !== "function") return null;
    return URL.createObjectURL(blob);
  }, [blob]);
  useEffect4(
    () => () => {
      if (url) URL.revokeObjectURL?.(url);
    },
    [url]
  );
  return url;
}
function ModaleSegnalazione({
  bozza,
  endpoint,
  fetchImpl,
  onChiudi
}) {
  const { toast } = useToast();
  const [commento, setCommento] = useState2("");
  const [video, setVideo] = useState2(true);
  const [maschera2, setMaschera] = useState2(true);
  const [esito, setEsito] = useState2({ stato: "pronto" });
  const inCorso = useRef4(false);
  const anteprima = useAnteprima(
    bozza.catture ? maschera2 ? bozza.catture.mascherato : bozza.catture.privato : null
  );
  const nome = nomeElemento(bozza.elemento);
  const vuoto = commento.trim() === "";
  const bloccato = esito.stato === "non_disponibile";
  const invia = async () => {
    if (inCorso.current || vuoto || bloccato) return;
    inCorso.current = true;
    setEsito({ stato: "invio" });
    const form = componiInvio(bozza, { commento, video, maschera: maschera2 });
    const r2 = await inviaSegnalazione({ endpoint, fetchImpl, form });
    inCorso.current = false;
    if (r2.esito === "inviata") {
      toast({
        title: `Segnalazione #${r2.ticket_id} inviata`,
        description: r2.url ? /* @__PURE__ */ jsx10(
          "a",
          {
            href: r2.url,
            target: "_blank",
            rel: "noreferrer",
            className: "font-medium text-primary underline-offset-4 hover:underline",
            children: "Apri il ticket"
          }
        ) : void 0,
        tone: "success",
        duration: 8e3
      });
      onChiudi();
      return;
    }
    setEsito({ stato: r2.esito, messaggio: r2.messaggio });
  };
  const invio = esito.stato === "invio";
  const footer = /* @__PURE__ */ jsxs8(Fragment, { children: [
    /* @__PURE__ */ jsx10(Button_default, { variant: "outline", onClick: onChiudi, disabled: invio, children: "Annulla" }),
    esito.stato === "riprova" ? /* @__PURE__ */ jsx10(Button_default, { icon: RotateCw, onClick: invia, disabled: vuoto, children: "Riprova" }) : /* @__PURE__ */ jsx10(
      Button_default,
      {
        icon: Send,
        onClick: invia,
        loading: invio,
        disabled: vuoto || bloccato,
        children: "Invia"
      }
    )
  ] });
  return /* @__PURE__ */ jsx10(
    Dialog,
    {
      open: true,
      onClose: onChiudi,
      closeDisabled: invio,
      closeOnBackdrop: false,
      title: "Segnala un problema",
      description: "Arriva a chi segue il portale, con le ultime azioni e uno screenshot della pagina.",
      icon: Bug,
      size: "lg",
      footer,
      children: /* @__PURE__ */ jsxs8("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxs8("div", { className: "flex items-start gap-3 rounded-lg border border-border bg-muted/40 px-3 py-2.5", children: [
          /* @__PURE__ */ jsx10(
            MousePointerClick,
            {
              className: "mt-0.5 h-4 w-4 shrink-0 text-primary",
              "aria-hidden": true
            }
          ),
          /* @__PURE__ */ jsxs8("div", { className: "min-w-0 text-sm", children: [
            /* @__PURE__ */ jsx10("p", { className: "text-xs font-medium uppercase tracking-wide text-muted-foreground", children: "Elemento" }),
            /* @__PURE__ */ jsx10(
              "p",
              {
                className: cn(
                  "truncate",
                  nome ? "font-medium text-foreground" : "text-muted-foreground"
                ),
                children: nome ?? "Altro (nessun elemento scelto)"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx10(
          Field,
          {
            label: "Cosa non va?",
            required: true,
            hint: `${commento.length}/${MAX_COMMENTO} \xB7 cosa ti aspettavi e cosa vedi invece`,
            children: /* @__PURE__ */ jsx10(
              Textarea_default,
              {
                "data-autofocus": true,
                rows: 4,
                maxLength: MAX_COMMENTO,
                value: commento,
                onChange: (e) => setCommento(e.target.value),
                placeholder: "Es. il totale dei clienti attivi non torna con l'estrazione di ieri"
              }
            )
          }
        ),
        /* @__PURE__ */ jsxs8("div", { className: "space-y-2.5", children: [
          /* @__PURE__ */ jsx10(
            Checkbox,
            {
              checked: video,
              onChange: setVideo,
              label: "Allega il video delle ultime azioni"
            }
          ),
          /* @__PURE__ */ jsx10(
            Checkbox,
            {
              checked: maschera2,
              onChange: setMaschera,
              label: "Maschera i dati"
            }
          ),
          /* @__PURE__ */ jsx10("p", { className: "pl-6 text-xs text-muted-foreground", children: "Password e campi riservati sono sempre nascosti." })
        ] }),
        /* @__PURE__ */ jsxs8("figure", { className: "overflow-hidden rounded-lg border border-border bg-muted/30", children: [
          anteprima ? /* @__PURE__ */ jsx10(
            "img",
            {
              src: anteprima,
              alt: "Anteprima dello screenshot",
              className: "max-h-56 w-full object-contain object-top"
            }
          ) : /* @__PURE__ */ jsxs8("div", { className: "flex h-24 items-center justify-center gap-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsx10(ImageOff, { className: "h-4 w-4", "aria-hidden": true }),
            bozza.catture ? "Anteprima non disponibile" : "Screenshot non disponibile"
          ] }),
          /* @__PURE__ */ jsxs8("figcaption", { className: "border-t border-border px-3 py-1.5 text-xs text-muted-foreground", children: [
            "Screenshot",
            " ",
            maschera2 ? "con i dati mascherati" : "con i dati visibili"
          ] })
        ] }),
        (esito.stato === "riprova" || esito.stato === "non_disponibile" || esito.stato === "errore") && /* @__PURE__ */ jsx10(
          Alert,
          {
            tone: esito.stato === "non_disponibile" ? "warning" : "danger",
            children: esito.messaggio
          }
        )
      ] })
    }
  );
}

// src/segnalazioni/SelettoreElemento.jsx
import { useEffect as useEffect5, useState as useState3 } from "react";
import { createPortal as createPortal2 } from "react-dom";
import { Crosshair } from "lucide-react";

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

// src/segnalazioni/segnalaAttr.js
function segnalaAttr(descrittore) {
  if (!descrittore || typeof descrittore !== "object") return {};
  const { tipo, id, nome, contesto } = descrittore;
  const pulito = {};
  if (tipo !== void 0) pulito.tipo = tipo;
  if (id !== void 0) pulito.id = id;
  if (nome !== void 0) pulito.nome = nome;
  if (contesto !== void 0) pulito.contesto = contesto;
  return { "data-segnala": JSON.stringify(pulito) };
}
function leggiSegnala(valore) {
  if (!valore) return null;
  try {
    const letto = JSON.parse(valore);
    return letto && typeof letto === "object" && !Array.isArray(letto) ? letto : null;
  } catch {
    return null;
  }
}

// src/segnalazioni/SelettoreElemento.jsx
import { jsx as jsx12, jsxs as jsxs9 } from "react/jsx-runtime";
var MAX_TESTO = 200;
var MAX_LIVELLI = 8;
var CLASSE_SEMPLICE = /^[a-zA-Z][\w-]*$/;
var breve = (testo) => {
  const una = String(testo ?? "").replace(/\s+/g, " ").trim();
  return una.length <= MAX_TESTO ? una : `${una.slice(0, MAX_TESTO - 1)}\u2026`;
};
function passo(el) {
  const tag = el.tagName.toLowerCase();
  const classe = Array.from(el.classList).find((c) => CLASSE_SEMPLICE.test(c));
  let s = classe ? `${tag}.${classe}` : tag;
  const fratelli = el.parentElement ? Array.from(el.parentElement.children).filter(
    (f) => f.tagName === el.tagName
  ) : [];
  if (fratelli.length > 1) s += `:nth-of-type(${fratelli.indexOf(el) + 1})`;
  return s;
}
function selettoreBreve(el) {
  const doc = el.ownerDocument;
  const parti = [];
  let corrente = el;
  while (corrente && corrente.nodeType === 1 && parti.length < MAX_LIVELLI) {
    if (corrente.id && CLASSE_SEMPLICE.test(corrente.id)) {
      parti.unshift(`#${corrente.id}`);
    } else {
      parti.unshift(passo(corrente));
    }
    const s = parti.join(" > ");
    try {
      const trovati = doc.querySelectorAll(s);
      if (trovati.length === 1 && trovati[0] === el) return s;
    } catch {
    }
    if (corrente.tagName === "BODY") break;
    corrente = corrente.parentElement;
  }
  return parti.join(" > ");
}
function descriviElemento(el) {
  const area = el.closest?.("[data-segnala]");
  const letto = area ? leggiSegnala(area.getAttribute("data-segnala")) : null;
  if (letto) return { ...letto };
  const r2 = el.getBoundingClientRect();
  const privato = Boolean(el.closest?.(PRIVATO));
  return {
    testo: privato ? MASCHERA : breve(el.innerText || el.textContent),
    selettore: selettoreBreve(el),
    rect: {
      x: Math.round(r2.x),
      y: Math.round(r2.y),
      width: Math.round(r2.width),
      height: Math.round(r2.height)
    }
  };
}
var bersaglioDi = (el) => el.closest("[data-segnala]") || el;
var elementoDi = (nodo) => nodo?.nodeType === 1 ? nodo : nodo?.parentElement ?? null;
function SelettoreElemento({ onScegli, onAnnulla }) {
  const [riquadro, setRiquadro] = useState3(null);
  useEffect5(() => {
    const radice = document.documentElement;
    const cursore = radice.style.cursor;
    radice.style.cursor = "crosshair";
    const nostro = (el) => !el || Boolean(el.closest(IGNORA));
    const muovi = (e) => {
      const el = elementoDi(e.target);
      if (nostro(el)) {
        setRiquadro(null);
        return;
      }
      const r2 = bersaglioDi(el).getBoundingClientRect();
      setRiquadro({
        top: r2.top,
        left: r2.left,
        width: r2.width,
        height: r2.height
      });
    };
    const blocca = (e) => {
      if (nostro(elementoDi(e.target))) return;
      e.preventDefault();
      e.stopPropagation();
    };
    const clicca = (e) => {
      const el = elementoDi(e.target);
      if (nostro(el)) return;
      e.preventDefault();
      e.stopPropagation();
      onScegli(descriviElemento(el));
    };
    const tasto = (e) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      e.stopPropagation();
      onAnnulla();
    };
    const ascoltatori = [
      ["mousemove", muovi],
      ["pointerdown", blocca],
      ["mousedown", blocca],
      ["pointerup", blocca],
      ["mouseup", blocca],
      ["click", clicca],
      ["keydown", tasto]
    ];
    ascoltatori.forEach(([ev, fn]) => window.addEventListener(ev, fn, true));
    return () => {
      ascoltatori.forEach(
        ([ev, fn]) => window.removeEventListener(ev, fn, true)
      );
      radice.style.cursor = cursore;
    };
  }, [onScegli, onAnnulla]);
  return createPortal2(
    /* @__PURE__ */ jsxs9("div", { "data-segnala-ignora": true, children: [
      riquadro && /* @__PURE__ */ jsx12(
        "div",
        {
          "aria-hidden": true,
          className: "pointer-events-none fixed z-[70] rounded-md bg-primary/10 ring-2 ring-primary transition-all duration-75",
          style: {
            top: riquadro.top - 2,
            left: riquadro.left - 2,
            width: riquadro.width + 4,
            height: riquadro.height + 4
          }
        }
      ),
      /* @__PURE__ */ jsxs9(
        "div",
        {
          role: "toolbar",
          "aria-label": "Scegli l'elemento da segnalare",
          className: "fixed bottom-6 left-1/2 z-[71] flex max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-wrap items-center gap-3 rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-card-foreground shadow-2xl ring-1 ring-black/5 animate-fade-in dark:ring-white/10",
          children: [
            /* @__PURE__ */ jsxs9("span", { className: "flex items-center gap-2 font-medium", children: [
              /* @__PURE__ */ jsx12(Crosshair, { className: "h-4 w-4 text-primary", "aria-hidden": true }),
              "Clicca l'elemento che non va"
            ] }),
            /* @__PURE__ */ jsxs9("span", { className: "hidden items-center gap-1 text-xs text-muted-foreground sm:flex", children: [
              /* @__PURE__ */ jsx12(Kbd, { children: "Esc" }),
              " per annullare"
            ] }),
            /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx12(Button_default, { variant: "secondary", size: "sm", onClick: () => onScegli(null), children: "Segnala senza elemento" }),
              /* @__PURE__ */ jsx12(Button_default, { variant: "ghost", size: "sm", onClick: onAnnulla, children: "Annulla" })
            ] })
          ]
        }
      )
    ] }),
    document.body
  );
}

// src/segnalazioni/useRegistroAzioni.js
import { useEffect as useEffect6, useRef as useRef5 } from "react";
var MAX_AZIONI = 200;
var MAX_MESSAGGIO = 500;
var MAX_ETICHETTA = 80;
var CONTROLLI = 'button, a, input, textarea, select, label, [role="button"], [role="tab"], [role="menuitem"], [role="checkbox"], [role="switch"], [role="option"], [role="link"]';
var breve2 = (testo, max) => {
  const una = String(testo ?? "").replace(/\s+/g, " ").trim();
  return una.length <= max ? una : `${una.slice(0, max - 1)}\u2026`;
};
function urlPulito(url, base) {
  try {
    const u = new URL(String(url), base);
    const stessa = base && u.origin === new URL(base).origin;
    return stessa ? u.pathname : `${u.origin}${u.pathname}`;
  } catch {
    return String(url).split(/[?#]/)[0];
  }
}
function testoMessaggio(argomenti) {
  return breve2(
    argomenti.map((a) => {
      if (a instanceof Error) return a.message;
      if (typeof a === "string") return a;
      try {
        return JSON.stringify(a);
      } catch {
        return String(a);
      }
    }).join(" "),
    MAX_MESSAGGIO
  );
}
function descriviClick(bersaglio) {
  const controllo = bersaglio.closest(CONTROLLI);
  const area = bersaglio.closest("[data-segnala]");
  const segnala = area ? leggiSegnala(area.getAttribute("data-segnala")) : null;
  const nomeArea = segnala ? segnala.nome || segnala.id : void 0;
  if (!controllo && nomeArea)
    return { elemento: nomeArea, fonte: "data-segnala" };
  const el = controllo || bersaglio;
  const tag = el.tagName.toLowerCase();
  const etichetta = el.getAttribute("aria-label") || (tag === "input" || tag === "textarea" || tag === "select" ? el.getAttribute("name") || el.getAttribute("placeholder") || tag : el.textContent) || el.getAttribute("title") || tag;
  const azione = {
    elemento: el.closest(PRIVATO) ? MASCHERA : breve2(etichetta, MAX_ETICHETTA),
    fonte: "testo"
  };
  if (nomeArea) azione.area = nomeArea;
  return azione;
}
function creaRegistroAzioni(win, { max = MAX_AZIONI, ignoraUrl = [] } = {}) {
  const buffer = [];
  const base = win.location?.href;
  const ripristini = [];
  const aggiungi = (azione) => {
    buffer.push({ ts: (/* @__PURE__ */ new Date()).toISOString(), ...azione });
    if (buffer.length > max) buffer.splice(0, buffer.length - max);
  };
  const ignorata = (url) => ignoraUrl.some((p) => p && url.startsWith(p));
  const durata = (inizio) => Math.round(performance.now() - inizio);
  const sostituisci = (obj, nome, crea) => {
    const originale = obj?.[nome];
    if (typeof originale !== "function") return;
    const nuovo = crea(originale);
    obj[nome] = nuovo;
    ripristini.push(() => {
      if (obj[nome] === nuovo) obj[nome] = originale;
    });
  };
  const ascolta = (bersaglio, evento, fn, cattura = false) => {
    bersaglio?.addEventListener?.(evento, fn, cattura);
    ripristini.push(
      () => bersaglio?.removeEventListener?.(evento, fn, cattura)
    );
  };
  const naviga = () => aggiungi({ tipo: "navigazione", url: win.location?.pathname ?? "" });
  naviga();
  sostituisci(
    win.history,
    "pushState",
    (orig) => function pushState(...args) {
      const esito = orig.apply(this, args);
      naviga();
      return esito;
    }
  );
  sostituisci(
    win.history,
    "replaceState",
    (orig) => function replaceState(...args) {
      const esito = orig.apply(this, args);
      naviga();
      return esito;
    }
  );
  ascolta(win, "popstate", naviga);
  ascolta(
    win.document,
    "click",
    (e) => {
      const bersaglio = e.target?.nodeType === 1 ? e.target : e.target?.parentElement;
      if (!bersaglio || bersaglio.closest(IGNORA)) return;
      aggiungi({ tipo: "click", ...descriviClick(bersaglio) });
    },
    true
  );
  sostituisci(
    win,
    "fetch",
    (orig) => function fetch(input, init) {
      const grezzo = typeof input === "string" ? input : input?.url ?? String(input);
      const url = urlPulito(grezzo, base);
      if (ignorata(url)) return orig.call(win, input, init);
      const metodo = String(
        init?.method || input?.method || "GET"
      ).toUpperCase();
      const inizio = performance.now();
      return new Promise(
        (risolvi) => risolvi(orig.call(win, input, init))
      ).then(
        (risposta) => {
          aggiungi({
            tipo: "richiesta",
            metodo,
            url,
            stato: risposta?.status ?? null,
            durata_ms: durata(inizio)
          });
          return risposta;
        },
        (errore) => {
          aggiungi({
            tipo: "richiesta",
            metodo,
            url,
            stato: null,
            durata_ms: durata(inizio),
            errore: errore?.name === "AbortError" ? "annullata" : "rete"
          });
          throw errore;
        }
      );
    }
  );
  const xhr = win.XMLHttpRequest?.prototype;
  const richiesteXhr = /* @__PURE__ */ new WeakMap();
  sostituisci(
    xhr,
    "open",
    (orig) => function open(metodo, url, ...resto) {
      richiesteXhr.set(this, {
        metodo: String(metodo || "GET").toUpperCase(),
        url: urlPulito(url, base)
      });
      return orig.call(this, metodo, url, ...resto);
    }
  );
  sostituisci(
    xhr,
    "send",
    (orig) => function send(corpo) {
      const info = richiesteXhr.get(this);
      if (info && !ignorata(info.url)) {
        const inizio = performance.now();
        this.addEventListener(
          "loadend",
          () => aggiungi({
            tipo: "richiesta",
            ...info,
            stato: this.status || null,
            durata_ms: durata(inizio),
            ...this.status ? {} : { errore: "rete" }
          })
        );
      }
      return orig.call(this, corpo);
    }
  );
  sostituisci(
    win.console,
    "error",
    (orig) => function error(...args) {
      aggiungi({
        tipo: "errore",
        origine: "console",
        messaggio: testoMessaggio(args)
      });
      return orig.apply(this, args);
    }
  );
  ascolta(win, "error", (e) => {
    if (!e.message && !e.error) return;
    aggiungi({
      tipo: "errore",
      origine: "eccezione",
      messaggio: breve2(e.message || e.error?.message, MAX_MESSAGGIO),
      sorgente: e.filename ? `${urlPulito(e.filename, base)}:${e.lineno ?? 0}` : void 0
    });
  });
  ascolta(win, "unhandledrejection", (e) => {
    const motivo = e.reason;
    aggiungi({
      tipo: "errore",
      origine: "promessa",
      messaggio: breve2(motivo?.message ?? String(motivo), MAX_MESSAGGIO)
    });
  });
  return {
    aggiungi,
    azioni: () => buffer.map((a) => ({ ...a })),
    stop: () => {
      while (ripristini.length) ripristini.pop()();
    }
  };
}
function useRegistroAzioni(attivo, { ignoraUrl = [] } = {}) {
  const registro = useRef5(null);
  const chiaveIgnora = ignoraUrl.join("|");
  useEffect6(() => {
    if (!attivo || typeof window === "undefined") return void 0;
    const r2 = creaRegistroAzioni(window, {
      ignoraUrl: chiaveIgnora.split("|")
    });
    registro.current = r2;
    return () => {
      r2.stop();
      registro.current = null;
    };
  }, [attivo, chiaveIgnora]);
  const api = useRef5({ azioni: () => registro.current?.azioni() ?? [] });
  return api.current;
}

// src/segnalazioni/SegnalazioniProvider.jsx
import { jsx as jsx13, jsxs as jsxs10 } from "react/jsx-runtime";
var fetchPredefinito = (...args) => globalThis.fetch(...args);
function SegnalazioniProvider({
  endpoint = "/api/segnalazioni",
  configEndpoint = "/api/segnalazioni/config",
  durataVideoSec = 30,
  getToken,
  fetchImpl = fetchPredefinito,
  children
}) {
  const [config, setConfig] = useState4(null);
  const [stato, setStato] = useState4("inattivo");
  const [bozza, setBozza] = useState4(null);
  const baseRef = useRef6(fetchImpl);
  baseRef.current = fetchImpl;
  const tokenRef = useRef6(getToken);
  tokenRef.current = getToken;
  const fetchRef = useRef6((url, opzioni = {}) => {
    const token = tokenRef.current?.();
    if (!token) return baseRef.current(url, opzioni);
    const headers = new Headers(opzioni.headers);
    headers.set("Authorization", `Bearer ${token}`);
    return baseRef.current(url, { ...opzioni, headers });
  });
  useEffect7(() => {
    let annullato = false;
    (async () => {
      try {
        const r2 = await fetchRef.current(configEndpoint, {
          credentials: "include"
        });
        if (r2.status === 401 || r2.status === 403)
          console.warn(
            `[segnalazioni] ${configEndpoint} ha risposto ${r2.status}: il pulsante resta nascosto. Il portale autentica con un header? Passa \`getToken\` a SegnalazioniProvider.`
          );
        const corpo = r2.ok ? await r2.json() : {};
        if (!annullato)
          setConfig({
            abilitato: corpo.abilitato === true,
            durata: Number(corpo.durata_video_sec) > 0 ? Number(corpo.durata_video_sec) : null
          });
      } catch {
        if (!annullato) setConfig({ abilitato: false, durata: null });
      }
    })();
    return () => {
      annullato = true;
    };
  }, [configEndpoint]);
  const abilitato = config?.abilitato === true;
  const durata = config?.durata ?? durataVideoSec;
  const registro = useRegistroAzioni(abilitato, {
    ignoraUrl: [endpoint, configEndpoint]
  });
  const registrazione = useRegistrazione(abilitato, durata);
  const apri = useCallback2(() => {
    if (!abilitato) return;
    setStato((s) => s === "inattivo" ? "mirino" : s);
  }, [abilitato]);
  const annulla = useCallback2(() => setStato("inattivo"), []);
  const scegli = useCallback2(
    async (elemento) => {
      setStato("cattura");
      const azioni = registro.azioni();
      const eventi = registrazione.eventi();
      const page_url = window.location.href;
      let catture = null;
      try {
        catture = await catturaSchermata();
      } catch {
      }
      setBozza({
        segnalazione_id: nuovoId(),
        elemento,
        azioni,
        eventi,
        catture,
        page_url
      });
      setStato("modale");
    },
    [registro, registrazione]
  );
  const chiudi = useCallback2(() => {
    setBozza(null);
    setStato("inattivo");
  }, []);
  const valore = useMemo3(
    () => ({ abilitato, apri, stato }),
    [abilitato, apri, stato]
  );
  return /* @__PURE__ */ jsxs10(SegnalazioniContext.Provider, { value: valore, children: [
    children,
    abilitato && /* @__PURE__ */ jsxs10(ToastProvider, { children: [
      stato === "mirino" && /* @__PURE__ */ jsx13(SelettoreElemento, { onScegli: scegli, onAnnulla: annulla }),
      stato === "cattura" && /* @__PURE__ */ jsx13(
        "div",
        {
          "data-segnala-ignora": true,
          role: "status",
          className: "fixed bottom-6 left-1/2 z-[71] -translate-x-1/2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-muted-foreground shadow-2xl",
          children: "Preparo lo screenshot\u2026"
        }
      ),
      stato === "modale" && bozza && /* @__PURE__ */ jsx13(
        ModaleSegnalazione,
        {
          bozza,
          endpoint,
          fetchImpl: fetchRef.current,
          onChiudi: chiudi
        }
      )
    ] })
  ] });
}

// src/segnalazioni/PulsanteSegnala.jsx
import { Bug as Bug2 } from "lucide-react";
import { jsx as jsx14, jsxs as jsxs11 } from "react/jsx-runtime";
var ETICHETTA = "Segnala un problema";
function PulsanteSegnala({
  compatto = false,
  riga = false,
  className
}) {
  const { abilitato, apri, stato } = useSegnalazioni();
  if (!abilitato) return null;
  const occupato = stato !== "inattivo";
  if (compatto)
    return /* @__PURE__ */ jsx14("span", { "data-segnala-ignora": true, className: "inline-flex", children: /* @__PURE__ */ jsx14(
      IconButton_default,
      {
        icon: Bug2,
        label: ETICHETTA,
        title: ETICHETTA,
        size: "sm",
        onClick: apri,
        disabled: occupato,
        className
      }
    ) });
  if (riga)
    return /* @__PURE__ */ jsxs11(
      "button",
      {
        type: "button",
        "data-segnala-ignora": true,
        onClick: apri,
        disabled: occupato,
        className: cn(
          "flex w-full items-center gap-2 rounded-md bg-muted/60 px-2 py-1.5 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        children: [
          /* @__PURE__ */ jsx14(Bug2, { className: "h-3.5 w-3.5", "aria-hidden": true }),
          ETICHETTA
        ]
      }
    );
  return /* @__PURE__ */ jsx14("span", { "data-segnala-ignora": true, className: "inline-flex", children: /* @__PURE__ */ jsx14(
    Button_default,
    {
      variant: "ghost",
      size: "sm",
      icon: Bug2,
      onClick: apri,
      disabled: occupato,
      className,
      children: ETICHETTA
    }
  ) });
}
function azioniSegnalazioni({ compressa }) {
  return compressa ? /* @__PURE__ */ jsx14(PulsanteSegnala, { compatto: true }) : /* @__PURE__ */ jsx14(PulsanteSegnala, { riga: true });
}
export {
  PRIVATO,
  PulsanteSegnala,
  SegnalazioniProvider,
  azioniSegnalazioni,
  mascheraAzioni,
  mascheraDom,
  mascheraEventi,
  segnalaAttr,
  useSegnalazioni
};
