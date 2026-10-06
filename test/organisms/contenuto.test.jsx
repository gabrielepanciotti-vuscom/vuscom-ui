import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Inbox } from "lucide-react";
import {
  KpiCard,
  EmptyState,
  Alert,
  Pagination,
  Card,
  CardHeader,
  CardContent,
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonTable,
} from "../../src/index.js";

test("kpi formats numbers and shows delta", () => {
  render(
    <KpiCard
      label="Lead in coda"
      value={1581}
      delta={{ value: 12, label: "vs ieri" }}
    />,
  );
  expect(screen.getByText("1.581")).toBeInTheDocument();
  expect(screen.getByText(/12/)).toBeInTheDocument();
});

test("kpi loading hides value", () => {
  render(<KpiCard label="Contratti" value={5} loading />);
  expect(screen.queryByText("5")).not.toBeInTheDocument();
});

test("kpi shows help tip", () => {
  render(<KpiCard label="X" value="1" help="Spiegazione" />);
  expect(
    screen.getByRole("button", { name: /maggiori informazioni/i }),
  ).toBeInTheDocument();
});

test("empty state renders title and action", () => {
  render(
    <EmptyState
      icon={Inbox}
      title="Nessun lead"
      action={<button>Carica</button>}
    />,
  );
  expect(screen.getByText("Nessun lead")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Carica" })).toBeInTheDocument();
});

test("danger alert is role=alert and closable", async () => {
  const onClose = vi.fn();
  render(
    <Alert tone="danger" title="Errore" onClose={onClose}>
      Rete giù
    </Alert>,
  );
  expect(screen.getByRole("alert")).toHaveTextContent("Rete giù");
  await userEvent.click(screen.getByRole("button", { name: /chiudi/i }));
  expect(onClose).toHaveBeenCalled();
});

test("info alert is role=status", () => {
  render(<Alert>Ciao</Alert>);
  expect(screen.getByRole("status")).toHaveTextContent("Ciao");
});

test("pagination bounds", async () => {
  const onPageChange = vi.fn();
  render(
    <Pagination
      page={1}
      pageSize={50}
      total={120}
      onPageChange={onPageChange}
    />,
  );
  expect(screen.getByText("1–50 di 120")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /precedente/i })).toBeDisabled();
  await userEvent.click(screen.getByRole("button", { name: /successiva/i }));
  expect(onPageChange).toHaveBeenCalledWith(2);
});

test("pagination last page clamps range and disables next", () => {
  render(
    <Pagination page={3} pageSize={50} total={120} onPageChange={() => {}} />,
  );
  expect(screen.getByText("101–120 di 120")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /successiva/i })).toBeDisabled();
});

test("pagination hidden when one page", () => {
  const { container } = render(
    <Pagination page={1} pageSize={50} total={10} onPageChange={() => {}} />,
  );
  expect(container).toBeEmptyDOMElement();
});

test("card header with actions", () => {
  render(
    <Card>
      <CardHeader title="Campagne" actions={<button>Nuova</button>} />
      <CardContent>x</CardContent>
    </Card>,
  );
  expect(screen.getByText("Campagne")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Nuova" })).toBeInTheDocument();
});

test("skeleton family renders", () => {
  const { container } = render(
    <div>
      <Skeleton className="h-4" />
      <SkeletonText lines={2} />
      <SkeletonCard />
      <SkeletonTable rows={2} cols={3} />
    </div>,
  );
  expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(
    8,
  );
});
