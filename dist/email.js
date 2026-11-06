// src/email/EmailTemplateEditor.jsx
import { useEffect as useEffect3, useMemo, useRef as useRef5, useState as useState5 } from "react";
import { Eye, Monitor, Pencil, Send, Smartphone } from "lucide-react";

// src/atoms/Button.jsx
import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

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

// src/atoms/Button.jsx
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
  sm: "h-8 max-sm:min-h-11 px-3 text-xs gap-1.5",
  md: "h-10 max-sm:min-h-11 px-4 text-sm gap-2",
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

// src/molecules/SegmentedControl.jsx
import { useRef } from "react";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var SIZE = {
  sm: "h-7 max-sm:min-h-11 px-3 text-xs",
  md: "h-9 max-sm:min-h-11 px-4 text-sm"
};
function SegmentedControl({
  value,
  onChange,
  options = [],
  size = "sm",
  "aria-label": ariaLabel,
  className
}) {
  const refs = useRef([]);
  const vai = (i) => {
    const n = (i + options.length) % options.length;
    onChange?.(options[n].value);
    refs.current[n]?.focus();
  };
  return /* @__PURE__ */ jsx2(
    "div",
    {
      role: "radiogroup",
      "aria-label": ariaLabel,
      className: cn("inline-flex rounded-lg bg-muted p-1", className),
      children: options.map((o, i) => {
        const attivo = o.value === value;
        const Icon = o.icon;
        return /* @__PURE__ */ jsxs2(
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
              } else if (e.key === "Home") {
                e.preventDefault();
                vai(0);
              } else if (e.key === "End") {
                e.preventDefault();
                vai(options.length - 1);
              }
            },
            className: cn(
              "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              SIZE[size] || SIZE.sm,
              attivo ? "bg-background text-primary shadow" : "text-muted-foreground hover:text-foreground"
            ),
            children: [
              Icon && /* @__PURE__ */ jsx2(Icon, { className: "h-3.5 w-3.5", "aria-hidden": true }),
              o.label
            ]
          },
          o.value
        );
      })
    }
  );
}

// src/email/Canvas.jsx
import { useRef as useRef3, useState } from "react";
import { Plus } from "lucide-react";

// src/email/BlockView.jsx
import { ChevronDown, ChevronUp, Copy, GripVertical, Trash2 } from "lucide-react";

// src/atoms/IconButton.jsx
import { forwardRef as forwardRef2, useEffect } from "react";
import { jsx as jsx3 } from "react/jsx-runtime";
var QUADRATI = {
  sm: "h-8 w-8 max-sm:min-h-11 max-sm:min-w-11",
  md: "h-10 w-10 max-sm:min-h-11 max-sm:min-w-11",
  lg: "h-12 w-12"
};
var haAvvisatoSenzaEtichetta = false;
var ambienteNode = typeof process !== "undefined" ? process.env : void 0;
var IconButton = forwardRef2(function IconButton2({
  icon: Icon,
  label,
  "aria-label": ariaLabel,
  variant = "ghost",
  size = "md",
  className,
  type = "button",
  ...props
}, ref) {
  useEffect(() => {
    if (!label && !ariaLabel && !haAvvisatoSenzaEtichetta && ambienteNode && ambienteNode.NODE_ENV !== "production") {
      console.warn("IconButton richiede label o aria-label per essere accessibile.");
      haAvvisatoSenzaEtichetta = true;
    }
  }, [ariaLabel, label]);
  return /* @__PURE__ */ jsx3(
    "button",
    {
      ref,
      type,
      "aria-label": ariaLabel || label,
      ...props,
      className: cn(
        buttonClasses(variant, size),
        "px-0 gap-0",
        QUADRATI[size],
        className
      ),
      children: Icon && /* @__PURE__ */ jsx3(Icon, { className: "h-4 w-4", "aria-hidden": true })
    }
  );
});
var IconButton_default = IconButton;

// src/email/BlockBody.jsx
import { Database } from "lucide-react";

// src/email/Editable.jsx
import { useLayoutEffect, useRef as useRef2 } from "react";

// src/email/context.js
import { createContext, useContext } from "react";
var EditorContext = createContext({ labels: {} });
var useEditorContext = () => useContext(EditorContext);

