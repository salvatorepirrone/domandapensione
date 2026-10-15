// Test del motore: node motore/test.js
const assert = require('assert');
const M = require('./motore.js');
const CAT = require('./catalogo.js');
let n = 0;
function t(nome, fn) { try { fn(); n++; console.log('  ok  ' + nome); } catch (e) { console.error('  KO  ' + nome + '\n      ' + e.message); process.exitCode = 1; } }
const D = { data: '2026-10-14' };
const base = { ramo: 'diretta', sesso: 'M', gestioni: ['AGO'] };
const cod = (r) => r.proposta && r.proposta.codice;
const stato = (r, c) => (r.candidati.find(x => x.codice === c) || {}).stato;

console.log('Motore domanda pensione');
t('ramo mancante → errore', () => assert.ok(M.valuta({}, D).errore));
t('dati mancanti → domande aperte', () => assert.deepStrictEqual(M.valuta({ ramo: 'diretta' }, D).domandeAperte, ['dataNascita', 'contributi']));

t('vecchiaia ordinaria (misto, 69 anni, 25 di contributi)', () => {
  const r = M.valuta({ ...base, dataNascita: '1957-03-10', contributi: { anni: 25 }, ante96: true }, D);
  assert.strictEqual(cod(r), '0001-0002-0001');
});
t('vecchiaia assorbe anticipata ordinaria', () => {
  const r = M.valuta({ ...base, dataNascita: '1957-03-10', contributi: { anni: 44 }, ante96: true }, D);
  assert.strictEqual(cod(r), '0001-0002-0001');
  assert.ok(r.candidati.find(x => x.codice === '0001-0001-0001').assorbita);
});
t('anticipata ordinaria donna 42 anni di contributi', () => {
  const r = M.valuta({ ...base, sesso: 'F', dataNascita: '1968-05-02', contributi: { anni: 42 }, ante96: true }, D);
  assert.strictEqual(cod(r), '0001-0001-0001');
});
t('anticipata ordinaria uomo con 42a e 9m → non accessibile, maturazione tra 1 mese', () => {
  const r = M.valuta({ ...base, dataNascita: '1968-05-02', contributi: { anni: 42, mesi: 9 }, ante96: true }, D);
  assert.strictEqual(stato(r, '0001-0001-0001'), 'non_accessibile');
  assert.strictEqual(r.candidati.find(x => x.codice === '0001-0001-0001').maturazione, '2026-11-14');
});
t('contributivo puro, 65 anni, 24 anni, anticipata contributiva a 64 (importo non verificato)', () => {
  const r = M.valuta({ ...base, dataNascita: '1961-01-01', contributi: { anni: 24 }, ante96: false }, D);
  assert.strictEqual(cod(r), '0001-0001-0017');
});
t('contributivo puro, 72 anni, 6 anni effettivi → vecchiaia a 71 anni', () => {
  const r = M.valuta({ ...base, dataNascita: '1954-02-01', contributi: { anni: 6 }, contributiEffettivi: { anni: 6 }, ante96: false }, D);
  assert.strictEqual(cod(r), '0001-0002-0017');
});
t('adeguamento 2027: a 67 anni nel 2027 non basta più', () => {
  const r = M.valuta({ ...base, dataNascita: '1960-06-15', contributi: { anni: 25 }, ante96: true }, { data: '2027-06-20' });
  assert.strictEqual(stato(r, '0001-0002-0001'), 'non_accessibile');
  const r2 = M.valuta({ ...base, dataNascita: '1960-06-15', contributi: { anni: 25 }, ante96: true }, { data: '2027-07-20' });
  assert.strictEqual(stato(r2, '0001-0002-0001'), 'accessibile');
});
t('Gestione separata + AGO, 18 anni, <18 al 1995 → computo art. 3', () => {
  const r = M.valuta({ ...base, gestioni: ['AGO', 'GS'], dataNascita: '1958-01-01', contributi: { anni: 18 }, ante96: true, contributiAl1995: 10, contributiDopo1996: 8 }, D);
  assert.strictEqual(cod(r), '0001-0002-0045');
});
t('Gestione separata + AGO senza dati al 1995 → da verificare e domande aperte', () => {
  const r = M.valuta({ ...base, gestioni: ['AGO', 'GS'], dataNascita: '1958-01-01', contributi: { anni: 18 }, ante96: true }, D);
  assert.strictEqual(stato(r, '0001-0002-0045'), 'da_verificare');
  assert.deepStrictEqual(r.domandeAperte.sort(), ['contributiAl1995', 'contributiDopo1996']);
});
t('lavoratore precoce certificato FELPE', () => {
  const r = M.valuta({ ...base, dataNascita: '1966-01-01', contributi: { anni: 41, mesi: 1 }, ante96: true, felpe: { certificazioni: ['PRECOCI'] } }, D);
  assert.strictEqual(cod(r), '0001-0001-0051');
});
t('senza certificazione FELPE i percorsi speciali non compaiono', () => {
  const r = M.valuta({ ...base, dataNascita: '1966-01-01', contributi: { anni: 41, mesi: 1 }, ante96: true }, D);
  assert.ok(!r.candidati.some(x => x.codice === '0001-0001-0051'));
});
t('salvaguardia L. 214 certificata, 66 anni, 21 di contributi → vecchiaia con salvaguardia', () => {
  const r = M.valuta({ ...base, dataNascita: '1960-03-01', contributi: { anni: 21 }, ante96: true, felpe: { certificazioni: ['SALVAGUARDIA'], salvaguardia: 'L214' } }, D);
  assert.strictEqual(stato(r, '0001-0002-0144'), 'accessibile');
});
t('amianto certificato viene sempre segnalato', () => {
  const r = M.valuta({ ...base, dataNascita: '1957-03-10', contributi: { anni: 25 }, ante96: true, felpe: { certificazioni: ['AMIANTO'] } }, D);
  assert.strictEqual(cod(r), '0001-0002-0001');
  assert.ok(r.segnalazioni.length >= 1);
});
t('Flessibile 2025: diritto acquisito', () => {
  const r = M.valuta({ ...base, dataNascita: '1962-01-01', contributi: { anni: 42, mesi: 3 }, ante96: true }, D);
  // 42a3m oggi → 41a8m al 31/12/2025, età 63: diritto alla Flessibile ma non ancora all'ordinaria (42a10m)
  assert.strictEqual(stato(r, '0001-0001-0201'), 'accessibile');
  assert.strictEqual(stato(r, '0001-0001-0001'), 'non_accessibile');
});
t('già pensionato → supplementare', () => {
  const r = M.valuta({ ...base, dataNascita: '1957-03-10', contributi: { anni: 3 }, ante96: true, pensionato: true }, D);
  assert.strictEqual(cod(r), '0001-0002-0009');
});

