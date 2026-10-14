Ordine di esecuzione (rilascio automatico di @vuscom/ui, {{versione}}). Aggiorna {{nome}} da {{precedente}} a {{versione}}.

Moduli cambiati che {{nome}} usa: {{toccati}}.
Cosa è cambiato (commit da {{precedente}} a {{versione}}):
{{commit}}

Cosa fare, nel frontend ({{frontend}}):
1. npm install "@vuscom/ui@github:gabrielepanciotti-vuscom/vuscom-ui#{{versione}}" (il lockfile tiene il tag vecchio: npm install da solo non basta).
2. Test: la suite del frontend deve restare verde.
3. npx vuscom-ui-conformita: deve dare ok con zero avvisi.
4. Commit di package.json e package-lock.json, push.
5. Deploy in produzione.
6. Verifica dal vivo sul portale (bundle servito aggiornato, pagina che usa i moduli cambiati).
7. Rispondi qui con lo sha del commit e l'esito della verifica dal vivo.

Se un test o la conformità si rompono per colpa del pacchetto, rispondi qui con l'errore: la correzione la faccio in vuscom-ui. Questa conversazione la chiudo io quando l'aggiornamento è in produzione.