// src/email/richText.js
var TONES = ["bad", "warn", "muted"];
var SAFE_HREF = /^(https?:\/\/|mailto:)|^\{\{\s*\w+\s*\}\}$/i;
var VAR_RE = /\{\{\s*(\w+)\s*\}\}/g;
var CHIP_CLASS = "mx-0.5 inline-flex items-center rounded bg-blue-100 px-1.5 text-xs font-semibold text-blue-800 select-none";
var esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
var escAttr = (s) => esc(s).replace(/"/g, "&quot;");
var chipHtml = (name, label) => `<span data-var="${escAttr(name)}" contenteditable="false" class="${CHIP_CLASS}">${esc(label || name)}</span>`;
var withChips = (escaped, labels) => escaped.replace(VAR_RE, (_, v) => chipHtml(v, labels[v] ?? v));
function walk(root, edit, labels) {
  let out = "";
  for (const n of root.childNodes) {
    if (n.nodeType === 3) {
      const t = esc(n.nodeValue.replace(/ /g, " "));
      out += edit ? withChips(t, labels) : t;
      continue;
    }
    if (n.nodeType !== 1) continue;
    const tag = n.tagName.toLowerCase();
    if (!edit && n.dataset?.var) {
      out += `{{${n.dataset.var}}}`;
      continue;
    }
    if (tag === "script" || tag === "style") continue;
    const inner = () => walk(n, edit, labels);
    if (tag === "b" || tag === "strong") out += `<b>${inner()}</b>`;
    else if (tag === "i" || tag === "em") out += `<i>${inner()}</i>`;
    else if (tag === "br") out += "<br>";
    else if (tag === "a") {
      const href = n.getAttribute("href") || "";
      out += SAFE_HREF.test(href) ? `<a href="${escAttr(href)}">${inner()}</a>` : inner();
    } else if (tag === "span" && TONES.includes(n.dataset?.tone)) {
      out += `<span data-tone="${n.dataset.tone}">${inner()}</span>`;
    } else if (tag === "div" || tag === "p") {
      out += (out && !out.endsWith("<br>") ? "<br>" : "") + inner();
    } else out += inner();
  }
  return out;
}
function parse(html) {
  const t = document.createElement("template");
  t.innerHTML = html;
  return t.content;
}
var toEditable = (html, labels = {}) => walk(parse(html || ""), true, labels);
var fromEditable = (el) => walk(el, false, {});
var toEditablePlain = (text, labels = {}) => withChips(esc(text || ""), labels);
function fromEditablePlain(el) {
  let s = "";
  for (const c of el.childNodes) {
    if (c.nodeType === 3) s += c.nodeValue;
    else if (c.nodeType === 1) s += c.dataset?.var ? `{{${c.dataset.var}}}` : fromEditablePlain(c);
  }
  return s.replace(/ /g, " ").replace(/\n/g, " ");
}
var fire = (el) => el.dispatchEvent(new Event("input", { bubbles: true }));
function rangeIn(el, range) {
  if (range && el.contains(range.commonAncestorContainer)) return range;
  const r2 = el.ownerDocument.createRange();
  r2.selectNodeContents(el);
  r2.collapse(false);
  return r2;
}
function insertVariable(el, range, name, label) {
  const r2 = rangeIn(el, range);
  r2.deleteContents();
  const tpl = el.ownerDocument.createElement("template");
  tpl.innerHTML = `${chipHtml(name, label)} `;
  const frag = tpl.content;
  const last = frag.lastChild;
  r2.insertNode(frag);
  r2.setStartAfter(last);
  r2.collapse(true);
  const sel = el.ownerDocument.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(r2);
  fire(el);
}
function applyFormat({ el, range }, cmd, arg) {
  if (!el?.isConnected || !range) return false;
  const doc = el.ownerDocument;
  const sel = doc.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  if (cmd === "bold" || cmd === "italic") doc.execCommand?.(cmd);
  else if (!range.collapsed) {
    let w;
    if (cmd === "tone") {
      w = doc.createElement("span");
      w.dataset.tone = "bad";
    } else if (cmd === "link" && SAFE_HREF.test(arg || "")) {
      w = doc.createElement("a");
      w.setAttribute("href", arg);
    } else return false;
    w.append(range.extractContents());
    range.insertNode(w);
  } else return false;
  fire(el);
  return true;
}
function insertPlainText(text) {
  document.execCommand?.("insertText", false, text);
}

// src/email/Editable.jsx
import { jsx as jsx4 } from "react/jsx-runtime";
function Editable({
  as: Tag = "div",
  value,
  onChange,
  rich = false,
  readOnly = false,
  className,
  ...rest
}) {
  const { labels } = useEditorContext();
  const ref = useRef2(null);
  const read = () => rich ? fromEditable(ref.current) : fromEditablePlain(ref.current);
  useLayoutEffect(() => {
    const el = ref.current;
    if (read() === (value ?? "")) return;
    el.innerHTML = rich ? toEditable(value, labels) : toEditablePlain(value, labels);
  }, [value, labels, rich]);
  return /* @__PURE__ */ jsx4(
    Tag,
    {
      ...rest,
      ref,
      "data-editable": "",
      role: "textbox",
      "aria-multiline": rich || void 0,
      "aria-readonly": readOnly || void 0,
      contentEditable: !readOnly,
      suppressContentEditableWarning: true,
      spellCheck: false,
      className: cn("min-h-[1.4em] outline-none focus-visible:ring-2 focus-visible:ring-blue-500", className),
      onInput: () => onChange?.(read()),
      onKeyDown: (e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
        if (rich) document.execCommand?.("insertLineBreak");
      },
      onPaste: (e) => {
        e.preventDefault();
        insertPlainText(e.clipboardData.getData("text/plain"));
      }
    }
  );
}

// src/email/BlockBody.jsx
import { jsx as jsx5, jsxs as jsxs3 } from "react/jsx-runtime";
var CELL = "border-b border-slate-200 px-2 py-1.5 text-left align-top";
function BlockBody({ block, onPatch, catalog, preview, sourceLabel }) {
  const { type } = block;
  if (type === "text")
    return /* @__PURE__ */ jsx5(Editable, { as: "p", rich: true, "aria-label": "Testo", value: block.html, onChange: (html) => onPatch({ html }), className: "my-1.5" });
  if (type === "heading")
    return /* @__PURE__ */ jsx5(
      Editable,
      {
        "aria-label": "Titolo",
        value: block.text,
        onChange: (text) => onPatch({ text }),
        className: block.level === 1 ? "my-1.5 text-lg font-bold" : "mb-1 mt-2 text-[15px] font-bold"
      }
    );
  if (type === "table") {
    const setCol = (i, v) => onPatch({ columns: block.columns.map((c, k) => k === i ? v : c) });
    const setCell = (r2, c, v) => onPatch({ rows: block.rows.map((row, i) => i === r2 ? row.map((x, k) => k === c ? v : x) : row) });
    return /* @__PURE__ */ jsx5("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs3("table", { className: "my-1 w-full border-collapse text-[13px]", children: [
      /* @__PURE__ */ jsx5("thead", { children: /* @__PURE__ */ jsx5("tr", { children: block.columns.map((c, i) => /* @__PURE__ */ jsx5(Editable, { as: "th", "aria-label": `Intestazione ${i + 1}`, value: c, onChange: (v) => setCol(i, v), className: cn(CELL, "bg-slate-100 text-xs text-slate-600") }, i)) }) }),
      /* @__PURE__ */ jsx5("tbody", { children: block.rows.map((row, r2) => /* @__PURE__ */ jsx5("tr", { children: row.map((c, i) => /* @__PURE__ */ jsx5(Editable, { as: "td", "aria-label": `Riga ${r2 + 1}, colonna ${i + 1}`, value: c, onChange: (v) => setCell(r2, i, v), className: CELL }, i)) }, r2)) })
    ] }) });
  }
  if (type === "button")
    return /* @__PURE__ */ jsx5(
      "span",
      {
        className: cn(
          "my-1 inline-block rounded-md px-4 py-2 font-bold",
          block.style === "secondary" ? "border border-blue-600 bg-white text-blue-600" : "bg-blue-600 text-white"
        ),
        children: block.label || "Pulsante"
      }
    );
  if (type === "divider") return /* @__PURE__ */ jsx5("hr", { className: "my-2.5 border-0 border-t border-slate-200" });
  if (type === "image")
    return /* @__PURE__ */ jsx5("div", { className: "py-1.5", children: /* @__PURE__ */ jsx5(
      "div",
      {
        style: { width: block.width },
        className: "flex h-11 max-w-full items-center justify-center rounded-md bg-gradient-to-r from-blue-900 to-blue-600 font-bold tracking-widest text-white",
        children: "VUS COM"
      }
    ) });
  if (type === "footer")
    return /* @__PURE__ */ jsxs3("div", { className: "rounded border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-600", children: [
      /* @__PURE__ */ jsx5("div", { className: "mb-1.5 inline-block rounded bg-gradient-to-r from-blue-900 to-blue-600 px-2 py-0.5 text-[10px] font-bold tracking-widest text-white", children: "VUS COM" }),
      /* @__PURE__ */ jsx5(Editable, { rich: true, "aria-label": "Pi\xE8 di pagina", value: block.html, onChange: (html) => onPatch({ html }) }),
      block.style !== "short" && /* @__PURE__ */ jsx5("p", { className: "mt-1.5 border-t border-slate-200 pt-1.5 text-[10.5px] text-slate-500", children: "Banner e informativa privacy" })
    ] });
  if (type === "code")
    return /* @__PURE__ */ jsx5("pre", { className: "my-1 whitespace-pre-wrap break-words rounded border border-slate-200 bg-slate-100 p-2.5 font-mono text-xs text-slate-800", children: block.text || "Dettaglio tecnico (errore, log)" });
  if (type === "data") {
    const info = catalog?.dataBlocks?.find((d) => d.name === block.ref);
    const part = preview?.parts?.[block.id];
    return /* @__PURE__ */ jsxs3("div", { className: "relative rounded-r-md border-l-[3px] border-violet-500 bg-violet-50 px-2 py-1.5", children: [
      /* @__PURE__ */ jsxs3("span", { className: "absolute right-1.5 top-1 inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 text-[10.5px] text-violet-700", children: [
        /* @__PURE__ */ jsx5(Database, { className: "h-3 w-3", "aria-hidden": true }),
        "Calcolato da ",
        sourceLabel,
        " \xB7 ",
        info?.label ?? block.ref
      ] }),
      part ? /* @__PURE__ */ jsx5("div", { className: "pt-4", dangerouslySetInnerHTML: { __html: part } }) : /* @__PURE__ */ jsx5("p", { className: "pt-4 text-xs text-slate-600", children: info?.description ?? `Dati \xAB${block.ref}\xBB` })
    ] });
  }
  if (type === "html")
    return /* @__PURE__ */ jsxs3("div", { children: [
      /* @__PURE__ */ jsx5("p", { className: "mb-1 text-xs text-amber-700", children: "Blocco HTML da un template vecchio" }),
      /* @__PURE__ */ jsx5("iframe", { title: "Anteprima del blocco HTML", sandbox: "", srcDoc: block.html, className: "h-40 w-full rounded border border-slate-200 bg-white" })
    ] });
  return /* @__PURE__ */ jsxs3("p", { className: "text-xs text-slate-500", children: [
    "Blocco sconosciuto (",
    type,
    ")"
  ] });
}

