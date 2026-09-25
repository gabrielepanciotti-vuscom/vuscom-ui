import "@testing-library/jest-dom/vitest";
import { act } from "react";
import { configure } from "@testing-library/dom";

// @testing-library/react 14 bundles its own @testing-library/dom (9.x) and
// wires only that copy to React's act(); user-event resolves the top-level
// @testing-library/dom (10.x), so every event it fires ran outside act() and
// flooded the output with "not wrapped in act(...)" warnings. Give the
// top-level copy the same wrappers RTL installs on its own.
configure({
  // Like RTL's act-compat: act() needs the flag on even when called from
  // inside asyncWrapper (user-event runs every action there).
  eventWrapper: (cb) => {
    const prima = globalThis.IS_REACT_ACT_ENVIRONMENT;
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    let risultato;
    try {
      act(() => {
        risultato = cb();
      });
    } finally {
      globalThis.IS_REACT_ACT_ENVIRONMENT = prima;
    }
    return risultato;
  },
  asyncWrapper: async (cb) => {
    const prima = globalThis.IS_REACT_ACT_ENVIRONMENT;
    globalThis.IS_REACT_ACT_ENVIRONMENT = false;
    try {
      return await cb();
    } finally {
      globalThis.IS_REACT_ACT_ENVIRONMENT = prima;
    }
  },
});
