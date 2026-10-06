import { useCallback, useMemo, useState } from "react";

// Dates compare by timestamp; NaN (and Invalid Date) behave like null.
function normalizza(v) {
  const x = v instanceof Date ? v.valueOf() : v;
  return typeof x === "number" && Number.isNaN(x) ? null : x;
}

const isNil = (v) => v === null || v === undefined;

function compare(a, b) {
  if (typeof a === "number" && typeof b === "number") return a - b;
  // numeric: "9" < "10", like a person would read them.
  return String(a).localeCompare(String(b), "it", {
    numeric: true,
    sensitivity: "base",
  });
}

/**
 * Client-side sorting. Numbers and Dates compare numerically, anything else
 * with localeCompare("it", numeric); null/undefined/NaN always sort last in
 * both directions.
 */
export default function useSort(rows, { initial = null, accessors = {} } = {}) {
  const [sort, setSort] = useState(initial);

  const toggle = useCallback((key) => {
    setSort((prev) =>
      prev && prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
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
    // accessors is usually an inline literal; key on sort and rows only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, sort]);

  return { sorted, sort, toggle };
}