// src/email/blocks.js
import {
  Heading,
  Image,
  Minus,
  MousePointerClick,
  PanelBottom,
  Table,
  Terminal,
  Type
} from "lucide-react";
var FOOTER_HTML = "Sede legale: {{sede}}<br>{{cap_citta}}<br>{{email}}";
var BASE_BLOCKS = [
  { type: "text", label: "Testo", icon: Type },
  { type: "heading", label: "Titolo", icon: Heading },
  { type: "table", label: "Tabella", icon: Table },
  { type: "button", label: "Pulsante", icon: MousePointerClick },
  { type: "divider", label: "Separatore", icon: Minus },
  { type: "image", label: "Logo", icon: Image },
  { type: "footer", label: "Pi\xE8 di pagina", icon: PanelBottom },
  { type: "code", label: "Dettaglio tecnico", icon: Terminal }
];
var TYPE_LABEL = {
  ...Object.fromEntries(BASE_BLOCKS.map((b) => [b.type, b.label])),
  data: "Dati",
  html: "HTML"
};
var DEFAULTS = {
  text: () => ({ html: "Nuovo paragrafo." }),
  heading: () => ({ level: 2, text: "Nuovo titolo" }),
  table: () => ({
    columns: ["Voce", "Valore"],
    rows: [
      ["", ""],
      ["", ""]
    ]
  }),
  button: () => ({ label: "Apri la pratica", url: "", style: "primary" }),
  divider: () => ({}),
  image: () => ({ asset: "logo_vuscom_blu.png", width: 160 }),
  footer: () => ({ html: FOOTER_HTML }),
  code: () => ({ text: "" }),
  data: () => ({ missing: "warn" })
};
function nextId(blocks) {
  const used = new Set(blocks.map((b) => b.id));
  let n = blocks.length + 1;
  while (used.has(`b${n}`)) n += 1;
  return `b${n}`;
}
var newBlock = (type, blocks, extra = {}) => ({
  id: nextId(blocks),
  type,
  ...DEFAULTS[type](),
  ...extra
});
function insertAfter(blocks, selectedId, block) {
  const i = blocks.findIndex((b) => b.id === selectedId);
  const at = i < 0 ? blocks.length : i + 1;
  return [...blocks.slice(0, at), block, ...blocks.slice(at)];
}
function moveBy(blocks, id, delta) {
  const i = blocks.findIndex((b) => b.id === id);
  const j = i + delta;
  if (i < 0 || j < 0 || j >= blocks.length) return blocks;
  const out = [...blocks];
  [out[i], out[j]] = [out[j], out[i]];
  return out;
}
function moveTo(blocks, fromId, toId) {
  if (fromId === toId) return blocks;
  const moving = blocks.find((b) => b.id === fromId);
  if (!moving) return blocks;
  const rest = blocks.filter((b) => b.id !== fromId);
  const at = rest.findIndex((b) => b.id === toId);
  if (at < 0) return blocks;
  return [...rest.slice(0, at), moving, ...rest.slice(at)];
}
function duplicate(blocks, id) {
  const i = blocks.findIndex((b) => b.id === id);
  if (i < 0) return { blocks, id: null };
  const copy = { ...structuredClone(blocks[i]), id: nextId(blocks) };
  return { blocks: [...blocks.slice(0, i + 1), copy, ...blocks.slice(i + 1)], id: copy.id };
}
var patchBlock = (blocks, id, patch) => blocks.map((b) => {
  if (b.id !== id) return b;
  const next = { ...b, ...patch };
  for (const k of Object.keys(next)) if (next[k] === void 0) delete next[k];
  return next;
});

