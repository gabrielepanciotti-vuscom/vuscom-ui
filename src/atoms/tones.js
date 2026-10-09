// Shared tone -> class maps for Badge, StatusDot, ProgressBar, KpiCard, Field
// and Toast. One place, so every component reads the same contrast rules.

// Text on a light tinted (or white) surface. The raw tokens fail WCAG AA in
// light mode, so light uses a darker shade and dark keeps the token.
export const TESTO = {
  neutral: "text-muted-foreground",
  primary: "text-brand-700 dark:text-primary",
  success: "text-green-800 dark:text-success",
  warning: "text-amber-800 dark:text-warning",
  danger: "text-red-700 dark:text-red-400",
  info: "text-sky-800 dark:text-info",
};

const SFONDI = {
  neutral: "bg-muted",
  primary: "bg-primary/15",
  success: "bg-success/15",
  warning: "bg-warning/15",
  danger: "bg-destructive/15",
  info: "bg-info/15",
};

export const TINTE = Object.fromEntries(
  Object.keys(SFONDI).map((k) => [k, `${SFONDI[k]} ${TESTO[k]}`]),
);

export const PIENI = {
  neutral: "bg-muted-foreground",
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
  info: "bg-info",
};
