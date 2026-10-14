import { cn } from "../lib/cn.js";

/**
 * Tiny trend line (inline SVG, no Chart.js): the colour is `currentColor`, so a
 * text class (`text-primary`, `text-muted-foreground`) themes it. Fewer than two
 * points draw nothing but keep the box, so tiles in a grid stay the same height.
 */
export default function Sparkline({
  valori = [],
  larghezza = 80,
  altezza = 28,
  titolo,
  className,
}) {
  const punti = valori.filter((v) => Number.isFinite(v));
  const box = { width: larghezza, height: altezza };
  if (punti.length < 2)
    return (
      <span aria-hidden className={cn("inline-block", className)} style={box} />
    );

  const min = Math.min(...punti);
  const max = Math.max(...punti);
  const campo = max - min || 1;
  const pad = 2;
  const xy = punti.map((v, i) => [
    pad + (i * (larghezza - 2 * pad)) / (punti.length - 1),
    // A flat series sits in the middle instead of on the floor.
    max === min
      ? altezza / 2
      : altezza - pad - ((v - min) * (altezza - 2 * pad)) / campo,
  ]);
  const linea = xy
    .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  const [ux, uy] = xy.at(-1);
  const area = `${linea} L${ux.toFixed(1)},${altezza} L${xy[0][0].toFixed(1)},${altezza} Z`;

  return (
    <svg
      viewBox={`0 0 ${larghezza} ${altezza}`}
      {...box}
      role={titolo ? "img" : undefined}
      aria-label={titolo}
      aria-hidden={titolo ? undefined : true}
      className={cn("shrink-0 overflow-visible text-primary", className)}
    >
      <path d={area} fill="currentColor" opacity="0.12" />
      <path
        d={linea}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={ux} cy={uy} r="2" fill="currentColor" />
    </svg>
  );
}
