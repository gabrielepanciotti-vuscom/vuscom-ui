// Role ladder shared with vuscom_auth.ruoli: unknown roles rank 0.
export const RUOLI = ["viewer", "manager", "admin", "superadmin"];

export const LIVELLO = { viewer: 1, manager: 2, admin: 3, superadmin: 4 };

export const ETICHETTE_PORTALE = {
  offerte: "Hub Offerte",
  cruscotto: "Cruscotto",
  outbound: "Outbound",
};

export function livello(ruolo) {
  return LIVELLO[ruolo] || 0;
}

// Only a superadmin hands out superadmin; an admin goes up to admin; below
// admin nobody assigns a role higher than their own.
export function ruoliAssegnabili(ruoloAttore) {
  const lv = livello(ruoloAttore);
  if (lv >= LIVELLO.superadmin) return [...RUOLI];
  const tetto = Math.min(lv, LIVELLO.admin);
  return RUOLI.filter((r) => livello(r) <= tetto);
}

export function etichettaPortale(portale) {
  return ETICHETTE_PORTALE[portale] || portale;
}
