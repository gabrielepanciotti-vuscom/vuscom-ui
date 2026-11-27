import {
  BadgeCheck,
  Building,
  Building2,
  Factory,
  Flame,
  House,
  Lock,
  TrendingUp,
  Zap,
} from "lucide-react";
import { cn } from "../lib/cn.js";
import Badge from "../atoms/Badge.jsx";

const icona = "h-3 w-3";

const SERVIZI = {
  luce: { label: "Luce", Icona: Zap },
  gas: { label: "Gas", Icona: Flame },
};

const CLIENTI = {
  domestico: House,
  business: Building2,
  "non domestico": Building2,
  condominio: Building,
  "altri usi": Factory,
};

const lista = (v) => (Array.isArray(v) ? v : v ? [v] : []);
const chiave = (v) => String(v).trim().toLowerCase();

/**
 * Classification of an offer or document as sober tags with a monochrome icon:
 * service (light tint), price, customer type, PLACET.
 * `servizio`: "luce" | "gas" or both as array; `cliente`: label or labels
 * (Domestico, Business, Non domestico, Condominio, Altri usi);
 * `prezzo`: "Fisso" or any variable label.
 */
export default function TagCombinazione({
  servizio,
  cliente,
  prezzo,
  placet = false,
  className,
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {lista(servizio).map((s) => {
        const def = SERVIZI[chiave(s)] ?? { label: s, Icona: Zap };
        return (
          <Badge key={`s-${s}`} tone="info">
            <def.Icona className={icona} aria-hidden />
            {def.label}
          </Badge>
        );
      })}
      {prezzo && (
        <Badge tone="neutral">
          {chiave(prezzo) === "fisso" ? (
            <Lock className={icona} aria-hidden />
          ) : (
            <TrendingUp className={icona} aria-hidden />
          )}
          {prezzo}
        </Badge>
      )}
      {lista(cliente).map((c) => {
        const Icona = CLIENTI[chiave(c)] ?? House;
        return (
          <Badge key={`c-${c}`} tone="neutral">
            <Icona className={icona} aria-hidden />
            {c}
          </Badge>
        );
      })}
      {placet && (
        <Badge tone="primary">
          <BadgeCheck className={icona} aria-hidden />
          PLACET
        </Badge>
      )}
    </div>
  );
}
