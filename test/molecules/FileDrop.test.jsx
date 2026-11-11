import { render, screen, fireEvent } from "@testing-library/react";
import { FileDrop } from "../../src/index.js";
import { accettato } from "../../src/molecules/FileDrop.jsx";

const f = (name, type, size = 10) => {
  const file = new File(["x"], name, { type });
  Object.defineProperty(file, "size", { value: size });
  return file;
};
const scegli = (files) =>
  fireEvent.change(screen.getByTestId("filedrop-input"), { target: { files } });

test("accettato: estensione, jolly, tipo esatto", () => {
  expect(accettato(f("a.PDF", ""), ".pdf")).toBe(true);
  expect(accettato(f("a.png", "image/png"), "image/*")).toBe(true);
  expect(accettato(f("a.txt", "text/plain"), "image/*,.pdf")).toBe(false);
  expect(accettato(f("a.txt", "text/plain"), "")).toBe(true);
});

test("il pulsante apre il selettore; l'input nativo è nascosto", () => {
  render(<FileDrop onFiles={() => {}} />);
  const input = screen.getByTestId("filedrop-input");
  expect(input).toHaveAttribute("hidden");
  const click = vi.spyOn(input, "click");
  fireEvent.click(screen.getByRole("button", { name: "Scegli file" }));
  expect(click).toHaveBeenCalled();
});

test("onFiles riceve i validi, gli scartati finiscono in Alert e onReject", () => {
  const onFiles = vi.fn();
  const onReject = vi.fn();
  render(<FileDrop accept=".pdf" maxSize={100} multiple onFiles={onFiles} onReject={onReject} />);
  scegli([f("ok.pdf", "application/pdf"), f("grosso.pdf", "application/pdf", 500), f("x.txt", "text/plain")]);
  expect(onFiles).toHaveBeenCalledWith([expect.objectContaining({ name: "ok.pdf" })]);
  expect(onReject).toHaveBeenCalledTimes(1);
  expect(screen.getByText(/grosso\.pdf: supera/)).toBeInTheDocument();
  expect(screen.getByText(/x\.txt: tipo non ammesso/)).toBeInTheDocument();
});

test("senza multiple prende solo il primo file", () => {
  const onFiles = vi.fn();
  render(<FileDrop onFiles={onFiles} />);
  scegli([f("a.pdf", ""), f("b.pdf", "")]);
  expect(onFiles.mock.calls[0][0]).toHaveLength(1);
});

test("drop sulla zona", () => {
  const onFiles = vi.fn();
  render(<FileDrop onFiles={onFiles} />);
  fireEvent.drop(screen.getByTestId("filedrop-zona"), { dataTransfer: { files: [f("a.pdf", "")] } });
  expect(onFiles).toHaveBeenCalled();
});

test("disabled e loading bloccano pulsante e drop; loading mostra Spinner; error mostra Alert", () => {
  const onFiles = vi.fn();
  const { rerender } = render(<FileDrop disabled onFiles={onFiles} />);
  expect(screen.getByRole("button")).toBeDisabled();
  fireEvent.drop(screen.getByTestId("filedrop-zona"), { dataTransfer: { files: [f("a.pdf", "")] } });
  expect(onFiles).not.toHaveBeenCalled();
  rerender(<FileDrop loading error="Server KO" onFiles={onFiles} />);
  expect(screen.getByRole("button")).toBeDisabled();
  expect(screen.getByRole("status")).toBeInTheDocument();
  expect(screen.getByRole("alert")).toHaveTextContent("Server KO");
});
