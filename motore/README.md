# Motore di indirizzamento

Dato un profilo (tipo di richiesta, età, contributi, ante 1996, gestioni, certificazioni FELPE) individua quale tipologia di domanda di pensione può essere presentata tra le 98 del catalogo.

- `catalogo.js` – le 98 tipologie (`codice`, descrizione, canale WebDOM/cittadino, `obsoleta`).
- `motore.js` – `MotorePensioni.valuta(profilo, {data})` (browser e Node), `parametri(anno)`, `formattaMesi`.
- `test.js` – `node motore/test.js`.
- `../flusso.html` – diagramma Mermaid + simulatore; gli id dei nodi coincidono con `risultato.traccia`.

## Rami e priorità
1. `diretta`: vecchiaia → anticipata/contributiva → percorsi speciali (precoci, usuranti, gravosi, salvaguardie, Flessibile, opzione donna...). L'amianto è sempre segnalato; supplementari/trasformazioni per chi è già pensionato.
2. `invalidita`: assegno/inabilità (5 anni, di cui 3 nell'ultimo quinquennio), privilegiate, solo riconoscimento.
3. `superstiti`: reversibilità, indiretta (15 anni, o 5 di cui 3), marittimi, una tantum.

Esito per tipologia: `accessibile`, `non_accessibile` (con motivi e data di maturazione), `da_verificare` (dato mancante → `domandeAperte`).

## Profilo
`{ramo, sesso, dataNascita, contributi:{anni,mesi}, ante96, gestioni:[AGO|GS|ESCLUSIVA|CASSA|ESTERO], felpe:{certificazioni[], salvaguardia}, importoPrimaRata, contributiAl1995, contributiDopo1996, figli, pensionato, invalidita:{...}, superstiti:{dante:{...}}}`

## Limiti
Prototipo. Da verificare sulle norme: c. 250 L. 232/2016, c. 500 L. 160/2019, art. 2-ter L. 114/74, soglia 2,8/2,6 AS per donne con figli, estremi della legge di bilancio 2026 (adeguamento speranza di vita). Il contenuto di ARCA non è noto. La mappatura salvaguardie→tipologie e le stime alla data passata sono assunzioni.
