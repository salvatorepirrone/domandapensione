# Motore di indirizzamento

Dato un profilo (tipo di richiesta, età, contributi, ante 1996, gestioni, certificazioni FELPE) individua quale tipologia di domanda di pensione può essere presentata tra le 98 del catalogo.

- `catalogo.js` – le 98 tipologie (`codice`, descrizione, canale WebDOM/cittadino, `obsoleta`).
- `motore.js` – `MotorePensioni.valuta(profilo, {data})` (browser e Node), `parametri(anno)`, `formattaMesi`.
- `esempi.js` – 12 posizioni fittizie (nome, nota, profilo, domanda attesa), usate dai test e dal menu «Carica una posizione fittizia» di `flusso.html`.
- `test.js` – `node motore/test.js`.
- `../flusso.html` – diagramma Mermaid + simulatore; gli id dei nodi coincidono con `risultato.traccia`.

## Rami e priorità
1. `diretta`: vecchiaia → anticipata/contributiva → percorsi speciali (precoci, usuranti, gravosi, salvaguardie, Flessibile, opzione donna...). L'amianto è sempre segnalato; supplementari/trasformazioni per chi è già pensionato.
2. `invalidita`: assegno/inabilità (5 anni, di cui 3 nell'ultimo quinquennio), privilegiate, solo riconoscimento.
3. `superstiti`: reversibilità, indiretta (15 anni, o 5 di cui 3), marittimi, una tantum.

Esito per tipologia: `accessibile`, `non_accessibile` (con motivi e data di maturazione), `da_verificare` (dato mancante → `domandeAperte`).

## Profilo
`{ramo, sesso, dataNascita, contributi:{anni,mesi}, ante96, gestioni:[AGO|GS|ESCLUSIVA|CASSA|ESTERO], felpe:{certificazioni[], salvaguardia}, contributiAl1995, contributiDopo1996, figli, pensionato, invalidita:{...}, superstiti:{dante:{...}}}`

## Limiti
Prototipo. Il motore **filtra** le domande con una verifica di massima sui dati di ARCA (archivio delle posizioni anagrafiche) e FELPE; non verifica puntualmente i requisiti né gli importi (soglie 1,5/3 volte l'assegno sociale escluse: spetta all'istruttoria). Da verificare sulle norme: c. 250 L. 232/2016, c. 500 L. 160/2019, art. 2-ter L. 114/74, estremi della legge di bilancio 2026 (adeguamento speranza di vita). La mappatura salvaguardie→tipologie e le stime alla data passata sono assunzioni.
