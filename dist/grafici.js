// src/grafici/GraficoBarre.jsx
import { useEffect as useEffect2, useRef } from "react";
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Tooltip
} from "chart.js";
import { BarChart3 } from "lucide-react";

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
  const predefinito = opts.style === "percent" ? 0 : 2;
  const maximumFractionDigits = Math.max(
    opts.minimumFractionDigits ?? 0,
    predefinito
  );
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

// src/organisms/Card.jsx
import { jsx, jsxs } from "react/jsx-runtime";
function Card({ className, interactive = false, children, ...props }) {
  return /* @__PURE__ */ jsx(
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

// src/organisms/EmptyState.jsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className
}) {
  return /* @__PURE__ */ jsxs2(
    "div",
    {
      className: cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-12 text-center",
        className
      ),
      children: [
        /* @__PURE__ */ jsx2("span", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground", children: /* @__PURE__ */ jsx2(Icon, { className: "h-6 w-6", "aria-hidden": true }) }),
        /* @__PURE__ */ jsxs2("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx2("p", { className: "text-base font-semibold", children: title }),
          description && /* @__PURE__ */ jsx2("p", { className: "max-w-sm text-sm text-muted-foreground", children: description })
        ] }),
        action && /* @__PURE__ */ jsx2("div", { className: "mt-1", children: action })
      ]
    }
  );
}

// src/theme/useTheme.js
import { useCallback, useEffect, useState } from "react";
var leggi = () => typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "dark" : "light";
function useTheme() {
  const [theme, setThemeState] = useState(leggi);
  useEffect(() => {
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

// src/grafici/coloriTema.js
var SERIE_TEMA = 8;
var leggi2 = (stile, nome, riserva) => {
  const v = stile?.getPropertyValue(`--${nome}`).trim();
  return v ? v : riserva;
};
var hsl = (v, alfa) => alfa === void 0 ? `hsl(${v})` : `hsl(${v} / ${alfa})`;
function coloriTema(el = typeof document !== "undefined" ? document.documentElement : null) {
  const stile = el && typeof getComputedStyle === "function" ? getComputedStyle(el) : null;
  const serie = Array.from({ length: SERIE_TEMA }, (_, i) => hsl(leggi2(stile, `chart-${i + 1}`, "0 0% 50%")));
  return {
    serie,
    testo: hsl(leggi2(stile, "muted-foreground", "0 0% 45%")),
    primoPiano: hsl(leggi2(stile, "foreground", "0 0% 10%")),
    griglia: hsl(leggi2(stile, "border", "0 0% 90%")),
    sfondoTooltip: hsl(leggi2(stile, "popover", "0 0% 100%")),
    testoTooltip: hsl(leggi2(stile, "popover-foreground", "0 0% 10%"))
  };
}
var coloreSerie = (colori, i, tono) => colori.serie[((tono ? tono - 1 : i) % SERIE_TEMA + SERIE_TEMA) % SERIE_TEMA];

// src/lib/periodi.js
var GIORNO = 864e5;
var GRANULARITA = {
  settimana: "settimana",
  week: "settimana",
  mese: "mese",
  month: "mese"
};
var RE_SETTIMANA = /^(\d{4})-W(\d{2})$/;
var RE_MESE = /^(\d{4})-(\d{2})$/;
var RE_ISO = /^(\d{4})-(\d{2})-(\d{2})/;
var mese = (stile) => new Intl.DateTimeFormat("it-IT", { month: stile, timeZone: "UTC" });
var MESE_BREVE = mese("short");
var MESE_LUNGO = mese("long");
var due = (n) => String(n).padStart(2, "0");
function toUtcDay(v) {
  if (v === null || v === void 0 || v === "") return null;
  if (typeof v === "string") {
    const m = RE_ISO.exec(v);
    if (m) return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  }
  const d = v instanceof Date ? v : new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
  );
}
function granularita(g) {
  const n = GRANULARITA[g];
  if (!n) throw new Error(`granularit\xE0 sconosciuta: ${g}`);
  return n;
}
function periodOf(date, gran = "mese") {
  const d = toUtcDay(date);
  if (!d) return null;
  if (granularita(gran) === "mese")
    return `${d.getUTCFullYear()}-${due(d.getUTCMonth() + 1)}`;
  const giovedi = new Date(
    d.getTime() + (3 - (d.getUTCDay() + 6) % 7) * GIORNO
  );
  const anno = giovedi.getUTCFullYear();
  const settimana = Math.floor((giovedi - Date.UTC(anno, 0, 1)) / GIORNO / 7) + 1;
  return `${anno}-W${due(settimana)}`;
}
function periodSpan(key) {
  let m = RE_SETTIMANA.exec(key);
  if (m) {
    const gen4 = Date.UTC(+m[1], 0, 4);
    const lunedi1 = gen4 - (new Date(gen4).getUTCDay() + 6) % 7 * GIORNO;
    const start = new Date(lunedi1 + (+m[2] - 1) * 7 * GIORNO);
    return { start, end: new Date(start.getTime() + 7 * GIORNO) };
  }
  m = RE_MESE.exec(key);
  if (m)
    return {
      start: new Date(Date.UTC(+m[1], +m[2] - 1, 1)),
      end: new Date(Date.UTC(+m[1], +m[2], 1))
    };
  throw new Error(`periodo non valido: ${key}`);
}
function periodLabel(key, { breve = false } = {}) {
  const { start, end } = periodSpan(key);
  if (RE_MESE.test(key)) {
    const nome = (breve ? MESE_BREVE : MESE_LUNGO).format(start);
    return `${nome} ${start.getUTCFullYear()}`;
  }
  const fine = new Date(end.getTime() - GIORNO);
  const g1 = start.getUTCDate();
  const g2 = fine.getUTCDate();
  const m1 = MESE_BREVE.format(start);
  const m2 = MESE_BREVE.format(fine);
  const a1 = start.getUTCFullYear();
  const a2 = fine.getUTCFullYear();
  if (breve) return m1 === m2 ? `${g1}\u2013${g2} ${m2}` : `${g1} ${m1}\u2013${g2} ${m2}`;
  if (a1 !== a2) return `${g1} ${m1} ${a1} \u2013 ${g2} ${m2} ${a2}`;
  if (m1 !== m2) return `${g1} ${m1} \u2013 ${g2} ${m2} ${a2}`;
  return `${g1}\u2013${g2} ${m2} ${a2}`;
}
function isPartial(key, { from, to, now = /* @__PURE__ */ new Date() } = {}) {
  const { start, end } = periodSpan(key);
  const ultimo = end.getTime() - GIORNO;
  const dal = toUtcDay(from);
  const al = toUtcDay(to);
  const oggi = now === null ? null : toUtcDay(now);
  if (dal && dal.getTime() > start.getTime()) return true;
  if (al && al.getTime() < ultimo) return true;
  return Boolean(oggi && oggi.getTime() <= ultimo);
}

// src/grafici/configBarre.js
var num = (v) => Number.isFinite(Number(v)) ? Number(v) : 0;
var normalizzaPeriodi = (periodi) => periodi.map((p) => {
  const o = typeof p === "string" ? { key: p } : p;
  return {
    ...o,
    label: o.label ?? periodLabel(o.key, { breve: true }),
    titolo: o.titolo ?? periodLabel(o.key),
    parziale: Boolean(o.parziale)
  };
});
var valoreSerie = (s, p, i) => num(Array.isArray(s.valori) ? s.valori[i] : s.valori?.[p.key]);
var movimentoRidotto = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
function configGraficoBarre({
  periodi = [],
  serie = [],
  colori,
  impilate = true,
  formatValore = formatNumero,
  onPeriodoClick
}) {
  const ps = normalizzaPeriodi(periodi);
  return {
    type: "bar",
    data: {
      labels: ps.map((p) => p.parziale ? `${p.label} *` : p.label),
      datasets: serie.map((s, i) => {
        const colore = coloreSerie(colori, i, s.tono);
        return {
          label: s.label,
          data: ps.map((p, j) => valoreSerie(s, p, j)),
          backgroundColor: colore,
          hoverBackgroundColor: colore,
          borderRadius: 3,
          borderSkipped: impilate ? "start" : false,
          maxBarThickness: 48,
          stack: impilate ? "totale" : void 0
        };
      })
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: movimentoRidotto() ? false : { duration: 250 },
      interaction: { mode: "index", intersect: false },
      onClick: onPeriodoClick ? (_e, elementi) => {
        if (elementi?.length) onPeriodoClick(ps[elementi[0].index].key);
      } : void 0,
      scales: {
        x: {
          stacked: impilate,
          grid: { display: false },
          border: { color: colori.griglia },
          ticks: { color: colori.testo }
        },
        y: {
          stacked: impilate,
          beginAtZero: true,
          grid: { color: colori.griglia },
          border: { display: false },
          ticks: { color: colori.testo, callback: (v) => formatValore(v) }
        }
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: colori.primoPiano,
            usePointStyle: true,
            pointStyle: "rectRounded",
            padding: 16
          },
          // Clicking an entry hides/shows its series (Chart.js default); the
          // pointer tells the user the legend is interactive.
          onHover: (e) => {
            if (e?.native?.target) e.native.target.style.cursor = "pointer";
          },
          onLeave: (e) => {
            if (e?.native?.target) e.native.target.style.cursor = "default";
          }
        },
        tooltip: {
          backgroundColor: colori.sfondoTooltip,
          titleColor: colori.testoTooltip,
          bodyColor: colori.testoTooltip,
          footerColor: colori.testoTooltip,
          borderColor: colori.griglia,
          borderWidth: 1,
          padding: 10,
          usePointStyle: true,
          callbacks: {
            title: (items) => {
              const p = ps[items[0]?.dataIndex];
              return p ? `${p.titolo}${p.parziale ? " (parziale)" : ""}` : "";
            },
            label: (item) => `${item.dataset.label}: ${formatValore(item.parsed.y)}`,
            footer: (items) => `Totale: ${formatValore(items.reduce((a, it) => a + num(it.parsed.y), 0))}`
          }
        }
      }
    }
  };
}

