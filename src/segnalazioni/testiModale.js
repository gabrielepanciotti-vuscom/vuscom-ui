import { Bug, Lightbulb } from "lucide-react";

// Problem is the default; an improvement request changes only the wording.
export const NATURE = {
  problema: {
    icon: Bug,
    title: "Segnala un problema",
    description:
      "Arriva a chi segue il portale, con le ultime azioni e, se vuoi, uno screenshot o il video della pagina.",
    label: "Cosa non va?",
    hint: "cosa ti aspettavi e cosa vedi invece",
    placeholder:
      "Es. il totale dei clienti attivi non torna con l'estrazione di ieri",
  },
  evolutiva: {
    icon: Lightbulb,
    title: "Proponi un miglioramento",
    description:
      "Arriva a chi segue il portale, con lo screenshot della pagina e l'elemento che hai scelto.",
    label: "Cosa vorresti cambiare?",
    hint: "cosa vorresti e a cosa ti servirebbe",
    placeholder: "Es. vorrei poter esportare questa tabella in Excel",
  },
};

export function nomeElemento(elemento) {
  if (!elemento) return null;
  return (
    elemento.nome || elemento.id || elemento.testo || elemento.selettore || null
  );
}
