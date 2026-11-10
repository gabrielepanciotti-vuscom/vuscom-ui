import { afterEach, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginPage, ReimpostaPassword } from "../../src/index.js";

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
  document.documentElement.classList.remove("dark");
});

test("ricordami passes the choice as third argument and remembers it", async () => {
  const onSubmit = vi.fn().mockResolvedValue();
  render(<LoginPage title="X" onSubmit={onSubmit} ricordami />);
  await userEvent.click(screen.getByRole("checkbox", { name: "Ricordami" }));
  await userEvent.type(screen.getByLabelText(/username/i), "m");
  await userEvent.type(screen.getByLabelText(/^password/i), "p");
  await userEvent.click(screen.getByRole("button", { name: /accedi/i }));
  expect(onSubmit).toHaveBeenCalledWith("m", "p", true);
  expect(localStorage.getItem("rememberMe")).toBe("true");
});

test("forgot password posts to the base and shows the generic answer", async () => {
  const fetchMock = vi
    .fn()
    .mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Controlla la posta" }),
    });
  vi.stubGlobal("fetch", fetchMock);
  render(<LoginPage title="X" onSubmit={vi.fn()} recupero />);
  await userEvent.click(
    screen.getByRole("button", { name: "Password dimenticata?" }),
  );
  await userEvent.type(screen.getByLabelText(/email o username/i), "a@b.it");
  await userEvent.click(screen.getByRole("button", { name: /invia link/i }));
  expect(await screen.findByText("Controlla la posta")).toBeInTheDocument();
  expect(fetchMock.mock.calls[0][0]).toBe("/api/auth/forgot-password");
  await userEvent.click(screen.getByRole("button", { name: "Torna al login" }));
  expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
});

test("reset checks the passwords, posts the token and returns to the login", async () => {
  const fetchMock = vi
    .fn()
    .mockResolvedValue({ ok: true, json: async () => ({}) });
  vi.stubGlobal("fetch", fetchMock);
  const onFatto = vi.fn();
  render(<ReimpostaPassword title="X" token="tok" onFatto={onFatto} />);
  const [a, b] = screen.getAllByLabelText(/password/i);
  await userEvent.type(a, "abcdefgh");
  await userEvent.type(b, "abcdefgX");
  await userEvent.click(screen.getByRole("button", { name: /reimposta/i }));
  expect(screen.getByRole("alert")).toHaveTextContent("non corrispondono");
  await userEvent.clear(b);
  await userEvent.type(b, "abcdefgh");
  await userEvent.click(screen.getByRole("button", { name: /reimposta/i }));
  await userEvent.click(
    await screen.findByRole("button", { name: "Vai al login" }),
  );
  expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
    token: "tok",
    new_password: "abcdefgh",
    confirm_password: "abcdefgh",
  });
  expect(onFatto).toHaveBeenCalled();
});

test("login applies the saved dark theme by itself", () => {
  localStorage.setItem("theme", "dark");
  render(<LoginPage title="X" onSubmit={vi.fn()} />);
  expect(document.documentElement).toHaveClass("dark");
});