// src/grafici/GraficoBarre.jsx
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip
);
function GraficoBarre({
  periodi = [],
  serie = [],
  impilate = true,
  altezza = 320,
  formatValore = formatNumero,
  onPeriodoClick,
  titolo: titolo2 = "Grafico a barre per periodo",
  empty = "Nessun dato nel periodo",
  segnala,
  className
}) {
  const tela = useRef(null);
  const grafico = useRef(null);
  const { theme } = useTheme();
  const vuoto2 = periodi.length === 0 || serie.length === 0;
  useEffect2(() => {
    if (vuoto2 || !tela.current) return void 0;
    const config = configGraficoBarre({
      periodi,
      serie,
      colori: coloriTema(),
      impilate,
      formatValore,
      onPeriodoClick
    });
    if (grafico.current) {
      grafico.current.data = config.data;
      grafico.current.options = config.options;
      grafico.current.update();
    } else {
      grafico.current = new Chart(tela.current, config);
    }
    return void 0;
  }, [vuoto2, periodi, serie, impilate, formatValore, onPeriodoClick, theme]);
  useEffect2(() => {
    if (!vuoto2) return void 0;
    grafico.current?.destroy();
    grafico.current = null;
    return void 0;
  }, [vuoto2]);
  useEffect2(
    () => () => {
      grafico.current?.destroy();
      grafico.current = null;
    },
    []
  );
  if (vuoto2)
    return /* @__PURE__ */ jsx3(Card, { className: cn("p-0", className), ...segnalaAttr(segnala), children: /* @__PURE__ */ jsx3(EmptyState, { icon: BarChart3, title: empty }) });
  const ps = normalizzaPeriodi(periodi);
  return /* @__PURE__ */ jsxs3(Card, { className: cn("p-4", className), ...segnalaAttr(segnala), children: [
    /* @__PURE__ */ jsx3("div", { style: { height: altezza }, className: "relative", children: /* @__PURE__ */ jsx3("canvas", { ref: tela, role: "img", "aria-label": titolo2 }) }),
    ps.some((p) => p.parziale) && /* @__PURE__ */ jsx3("p", { className: "mt-2 text-xs text-muted-foreground", children: "* periodo parziale: il filtro lo taglia o non \xE8 ancora chiuso" }),
    /* @__PURE__ */ jsxs3("table", { className: "sr-only", children: [
      /* @__PURE__ */ jsx3("caption", { children: titolo2 }),
      /* @__PURE__ */ jsx3("thead", { children: /* @__PURE__ */ jsxs3("tr", { children: [
        /* @__PURE__ */ jsx3("th", { scope: "col", children: "Periodo" }),
        serie.map((s) => /* @__PURE__ */ jsx3("th", { scope: "col", children: s.label }, s.id ?? s.label))
      ] }) }),
      /* @__PURE__ */ jsx3("tbody", { children: ps.map((p, j) => /* @__PURE__ */ jsxs3("tr", { children: [
        /* @__PURE__ */ jsxs3("th", { scope: "row", children: [
          p.titolo,
          p.parziale ? " (parziale)" : ""
        ] }),
        serie.map((s) => /* @__PURE__ */ jsx3("td", { children: formatValore(
          Number(
            Array.isArray(s.valori) ? s.valori[j] : s.valori?.[p.key]
          ) || 0
        ) }, s.id ?? s.label))
      ] }, p.key)) })
    ] })
  ] });
}

// src/grafici/Sparkline.jsx
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
function Sparkline({
  valori = [],
  larghezza = 80,
  altezza = 28,
  titolo: titolo2,
  className
}) {
  const punti = valori.filter((v) => Number.isFinite(v));
  const box = { width: larghezza, height: altezza };
  if (punti.length < 2)
    return /* @__PURE__ */ jsx4("span", { "aria-hidden": true, className: cn("inline-block", className), style: box });
  const min = Math.min(...punti);
  const max = Math.max(...punti);
  const campo = max - min || 1;
  const pad = 2;
  const xy = punti.map((v, i) => [
    pad + i * (larghezza - 2 * pad) / (punti.length - 1),
    // A flat series sits in the middle instead of on the floor.
    max === min ? altezza / 2 : altezza - pad - (v - min) * (altezza - 2 * pad) / campo
  ]);
  const linea = xy.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const [ux, uy] = xy.at(-1);
  const area = `${linea} L${ux.toFixed(1)},${altezza} L${xy[0][0].toFixed(1)},${altezza} Z`;
  return /* @__PURE__ */ jsxs4(
    "svg",
    {
      viewBox: `0 0 ${larghezza} ${altezza}`,
      ...box,
      role: titolo2 ? "img" : void 0,
      "aria-label": titolo2,
      "aria-hidden": titolo2 ? void 0 : true,
      className: cn("shrink-0 overflow-visible text-primary", className),
      children: [
        /* @__PURE__ */ jsx4("path", { d: area, fill: "currentColor", opacity: "0.12" }),
        /* @__PURE__ */ jsx4(
          "path",
          {
            d: linea,
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinejoin: "round",
            strokeLinecap: "round"
          }
        ),
        /* @__PURE__ */ jsx4("circle", { cx: ux, cy: uy, r: "2", fill: "currentColor" })
      ]
    }
  );
}

// src/grafici/PaginaReportCampagna.jsx
import { useMemo as useMemo2, useState as useState7 } from "react";
import { BarChart3 as BarChart32 } from "lucide-react";

// src/organisms/Alert.jsx
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";

// src/atoms/IconButton.jsx
import { forwardRef as forwardRef2 } from "react";

// src/atoms/Button.jsx
import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsxs5(
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
        loading ? /* @__PURE__ */ jsx5(Loader2, { className: "h-4 w-4 animate-spin", "aria-hidden": true }) : Icon && /* @__PURE__ */ jsx5(Icon, { className: "h-4 w-4", "aria-hidden": true }),
        children,
        !loading && IconRight && /* @__PURE__ */ jsx5(IconRight, { className: "h-4 w-4", "aria-hidden": true })
      ]
    }
  );
});
var Button_default = Button;

// src/atoms/IconButton.jsx
import { jsx as jsx6 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx6(
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
      children: Icon && /* @__PURE__ */ jsx6(Icon, { className: "h-4 w-4", "aria-hidden": true })
    }
  );
});
var IconButton_default = IconButton;

// src/organisms/Alert.jsx
import { jsx as jsx7, jsxs as jsxs6 } from "react/jsx-runtime";
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
        /* @__PURE__ */ jsx7(t.Icona, { className: cn("mt-0.5 h-5 w-5 shrink-0", t.icon), "aria-hidden": true }),
        /* @__PURE__ */ jsxs6("div", { className: "min-w-0 flex-1", children: [
          title && /* @__PURE__ */ jsx7("p", { className: "font-semibold", children: title }),
          children && /* @__PURE__ */ jsx7("div", { className: cn(title && "mt-0.5"), children })
        ] }),
        onClose && /* @__PURE__ */ jsx7(
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

// src/templates/Section.jsx
import { jsx as jsx8, jsxs as jsxs7 } from "react/jsx-runtime";
function Section({
  title,
  description,
  actions,
  className,
  children
}) {
  return /* @__PURE__ */ jsxs7("section", { className: cn("space-y-3", className), children: [
    (title || description || actions) && /* @__PURE__ */ jsxs7("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs7("div", { className: "min-w-0", children: [
        title && /* @__PURE__ */ jsx8("h2", { className: "text-lg font-semibold", children: title }),
        description && /* @__PURE__ */ jsx8("p", { className: "text-sm text-muted-foreground", children: description })
      ] }),
      actions && /* @__PURE__ */ jsx8("div", { className: "flex shrink-0 items-center gap-2", children: actions })
    ] }),
    children
  ] });
}

// src/grafici/report/AndamentoCampagna.jsx
import { History } from "lucide-react";
import { jsx as jsx9, jsxs as jsxs8 } from "react/jsx-runtime";
function AndamentoCampagna({
  periodi = [],
  serie = [],
  inCostruzione,
  titolo: titolo2 = "Andamento della campagna",
  formatValore = formatNumero,
  altezza = 300
}) {
  if (periodi.length < 2)
    return /* @__PURE__ */ jsxs8(Card, { className: "flex items-start gap-3 p-4", role: "status", children: [
      /* @__PURE__ */ jsx9(
        History,
        {
          className: "mt-0.5 h-5 w-5 shrink-0 text-muted-foreground",
          "aria-hidden": true
        }
      ),
      /* @__PURE__ */ jsxs8("div", { className: "space-y-0.5 text-sm", children: [
        /* @__PURE__ */ jsx9("p", { className: "font-medium", children: inCostruzione ?? "Storico in costruzione." }),
        /* @__PURE__ */ jsx9("p", { className: "text-muted-foreground", children: "Il grafico compare dal secondo periodo: per ora i numeri sono nella tabella qui sotto." })
      ] })
    ] });
  return /* @__PURE__ */ jsx9(
    GraficoBarre,
    {
      titolo: titolo2,
      periodi,
      serie,
      impilate: true,
      altezza,
      formatValore
    }
  );
}

// src/grafici/report/FiltriReport.jsx
import { RotateCcw as RotateCcw2 } from "lucide-react";

// src/molecules/CampoData.jsx
import { forwardRef as forwardRef4, useEffect as useEffect4, useId, useRef as useRef3, useState as useState3 } from "react";
import { CalendarDays } from "lucide-react";

// src/lib/dataIt.js
var RE_IT = /^\s*(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})\s*$/;
var RE_ISO2 = /^(\d{4})-(\d{2})-(\d{2})$/;
var due2 = (n) => String(n).padStart(2, "0");
function parseDataIt(testo) {
  if (!testo || !testo.trim()) return null;
  const m = RE_IT.exec(testo);
  if (!m) return void 0;
  const [g, me, a] = [+m[1], +m[2], +m[3]];
  const d = new Date(Date.UTC(a, me - 1, g));
  if (d.getUTCFullYear() !== a || d.getUTCMonth() !== me - 1 || d.getUTCDate() !== g)
    return void 0;
  return `${a}-${due2(me)}-${due2(g)}`;
}
function formatDataIt(iso) {
  const m = RE_ISO2.exec(iso ?? "");
  return m ? `${m[3]}/${m[2]}/${m[1]}` : "";
}
var isoGiorno = (d) => `${d.getUTCFullYear()}-${due2(d.getUTCMonth() + 1)}-${due2(d.getUTCDate())}`;

