# Motore di indirizzamento

Dato un profilo (tipo di richiesta, età, contributi, ante 1996, gestioni, certificazioni FELPE) individua quale tipologia di domanda di pensione può essere presentata tra le 98 del catalogo.

- `catalogo.js` – le 98 tipologie (`codice`, descrizione, canale WebDOM/cittadino, `obsoleta`).
- `dati/Requisiti_domande_pensione.xlsx` – la cartella di lavoro con il foglio **Regole motore** (una riga per tipologia e ramo): è la fonte delle regole. Le istruzioni sono nel foglio «Regole motore - guida».
- `tools/xlsx_to_regole.py` – legge il foglio e genera `regole.json` / `regole.js` (da rilanciare dopo ogni modifica: `python3 motore/tools/xlsx_to_regole.py`).
- `motore.js` – `MotorePensioni.valuta(profilo, {data})` (browser e Node), `parametri(anno)`, `formattaMesi`.
- `esempi.js` – 12 posizioni fittizie descritte dalle caratteristiche del richiedente (iniziali, età, contributi, gestioni, FELPE; per i superstiti anche la persona deceduta). Il tipo di richiesta si sceglie nel simulatore; `scenario` serve solo ai test.
- `test.js` – `node motore/test.js`.
- `../simulatore.html` – la demo guidata: le opzioni del wizard sono filtrate dal motore (disabilitate con la motivazione, suggerita quella proposta), con pannello di esito e dettaglio per tipologia.
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

## Tabella delle regole
Il motore non contiene più l'elenco dei requisiti: lo legge da `regole.json`. Per cambiare una soglia, una condizione o un messaggio si modifica il foglio Excel e si rigenera il file. Le regole che non si esprimono a colonne (computo in Gestione separata, opzione al contributivo, diritti acquisiti, indiretta...) hanno la colonna «Predicato» valorizzata e restano nel codice (`REGOLE_LEGACY` in `motore.js`); le colonne descrittive documentano cosa fanno. Il test di equivalenza confronta, su 4000 profili casuali, ogni riga della tabella con la logica originale scritta nel codice.

### Requisiti con data e «Una tra»
- `eta@31/12/2025>=62a` / `contr@31/12/2025>=41a`: requisito stimato alla data indicata (Flessibile 0189/0195/0201/0202). Se manca, non maturerà più (nessuna data di maturazione).
- `una_tra(cond : testo ; cond : testo ; ...) => messaggio`: basta una alternativa vera. Usato dalla vecchiaia in deroga (0043): `deroga.contr92`, `deroga.volontari92`, `deroga.anz92` (campo `deroga` del profilo).
- Per le righe con «Predicato» la colonna Note riporta i requisiti letti dalla lista domande.

### Domande solo per operatori INPS
Le tipologie non presentabili da cittadino/patronato (`cittadino: false` nel catalogo, es. le salvaguardie) sono escluse dal motore, salvo l'opzione `includiSoloOperatori: true`.