t('invalidità: assegno ordinario con 10 anni e 4 nell\'ultimo quinquennio', () => {
  const r = M.valuta({ ramo: 'invalidita', sesso: 'M', dataNascita: '1975-01-01', contributi: { anni: 10 }, contributiUltimoQuinquennio: 4, invalidita: { grado: 'parziale' }, gestioni: ['AGO'] }, D);
  assert.strictEqual(cod(r), '0002-0011-0001');
});
t('inabilità con 4 anni → non accessibile', () => {
  const r = M.valuta({ ramo: 'invalidita', sesso: 'M', dataNascita: '1975-01-01', contributi: { anni: 4 }, contributiUltimoQuinquennio: 4, invalidita: { grado: 'assoluta' }, gestioni: ['AGO'] }, D);
  assert.strictEqual(r.proposta, null);
  assert.strictEqual(stato(r, '0002-0012-0001'), 'non_accessibile');
});
t('inabilità causa di servizio gestione pubblica → da verificare', () => {
  const r = M.valuta({ ramo: 'invalidita', sesso: 'M', dataNascita: '1975-01-01', contributi: { anni: 20 }, invalidita: { grado: 'assoluta', causaServizio: true }, gestioni: ['ESCLUSIVA'] }, D);
  assert.strictEqual(stato(r, '0002-0012-0046'), 'da_verificare');
});

t('superstiti: dante pensionato → reversibilità', () => {
  const r = M.valuta({ ramo: 'superstiti', superstiti: { dante: { pensionato: true } } }, D);
  assert.strictEqual(cod(r), '0003-0021-0001');
});
t('superstiti: dante con 16 anni → indiretta', () => {
  const r = M.valuta({ ramo: 'superstiti', superstiti: { dante: { pensionato: false, contributi: { anni: 16 } } } }, D);
  assert.strictEqual(cod(r), '0003-0022-0001');
});
t('superstiti: dante con 3 anni → indennità una tantum da verificare', () => {
  const r = M.valuta({ ramo: 'superstiti', superstiti: { dante: { pensionato: false, contributi: { anni: 3 } } } }, D);
  assert.strictEqual(r.proposta, null);
  assert.strictEqual(stato(r, '0003-0025-0001'), 'da_verificare');
});

t('tutte le regole puntano a codici in catalogo', () => {
  const r = ['diretta', 'invalidita', 'superstiti'].flatMap(ramo =>
    M.valuta({ ramo, sesso: 'F', dataNascita: '1960-01-01', contributi: { anni: 30 }, superstiti: { dante: {} } }, D).nonPertinenti);
  assert.deepStrictEqual(r.filter(x => /non in catalogo/.test(x)), []);
});
t('tipologie obsolete mai proposte', () => {
  const obs = new Set(CAT.filter(x => x.obsoleta).map(x => x.codice));
  const r = M.valuta({ ...base, sesso: 'F', dataNascita: '1962-01-01', contributi: { anni: 40 }, ante96: true }, D);
  assert.ok(!r.candidati.some(x => obs.has(x.codice)));
});
const ESEMPI = require('./esempi.js');
ESEMPI.forEach(e => t('esempio ' + e.id + ' ' + e.iniziali + ' (' + e.scenario.ramo + ') → ' + e.scenario.atteso, () => {
  const r = M.valuta(ESEMPI.profiloMotore(e), D);
  assert.strictEqual(r.proposta ? r.proposta.codice : null, e.scenario.atteso);
}));
console.log(n + ' test superati' + (process.exitCode ? ' — con errori' : ''));