// src/atoms/Input.jsx
import { forwardRef as forwardRef3 } from "react";
import { jsx as jsx10, jsxs as jsxs9 } from "react/jsx-runtime";
var CAMPO = "w-full rounded-lg border bg-background text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50";
var campoClasses = (invalid) => cn(
  CAMPO,
  invalid ? "border-destructive focus-visible:ring-destructive/40" : "border-input hover:border-ring/60 focus-visible:border-ring focus-visible:ring-ring/40"
);
var Input = forwardRef3(function Input2({ invalid, icon: Icon, className, ...props }, ref) {
  const input = /* @__PURE__ */ jsx10(
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
  return /* @__PURE__ */ jsxs9("div", { className: "relative w-full", children: [
    /* @__PURE__ */ jsx10(
      Icon,
      {
        className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",
        "aria-hidden": true
      }
    ),
    input
  ] });
});

// src/molecules/CalendarioMese.jsx
import { useEffect as useEffect3, useRef as useRef2, useState as useState2 } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { jsx as jsx11, jsxs as jsxs10 } from "react/jsx-runtime";
var GIORNO2 = 864e5;
var SETTIMANA = ["lu", "ma", "me", "gi", "ve", "sa", "do"];
var TITOLO = new Intl.DateTimeFormat("it-IT", {
  month: "long",
  year: "numeric",
  timeZone: "UTC"
});
var LUNGO = new Intl.DateTimeFormat("it-IT", {
  dateStyle: "full",
  timeZone: "UTC"
});
var daIso = (iso) => iso ? /* @__PURE__ */ new Date(`${iso}T00:00:00Z`) : null;
var primoDelMese = (d) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
var spostaMese = (d, n) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1));
function griglia(mese2) {
  const inizio = mese2.getTime() - (mese2.getUTCDay() + 6) % 7 * GIORNO2;
  return Array.from({ length: 42 }, (_, i) => new Date(inizio + i * GIORNO2));
}
function CalendarioMese({
  value,
  onChange,
  min,
  max,
  oggi = isoGiorno(/* @__PURE__ */ new Date()),
  autoFocus = false,
  className
}) {
  const [fuoco, setFuoco] = useState2(value || oggi);
  const [mese2, setMese] = useState2(() => primoDelMese(daIso(value || oggi)));
  const griglia$ = useRef2(null);
  const daFocalizzare = useRef2(autoFocus);
  useEffect3(() => {
    if (!daFocalizzare.current) return;
    daFocalizzare.current = false;
    griglia$.current?.querySelector(`[data-giorno="${fuoco}"]`)?.focus();
  });
  const fuori = (iso) => min && iso < min || max && iso > max;
  const vai = (iso) => {
    setFuoco(iso);
    setMese(primoDelMese(daIso(iso)));
    daFocalizzare.current = true;
  };
  const sposta = (giorni2) => vai(isoGiorno(new Date(daIso(fuoco).getTime() + giorni2 * GIORNO2)));
  const tasto = (e) => {
    const passi = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (passi[e.key]) {
      e.preventDefault();
      sposta(passi[e.key]);
    } else if (e.key === "PageUp" || e.key === "PageDown") {
      e.preventDefault();
      const d = daIso(fuoco);
      const n = e.key === "PageUp" ? -1 : 1;
      const dest = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1));
      const ultimo = new Date(Date.UTC(dest.getUTCFullYear(), dest.getUTCMonth() + 1, 0)).getUTCDate();
      dest.setUTCDate(Math.min(d.getUTCDate(), ultimo));
      vai(isoGiorno(dest));
    }
  };
  const giorni = griglia(mese2);
  const tabbabile = giorni.some((d) => isoGiorno(d) === fuoco) ? fuoco : isoGiorno(mese2);
  return /* @__PURE__ */ jsxs10("div", { className: cn("w-72 select-none p-3", className), children: [
    /* @__PURE__ */ jsxs10("div", { className: "mb-2 flex items-center justify-between", children: [
      /* @__PURE__ */ jsx11(IconButton_default, { icon: ChevronLeft, label: "Mese precedente", size: "sm", onClick: () => setMese(spostaMese(mese2, -1)) }),
      /* @__PURE__ */ jsx11("span", { className: "text-sm font-semibold capitalize", "aria-live": "polite", children: TITOLO.format(mese2) }),
      /* @__PURE__ */ jsx11(IconButton_default, { icon: ChevronRight, label: "Mese successivo", size: "sm", onClick: () => setMese(spostaMese(mese2, 1)) })
    ] }),
    /* @__PURE__ */ jsxs10("div", { role: "grid", "aria-label": TITOLO.format(mese2), ref: griglia$, onKeyDown: tasto, children: [
      /* @__PURE__ */ jsx11("div", { role: "row", className: "grid grid-cols-7 text-center text-xs text-muted-foreground", children: SETTIMANA.map((g) => /* @__PURE__ */ jsx11("span", { role: "columnheader", className: "py-1", children: g }, g)) }),
      [0, 1, 2, 3, 4, 5].map((s) => /* @__PURE__ */ jsx11("div", { role: "row", className: "grid grid-cols-7", children: giorni.slice(s * 7, s * 7 + 7).map((d) => {
        const iso = isoGiorno(d);
        const scelto = iso === value;
        const altroMese = d.getUTCMonth() !== mese2.getUTCMonth();
        const disattivo = fuori(iso);
        return /* @__PURE__ */ jsx11(
          "button",
          {
            type: "button",
            role: "gridcell",
            "data-giorno": iso,
            "aria-selected": scelto,
            "aria-label": LUNGO.format(d),
            "aria-current": iso === oggi ? "date" : void 0,
            disabled: disattivo,
            tabIndex: iso === tabbabile ? 0 : -1,
            onClick: () => onChange?.(iso),
            onFocus: () => setFuoco(iso),
            className: cn(
              "m-0.5 h-8 rounded-md text-sm tabular-nums transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "disabled:pointer-events-none disabled:opacity-30",
              scelto ? "bg-primary font-semibold text-primary-foreground shadow-sm" : "hover:bg-accent hover:text-accent-foreground",
              !scelto && altroMese && "text-muted-foreground/60",
              !scelto && iso === oggi && "font-semibold text-primary"
            ),
            children: d.getUTCDate()
          },
          iso
        );
      }) }, s))
    ] })
  ] });
}

// src/molecules/CampoData.jsx
import { jsx as jsx12, jsxs as jsxs11 } from "react/jsx-runtime";
var CampoData = forwardRef4(function CampoData2({
  value,
  onChange,
  min,
  max,
  placeholder = "gg/mm/aaaa",
  invalid,
  disabled,
  "aria-label": ariaLabel,
  id,
  className
}, ref) {
  const [testo, setTesto] = useState3(formatDataIt(value));
  const [errato, setErrato] = useState3(false);
  const [aperto, setAperto] = useState3(false);
  const radice = useRef3(null);
  const pannello = useId();
  useEffect4(() => {
    setTesto(formatDataIt(value));
    setErrato(false);
  }, [value]);
  useEffect4(() => {
    if (!aperto) return void 0;
    const fuori = (e) => {
      if (!radice.current?.contains(e.target)) setAperto(false);
    };
    document.addEventListener("mousedown", fuori);
    return () => document.removeEventListener("mousedown", fuori);
  }, [aperto]);
  const conferma = () => {
    const iso = parseDataIt(testo);
    const fuoriLimiti = iso && (min && iso < min || max && iso > max);
    if (iso === void 0 || fuoriLimiti) {
      setErrato(true);
      return;
    }
    setErrato(false);
    if (iso !== (value ?? null)) onChange?.(iso);
  };
  const scegli = (iso) => {
    setAperto(false);
    setErrato(false);
    setTesto(formatDataIt(iso));
    onChange?.(iso);
    radice.current?.querySelector("input")?.focus();
  };
  return /* @__PURE__ */ jsxs11(
    "div",
    {
      ref: radice,
      className: cn("relative w-40", className),
      onKeyDown: (e) => {
        if (e.key === "Escape" && aperto) {
          e.stopPropagation();
          setAperto(false);
          radice.current?.querySelector("input")?.focus();
        }
      },
      children: [
        /* @__PURE__ */ jsx12(
          "input",
          {
            ref,
            id,
            type: "text",
            inputMode: "numeric",
            autoComplete: "off",
            value: testo,
            placeholder,
            disabled,
            "aria-label": ariaLabel,
            "aria-invalid": invalid || errato ? "true" : void 0,
            onChange: (e) => setTesto(e.target.value),
            onBlur: conferma,
            onKeyDown: (e) => {
              if (e.key === "Enter") conferma();
              if (e.key === "ArrowDown" && e.altKey) setAperto(true);
            },
            className: cn(campoClasses(invalid || errato), "h-9 pl-3 pr-9 tabular-nums")
          }
        ),
        /* @__PURE__ */ jsx12(
          IconButton_default,
          {
            icon: CalendarDays,
            label: "Apri calendario",
            size: "sm",
            disabled,
            "aria-expanded": aperto,
            "aria-controls": aperto ? pannello : void 0,
            onClick: () => setAperto((a) => !a),
            className: "absolute right-0.5 top-1/2 h-8 w-8 -translate-y-1/2"
          }
        ),
        aperto && /* @__PURE__ */ jsx12(
          "div",
          {
            id: pannello,
            role: "dialog",
            "aria-label": "Scegli una data",
            className: "absolute left-0 top-full z-50 mt-1 animate-fade-in rounded-lg border bg-popover text-popover-foreground shadow-lg",
            children: /* @__PURE__ */ jsx12(CalendarioMese, { value, onChange: scegli, min, max, autoFocus: true })
          }
        )
      ]
    }
  );
});
var CampoData_default = CampoData;

// src/molecules/SegmentedControl.jsx
import { useRef as useRef4 } from "react";
import { jsx as jsx13, jsxs as jsxs12 } from "react/jsx-runtime";
var SIZE = { sm: "h-7 px-3 text-xs", md: "h-9 px-4 text-sm" };
function SegmentedControl({
  value,
  onChange,
  options = [],
  size = "sm",
  "aria-label": ariaLabel,
  className
}) {
  const refs = useRef4([]);
  const vai = (i) => {
    const n = (i + options.length) % options.length;
    onChange?.(options[n].value);
    refs.current[n]?.focus();
  };
  return /* @__PURE__ */ jsx13(
    "div",
    {
      role: "radiogroup",
      "aria-label": ariaLabel,
      className: cn("inline-flex rounded-lg bg-muted p-1", className),
      children: options.map((o, i) => {
        const attivo = o.value === value;
        const Icon = o.icon;
        return /* @__PURE__ */ jsxs12(
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
              Icon && /* @__PURE__ */ jsx13(Icon, { className: "h-3.5 w-3.5", "aria-hidden": true }),
              o.label
            ]
          },
          o.value
        );
      })
    }
  );
}

