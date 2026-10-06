import {
  formatNumero,
  formatData,
  formatDataOra,
  formatRelativo,
} from "../../src/lib/format.js";
test("formatNumero uses it-IT and tolerates null", () => {
  expect(formatNumero(12345)).toBe("12.345");
  expect(formatNumero(null)).toBe("0");
  expect(formatNumero(0.256, { style: "percent" })).toBe("26%");
  expect(
    formatNumero(0.256, { style: "percent", maximumFractionDigits: 1 }),
  ).toBe("25,6%");
});
test("formatData / formatDataOra", () => {
  expect(formatData("2026-09-30T08:05:00Z")).toBe("30/09/2026");
  expect(formatDataOra("2026-09-30T08:05:00Z")).toMatch(
    /^30\/09\/2026, \d{2}:05$/,
  );
  expect(formatData(null)).toBe("—");
});
test("formatRelativo", () => {
  const ora = new Date("2026-09-30T10:00:00Z");
  expect(formatRelativo("2026-09-30T09:59:30Z", ora)).toBe("adesso");
  expect(formatRelativo("2026-09-30T09:45:00Z", ora)).toBe("15 min fa");
  expect(formatRelativo("2026-09-30T07:00:00Z", ora)).toBe("3 ore fa");
  expect(formatRelativo("2026-09-28T10:00:00Z", ora)).toBe("2 giorni fa");
});
