// Role ladder shared with vuscom_auth.ruoli: unknown roles rank 0.
export const RUOLI = ["viewer", "manager", "billing", "admin", "superadmin"];

export const LIVELLO = { viewer: 1, manager: 2, admin: 3, superadmin: 4, billing: 1 };

// Lateral roles sit beside the ladder (level 1 for comparisons), neither above nor below manager.
const RUOLI_LATERALI = ["billing"];

export const ETICHETTE_RUOLO = { billing: "Fatturazione" };

export function eLaterale(ruolo) {
  return RUOLI_LATERALI.includes(ruolo);
}

export function etichettaRuolo(ruolo) {
  return ETICHETTE_RUOLO[ruolo] || ruolo;
}

export const ETICHETTE_PORTALE = {
  offerte: "Hub Offerte",
  cruscotto: "Cruscotto",
  outbound: "Campagne",
};

export function livello(ruolo) {
  return LIVELLO[ruolo] || 0;
}

// Only a superadmin hands out superadmin; an admin goes up to admin; below
// admin nobody assigns a role higher than their own. Lateral roles: admin+ only.
export function ruoliAssegnabili(ruoloAttore) {
  const lv = livello(ruoloAttore);
  if (lv >= LIVELLO.superadmin) return [...RUOLI];
  const tetto = Math.min(lv, LIVELLO.admin);
  return RUOLI.filter((r) => livello(r) <= tetto && (!eLaterale(r) || lv >= LIVELLO.admin));
}

export function etichettaPortale(portale) {
  return ETICHETTE_PORTALE[portale] || portale;
}