// src/email/BlockView.jsx
import { jsx as jsx6, jsxs as jsxs4 } from "react/jsx-runtime";
function BlockView({
  block,
  index,
  total,
  selected,
  armed,
  over,
  showIfLabel,
  actions,
  bodyProps
}) {
  const { select, move, duplicate: duplicate2, remove, arm, dragStart, dragOver, drop, dragEnd } = actions;
  const name = TYPE_LABEL[block.type] ?? block.type;
  const bar = "h-7 w-7 max-sm:min-h-9 max-sm:min-w-9";
  return /* @__PURE__ */ jsxs4(
    "div",
    {
      "data-block": block.id,
      role: "group",
      "aria-label": `Blocco ${index + 1} di ${total}: ${name}`,
      "aria-current": selected || void 0,
      tabIndex: 0,
      draggable: armed,
      onClick: () => select(block.id),
      onFocusCapture: () => select(block.id),
      onKeyDown: (e) => e.target === e.currentTarget && e.key === "Enter" && select(block.id),
      onDragStart: (e) => dragStart(e, block.id),
      onDragOver: (e) => dragOver(e, block.id),
      onDrop: (e) => drop(e, block.id),
      onDragEnd: dragEnd,
      className: cn(
        "group relative -mx-1.5 my-0.5 rounded-md border px-1.5 py-1 outline-none",
        "focus-visible:ring-2 focus-visible:ring-blue-500",
        selected ? "border-blue-600 shadow-[0_0_0_3px_rgb(37_99_235/0.15)]" : "border-dashed border-transparent hover:border-slate-300",
        over && "border-t-4 border-t-blue-600"
      ),
      children: [
        /* @__PURE__ */ jsxs4(
          "div",
          {
            className: cn(
              "absolute -top-4 right-1 z-10 gap-0.5 rounded-md border border-border bg-card p-0.5 text-foreground shadow-sm",
              selected ? "flex" : "hidden group-focus-within:flex group-hover:flex"
            ),
            children: [
              /* @__PURE__ */ jsx6(IconButton_default, { icon: GripVertical, size: "sm", "aria-label": "Trascina per spostare", className: cn(bar, "cursor-grab"), onMouseDown: () => arm(block.id), onMouseUp: () => arm(null) }),
              /* @__PURE__ */ jsx6(IconButton_default, { icon: ChevronUp, size: "sm", "aria-label": "Sposta su", disabled: index === 0, className: bar, onClick: (e) => {
                e.stopPropagation();
                move(block.id, -1);
              } }),
              /* @__PURE__ */ jsx6(IconButton_default, { icon: ChevronDown, size: "sm", "aria-label": "Sposta gi\xF9", disabled: index === total - 1, className: bar, onClick: (e) => {
                e.stopPropagation();
                move(block.id, 1);
              } }),
              /* @__PURE__ */ jsx6(IconButton_default, { icon: Copy, size: "sm", "aria-label": "Duplica", className: bar, onClick: (e) => {
                e.stopPropagation();
                duplicate2(block.id);
              } }),
              /* @__PURE__ */ jsx6(IconButton_default, { icon: Trash2, size: "sm", "aria-label": "Elimina", className: bar, onClick: (e) => {
                e.stopPropagation();
                remove(block.id);
              } })
            ]
          }
        ),
        /* @__PURE__ */ jsx6(BlockBody, { block, ...bodyProps, onPatch: (patch) => actions.patch(block.id, patch) }),
        showIfLabel && /* @__PURE__ */ jsxs4("span", { className: "mt-1 inline-block rounded-full bg-amber-100 px-2 text-[11px] text-amber-800", children: [
          "Solo se: ",
          showIfLabel
        ] })
      ]
    }
  );
}

// src/email/Canvas.jsx
import { jsx as jsx7, jsxs as jsxs5 } from "react/jsx-runtime";
function Canvas({
  template,
  selectedId,
  phone,
  catalog,
  preview,
  sourceLabel,
  actions,
  onSubject,
  onAddText
}) {
  const [armed, setArmed] = useState(null);
  const [over, setOver] = useState(null);
  const dragged = useRef3(null);
  const { blocks } = template;
  const labelOf = (name) => catalog?.variables?.find((v) => v.name === name)?.label ?? catalog?.dataBlocks?.find((d) => d.name === name)?.label ?? name;
  const dnd = {
    ...actions,
    arm: setArmed,
    dragStart: (e, id) => {
      dragged.current = id;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", id);
    },
    dragOver: (e, id) => {
      if (!dragged.current) return;
      e.preventDefault();
      setOver(id);
    },
    drop: (e, id) => {
      if (!dragged.current) return;
      e.preventDefault();
      actions.reorder(dragged.current, id);
    },
    dragEnd: () => {
      dragged.current = null;
      setArmed(null);
      setOver(null);
    }
  };
  return /* @__PURE__ */ jsxs5("div", { className: "mx-auto w-full max-w-[640px]", children: [
    /* @__PURE__ */ jsxs5("div", { className: "mb-3 flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2", children: [
      /* @__PURE__ */ jsx7("span", { className: "shrink-0 text-xs text-muted-foreground", children: "Oggetto" }),
      /* @__PURE__ */ jsx7(Editable, { "aria-label": "Oggetto", value: template.subject, onChange: onSubject, className: "min-w-0 flex-1 font-semibold text-foreground" })
    ] }),
    /* @__PURE__ */ jsxs5("div", { className: cn("mx-auto rounded-md border border-border bg-white px-6 py-5 font-sans text-sm text-slate-900 transition-[max-width]", phone ? "max-w-[375px] !px-4 !py-4" : "max-w-[640px]"), children: [
      blocks.length === 0 && /* @__PURE__ */ jsx7("p", { className: "py-8 text-center text-slate-600", children: "Email vuota: aggiungi un blocco dalla colonna di sinistra." }),
      blocks.map((b, i) => /* @__PURE__ */ jsx7(
        BlockView,
        {
          block: b,
          index: i,
          total: blocks.length,
          selected: b.id === selectedId,
          armed: armed === b.id,
          over: over === b.id && dragged.current !== b.id,
          showIfLabel: b.show_if ? labelOf(b.show_if) : null,
          actions: dnd,
          bodyProps: { catalog, preview, sourceLabel }
        },
        b.id
      ))
    ] }),
    /* @__PURE__ */ jsx7("div", { className: "mt-2 flex justify-center", children: /* @__PURE__ */ jsx7(Button_default, { variant: "outline", size: "sm", icon: Plus, className: "border-dashed", onClick: onAddText, children: "Aggiungi testo in fondo" }) })
  ] });
}

