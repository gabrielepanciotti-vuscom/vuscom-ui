import {
  isPartial,
  periodLabel,
  periodOf,
  periodSpan,
  periodsBetween,
  toUtcDay,
} from "../../src/lib/periodi.js";

const iso = (d) => d.toISOString().slice(0, 10);

test("periodOf: months and ISO weeks, year boundaries", () => {
  expect(periodOf("2026-10-14", "mese")).toBe("2026-10");
  expect(periodOf("2026-10-14", "settimana")).toBe("2026-W42");
  expect(periodOf("2026-10-14", "week")).toBe("2026-W42");
  // 1 Jan 2027 is a Friday: still week 53 of 2026.
  expect(periodOf("2027-01-01", "settimana")).toBe("2026-W53");
  // 29 Dec 2025 is a Monday: week 1 of 2026.
  expect(periodOf("2025-12-29", "settimana")).toBe("2026-W01");
  expect(periodOf(null)).toBeNull();
  expect(() => periodOf("2026-10-14", "anno")).toThrow();
});

test("periodOf ignores the time zone: UTC calendar day", () => {
  expect(periodOf(new Date(Date.UTC(2026, 9, 31, 23, 30)), "mese")).toBe("2026-10");
  expect(iso(toUtcDay("2026-02-28T10:00:00"))).toBe("2026-02-28");
});

test("periodSpan: start inclusive, end exclusive", () => {
  const w = periodSpan("2026-W42");
  expect(iso(w.start)).toBe("2026-10-12");
  expect(iso(w.end)).toBe("2026-10-19");
  const m = periodSpan("2026-02");
  expect(iso(m.start)).toBe("2026-02-01");
  expect(iso(m.end)).toBe("2026-03-01");
  expect(iso(periodSpan("2026-W01").start)).toBe("2025-12-29");
  expect(() => periodSpan("ottobre")).toThrow();
});

test("periodOf and periodSpan round-trip over two years of weeks", () => {
  for (let t = Date.UTC(2025, 0, 1); t < Date.UTC(2027, 0, 1); t += 86400000) {
    const k = periodOf(new Date(t), "settimana");
    const { start, end } = periodSpan(k);
    expect(t >= start.getTime() && t < end.getTime()).toBe(true);
  }
});

test("periodLabel in Italian", () => {
  expect(periodLabel("2026-10")).toBe("ottobre 2026");
  expect(periodLabel("2026-10", { breve: true })).toBe("ott 2026");
  expect(periodLabel("2026-W42")).toBe("12–18 ott 2026");
  expect(periodLabel("2026-W40")).toBe("28 set – 4 ott 2026");
  expect(periodLabel("2026-W01")).toBe("29 dic 2025 – 4 gen 2026");
  expect(periodLabel("2026-W42", { breve: true })).toBe("12–18 ott");
  expect(periodLabel("2026-W40", { breve: true })).toBe("28 set–4 ott");
});

test("periodsBetween is inclusive and crosses years", () => {
  expect(periodsBetween("2026-11-20", "2027-02-01", "mese")).toEqual([
    "2026-11",
    "2026-12",
    "2027-01",
    "2027-02",
  ]);
  expect(periodsBetween("2026-12-20", "2027-01-05", "settimana")).toEqual([
    "2026-W51",
    "2026-W52",
    "2026-W53",
    "2027-W01",
  ]);
  expect(periodsBetween("2026-10-14", "2026-10-14", "settimana")).toEqual(["2026-W42"]);
  expect(periodsBetween("2026-10-14", "2026-09-01", "mese")).toEqual([]);
  expect(periodsBetween(null, "2026-09-01")).toEqual([]);
});

test("isPartial: cut by the filter or not over yet", () => {
  const now = "2026-10-14";
  expect(isPartial("2026-09", { now })).toBe(false);
  expect(isPartial("2026-10", { now })).toBe(true);
  expect(isPartial("2026-11", { now })).toBe(true);
  expect(isPartial("2026-09", { from: "2026-09-02", now })).toBe(true);
  expect(isPartial("2026-09", { from: "2026-09-01", to: "2026-09-30", now })).toBe(false);
  expect(isPartial("2026-09", { to: "2026-09-29", now })).toBe(true);
  // Last day of the period is today: still running.
  expect(isPartial("2026-W42", { now: "2026-10-18" })).toBe(true);
  expect(isPartial("2026-W42", { now: "2026-10-19" })).toBe(false);
  expect(isPartial("2026-10", { now: null })).toBe(false);
});
