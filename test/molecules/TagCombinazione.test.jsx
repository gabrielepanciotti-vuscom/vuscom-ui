import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TagCombinazione } from "../../src/index.js";

describe("TagCombinazione", () => {
  it("renders service, price, customer types and PLACET as tags", () => {
    render(
      <TagCombinazione
        servizio={["luce", "gas"]}
        prezzo="Fisso"
        cliente={["Domestico", "Condominio"]}
        placet
      />,
    );
    for (const t of ["Luce", "Gas", "Fisso", "Domestico", "Condominio", "PLACET"])
      expect(screen.getByText(t)).toBeTruthy();
  });

  it("omits what is not given", () => {
    const { container } = render(<TagCombinazione servizio="gas" />);
    expect(screen.getByText("Gas")).toBeTruthy();
    expect(screen.queryByText("PLACET")).toBeNull();
    expect(container.querySelectorAll("span.rounded-full")).toHaveLength(1);
  });
});