// src/email/Palette.jsx
import { Database as Database2 } from "lucide-react";
import { jsx as jsx8, jsxs as jsxs6 } from "react/jsx-runtime";
var TILE = "flex items-center gap-2 rounded-lg border border-border bg-card p-2 text-left text-[12.5px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
var Titolo = ({ children }) => /* @__PURE__ */ jsx8("h3", { className: "mb-2 mt-1 text-[11.5px] font-semibold uppercase tracking-wider text-muted-foreground", children });
function Palette({ catalog, onAdd, onInsertVariable }) {
  const dataBlocks = catalog?.dataBlocks ?? [];
  const variables = catalog?.variables ?? [];
  return /* @__PURE__ */ jsxs6("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs6("section", { "aria-label": "Aggiungi un blocco", children: [
      /* @__PURE__ */ jsx8(Titolo, { children: "Aggiungi un blocco" }),
      /* @__PURE__ */ jsx8("div", { className: "grid grid-cols-2 gap-1.5", children: BASE_BLOCKS.map(({ type, label, icon: Icon }) => /* @__PURE__ */ jsxs6("button", { type: "button", onClick: () => onAdd(type), className: cn(TILE, "hover:border-primary hover:bg-primary/10"), children: [
        /* @__PURE__ */ jsx8(Icon, { className: "h-4 w-4 shrink-0 text-primary", "aria-hidden": true }),
        label
      ] }, type)) })
    ] }),
    dataBlocks.length > 0 && /* @__PURE__ */ jsxs6("section", { "aria-label": "Dati", children: [
      /* @__PURE__ */ jsx8(Titolo, { children: "Dati" }),
      /* @__PURE__ */ jsx8("div", { className: "grid gap-1.5", children: dataBlocks.map((d) => /* @__PURE__ */ jsxs6(
        "button",
        {
          type: "button",
          onClick: () => onAdd("data", { ref: d.name }),
          className: cn(TILE, "hover:border-violet-500 hover:bg-violet-500/10"),
          children: [
            /* @__PURE__ */ jsx8(Database2, { className: "h-4 w-4 shrink-0 text-violet-600 dark:text-violet-300", "aria-hidden": true }),
            /* @__PURE__ */ jsxs6("span", { className: "min-w-0", children: [
              d.label,
              d.description && /* @__PURE__ */ jsx8("small", { className: "block text-[11.5px] font-normal leading-tight text-muted-foreground", children: d.description })
            ] })
          ]
        },
        d.name
      )) })
    ] }),
    variables.length > 0 && /* @__PURE__ */ jsxs6("section", { "aria-label": "Variabili", children: [
      /* @__PURE__ */ jsx8(Titolo, { children: "Variabili" }),
      /* @__PURE__ */ jsx8("div", { className: "flex flex-wrap gap-1.5", children: variables.map((v) => /* @__PURE__ */ jsx8(
        "button",
        {
          type: "button",
          title: `{{${v.name}}}`,
          onMouseDown: (e) => e.preventDefault(),
          onClick: () => onInsertVariable(v.name),
          className: "rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          children: v.label
        },
        v.name
      )) }),
      /* @__PURE__ */ jsx8("p", { className: "mt-1.5 text-[11.5px] text-muted-foreground", children: "Clic su una variabile: entra nel testo dove c'\xE8 il cursore. Nel testo si vede come etichetta azzurra." })
    ] })
  ] });
}

// src/email/PropertiesPanel.jsx
import { Plus as Plus2 } from "lucide-react";