// src/organisms/BarraFiltriPeriodo.jsx
import { useId as useId2 } from "react";
import { RotateCcw } from "lucide-react";
import { jsx as jsx14, jsxs as jsxs13 } from "react/jsx-runtime";
var GRANULARITA_REPORT = [
  { value: "settimana", label: "Settimana" },
  { value: "mese", label: "Mese" }
];

// src/grafici/report/FiltriReport.jsx
import { jsx as jsx15, jsxs as jsxs14 } from "react/jsx-runtime";
var FILTRI_VUOTI = { dal: null, al: null, granularita: "mese" };
function FiltriReport({
  value = FILTRI_VUOTI,
  onChange,
  predefinito = FILTRI_VUOTI,
  min,
  max,
  className
}) {
  const v = { ...FILTRI_VUOTI, ...value };
  const imposta = (patch) => onChange?.({ ...v, ...patch });
  const invertito = Boolean(v.dal && v.al && v.dal > v.al);
  const p = { ...FILTRI_VUOTI, ...predefinito };
  const modificato = v.dal !== p.dal || v.al !== p.al || v.granularita !== p.granularita;
  const etichetta2 = "text-xs font-medium text-muted-foreground";
  return /* @__PURE__ */ jsxs14("div", { className: cn("space-y-1", className), children: [
    /* @__PURE__ */ jsxs14(
      "div",
      {
        role: "group",
        "aria-label": "Filtri del periodo",
        className: "flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border bg-card px-3 py-2",
        children: [
          /* @__PURE__ */ jsx15("span", { className: etichetta2, children: "Periodo" }),
          /* @__PURE__ */ jsx15("div", { className: "w-36", children: /* @__PURE__ */ jsx15(
            CampoData_default,
            {
              "aria-label": "Dal",
              value: v.dal,
              onChange: (dal) => imposta({ dal }),
              min,
              max: v.al || max,
              invalid: invertito
            }
          ) }),
          /* @__PURE__ */ jsx15("span", { className: etichetta2, "aria-hidden": true, children: "\u2013" }),
          /* @__PURE__ */ jsx15("div", { className: "w-36", children: /* @__PURE__ */ jsx15(
            CampoData_default,
            {
              "aria-label": "Al",
              value: v.al,
              onChange: (al) => imposta({ al }),
              min: v.dal || min,
              max,
              invalid: invertito
            }
          ) }),
          /* @__PURE__ */ jsx15("span", { className: cn(etichetta2, "ml-2"), "aria-hidden": true, children: "Per" }),
          /* @__PURE__ */ jsx15(
            SegmentedControl,
            {
              "aria-label": "Raggruppa per",
              value: v.granularita,
              onChange: (granularita2) => imposta({ granularita: granularita2 }),
              options: GRANULARITA_REPORT
            }
          ),
          /* @__PURE__ */ jsx15(
            Button_default,
            {
              variant: "ghost",
              size: "sm",
              icon: RotateCcw2,
              onClick: () => onChange?.(p),
              disabled: !modificato,
              className: "ml-auto",
              children: "Azzera"
            }
          )
        ]
      }
    ),
    invertito && /* @__PURE__ */ jsx15("p", { role: "alert", className: "text-xs text-destructive", children: "La data iniziale \xE8 dopo quella finale." })
  ] });
}

