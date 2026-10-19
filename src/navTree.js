/**
 * Normalizzazione dell'albero di navigazione.
 *
 * Un nodo è una foglia (`to`), un gruppo (`label` + `children`, a fisarmonica)
 * oppure una sezione (`section` + `children`): un titolo fisso, non richiudibile,
 * sopra un blocco di voci sempre visibili (badge compresi). La stessa struttura
 * serve entrambi i frontend: qui si applicano le due regole che altrimenti ogni
 * app riscriverebbe per conto suo, con esiti leggermente diversi.
 */

/**
 * Rimuove le voci non visibili per il ruolo corrente, elimina i gruppi e le
 * sezioni rimasti senza figli e appiattisce i gruppi (non le sezioni) con un figlio solo (un accordion che si
 * apre su una voce sola è solo un click in più).
 *
 * @param {Array} nodes albero grezzo
 * @returns {Array} albero pronto da passare a AppSidebar
 */
export function normalizeNavTree(nodes = []) {
  const out = [];

  for (const node of nodes) {
    if (node?.visible === false) continue;

    if (!node?.children) {
      out.push(node);
      continue;
    }

    const children = normalizeNavTree(node.children);
    if (children.length === 0) continue;

    // Una sezione non si appiattisce: anche con una voce sola il titolo dice
    // a quale blocco appartiene, e non costa click.
    if (node.section) {
      out.push({ ...node, id: node.id || node.section, children });
      continue;
    }

    if (children.length === 1) {
      // Il gruppo sparisce, il figlio prende l'icona del gruppo se non ne ha una.
      const only = children[0];
      out.push({ ...only, icon: only.icon || node.icon });
      continue;
    }

    out.push({ ...node, id: node.id || node.label, children });
  }

  return out;
}

/**
 * Id di tutti i gruppi dell'albero: serve per aprirli tutti al primo avvio,
 * così un utente nuovo vede il menu intero invece di una lista di accordion chiusi.
 *
 * @param {Array} nodes albero normalizzato
 * @returns {string[]}
 */
export function collectGroupIds(nodes = []) {
  const ids = [];
  for (const node of nodes) {
    if (node?.children) {
      // Le sezioni non si aprono e chiudono: si cercano solo i gruppi dentro.
      if (!node.section) ids.push(node.id || node.label);
      ids.push(...collectGroupIds(node.children));
    }
  }
  return ids;
}
