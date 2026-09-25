import { useCallback, useEffect, useRef, useState } from "react";
import { messaggioErrore } from "./formato.js";

/**
 * Loads the people with access to the current portal.
 * Every page action calls the client and then `ricarica()`: the list is
 * always the server's truth, never patched locally.
 */
export function useUtenti({ client, basePath = "/api/utenti", includiDisattivati = false }) {
  const [utenti, setUtenti] = useState([]);
  const [caricando, setCaricando] = useState(true);
  const [errore, setErrore] = useState(null);
  // Only the latest request may write state (toggle clicked twice quickly).
  const ultima = useRef(0);

  const ricarica = useCallback(async () => {
    const numero = ++ultima.current;
    setCaricando(true);
    try {
      const dati = await client.get(`${basePath}?includi_disattivati=${includiDisattivati}`);
      if (numero !== ultima.current) return;
      setUtenti(Array.isArray(dati) ? dati : []);
      setErrore(null);
    } catch (err) {
      if (numero !== ultima.current) return;
      setErrore(messaggioErrore(err));
    } finally {
      if (numero === ultima.current) setCaricando(false);
    }
  }, [client, basePath, includiDisattivati]);

  useEffect(() => {
    ricarica();
  }, [ricarica]);

  return { utenti, caricando, errore, ricarica };
}