// src/molecules/Tabs.jsx
import { useId as useId3, useRef as useRef5 } from "react";
import { jsx as jsx16, jsxs as jsxs15 } from "react/jsx-runtime";
var tabId = (prefix, id) => prefix ? `${prefix}-tab-${id}` : `tab-${id}`;
var panelId = (prefix, id) => prefix ? `${prefix}-panel-${id}` : `panel-${id}`;
function Tabs({
  value,
  onChange,
  items = [],
  "aria-label": ariaLabel,
  idPrefix,
  className
}) {
  const refs = useRef5([]);
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
        return /* @__PURE__ */ jsxs15(
          "button",
          {
            ref: (el) => {
              refs.current[i] = el;
            },
            type: "button",
            role: "tab",
            id: tabId(idPrefix, t.id),
            "aria-selected": attiva,
            "aria-controls": attiva ? panelId(idPrefix, t.id) : void 0,
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

// src/grafici/report/IntestazioneCampagna.jsx
import { jsx as jsx17, jsxs as jsxs16 } from "react/jsx-runtime";
function IntestazioneCampagna({
  campagne = [],
  campagna,
  onCampagnaChange,
  titolo: titolo2,
  situazione,
  descrizione,
  meta,
  azioni
}) {
  return /* @__PURE__ */ jsxs16("header", { className: "space-y-4", children: [
    campagne.length > 0 && /* @__PURE__ */ jsxs16("div", { className: "flex flex-wrap items-end gap-x-4 gap-y-1", children: [
      /* @__PURE__ */ jsx17("span", { className: "pb-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground", children: "Campagna" }),
      /* @__PURE__ */ jsx17(
        Tabs,
        {
          "aria-label": "Campagna",
          value: campagna,
          onChange: onCampagnaChange,
          items: campagne.map((c) => ({ id: c.id, label: c.label })),
          className: "min-w-0 flex-1"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs16("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxs16("div", { className: "min-w-0 space-y-1", children: [
        /* @__PURE__ */ jsx17("h1", { className: "text-3xl font-bold tracking-tight", children: titolo2 }),
        situazione && /* @__PURE__ */ jsx17("p", { className: "text-sm font-medium text-foreground", children: situazione }),
        descrizione && /* @__PURE__ */ jsx17("p", { className: "max-w-3xl text-sm text-muted-foreground", children: descrizione }),
        meta && /* @__PURE__ */ jsx17("p", { className: "text-xs text-muted-foreground", children: meta })
      ] }),
      azioni && /* @__PURE__ */ jsx17("div", { className: "flex shrink-0 items-center gap-2", children: azioni })
    ] })
  ] });
}

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
var PIENI = {
  neutral: "bg-muted-foreground",
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
  info: "bg-info"
};

// src/atoms/Badge.jsx
import { jsx as jsx18, jsxs as jsxs17 } from "react/jsx-runtime";
function Badge({
  tone = "neutral",
  dot = false,
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs17(
    "span",
    {
      ...props,
      className: cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        TINTE[tone],
        className
      ),
      children: [
        dot && /* @__PURE__ */ jsx18(
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

// src/molecules/PulsanteEsportaCsv.jsx
import { Download } from "lucide-react";

// src/lib/esportaCsv.js
var BOM = String.fromCharCode(65279);
var SEP = ";";
var DA_QUOTARE = /[;"\r\n]/;
var FORMULA = /^[=+\-@\t\r]/;
var NUMERO = new Intl.NumberFormat("it-IT", {
  useGrouping: false,
  maximumFractionDigits: 10
});
function cella(v) {
  if (v === null || v === void 0) return "";
  if (typeof v === "number") return Number.isFinite(v) ? NUMERO.format(v) : "";
  if (typeof v === "boolean") return v ? "s\xEC" : "no";
  if (v instanceof Date) {
    if (Number.isNaN(v.getTime())) return "";
    const g = String(v.getUTCDate()).padStart(2, "0");
    const m = String(v.getUTCMonth() + 1).padStart(2, "0");
    return `${g}/${m}/${v.getUTCFullYear()}`;
  }
  let s = String(v);
  if (FORMULA.test(s) && !/^-?\d+([.,]\d+)?$/.test(s)) s = `'${s}`;
  return DA_QUOTARE.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
var valore = (c, row) => typeof c.csv === "function" ? c.csv(row) : c.sortAccessor ? c.sortAccessor(row) : row[c.key];
var titolo = (c) => c.csvHeader ?? (typeof c.header === "string" ? c.header : c.key);
function toCsv(rows, columns) {
  const cols = columns.filter((c) => c.csv !== false);
  const righe = [
    cols.map((c) => cella(titolo(c))).join(SEP),
    ...rows.map((r2) => cols.map((c) => cella(valore(c, r2))).join(SEP))
  ];
  return BOM + righe.join("\r\n");
}
function esportaCsv(nomeFile, rows, columns) {
  const nome = /\.csv$/i.test(nomeFile) ? nomeFile : `${nomeFile}.csv`;
  const blob = new Blob([toCsv(rows, columns)], {
    type: "text/csv;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

// src/molecules/PulsanteEsportaCsv.jsx
import { jsx as jsx19 } from "react/jsx-runtime";
function PulsanteEsportaCsv({
  nomeFile = "esportazione",
  rows,
  columns,
  variant = "outline",
  size = "sm",
  children = "Esporta CSV",
  disabled,
  ...props
}) {
  const vuoto2 = Array.isArray(rows) && rows.length === 0;
  return /* @__PURE__ */ jsx19(
    Button_default,
    {
      variant,
      size,
      icon: Download,
      disabled: disabled || vuoto2,
      onClick: () => esportaCsv(nomeFile, typeof rows === "function" ? rows() : rows, columns),
      ...props,
      children
    }
  );
}

// src/molecules/Toggle.jsx
import { useId as useId4 } from "react";
import { jsx as jsx20, jsxs as jsxs18 } from "react/jsx-runtime";
function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled,
  className,
  id,
  "aria-describedby": describedBy,
  ...rest
}) {
  const uid = useId4();
  const cambia = () => {
    if (!disabled) onChange?.(!checked);
  };
  const descrizione = [describedBy, description ? `${uid}-d` : null].filter(Boolean).join(" ") || void 0;
  return /* @__PURE__ */ jsxs18("div", { className: cn("flex items-start gap-3", className), children: [
    /* @__PURE__ */ jsx20(
      "button",
      {
        "aria-labelledby": label ? `${uid}-l` : void 0,
        ...rest,
        id,
        type: "button",
        role: "switch",
        "aria-checked": !!checked,
        "aria-describedby": descrizione,
        disabled,
        onClick: cambia,
        className: cn(
          "relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "active:scale-95 disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-primary hover:bg-primary/90" : "bg-muted-foreground/30 hover:bg-muted-foreground/40"
        ),
        children: /* @__PURE__ */ jsx20(
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
    (label || description) && /* @__PURE__ */ jsxs18("div", { className: "min-w-0", children: [
      label && /* @__PURE__ */ jsx20(
        "div",
        {
          id: `${uid}-l`,
          onClick: cambia,
          "data-no-row-click": true,
          className: cn(
            "select-none text-sm font-medium text-foreground",
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          ),
          children: label
        }
      ),
      description && /* @__PURE__ */ jsx20(
        "div",
        {
          id: `${uid}-d`,
          "data-no-row-click": true,
          className: "text-xs text-muted-foreground",
          children: description
        }
      )
    ] })
  ] });
}

// src/organisms/DataTable.jsx
import { useEffect as useEffect5, useState as useState5 } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown, Inbox } from "lucide-react";

// src/organisms/Skeleton.jsx
import { jsx as jsx21, jsxs as jsxs19 } from "react/jsx-runtime";
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
function SkeletonTable({ rows = 5, cols = 4 }) {
  return /* @__PURE__ */ jsxs19("div", { className: "space-y-3", role: "status", "aria-label": "Caricamento", children: [
    /* @__PURE__ */ jsx21("div", { className: "flex gap-4", children: Array.from({ length: cols }, (_, c) => /* @__PURE__ */ jsx21(Skeleton, { className: "h-4 flex-1" }, c)) }),
    Array.from({ length: rows }, (_, r2) => /* @__PURE__ */ jsx21("div", { className: "flex gap-4", children: Array.from({ length: cols }, (_2, c) => /* @__PURE__ */ jsx21(Skeleton, { className: "h-6 flex-1" }, c)) }, r2))
  ] });
}

// src/organisms/Pagination.jsx
import { ChevronLeft as ChevronLeft2, ChevronRight as ChevronRight2 } from "lucide-react";
import { jsx as jsx22, jsxs as jsxs20 } from "react/jsx-runtime";
function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  className
}) {
  if (total <= pageSize && page <= 1) return null;
  const pagine = Math.max(1, Math.ceil(total / pageSize));
  const p = Math.min(Math.max(1, page), pagine);
  const da = (p - 1) * pageSize + 1;
  const a = Math.min(p * pageSize, total);
  return /* @__PURE__ */ jsxs20(
    "nav",
    {
      "aria-label": "Paginazione",
      className: cn("flex items-center justify-between gap-3", className),
      children: [
        /* @__PURE__ */ jsx22("p", { className: "text-sm text-muted-foreground tabular-nums", children: total > 0 ? `${formatNumero(da)}\u2013${formatNumero(a)} di ${formatNumero(total)}` : "Nessun risultato" }),
        /* @__PURE__ */ jsxs20("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx22(
            Button_default,
            {
              variant: "outline",
              size: "sm",
              icon: ChevronLeft2,
              disabled: page <= 1,
              onClick: () => onPageChange(Math.min(page - 1, pagine)),
              "aria-label": "Pagina precedente",
              children: "Precedente"
            }
          ),
          /* @__PURE__ */ jsx22(
            Button_default,
            {
              variant: "outline",
              size: "sm",
              iconRight: ChevronRight2,
              disabled: p >= pagine,
              onClick: () => onPageChange(p + 1),
              "aria-label": "Pagina successiva",
              children: "Successiva"
            }
          )
        ] })
      ]
    }
  );
}

// src/organisms/useSort.js
import { useCallback as useCallback2, useMemo, useState as useState4 } from "react";
function normalizza(v) {
  const x = v instanceof Date ? v.valueOf() : v;
  return typeof x === "number" && Number.isNaN(x) ? null : x;
}
var isNil = (v) => v === null || v === void 0;
function compare(a, b) {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), "it", {
    numeric: true,
    sensitivity: "base"
  });
}
function useSort(rows, { initial = null, accessors = {} } = {}) {
  const [sort, setSort] = useState4(initial);
  const toggle = useCallback2((key) => {
    setSort(
      (prev) => prev && prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
    );
  }, []);
  const sorted = useMemo(() => {
    if (!sort) return rows;
    const get = accessors[sort.key] || ((row) => row[sort.key]);
    const sign = sort.dir === "desc" ? -1 : 1;
    return [...rows].sort((ra, rb) => {
      const a = normalizza(get(ra));
      const b = normalizza(get(rb));
      if (isNil(a) && isNil(b)) return 0;
      if (isNil(a)) return 1;
      if (isNil(b)) return -1;
      return sign * compare(a, b);
    });
  }, [rows, sort]);
  return { sorted, sort, toggle };
}

// src/organisms/BarraInline.jsx
import { jsx as jsx23, jsxs as jsxs21 } from "react/jsx-runtime";
var valoreBarra = (c, row) => {
  const v = c.barValue ? c.barValue(row) : c.sortAccessor ? c.sortAccessor(row) : row[c.key];
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
var massimiBarre = (columns, rows) => Object.fromEntries(
  columns.filter((c) => c.bar).map((c) => [c.key, Math.max(0, ...rows.map((r2) => valoreBarra(c, r2)))])
);
function BarraInline({ value, max, children, className }) {
  const pct = max > 0 ? Math.min(Math.max(value / max, 0), 1) * 100 : 0;
  const larghezza = pct > 0 && pct < 2 ? 2 : pct;
  return /* @__PURE__ */ jsxs21("div", { className: cn("flex items-center justify-end gap-2", className), children: [
    /* @__PURE__ */ jsx23(
      "div",
      {
        className: "h-1.5 min-w-[3rem] flex-1 overflow-hidden rounded-full bg-muted",
        "aria-hidden": true,
        "data-barra": "",
        children: /* @__PURE__ */ jsx23(
          "div",
          {
            className: "h-full rounded-full bg-primary/70 transition-all duration-300",
            style: { width: `${larghezza}%` }
          }
        )
      }
    ),
    /* @__PURE__ */ jsx23("span", { className: "shrink-0 tabular-nums", children })
  ] });
}

// src/organisms/DataTable.jsx
import { jsx as jsx24, jsxs as jsxs22 } from "react/jsx-runtime";
var INTERATTIVI = "a,button,input,textarea,select,[role=listbox],[role=option],[role=switch],[role=checkbox],[data-no-row-click]";
var ALIGN = { left: "text-left", right: "text-right", center: "text-center" };
var JUSTIFY = {
  left: "justify-start",
  right: "justify-end",
  center: "justify-center"
};
function SortIcon({ dir }) {
  const Icon = dir === "asc" ? ChevronUp : dir === "desc" ? ChevronDown : ChevronsUpDown;
  return /* @__PURE__ */ jsx24(Icon, { className: cn("h-3.5 w-3.5", !dir && "opacity-40"), "aria-hidden": true });
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
  caption,
  pageSize,
  segnala,
  className
}) {
  const accessors = {};
  columns.forEach((c) => {
    if (c.sortAccessor) accessors[c.key] = c.sortAccessor;
  });
  const { sorted, sort, toggle } = useSort(rows, {
    initial: initialSort,
    accessors
  });
  const [pagina, setPagina] = useState5(1);
  useEffect5(() => setPagina(1), [sort, rows.length]);
  const visibili = pageSize ? sorted.slice((pagina - 1) * pageSize, pagina * pageSize) : sorted;
  const pad = dense ? "px-3 py-1.5" : "px-4 py-3";
  const massimi = massimiBarre(columns, rows);
  let body;
  if (loading && rows.length === 0) {
    body = /* @__PURE__ */ jsx24("div", { className: "p-4", children: /* @__PURE__ */ jsx24(SkeletonTable, { rows: 5, cols: columns.length }) });
  } else if (rows.length === 0) {
    body = empty === void 0 ? /* @__PURE__ */ jsx24(EmptyState, { icon: Inbox, title: "Nessun dato" }) : typeof empty === "string" ? /* @__PURE__ */ jsx24("p", { className: "px-6 py-12 text-center text-sm text-muted-foreground", children: empty }) : empty;
  }
  return /* @__PURE__ */ jsxs22(Card, { className: cn("p-0", className), ...segnalaAttr(segnala), children: [
    /* @__PURE__ */ jsx24("div", { className: "overflow-x-auto", children: body ? body : /* @__PURE__ */ jsxs22("table", { className: "w-full text-sm", children: [
      caption && /* @__PURE__ */ jsx24("caption", { className: "sr-only", children: caption }),
      /* @__PURE__ */ jsx24("thead", { className: "border-b bg-muted/50 font-medium text-muted-foreground", children: /* @__PURE__ */ jsx24("tr", { children: columns.map((c) => {
        const active = sort && sort.key === c.key ? sort.dir : null;
        const align = ALIGN[c.align] || ALIGN.left;
        return /* @__PURE__ */ jsx24(
          "th",
          {
            scope: "col",
            ...segnalaAttr(c.segnala),
            style: c.width ? { width: c.width } : void 0,
            "aria-sort": c.sortable ? active === "asc" ? "ascending" : active === "desc" ? "descending" : "none" : void 0,
            className: cn(
              pad,
              "whitespace-nowrap font-medium",
              align,
              c.className
            ),
            children: c.sortable ? /* @__PURE__ */ jsxs22(
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
                  /* @__PURE__ */ jsx24(SortIcon, { dir: active })
                ]
              }
            ) : c.header
          },
          c.key
        );
      }) }) }),
      /* @__PURE__ */ jsx24("tbody", { className: "divide-y", children: visibili.map((row) => /* @__PURE__ */ jsx24(
        "tr",
        {
          tabIndex: onRowClick ? 0 : void 0,
          onClick: onRowClick ? (e) => {
            const hit = e.target.closest?.(INTERATTIVI);
            if (hit && e.currentTarget.contains(hit)) return;
            onRowClick(row);
          } : void 0,
          onKeyDown: onRowClick ? (e) => {
            if (e.key === "Enter" && e.target === e.currentTarget)
              onRowClick(row);
          } : void 0,
          className: cn(
            "transition-colors hover:bg-muted/40",
            onRowClick && "cursor-pointer focus-visible:outline-none focus-visible:bg-muted/60 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
          ),
          children: columns.map((c) => /* @__PURE__ */ jsx24(
            "td",
            {
              ...segnalaAttr(c.segnala),
              className: cn(
                pad,
                ALIGN[c.align] || ALIGN.left,
                c.className
              ),
              children: c.bar ? /* @__PURE__ */ jsx24(
                BarraInline,
                {
                  value: valoreBarra(c, row),
                  max: massimi[c.key],
                  children: c.cell ? c.cell(row) : row[c.key] ?? ""
                }
              ) : c.cell ? c.cell(row) : row[c.key] ?? ""
            },
            c.key
          ))
        },
        rowKey(row)
      )) })
    ] }) }),
    pageSize && !body && /* @__PURE__ */ jsx24(
      Pagination,
      {
        page: pagina,
        pageSize,
        total: sorted.length,
        onPageChange: setPagina,
        className: "border-t px-4 py-2"
      }
    )
  ] });
}

// src/grafici/report/datiReport.js
var ND = "n.d.";
var METRICHE_CAMPAGNA = [
  {
    key: "forniture_attive",
    label: "Forniture attive",
    unita: "numero",
    meglio: "su",
    tono: 1,
    aiuto: "Forniture ancora attive dei beneficiari della campagna."
  },
  {
    key: "storni",
    label: "Storni",
    unita: "numero",
    meglio: "giu",
    tono: 4,
    aiuto: "Bonus stornati: la fornitura \xE8 cessata prima del termine."
  },
  {
    key: "maturati",
    label: "Maturati",
    unita: "numero",
    meglio: "su",
    tono: 3,
    aiuto: "Bonus maturati, cio\xE8 dovuti al beneficiario."
  },
  {
    key: "costo",
    label: "Costo",
    unita: "euro",
    meglio: "giu",
    aiuto: "Quanto \xE8 costata la campagna in bonus riconosciuti."
  },
  {
    key: "margine",
    label: "Margine",
    unita: "euro",
    meglio: "su",
    aiuto: "Il margine delle forniture della campagna."
  },
  {
    key: "guadagno_netto",
    label: "Guadagno netto",
    unita: "euro",
    meglio: "su",
    aiuto: "Margine meno costo: quanto ha reso davvero la campagna."
  }
];
var RE_EURO = /^(bonus_|costo|margine|importo|guadagno|ricavo)/;
var vuoto = (v) => v === null || v === void 0 || typeof v === "number" && Number.isNaN(v);
function numero(v) {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v)))
    return Number(v);
  return null;
}
function etichetta(codice) {
  if (!codice) return "";
  const s = String(codice).replace(/_/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}
var normalizzaCampagne = (campagne = []) => campagne.map(
  (c) => typeof c === "string" ? { id: c, label: etichetta(c) } : {
    id: c.id ?? c.codice,
    label: c.label ?? c.nome ?? etichetta(c.id ?? c.codice)
  }
);
function formatta(v, unita = "numero", { centesimi = false } = {}) {
  if (vuoto(v)) return ND;
  const n = numero(v);
  if (n === null) {
    if (typeof v === "boolean") return v ? "s\xEC" : "no";
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return formatData(`${v}T12:00:00Z`);
    return String(v);
  }
  if (unita === "euro")
    return formatNumero(n, {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: centesimi ? 2 : 0,
      minimumFractionDigits: centesimi ? 2 : 0
    });
  return formatNumero(n);
}
function unisciPerGiorno(righe = []) {
  const perGiorno = /* @__PURE__ */ new Map();
  for (const r2 of righe) {
    const k = String(r2.data_riferimento).slice(0, 10);
    const prima = perGiorno.get(k);
    if (!prima) {
      perGiorno.set(k, {
        ...r2,
        data_riferimento: k,
        indicatori: { ...r2.indicatori }
      });
      continue;
    }
    for (const { key } of METRICHE_CAMPAGNA)
      if (vuoto(prima[key]) && !vuoto(r2[key])) prima[key] = r2[key];
    prima.indicatori = { ...r2.indicatori, ...prima.indicatori };
    prima.mensile = Boolean(prima.mensile || r2.mensile);
  }
  return [...perGiorno.values()].sort(
    (a, b) => a.data_riferimento.localeCompare(b.data_riferimento)
  );
}
function voci(giorni, { metriche = METRICHE_CAMPAGNA, etichette = {}, formati = {} } = {}) {
  const viste = /* @__PURE__ */ new Map();
  for (const g of giorni)
    for (const [k, v] of Object.entries(g.indicatori ?? {})) {
      const numerico = numero(v) !== null;
      viste.set(k, (viste.get(k) ?? false) || numerico);
    }
  const indicatori = [...viste].map(([k, numerico]) => ({
    key: `indicatori.${k}`,
    label: etichette[k] ?? etichetta(k),
    unita: numerico ? formati[k] ?? (RE_EURO.test(k) ? "euro" : "numero") : "testo",
    indicatore: true,
    leggi: (g) => g.indicatori?.[k] ?? null
  }));
  return [
    ...metriche.map((m) => ({ ...m, leggi: (g) => g[m.key] ?? null })),
    ...indicatori
  ];
}
function ultimaFoto(giorni, elenco) {
  const ultima = giorni.at(-1);
  if (!ultima) return null;
  const riferimento = [...giorni].reverse().find((g) => g.mensile && g.data_riferimento < ultima.data_riferimento) ?? null;
  const delta = {};
  for (const v of elenco) {
    if (v.unita === "testo" || !riferimento) continue;
    const a = numero(v.leggi(ultima));
    const b = numero(v.leggi(riferimento));
    if (a !== null && b !== null) delta[v.key] = a - b;
  }
  return { ultima, riferimento, delta };
}
var filtra = (giorni, { dal, al } = {}) => giorni.filter(
  (g) => (!dal || g.data_riferimento >= dal) && (!al || g.data_riferimento <= al)
);
function perPeriodo(giorni, granularita2 = "mese") {
  const ultimo = /* @__PURE__ */ new Map();
  for (const g of giorni)
    ultimo.set(periodOf(g.data_riferimento, granularita2), g);
  return [...ultimo].map(([key, riga]) => ({ key, riga }));
}
var serieAndamento = (periodi, elenco) => elenco.map((v, i) => {
  const valori = {};
  for (const p of periodi) {
    const n = numero(v.leggi(p.riga));
    if (n !== null) valori[p.key] = n;
  }
  return { id: v.key, label: v.label, valori, tono: v.tono ?? i + 1 };
});
function variazioni(periodi, elenco) {
  return elenco.filter((v) => v.unita !== "testo").map((v) => {
    const valori = {};
    periodi.forEach((p, i) => {
      const a = numero(v.leggi(p.riga));
      const b = i > 0 ? numero(v.leggi(periodi[i - 1].riga)) : null;
      valori[p.key] = a !== null && b !== null ? a - b : null;
    });
    return {
      id: v.key,
      label: v.label,
      valori,
      format: (n) => (n > 0 ? "+" : "") + formatta(n, v.unita)
    };
  });
}
function andamentoVoce(giorni, voce, n = 12) {
  return perPeriodo(giorni, "mese").map((p) => numero(voce.leggi(p.riga))).filter((x) => x !== null).slice(-n);
}
function prossimaFotoMensile(data) {
  const d = /* @__PURE__ */ new Date(`${String(data).slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return "";
  const m = (d.getUTCMonth() + 1) % 12;
  return `1/${m + 1}`;
}
var situazioneAl = (riga) => riga ? `Situazione al ${formatData(`${riga.data_riferimento}T12:00:00Z`)}` : "Situazione";

// src/grafici/report/StoricoCampagna.jsx
import { Fragment, jsx as jsx25, jsxs as jsxs23 } from "react/jsx-runtime";
function colonneStorico(elenco) {
  return [
    {
      key: "data_riferimento",
      header: "Data",
      sortable: true,
      cell: (r2) => formatData(`${r2.data_riferimento}T12:00:00Z`),
      csv: (r2) => r2.data_riferimento,
      className: "whitespace-nowrap"
    },
    {
      key: "mensile",
      header: "Foto",
      cell: (r2) => r2.mensile ? /* @__PURE__ */ jsx25(Badge, { tone: "primary", children: "mensile" }) : /* @__PURE__ */ jsx25("span", { className: "text-muted-foreground", children: "giornaliera" }),
      csv: (r2) => r2.mensile ? "mensile" : "giornaliera"
    },
    ...elenco.map((v) => {
      const n = (r2) => numero(v.leggi(r2));
      return {
        key: v.key,
        header: v.label,
        align: v.unita === "testo" ? "left" : "right",
        sortable: true,
        sortAccessor: v.unita === "testo" ? (r2) => v.leggi(r2) : n,
        // Bars only where a length means something: non-negative headline counts and costs.
        bar: !v.indicatore && v.key !== "margine" && v.key !== "guadagno_netto",
        barValue: (r2) => n(r2) ?? 0,
        cell: (r2) => formatta(v.leggi(r2), v.unita),
        csv: (r2) => v.unita === "testo" ? v.leggi(r2) : n(r2),
        className: "whitespace-nowrap"
      };
    })
  ];
}
function StoricoCampagna({
  righe = [],
  colonne: colonne2,
  soloMensili,
  onSoloMensili,
  nomeFile = "storico_campagna",
  pageSize = 10
}) {
  return /* @__PURE__ */ jsx25(
    Section,
    {
      title: "Storico delle foto",
      description: "Una riga per foto: lo stato della campagna in quel giorno. Clicca un'intestazione per ordinare.",
      actions: /* @__PURE__ */ jsxs23(Fragment, { children: [
        /* @__PURE__ */ jsx25(Toggle, { checked: soloMensili, onChange: onSoloMensili, label: "Solo foto mensili" }),
        /* @__PURE__ */ jsx25(PulsanteEsportaCsv, { nomeFile, rows: righe, columns: colonne2 })
      ] }),
      children: /* @__PURE__ */ jsx25(
        DataTable,
        {
          columns: colonne2,
          rows: righe,
          rowKey: (r2) => r2.data_riferimento,
          initialSort: { key: "data_riferimento", dir: "desc" },
          pageSize,
          dense: true,
          caption: "Storico delle foto della campagna",
          empty: soloMensili ? "Nessuna foto mensile nel periodo: togli \xABSolo foto mensili\xBB per vedere quelle giornaliere." : "Nessuna foto nel periodo"
        }
      )
    }
  );
}

// src/grafici/report/TesseraKpi.jsx
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

// src/molecules/InfoTip.jsx
import { HelpCircle } from "lucide-react";

// src/molecules/Tooltip.jsx
import {
  Children,
  cloneElement,
  useCallback as useCallback3,
  useEffect as useEffect6,
  useId as useId5,
  useRef as useRef6,
  useState as useState6
} from "react";
import { jsx as jsx26, jsxs as jsxs24 } from "react/jsx-runtime";
var DELAY_MS = 150;
var SIDE = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
  left: "right-full top-1/2 mr-2 -translate-y-1/2",
  right: "left-full top-1/2 ml-2 -translate-y-1/2"
};
function Tooltip2({
  content,
  side = "top",
  wide = false,
  children
}) {
  const id = useId5();
  const [open, setOpen] = useState6(false);
  const timer = useRef6(null);
  const child = Children.only(children);
  const show = useCallback3(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), DELAY_MS);
  }, []);
  const hide = useCallback3(() => {
    clearTimeout(timer.current);
    setOpen(false);
  }, []);
  useEffect6(() => () => clearTimeout(timer.current), []);
  const chain = (name, fn) => (e) => {
    child.props[name]?.(e);
    fn(e);
  };
  const proprio = child.props["aria-describedby"];
  const trigger = cloneElement(child, {
    "aria-describedby": open ? [proprio, id].filter(Boolean).join(" ") : proprio,
    onMouseEnter: chain("onMouseEnter", show),
    onMouseLeave: chain("onMouseLeave", hide),
    onFocus: chain("onFocus", show),
    onBlur: chain("onBlur", hide),
    onKeyDown: chain("onKeyDown", (e) => {
      if (e.key !== "Escape" || !open) return;
      e.preventDefault();
      hide();
    })
  });
  return /* @__PURE__ */ jsxs24("span", { className: "relative inline-flex", children: [
    trigger,
    open && content != null && /* @__PURE__ */ jsx26(
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
import { jsx as jsx27 } from "react/jsx-runtime";
var LONG = 40;
function InfoTip({
  children,
  label = "Maggiori informazioni",
  side = "top",
  wide
}) {
  const long = wide ?? (typeof children === "string" && children.length > LONG);
  return /* @__PURE__ */ jsx27(Tooltip2, { content: children, side, wide: long, children: /* @__PURE__ */ jsx27(
    "button",
    {
      type: "button",
      "aria-label": label,
      className: "inline-flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
      children: /* @__PURE__ */ jsx27(HelpCircle, { className: "h-4 w-4", "aria-hidden": true })
    }
  ) });
}

// src/grafici/report/TesseraKpi.jsx
import { jsx as jsx28, jsxs as jsxs25 } from "react/jsx-runtime";
function TesseraKpi({
  label,
  valore: valore2,
  aiuto,
  delta,
  deltaTesto,
  deltaNota,
  meglio,
  andamento,
  tono,
  loading = false,
  className
}) {
  const su = delta > 0;
  const giu = delta < 0;
  const buono = meglio && (su || giu) ? meglio === "su" === su : null;
  const Freccia = giu ? ArrowDownRight : ArrowUpRight;
  return /* @__PURE__ */ jsxs25(Card, { className: cn("flex min-h-[8.5rem] flex-col p-4", className), children: [
    /* @__PURE__ */ jsxs25("div", { className: "flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground", children: [
      /* @__PURE__ */ jsx28("span", { className: "truncate", title: label, children: label }),
      aiuto && /* @__PURE__ */ jsx28(InfoTip, { children: aiuto })
    ] }),
    loading ? /* @__PURE__ */ jsx28(Skeleton, { className: "mt-2 h-7 w-24" }) : /* @__PURE__ */ jsx28(
      "p",
      {
        className: cn(
          "mt-1 truncate text-2xl font-semibold tabular-nums tracking-tight",
          tono && TESTO[tono]
        ),
        children: valore2
      }
    ),
    /* @__PURE__ */ jsxs25("div", { className: "mt-auto flex items-end justify-between gap-2 pt-2", children: [
      /* @__PURE__ */ jsxs25("div", { className: "min-w-0 text-xs", children: [
        !loading && deltaTesto ? /* @__PURE__ */ jsxs25(
          "span",
          {
            className: cn(
              "inline-flex items-center gap-0.5 font-medium tabular-nums",
              buono === true && TESTO.success,
              buono === false && TESTO.danger,
              buono === null && "text-muted-foreground"
            ),
            children: [
              (su || giu) && /* @__PURE__ */ jsx28(Freccia, { className: "h-3.5 w-3.5", "aria-hidden": true }),
              deltaTesto
            ]
          }
        ) : null,
        !loading && deltaNota && /* @__PURE__ */ jsx28("span", { className: "block truncate text-muted-foreground", children: deltaNota })
      ] }),
      /* @__PURE__ */ jsx28(
        Sparkline,
        {
          valori: andamento,
          titolo: andamento?.length > 1 ? `Andamento di ${label}` : void 0
        }
      )
    ] })
  ] });
}

// src/organisms/MatriceCalore.jsx
import { Inbox as Inbox2 } from "lucide-react";
import { Fragment as Fragment2, jsx as jsx29, jsxs as jsxs26 } from "react/jsx-runtime";
var num2 = (v) => Number.isFinite(Number(v)) ? Number(v) : 0;
var somma = (xs) => xs.reduce((a, b) => a + b, 0);
var percento = (v) => formatNumero(v, { style: "percent", maximumFractionDigits: 1 });
var colonne = (periodi) => periodi.map(
  (p) => typeof p === "string" ? { key: p, label: periodLabel(p, { breve: true }), parziale: false } : { label: periodLabel(p.key, { breve: true }), ...p }
);
function intensita(valore2, massimo) {
  if (!(massimo > 0) || !(valore2 > 0)) return 0;
  return Math.sqrt(Math.min(valore2 / massimo, 1));
}
function Cella({ valore: valore2, massimo, format, nd }) {
  const mancante = nd !== void 0 && (valore2 === null || valore2 === void 0);
  const t = mancante ? 0 : intensita(valore2, massimo);
  const alfa = t > 0 ? 0.08 + 0.82 * t : 0;
  return /* @__PURE__ */ jsx29(
    "td",
    {
      className: cn(
        "px-3 py-2 text-right tabular-nums transition-colors",
        alfa > 0.55 ? "text-primary-foreground" : "text-foreground"
      ),
      style: alfa ? { backgroundColor: `hsl(var(--primary) / ${alfa.toFixed(3)})` } : void 0,
      "data-intensita": t.toFixed(3),
      children: mancante ? /* @__PURE__ */ jsx29("span", { className: "text-muted-foreground", children: nd }) : valore2 || nd !== void 0 && valore2 === 0 ? format(valore2) : /* @__PURE__ */ jsx29("span", { className: "text-muted-foreground", children: "\u2013" })
    }
  );
}
function MatriceCalore({
  righe = [],
  periodi = [],
  onRigaClick,
  formatValore = formatNumero,
  etichettaRighe = "Voce",
  totale = true,
  quota = true,
  rigaTotali = true,
  caption,
  scala = "globale",
  nd,
  empty = "Nessun dato nel periodo",
  segnala,
  className
}) {
  const cols = colonne(periodi);
  const grezzo = (r2, k) => {
    const v = r2.valori?.[k];
    return nd !== void 0 && (v === null || v === void 0) ? null : num2(v);
  };
  const valore2 = (r2, k) => num2(r2.valori?.[k]);
  const totaliRiga = righe.map((r2) => somma(cols.map((c) => valore2(r2, c.key))));
  const totaliColonna = cols.map(
    (c) => somma(righe.map((r2) => valore2(r2, c.key)))
  );
  const generale = somma(totaliRiga);
  const massimoDi = (rs) => Math.max(0, ...rs.flatMap((r2) => cols.map((c) => valore2(r2, c.key))));
  const massimo = massimoDi(righe);
  const massimoRiga = (r2) => scala === "riga" ? massimoDi([r2]) : massimo;
  const parziali = cols.some((c) => c.parziale);
  const intest = "px-3 py-2 font-medium whitespace-nowrap";
  if (righe.length === 0 || cols.length === 0)
    return /* @__PURE__ */ jsx29(Card, { className: cn("p-0", className), ...segnalaAttr(segnala), children: /* @__PURE__ */ jsx29(EmptyState, { icon: Inbox2, title: empty }) });
  return /* @__PURE__ */ jsxs26(Card, { className: cn("p-0", className), ...segnalaAttr(segnala), children: [
    /* @__PURE__ */ jsx29("div", { className: "overflow-x-auto scrollbar-thin", children: /* @__PURE__ */ jsxs26("table", { className: "w-full text-sm", children: [
      caption && /* @__PURE__ */ jsx29("caption", { className: "sr-only", children: caption }),
      /* @__PURE__ */ jsx29("thead", { className: "border-b bg-muted/50 text-muted-foreground", children: /* @__PURE__ */ jsxs26("tr", { children: [
        /* @__PURE__ */ jsx29(
          "th",
          {
            scope: "col",
            className: cn(intest, "sticky left-0 bg-card text-left"),
            children: etichettaRighe
          }
        ),
        cols.map((c) => /* @__PURE__ */ jsxs26(
          "th",
          {
            scope: "col",
            className: cn(intest, "text-right"),
            title: c.parziale ? "Periodo parziale" : void 0,
            children: [
              c.label,
              c.parziale && /* @__PURE__ */ jsxs26(Fragment2, { children: [
                /* @__PURE__ */ jsx29("span", { "aria-hidden": true, children: "*" }),
                /* @__PURE__ */ jsx29("span", { className: "sr-only", children: " (parziale)" })
              ] })
            ]
          },
          c.key
        )),
        totale && /* @__PURE__ */ jsx29("th", { scope: "col", className: cn(intest, "text-right"), children: "Totale" }),
        quota && /* @__PURE__ */ jsx29("th", { scope: "col", className: cn(intest, "text-right"), children: "Quota" })
      ] }) }),
      /* @__PURE__ */ jsx29("tbody", { className: "divide-y", children: righe.map((r2, i) => /* @__PURE__ */ jsxs26(
        "tr",
        {
          tabIndex: onRigaClick ? 0 : void 0,
          onClick: onRigaClick ? () => onRigaClick(r2) : void 0,
          onKeyDown: onRigaClick ? (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onRigaClick(r2);
            }
          } : void 0,
          className: cn(
            onRigaClick && "cursor-pointer hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
          ),
          children: [
            /* @__PURE__ */ jsx29(
              "th",
              {
                scope: "row",
                className: "sticky left-0 bg-card px-3 py-2 text-left font-medium",
                children: r2.label
              }
            ),
            cols.map((c) => /* @__PURE__ */ jsx29(
              Cella,
              {
                valore: grezzo(r2, c.key),
                massimo: massimoRiga(r2),
                format: r2.format ?? formatValore,
                nd
              },
              c.key
            )),
            totale && /* @__PURE__ */ jsx29("td", { className: "px-3 py-2 text-right font-semibold tabular-nums", children: (r2.format ?? formatValore)(totaliRiga[i]) }),
            quota && /* @__PURE__ */ jsx29("td", { className: "px-3 py-2 text-right tabular-nums text-muted-foreground", children: generale > 0 ? percento(totaliRiga[i] / generale) : "\u2013" })
          ]
        },
        r2.id ?? r2.label
      )) }),
      rigaTotali && /* @__PURE__ */ jsx29("tfoot", { className: "border-t-2 bg-muted/30 font-semibold", children: /* @__PURE__ */ jsxs26("tr", { children: [
        /* @__PURE__ */ jsx29(
          "th",
          {
            scope: "row",
            className: "sticky left-0 bg-card px-3 py-2 text-left",
            children: "Totale"
          }
        ),
        totaliColonna.map((t, i) => /* @__PURE__ */ jsx29(
          "td",
          {
            className: "px-3 py-2 text-right tabular-nums",
            children: formatValore(t)
          },
          cols[i].key
        )),
        totale && /* @__PURE__ */ jsx29("td", { className: "px-3 py-2 text-right tabular-nums", children: formatValore(generale) }),
        quota && /* @__PURE__ */ jsx29("td", { className: "px-3 py-2 text-right tabular-nums text-muted-foreground", children: generale > 0 ? percento(1) : "\u2013" })
      ] }) })
    ] }) }),
    parziali && /* @__PURE__ */ jsx29("p", { className: "border-t px-4 py-2 text-xs text-muted-foreground", children: "* periodo parziale: il filtro lo taglia o non \xE8 ancora chiuso" })
  ] });
}

// src/grafici/report/VariazioniCampagna.jsx
import { jsx as jsx30, jsxs as jsxs27 } from "react/jsx-runtime";
var PERIODI_MATRICE = 3;
function VariazioniCampagna({ righe = [], periodi = [] }) {
  if (periodi.length < PERIODI_MATRICE)
    return /* @__PURE__ */ jsxs27("p", { className: "text-sm text-muted-foreground", children: [
      "La matrice delle variazioni compare con almeno ",
      PERIODI_MATRICE,
      " periodi."
    ] });
  return /* @__PURE__ */ jsx30(
    MatriceCalore,
    {
      righe,
      periodi,
      etichettaRighe: "Indicatore",
      caption: "Variazioni per periodo e indicatore",
      scala: "riga",
      nd: ND,
      quota: false,
      rigaTotali: false
    }
  );
}

// src/grafici/PaginaReportCampagna.jsx
import { jsx as jsx31, jsxs as jsxs28 } from "react/jsx-runtime";
var NESSUNA = [];
var IMPILATE = ["forniture_attive", "maturati", "storni"];
var giornoIt = (iso) => formatData(`${iso}T12:00:00Z`);
function PaginaReportCampagna({
  campagne = NESSUNA,
  campagna: campagnaControllata,
  onCampagnaChange,
  righe = NESSUNA,
  caricando = false,
  errore,
  descrizione = "I numeri della campagna, fotografati ogni notte. Solo lettura.",
  etichetteIndicatori,
  formatiIndicatori,
  azioni,
  filtriIniziali = FILTRI_VUOTI,
  oggi
}) {
  const elenco = useMemo2(() => normalizzaCampagne(campagne), [campagne]);
  const [sceltaInterna, setSceltaInterna] = useState7(null);
  const campagna = campagnaControllata ?? sceltaInterna ?? elenco[0]?.id ?? null;
  const scegli = (id) => onCampagnaChange ? onCampagnaChange(id) : setSceltaInterna(id);
  const nome = elenco.find((c) => c.id === campagna)?.label ?? "Report campagna";
  const [filtri, setFiltri] = useState7({ ...FILTRI_VUOTI, ...filtriIniziali });
  const [soloMensili, setSoloMensili] = useState7(null);
  const giorni = useMemo2(
    () => unisciPerGiorno(
      righe.filter(
        (r2) => !r2.campagna || !campagna || r2.campagna === campagna
      )
    ),
    [righe, campagna]
  );
  const tutte = useMemo2(
    () => voci(giorni, {
      etichette: etichetteIndicatori,
      formati: formatiIndicatori
    }),
    [giorni, etichetteIndicatori, formatiIndicatori]
  );
  const foto = useMemo2(() => ultimaFoto(giorni, tutte), [giorni, tutte]);
  const filtrati = useMemo2(() => filtra(giorni, filtri), [giorni, filtri]);
  const periodi = useMemo2(() => {
    const opz = { from: filtri.dal, to: filtri.al, now: oggi ?? /* @__PURE__ */ new Date() };
    return perPeriodo(filtrati, filtri.granularita).map((p) => ({
      ...p,
      parziale: isPartial(p.key, opz)
    }));
  }, [filtrati, filtri, oggi]);
  const impilate = tutte.filter((v) => IMPILATE.includes(v.key));
  const matrice = useMemo2(() => variazioni(periodi, tutte), [periodi, tutte]);
  const ciSonoMensili = filtrati.some((g) => g.mensile);
  const mensili = soloMensili ?? ciSonoMensili;
  const storico = useMemo2(
    () => mensili ? filtrati.filter((g) => g.mensile) : filtrati,
    [filtrati, mensili]
  );
  const colonne2 = useMemo2(() => colonneStorico(tutte), [tutte]);
  const ultima = foto?.ultima;
  const rif = foto?.riferimento;
  const prossima = ultima ? prossimaFotoMensile(ultima.data_riferimento) : "";
  const inCostruzione = `Storico in costruzione, ${giorni.some((g) => g.mensile) ? "prossima" : "prima"} foto mensile il ${prossima}.`;
  const intestazione = /* @__PURE__ */ jsx31(
    IntestazioneCampagna,
    {
      campagne: elenco,
      campagna,
      onCampagnaChange: scegli,
      titolo: nome,
      situazione: ultima ? situazioneAl(ultima) : void 0,
      descrizione,
      meta: rif ? `Variazioni rispetto all'ultima foto mensile, del ${giornoIt(rif.data_riferimento)}.` : void 0,
      azioni
    }
  );
  if (!caricando && !errore && giorni.length === 0)
    return /* @__PURE__ */ jsxs28("div", { className: "space-y-6", children: [
      intestazione,
      /* @__PURE__ */ jsx31(
        EmptyState,
        {
          icon: BarChart32,
          title: "Nessuna foto ancora",
          description: "Le foto della campagna arrivano ogni notte: la prima compare il giorno dopo l'avvio."
        }
      )
    ] });
  return /* @__PURE__ */ jsxs28("div", { className: "space-y-8", children: [
    intestazione,
    errore && /* @__PURE__ */ jsx31(Alert, { tone: "danger", title: "Report non disponibile", children: errore }),
    /* @__PURE__ */ jsx31(
      "section",
      {
        "aria-label": "Indicatori",
        className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        children: (caricando && !ultima ? METRICHE_CAMPAGNA : tutte).map((v) => {
          const d = foto?.delta?.[v.key];
          const valore2 = ultima ? v.leggi(ultima) : null;
          const negativo = v.key === "guadagno_netto" && Number(valore2) < 0;
          return /* @__PURE__ */ jsx31(
            TesseraKpi,
            {
              label: v.label,
              aiuto: v.aiuto,
              loading: caricando && !ultima,
              valore: formatta(valore2, v.unita),
              tono: negativo ? "danger" : void 0,
              delta: d,
              meglio: v.meglio,
              deltaTesto: d === void 0 ? void 0 : `${d > 0 ? "+" : ""}${formatta(d, v.unita)}`,
              deltaNota: d === void 0 ? v.unita === "testo" ? void 0 : "senza confronto" : `dal ${giornoIt(rif.data_riferimento)}`,
              andamento: v.unita === "testo" || !v.leggi ? [] : andamentoVoce(giorni, v)
            },
            v.key
          );
        })
      }
    ),
    /* @__PURE__ */ jsx31(
      FiltriReport,
      {
        value: filtri,
        onChange: setFiltri,
        predefinito: { ...FILTRI_VUOTI, ...filtriIniziali }
      }
    ),
    /* @__PURE__ */ jsx31(
      Section,
      {
        title: "Andamento",
        description: "Una barra per periodo: lo stato all'ultima foto del periodo, non una somma. * = periodo non ancora chiuso o tagliato dal filtro.",
        children: /* @__PURE__ */ jsx31(
          AndamentoCampagna,
          {
            periodi,
            serie: serieAndamento(periodi, impilate),
            inCostruzione,
            titolo: `Andamento di ${nome}`
          }
        )
      }
    ),
    /* @__PURE__ */ jsx31(
      StoricoCampagna,
      {
        righe: storico,
        colonne: colonne2,
        soloMensili: mensili,
        onSoloMensili: setSoloMensili,
        nomeFile: `report_${campagna ?? "campagna"}`
      }
    ),
    /* @__PURE__ */ jsx31(
      Section,
      {
        title: "Variazioni per periodo",
        description: "Di quanto \xE8 cambiato ogni indicatore rispetto alla foto del periodo prima; il colore \xE8 proporzionale al valore della riga. Totale = variazione netta nell'intervallo.",
        children: /* @__PURE__ */ jsx31(VariazioniCampagna, { righe: matrice, periodi })
      }
    )
  ] });
}
export {
  AndamentoCampagna,
  FILTRI_VUOTI,
  FiltriReport,
  GraficoBarre,
  IntestazioneCampagna,
  METRICHE_CAMPAGNA,
  ND,
  PERIODI_MATRICE,
  PaginaReportCampagna,
  SERIE_TEMA,
  Sparkline,
  StoricoCampagna,
  TesseraKpi,
  VariazioniCampagna,
  colonneStorico,
  coloreSerie,
  coloriTema,
  configGraficoBarre,
  formatta as formattaReport,
  normalizzaPeriodi,
  ultimaFoto,
  unisciPerGiorno,
  variazioni as variazioniReport,
  voci as vociReport
};
