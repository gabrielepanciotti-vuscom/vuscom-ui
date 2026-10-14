import { render } from "@testing-library/react";
import { Sparkline } from "../../src/grafici/index.js";

test("draws a line with currentColor and a labelled image", () => {
  const { container, getByRole } = render(<Sparkline valori={[1, 3, 2]} titolo="Andamento" />);
  expect(getByRole("img", { name: "Andamento" })).toBeInTheDocument();
  const paths = container.querySelectorAll("path");
  expect(paths).toHaveLength(2);
  expect(paths[1].getAttribute("stroke")).toBe("currentColor");
  expect(container.innerHTML).not.toMatch(/#[0-9a-f]{3,6}\b/i);
});

test("fewer than two points keep the box but draw nothing", () => {
  const { container } = render(<Sparkline valori={[5]} larghezza={80} altezza={28} />);
  expect(container.querySelector("svg")).toBeNull();
  expect(container.firstChild).toHaveStyle({ width: "80px", height: "28px" });
});
