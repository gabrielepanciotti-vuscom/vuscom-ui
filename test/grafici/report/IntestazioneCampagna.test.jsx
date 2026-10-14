import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import IntestazioneCampagna from "../../../src/grafici/report/IntestazioneCampagna.jsx";

test("campaign tabs with a label, title and snapshot date", async () => {
  const onCampagnaChange = vi.fn();
  render(
    <IntestazioneCampagna
      campagne={[{ id: "bonus_50", label: "Bonus 50" }, { id: "segnalatori", label: "Segnalatori" }]}
      campagna="bonus_50"
      onCampagnaChange={onCampagnaChange}
      titolo="Bonus 50"
      situazione="Situazione al 14/10/2026"
    />,
  );
  expect(screen.getByRole("heading", { level: 1, name: "Bonus 50" })).toBeInTheDocument();
  expect(screen.getByText("Campagna")).toBeInTheDocument();
  expect(screen.getByRole("tablist", { name: "Campagna" })).toBeInTheDocument();
  expect(screen.getByText("Situazione al 14/10/2026")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("tab", { name: "Segnalatori" }));
  expect(onCampagnaChange).toHaveBeenCalledWith("segnalatori");
});