// src/atoms/Input.jsx
import { forwardRef as forwardRef3 } from "react";
import { jsx as jsx9, jsxs as jsxs7 } from "react/jsx-runtime";
var CAMPO = "w-full rounded-lg border bg-background text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50";
var campoClasses = (invalid) => cn(
  CAMPO,
  // Error wired from outside (Field sets aria-invalid) must look invalid without the prop.
  "aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive",
  invalid ? "border-destructive focus-visible:ring-destructive/40" : "border-input hover:border-ring/60 focus-visible:border-ring focus-visible:ring-ring"
);
var Input = forwardRef3(function Input2({ invalid, icon: Icon, className, ...props }, ref) {
  const input = /* @__PURE__ */ jsx9(
    "input",
    {
      ref,
      "aria-invalid": invalid ? "true" : void 0,
      ...props,
      className: cn(
        campoClasses(invalid),
        "h-10 max-sm:min-h-11 px-3",
        Icon && "pl-9",
        className
      )
    }
  );
  if (!Icon) return input;
  return /* @__PURE__ */ jsxs7("div", { className: "relative w-full", children: [
    /* @__PURE__ */ jsx9(
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
import { jsx as jsx10 } from "react/jsx-runtime";
var Textarea = forwardRef4(function Textarea2({ invalid, className, rows = 3, ...props }, ref) {
  return /* @__PURE__ */ jsx10(
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

// src/molecules/Select.jsx
import { useEffect as useEffect2, useId, useRef as useRef4, useState as useState3 } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown as ChevronDown2 } from "lucide-react";

// src/molecules/useFloatingList.js
import { useCallback, useLayoutEffect as useLayoutEffect2, useState as useState2 } from "react";
var GAP = 4;
var MAX_HEIGHT = 256;
var MARGIN = 8;
function useFloatingList(triggerRef, open) {
  const [style, setStyle] = useState2(null);
  const misura = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r2 = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const sotto = vh - r2.bottom - GAP - MARGIN;
    const sopra = r2.top - GAP - MARGIN;
    const suSu = sotto < MAX_HEIGHT && sopra > sotto;
    const spazio = Math.max(suSu ? sopra : sotto, 0);
    setStyle({
      position: "fixed",
      left: r2.left,
      width: r2.width,
      maxHeight: Math.min(MAX_HEIGHT, spazio) || MAX_HEIGHT,
      ...suSu ? { bottom: vh - r2.top + GAP } : { top: r2.bottom + GAP }
    });
  }, [triggerRef]);
  useLayoutEffect2(() => {
    if (!open) return void 0;
    misura();
    const suScroll = (e) => {
      const t = e.target;
      if (!(t instanceof Element) || t.contains(triggerRef.current))
        misura();
    };
    window.addEventListener("scroll", suScroll, true);
    window.addEventListener("resize", misura);
    return () => {
      window.removeEventListener("scroll", suScroll, true);
      window.removeEventListener("resize", misura);
    };
  }, [open, misura, triggerRef]);
  return style;
}

// src/molecules/Select.jsx
import { jsx as jsx11, jsxs as jsxs8 } from "react/jsx-runtime";
var CLEAR = "__clear__";
var BUFFER_MS = 500;
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
  onKeyDown: onKeyDownProp,
  onKeyUp: onKeyUpProp,
  onClick: onClickProp,
  ...rest
}) {
  const [open, setOpen] = useState3(false);
  const [active, setActive] = useState3(-1);
  const rootRef = useRef4(null);
  const triggerRef = useRef4(null);
  const listRef = useRef4(null);
  const buffer = useRef4("");
  const bufferTimer = useRef4(null);
  const uid = useId();
  const triggerId = rest.id ?? `${uid}-trigger`;
  const listStyle = useFloatingList(triggerRef, open);
  const entries = [
    ...allowClear ? [{ value: CLEAR, label: "Nessuno", clear: true }] : [],
    ...options
  ];
  const selected = options.find((o) => o.value === value);
  const optId = (i) => `${uid}-opt-${i}`;
  useEffect2(() => {
    if (!open) return void 0;
    const fuori = (e) => {
      const dentro = rootRef.current?.contains(e.target) || listRef.current?.contains(e.target);
      if (!dentro) setOpen(false);
    };
    document.addEventListener("mousedown", fuori);
    return () => document.removeEventListener("mousedown", fuori);
  }, [open]);
  useEffect2(() => () => clearTimeout(bufferTimer.current), []);
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
  const estremo = (dir) => {
    const abilitate = entries.map((o, i) => o.disabled ? -1 : i).filter((i) => i >= 0);
    return dir > 0 ? abilitate[abilitate.length - 1] : abilitate[0];
  };
  const vaiA = (i) => {
    if (i === void 0) return;
    setActive(i);
    setOpen(true);
  };
  const cerca = (carattere) => {
    clearTimeout(bufferTimer.current);
    buffer.current += carattere.toLowerCase();
    bufferTimer.current = setTimeout(() => {
      buffer.current = "";
    }, BUFFER_MS);
    const i = entries.findIndex(
      (o) => !o.disabled && typeof o.label === "string" && o.label.toLowerCase().startsWith(buffer.current)
    );
    if (i >= 0) vaiA(i);
  };
  const onKeyDown = (e) => {
    onKeyDownProp?.(e);
    if (disabled || e.defaultPrevented) return;
    const stampabile = e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && (e.key !== " " || buffer.current !== "");
    if (stampabile) {
      e.preventDefault();
      cerca(e.key);
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      vaiA(estremo(e.key === "End" ? 1 : -1));
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
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
  return /* @__PURE__ */ jsxs8("div", { ref: rootRef, className: cn("relative", className), children: [
    /* @__PURE__ */ jsxs8(
      "button",
      {
        ...rest,
        ref: triggerRef,
        id: triggerId,
        type: "button",
        role: "combobox",
        disabled,
        "aria-label": ariaLabel,
        "aria-haspopup": "listbox",
        "aria-expanded": open,
        "aria-controls": open ? `${uid}-list` : void 0,
        "aria-activedescendant": open && active >= 0 ? optId(active) : void 0,
        "aria-invalid": invalid ? "true" : void 0,
        onClick: (e) => {
          onClickProp?.(e);
          if (!e.defaultPrevented) open ? setOpen(false) : apri();
        },
        onKeyDown,
        onKeyUp: (e) => {
          onKeyUpProp?.(e);
          if (e.key === " ") e.preventDefault();
        },
        className: cn(
          campoClasses(invalid),
          "flex h-10 max-sm:min-h-11 items-center justify-between gap-2 px-3 text-left"
        ),
        children: [
          /* @__PURE__ */ jsx11("span", { className: cn("truncate", !selected && "text-muted-foreground"), children: selected ? selected.label : placeholder }),
          /* @__PURE__ */ jsx11(
            ChevronDown2,
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
    open && createPortal(
      /* @__PURE__ */ jsx11(
        "ul",
        {
          ref: listRef,
          id: `${uid}-list`,
          role: "listbox",
          "aria-labelledby": triggerId,
          "aria-label": ariaLabel,
          style: listStyle ?? { position: "fixed" },
          onMouseDown: (e) => e.preventDefault(),
          className: "z-[70] max-h-64 overflow-y-auto rounded-lg border border-border bg-card py-1 shadow-lg",
          children: entries.map((o, i) => {
            const sel = !o.clear && o.value === value;
            return /* @__PURE__ */ jsxs8(
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
                  /* @__PURE__ */ jsxs8("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsx11("div", { className: "font-medium", children: o.label }),
                    o.description && /* @__PURE__ */ jsx11("div", { className: "mt-0.5 text-xs text-muted-foreground", children: o.description })
                  ] }),
                  sel && /* @__PURE__ */ jsx11(Check, { className: "mt-0.5 h-4 w-4 shrink-0", "aria-hidden": true })
                ]
              },
              o.value
            );
          })
        }
      ),
      document.body
    )
  ] });
}

// src/email/FormatBar.jsx
import { useState as useState4 } from "react";
import { Bold, Italic, Link as LinkIcon } from "lucide-react";
import { jsx as jsx12, jsxs as jsxs9 } from "react/jsx-runtime";
function FormatBar({ caret }) {
  const [asking, setAsking] = useState4(false);
  const [url, setUrl] = useState4("");
  const keep = (e) => e.preventDefault();
  const run = (cmd, arg) => caret.current && applyFormat(caret.current, cmd, arg);
  return /* @__PURE__ */ jsxs9("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxs9("div", { className: "flex flex-wrap gap-1", onMouseDown: keep, children: [
      /* @__PURE__ */ jsx12(IconButton_default, { icon: Bold, variant: "outline", size: "sm", "aria-label": "Grassetto", onClick: () => run("bold") }),
      /* @__PURE__ */ jsx12(IconButton_default, { icon: Italic, variant: "outline", size: "sm", "aria-label": "Corsivo", onClick: () => run("italic") }),
      /* @__PURE__ */ jsx12(Button_default, { variant: "outline", size: "sm", "aria-label": "Rosso", className: "font-bold text-red-700", onClick: () => run("tone"), children: "A" }),
      /* @__PURE__ */ jsx12(Button_default, { variant: "outline", size: "sm", icon: LinkIcon, "aria-expanded": asking, onClick: () => setAsking((a) => !a), children: "Link" })
    ] }),
    asking && /* @__PURE__ */ jsxs9("div", { className: "flex gap-1", children: [
      /* @__PURE__ */ jsx12(Input_default, { "aria-label": "Indirizzo del link", placeholder: "https://\u2026 o {{variabile}}", value: url, onChange: (e) => setUrl(e.target.value) }),
      /* @__PURE__ */ jsx12(
        Button_default,
        {
          size: "sm",
          className: "shrink-0",
          onMouseDown: keep,
          onClick: () => {
            if (run("link", url.trim())) {
              setAsking(false);
              setUrl("");
            }
          },
          children: "Applica"
        }
      )
    ] })
  ] });
}

// src/email/PropertiesPanel.jsx
import { Fragment, jsx as jsx13, jsxs as jsxs10 } from "react/jsx-runtime";
var Row = ({ label, children, hint }) => /* @__PURE__ */ jsxs10("div", { className: "grid gap-1.5", children: [
  /* @__PURE__ */ jsx13("span", { className: "text-xs font-semibold", children: label }),
  children,
  hint && /* @__PURE__ */ jsx13("p", { className: "text-[11.5px] text-muted-foreground", children: hint })
] });
var ALWAYS = "";
function PropertiesPanel({ block, catalog, caret, onPatch, mode, preview }) {
  if (mode === "preview")
    return /* @__PURE__ */ jsxs10("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx13("h3", { className: "text-[11.5px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Anteprima" }),
      /* @__PURE__ */ jsxs10("div", { className: "rounded-lg border border-border bg-muted p-2.5 text-[12.5px]", children: [
        /* @__PURE__ */ jsx13("b", { className: "block", children: "Com'\xE8 l'email con i dati di prova" }),
        "Oggetto: ",
        preview?.subject ?? "\u2014"
      ] })
    ] });
  if (!block)
    return /* @__PURE__ */ jsxs10("div", { children: [
      /* @__PURE__ */ jsx13("h3", { className: "mb-2 text-[11.5px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Propriet\xE0" }),
      /* @__PURE__ */ jsx13("p", { className: "text-sm text-muted-foreground", children: "Scegli un blocco nell'email per vederne le propriet\xE0." })
    ] });
  const showIf = [
    { value: ALWAYS, label: "Sempre" },
    ...(catalog?.variables ?? []).map((v) => ({ value: v.name, label: `Variabile \xB7 ${v.label}` })),
    ...(catalog?.dataBlocks ?? []).map((d) => ({ value: d.name, label: `Dati \xB7 ${d.label}` }))
  ];
  if (block.show_if && !showIf.some((o) => o.value === block.show_if))
    showIf.push({ value: block.show_if, label: block.show_if });
  const info = block.type === "data" ? catalog?.dataBlocks?.find((d) => d.name === block.ref) : null;
  return /* @__PURE__ */ jsxs10("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsx13("h3", { className: "text-[11.5px] font-semibold uppercase tracking-wider text-muted-foreground", children: TYPE_LABEL[block.type] ?? block.type }),
    (block.type === "text" || block.type === "footer") && /* @__PURE__ */ jsx13(Row, { label: "Formato del testo selezionato", hint: "Scrivi direttamente nell'email. Per una variabile, clic su un'etichetta a sinistra.", children: /* @__PURE__ */ jsx13(FormatBar, { caret }) }),
    block.type === "footer" && /* @__PURE__ */ jsx13(Row, { label: "Stile del pi\xE8 di pagina", children: /* @__PURE__ */ jsx13(SegmentedControl, { "aria-label": "Stile del pi\xE8 di pagina", value: block.style ?? "full", onChange: (style) => onPatch({ style: style === "full" ? void 0 : style }), options: [{ value: "full", label: "Completo (firma e banner)" }, { value: "short", label: "Corto (logo e nome del portale)" }] }) }),
    block.type === "code" && /* @__PURE__ */ jsx13(Row, { label: "Testo", hint: "Testo semplice su pi\xF9 righe, per errori e log. Le variabili si scrivono come {{nome}}.", children: /* @__PURE__ */ jsx13(Textarea_default, { "aria-label": "Testo del dettaglio tecnico", rows: 6, className: "font-mono text-xs", value: block.text, onChange: (e) => onPatch({ text: e.target.value }) }) }),
    block.type === "heading" && /* @__PURE__ */ jsx13(Row, { label: "Grandezza", children: /* @__PURE__ */ jsx13(SegmentedControl, { "aria-label": "Grandezza", value: block.level, onChange: (level) => onPatch({ level }), options: [{ value: 1, label: "Titolo" }, { value: 2, label: "Sottotitolo" }] }) }),
    block.type === "table" && /* @__PURE__ */ jsx13(Row, { label: "Tabella", hint: "Scrivi nelle celle, anche con variabili.", children: /* @__PURE__ */ jsxs10("div", { className: "flex flex-wrap gap-1.5", children: [
      /* @__PURE__ */ jsx13(Button_default, { variant: "outline", size: "sm", icon: Plus2, onClick: () => onPatch({ rows: [...block.rows, block.columns.map(() => "")] }), children: "Riga" }),
      /* @__PURE__ */ jsx13(Button_default, { variant: "outline", size: "sm", icon: Plus2, onClick: () => onPatch({ columns: [...block.columns, "Nuova"], rows: block.rows.map((r2) => [...r2, ""]) }), children: "Colonna" }),
      /* @__PURE__ */ jsx13(Button_default, { variant: "outline", size: "sm", disabled: block.rows.length < 2, onClick: () => onPatch({ rows: block.rows.slice(0, -1) }), children: "Togli riga" })
    ] }) }),
    block.type === "button" && /* @__PURE__ */ jsxs10(Fragment, { children: [
      /* @__PURE__ */ jsx13(Row, { label: "Testo del pulsante", children: /* @__PURE__ */ jsx13(Input_default, { "aria-label": "Testo del pulsante", value: block.label, onChange: (e) => onPatch({ label: e.target.value }) }) }),
      /* @__PURE__ */ jsx13(Row, { label: "Link", hint: "Accetta variabili, es. {{link_pratica}}.", children: /* @__PURE__ */ jsx13(Input_default, { "aria-label": "Link del pulsante", value: block.url, onChange: (e) => onPatch({ url: e.target.value }) }) }),
      /* @__PURE__ */ jsx13(Row, { label: "Stile", children: /* @__PURE__ */ jsx13(SegmentedControl, { "aria-label": "Stile", value: block.style, onChange: (style) => onPatch({ style }), options: [{ value: "primary", label: "Pieno" }, { value: "secondary", label: "Contorno" }] }) })
    ] }),
    block.type === "image" && /* @__PURE__ */ jsx13(Row, { label: "Larghezza", hint: "Immagini da vuscom-email-assets, mai caricate a mano.", children: /* @__PURE__ */ jsx13(SegmentedControl, { "aria-label": "Larghezza", value: block.width, onChange: (width) => onPatch({ width }), options: [{ value: 120, label: "Piccolo" }, { value: 160, label: "Medio" }, { value: 220, label: "Grande" }] }) }),
    block.type === "data" && /* @__PURE__ */ jsxs10(Fragment, { children: [
      /* @__PURE__ */ jsxs10("div", { className: "rounded-lg border border-border bg-muted p-2.5 text-[12.5px]", children: [
        /* @__PURE__ */ jsx13("b", { className: "block", children: info?.label ?? block.ref }),
        info?.description,
        info?.kind && /* @__PURE__ */ jsx13("span", { className: "block text-[11.5px] text-muted-foreground", children: info.kind })
      ] }),
      /* @__PURE__ */ jsx13(Row, { label: "Se i dati mancano", hint: "Il contenuto lo calcola il progetto: qui scegli solo cosa succede se manca.", children: /* @__PURE__ */ jsx13(SegmentedControl, { "aria-label": "Se i dati mancano", value: block.missing ?? "warn", onChange: (missing) => onPatch({ missing }), options: [{ value: "warn", label: "Mostra l'avviso" }, { value: "hide", label: "Nascondi il blocco" }] }) })
    ] }),
    block.type === "html" && /* @__PURE__ */ jsx13("p", { className: "text-sm text-muted-foreground", children: "Blocco HTML da un template vecchio: non si modifica, si pu\xF2 eliminare." }),
    /* @__PURE__ */ jsx13(Row, { label: "Mostra solo se", hint: "Il blocco compare solo quando il valore scelto \xE8 pieno.", children: /* @__PURE__ */ jsx13(Select, { "aria-label": "Mostra solo se", value: block.show_if ?? ALWAYS, onChange: (v) => onPatch({ show_if: v || void 0 }), options: showIf }) })
  ] });
}

// src/email/EmailTemplateEditor.jsx
import { jsx as jsx14, jsxs as jsxs11 } from "react/jsx-runtime";
var MODES = [
  { value: "edit", label: "Modifica", icon: Pencil },
  { value: "preview", label: "Anteprima", icon: Eye }
];
var WIDTHS = [
  { value: "desk", label: /* @__PURE__ */ jsx14("span", { className: "sr-only", children: "Computer" }), icon: Monitor },
  { value: "phone", label: /* @__PURE__ */ jsx14("span", { className: "sr-only", children: "Telefono" }), icon: Smartphone }
];
function useCaret(rootRef) {
  const last = useRef5(null);
  useEffect3(() => {
    const onChange = () => {
      const s = document.getSelection();
      if (!s?.rangeCount) return;
      const n = s.anchorNode;
      const el = (n?.nodeType === 1 ? n : n?.parentElement)?.closest?.("[data-editable]");
      if (el && rootRef.current?.contains(el)) last.current = { el, range: s.getRangeAt(0).cloneRange() };
    };
    document.addEventListener("selectionchange", onChange);
    return () => document.removeEventListener("selectionchange", onChange);
  }, [rootRef]);
  return last;
}
function EmailTemplateEditor({
  value,
  onChange,
  catalog,
  preview,
  toolbar,
  onSendTest,
  sourceLabel = "progetto"
}) {
  const [mode, setMode] = useState5("edit");
  const [width, setWidth] = useState5("desk");
  const [selectedId, setSelectedId] = useState5(null);
  const rootRef = useRef5(null);
  const caret = useCaret(rootRef);
  const blocks = value.blocks;
  const labels = useMemo(
    () => Object.fromEntries((catalog?.variables ?? []).map((v) => [v.name, v.label])),
    [catalog]
  );
  const ctx = useMemo(() => ({ labels }), [labels]);
  const selected = blocks.find((b) => b.id === selectedId) ?? null;
  const setBlocks = (next) => onChange({ ...value, blocks: next });
  const add = (type, extra) => {
    const block = newBlock(type, blocks, extra);
    setBlocks(insertAfter(blocks, selectedId, block));
    setSelectedId(block.id);
    setMode("edit");
  };
  const actions = {
    select: setSelectedId,
    patch: (id, patch) => setBlocks(patchBlock(blocks, id, patch)),
    move: (id, d) => setBlocks(moveBy(blocks, id, d)),
    reorder: (from, to) => {
      setBlocks(moveTo(blocks, from, to));
      setSelectedId(from);
    },
    duplicate: (id) => {
      const r2 = duplicate(blocks, id);
      setBlocks(r2.blocks);
      setSelectedId(r2.id);
    },
    remove: (id) => {
      const i = blocks.findIndex((b) => b.id === id);
      const rest = blocks.filter((b) => b.id !== id);
      setBlocks(rest);
      setSelectedId(rest[Math.min(i, rest.length - 1)]?.id ?? null);
    }
  };
  const insertVar = (name) => {
    let { el, range } = caret.current ?? {};
    if (!el?.isConnected)
      [el, range] = [rootRef.current?.querySelector(`[data-block="${selectedId}"] [data-editable]`), null];
    if (el) insertVariable(el, range, name, labels[name]);
  };
  const phone = width === "phone";
  return /* @__PURE__ */ jsx14(EditorContext.Provider, { value: ctx, children: /* @__PURE__ */ jsxs11("div", { ref: rootRef, className: "overflow-hidden rounded-xl border border-border bg-background text-foreground", children: [
    /* @__PURE__ */ jsxs11("div", { className: "flex flex-wrap items-center gap-3 border-b border-border bg-card px-4 py-2.5", children: [
      /* @__PURE__ */ jsx14(SegmentedControl, { "aria-label": "Modalit\xE0", value: mode, onChange: setMode, options: MODES }),
      /* @__PURE__ */ jsx14(SegmentedControl, { "aria-label": "Larghezza", value: width, onChange: setWidth, options: WIDTHS }),
      toolbar,
      onSendTest && /* @__PURE__ */ jsx14(Button_default, { variant: "outline", size: "sm", icon: Send, className: "ml-auto", onClick: onSendTest, children: "Prova a me" })
    ] }),
    /* @__PURE__ */ jsxs11("div", { className: "grid min-h-[560px] lg:grid-cols-[240px_minmax(0,1fr)_290px]", children: [
      /* @__PURE__ */ jsx14("aside", { className: "border-b border-border bg-card p-3.5 lg:border-b-0 lg:border-r", children: /* @__PURE__ */ jsx14(Palette, { catalog, onAdd: add, onInsertVariable: insertVar }) }),
      /* @__PURE__ */ jsx14("main", { className: "min-w-0 overflow-auto bg-background p-4 lg:p-5", children: mode === "edit" ? /* @__PURE__ */ jsx14(
        Canvas,
        {
          template: value,
          selectedId,
          phone,
          catalog,
          preview,
          sourceLabel,
          actions,
          onSubject: (subject) => onChange({ ...value, subject }),
          onAddText: () => add("text")
        }
      ) : preview?.html ? /* @__PURE__ */ jsx14(
        "iframe",
        {
          title: "Anteprima dell'email",
          sandbox: "",
          srcDoc: preview.html,
          className: cn("mx-auto block h-[640px] w-full rounded-md border border-border bg-white", phone ? "max-w-[375px]" : "max-w-[640px]")
        }
      ) : /* @__PURE__ */ jsx14("p", { className: "py-10 text-center text-sm text-muted-foreground", children: "Anteprima non disponibile." }) }),
      /* @__PURE__ */ jsx14("aside", { className: "border-t border-border bg-card p-3.5 lg:border-l lg:border-t-0", children: /* @__PURE__ */ jsx14(
        PropertiesPanel,
        {
          block: selected,
          catalog,
          caret,
          mode,
          preview,
          onPatch: (patch) => actions.patch(selectedId, patch)
        }
      ) })
    ] })
  ] }) });
}
export {
  EmailTemplateEditor,
  fromEditable,
  fromEditablePlain,
  toEditable,
  toEditablePlain
};
