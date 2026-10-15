/*
 * Motore di indirizzamento — Domanda di pensione INPS (prototipo di ricerca)
 *
 * Dato un profilo (età, contributi, ante/post 1996, gestioni, certificazioni FELPE, ...)
 * indica quali tipologie del catalogo (98 codici GGGG-PPPP-TTTT) sono presentabili,
 * quali no (con motivazione) e quale proporre.
 *
 * Il flusso è a tre rami, decisi alla prima domanda:
 *   diretta      → vecchiaia / anticipata / percorsi speciali certificati / supplementari
 *   invalidita   → assegno di invalidità / inabilità / privilegiate
 *   superstiti   → reversibilità / indiretta
 *
 * Ordine di priorità del ramo "diretta" (regole di dominio del progetto):
 *   1) se la vecchiaia è accessibile è quella la risposta;
 *   2) altrimenti anticipata ordinaria / contributiva a 64 anni;
 *   3) altrimenti percorsi speciali (FELPE, diritti acquisiti);
 *   4) amianto e benefici contributivi vengono sempre segnalati.
 *
 * Le regole sono nella tabella regole.json (generata dal foglio "Regole motore" di
 * motore/dati/Requisiti_domande_pensione.xlsx); la logica che non si esprime a colonne resta qui
 * (REGOLE_LEGACY, richiamate per codice dalle righe con "Predicato").
 * I parametri numerici sono nella funzione parametri() (per anno di maturazione).
 * Le tipologie marcate "obsoleta" nel catalogo non vengono mai proposte.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./catalogo.js'), require('./regole.js'));
  else root.MotorePensioni = factory(root.CATALOGO_PENSIONI, root.REGOLE_MOTORE);
})(typeof self !== 'undefined' ? self : this, function (CATALOGO, TABELLA) {
  'use strict';

  // ───────────────────────── Parametri normativi (in mesi) ─────────────────────────
  // Adeguamento alla speranza di vita: +1 mese dal 2027, +3 mesi complessivi dal 2028
  // (legge di bilancio 2026; estremi da confermare). Oltre il 2028 si mantiene il 2028.
  const AGG = { 2027: 1, 2028: 3 };
  function agg(anno) { return anno >= 2028 ? AGG[2028] : (AGG[anno] || 0); }
  function parametri(anno) {
    const a = agg(anno);
    return {
      anno,
      vecchiaia: 67 * 12 + a,            // 67 anni
      vecchiaiaContributiva71: 71 * 12 + a,
      contributiva64: 64 * 12 + a,
      anticipataM: 42 * 12 + 10 + a,     // 42 anni e 10 mesi
      anticipataF: 41 * 12 + 10 + a,     // 41 anni e 10 mesi
      precoci: 41 * 12 + a,
      gravosiEta: 66 * 12 + 7,           // art. 1 c. 147 L. 205/2017: non adeguato
      usurantiEta: 61 * 12 + 7,          // D.Lgs. 67/2011 (dipendenti); autonomi +12 mesi
    };
  }

  // ───────────────────────── Utilità ─────────────────────────
  const byCodice = {};
  CATALOGO.forEach(function (t) { byCodice[t.codice] = t; });

  function fmt(mesi) {
    mesi = Math.max(0, Math.round(mesi));
    const a = Math.floor(mesi / 12), m = mesi % 12;
    const pa = a ? a + (a === 1 ? ' anno' : ' anni') : '';
    const pm = m ? m + (m === 1 ? ' mese' : ' mesi') : '';
    return [pa, pm].filter(Boolean).join(' e ') || '0 mesi';
  }
  function mesiDa(c) { return c ? Math.round((c.anni || 0) * 12 + (c.mesi || 0)) : 0; }
  function parseData(s) { if (s instanceof Date) return s; const d = new Date(s + 'T00:00:00'); return isNaN(d) ? null : d; }
  function etaMesi(nascita, al) {
    let m = (al.getFullYear() - nascita.getFullYear()) * 12 + (al.getMonth() - nascita.getMonth());
    if (al.getDate() < nascita.getDate()) m -= 1;
    return m;
  }
  function aggiungiMesi(d, m) { const r = new Date(d.getTime()); r.setMonth(r.getMonth() + m); return r; }
  function iso(d) { const z = function (n) { return (n < 10 ? '0' : '') + n; }; return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate()); }

  const OK = function (motivi) { return { stato: 'accessibile', motivi: motivi || [] }; };
  const NO = function (motivi, mancano) { return { stato: 'non_accessibile', motivi: motivi, mancano: mancano || 0 }; };
  const VER = function (motivi) { return { stato: 'da_verificare', motivi: motivi }; };

  /** Esegue un elenco di requisiti [[ok, messaggioSeNo, mesiMancanti]] → esito. */
  function requisiti(lista, okMsg) {
    const ko = lista.filter(function (r) { return !r[0]; });
    if (!ko.length) return OK(okMsg ? [okMsg] : []);
    return NO(ko.map(function (r) { return r[1]; }),
      Math.max.apply(null, ko.map(function (r) { return r[2] || 0; })));
  }

  // ───────────────────────── Contesto derivato dal profilo ─────────────────────────
  function contesto(p, opz) {
    const oggi = opz && opz.data ? parseData(opz.data) : new Date();
    const nascita = parseData(p.dataNascita);
    const sesso = (p.sesso || 'M').toUpperCase();
    const contrM = mesiDa(p.contributi);
    const gest = new Set((p.gestioni && p.gestioni.length ? p.gestioni : ['AGO']).map(function (g) { return String(g).toUpperCase(); }));
    const cert = new Set(((p.felpe && p.felpe.certificazioni) || []).map(function (c) { return String(c).toUpperCase(); }));
    const P = parametri(oggi.getFullYear());
    const etaM = nascita ? etaMesi(nascita, oggi) : 0;
    const altre = gest.has('AGO') || gest.has('ESCLUSIVA') || gest.has('CASSA');
    // stima età/contributi a una data passata, assumendo contribuzione continua (da verificare in UNEX)
    function alla(data) {
      const trascorsi = etaMesi(data, oggi);
      return { etaM: etaMesi(nascita, data), contrM: contrM - Math.max(0, trascorsi) };
    }
    return {
      p: p, oggi: oggi, nascita: nascita, sesso: sesso, etaM: etaM, contrM: contrM,
      effM: p.contributiEffettivi ? mesiDa(p.contributiEffettivi) : contrM,
      ante96: !!p.ante96, gest: gest, cert: cert, P: P,
      hasGS: gest.has('GS'), hasEst: gest.has('ESTERO'), hasEsc: gest.has('ESCLUSIVA'),
      gsPiuAltre: gest.has('GS') && altre,
      lt18: typeof p.contributiAl1995 === 'number' ? p.contributiAl1995 < 18 : null,
      dopo96M: typeof p.contributiDopo1996 === 'number' ? p.contributiDopo1996 * 12 : null,
      figli: p.figli || 0,
      sogliaAnt: sesso === 'F' ? P.anticipataF : P.anticipataM,
      alla: alla
    };
  }

  // ───────────────────────── Regole: ramo DIRETTA ─────────────────────────
  // Ogni regola: { codice, tier, valuta(c) → esito | null (non pertinente) }
  // tier: 1 vecchiaia · 2 anticipata ordinaria · 3 speciale · 4 supplementare/trasformazione · 0 segnalazione
  const SALV = {
    L214: ['0144', '0144'], L135: ['0145', '0145'], L228: ['0146', '0146'], DL102: ['0151', '0151'],
    L147_2013: ['0155', '0155'], L147_2014: ['0157', '0157'], L208: [null, '0160'],
    L232: ['0165', '0165'], L178: ['0181', '0181']
  };

  const REGOLE_DIRETTA_LEGACY = [
    // ── Tier 1: vecchiaia ──────────────────────────────────────
    { codice: '0001-0002-0001', tier: 1, valuta: function (c) {
      if (!c.ante96) return NO(['Primo contributo dopo il 1995: si applica la vecchiaia con sistema contributivo.']);
      return requisiti([
        [c.etaM >= c.P.vecchiaia, 'Servono ' + fmt(c.P.vecchiaia) + ' di età (hai ' + fmt(c.etaM) + ').', c.P.vecchiaia - c.etaM],
        [c.contrM >= 240, 'Servono 20 anni di contributi (hai ' + fmt(c.contrM) + ').', 240 - c.contrM]
      ], 'Età e contributi sufficienti per la vecchiaia ordinaria (sistema misto).');
    } },
    { codice: '0001-0002-0017', tier: 1, valuta: function (c) {
      if (c.ante96) return NO(['Hai contributi prima del 1996: sistema misto, non contributivo puro.']);
      const via67 = requisiti([
        [c.etaM >= c.P.vecchiaia, 'Servono ' + fmt(c.P.vecchiaia) + ' di età (hai ' + fmt(c.etaM) + ').', c.P.vecchiaia - c.etaM],
        [c.contrM >= 240, 'Servono 20 anni di contributi (hai ' + fmt(c.contrM) + ').', 240 - c.contrM]
      ]);
      const via71 = requisiti([
        [c.etaM >= c.P.vecchiaiaContributiva71, 'In alternativa servono ' + fmt(c.P.vecchiaiaContributiva71) + ' di età.', c.P.vecchiaiaContributiva71 - c.etaM],
        [c.effM >= 60, 'e 5 anni di contributi effettivi (hai ' + fmt(c.effM) + ').', 60 - c.effM]
      ]);
      if (via71.stato === 'accessibile') return OK(['Vecchiaia contributiva a ' + fmt(c.P.vecchiaiaContributiva71) + ' con 5 anni effettivi, senza soglia di importo.']);
      if (via67.stato === 'accessibile') {
        return OK(['Vecchiaia contributiva a ' + fmt(c.P.vecchiaia) + ' con 20 anni di contributi (la soglia di importo di 1,5 volte l\'assegno sociale è verificata in istruttoria).']);
      }
      return NO(via67.motivi.concat(via71.motivi), Math.min(via67.mancano, via71.mancano));
    } },
    { codice: '0001-0002-0030', tier: 1, valuta: function (c) {
      if (!c.ante96) return null;
      if (c.lt18 === false) return NO(['Con almeno 18 anni di contributi al 31/12/1995 l\'opzione per il contributivo non è ammessa.']);
      if (!c.cert.has('OPZIONE_CONTRIBUTIVO')) return c.lt18 === true ? VER(['Opzione possibile (meno di 18 anni al 1995): serve la certificazione FELPE dell\'opzione.']) : null;
      return requisiti([
        [c.etaM >= c.P.vecchiaia, 'Servono ' + fmt(c.P.vecchiaia) + ' di età.', c.P.vecchiaia - c.etaM],
        [c.contrM >= 240, 'Servono 20 anni di contributi.', 240 - c.contrM]
      ], 'Opzione per il calcolo contributivo certificata in FELPE.');
    } },
    { codice: '0001-0002-0045', tier: 1, valuta: function (c) {
      if (!c.gsPiuAltre) return null;
      if (!c.ante96) return null;
      if (c.lt18 === false) return NO(['Il computo in Gestione separata richiede meno di 18 anni di contributi al 31/12/1995.']);
      if (c.lt18 === null || c.dopo96M === null) return VER(['Gestione separata con periodi in altre gestioni: verificare meno di 18 anni al 1995 e almeno 5 anni dopo il 1996 (computo art. 3 DM 282/1996).']);
      return requisiti([
        [c.etaM >= c.P.vecchiaia, 'Servono ' + fmt(c.P.vecchiaia) + ' di età.', c.P.vecchiaia - c.etaM],
        [c.contrM >= 180, 'Servono almeno 15 anni di contributi.', 180 - c.contrM],
        [c.dopo96M >= 60, 'Servono almeno 5 anni di contributi dopo il 1996.', 60 - c.dopo96M]
      ], 'Computo dei periodi in altre gestioni nella Gestione separata (DM 282/1996, art. 3).');
    } },
    { codice: '0001-0002-0008', tier: 1, valuta: function (c) {
      if (!(c.p.invalidita80)) return null;
      const eta = c.sesso === 'F' ? 56 * 12 : 61 * 12;
      return requisiti([
        [c.etaM >= eta, 'Servono ' + fmt(eta) + ' di età (invalidi ≥ 80%, dipendenti).', eta - c.etaM],
        [c.contrM >= 240, 'Servono 20 anni di contributi.', 240 - c.contrM]
      ], 'Invalidità ≥ 80%: pensione anticipata di vecchiaia.');
    } },
    { codice: '0001-0002-0172', tier: 1, valuta: function (c) {
      if (!c.cert.has('GRAVOSI')) return null;
      const opz = c.cert.has('OPZIONE_CONTRIBUTIVO');
      return requisiti([
        [c.etaM >= c.P.gravosiEta, 'Servono ' + fmt(c.P.gravosiEta) + ' di età (requisito non adeguato).', c.P.gravosiEta - c.etaM],
        [c.contrM >= 360, 'Servono 30 anni di contributi.', 360 - c.contrM]
      ], 'Attività gravose certificate in FELPE' + (opz ? ' (la variante con opzione contributivo è 0001-0002-0173)' : '') + '.');
    } },
    { codice: '0001-0002-0173', tier: 1, valuta: function (c) {
      if (!c.cert.has('GRAVOSI') || !c.cert.has('OPZIONE_CONTRIBUTIVO')) return null;
      return requisiti([
        [c.etaM >= c.P.gravosiEta, 'Servono ' + fmt(c.P.gravosiEta) + ' di età.', c.P.gravosiEta - c.etaM],
        [c.contrM >= 360, 'Servono 30 anni di contributi.', 360 - c.contrM]
      ], 'Attività gravose con opzione per il calcolo contributivo.');
    } },
    { codice: '0001-0002-0077', tier: 1, valuta: function (c) {
      if (!c.hasEst) return null;
      return VER(['Periodi all\'estero: la prestazione a carico di Stato estero segue la legislazione estera; INPS opera come organismo di collegamento.']);
    } },

    // ── Tier 2: anticipata ordinaria / contributiva ────────────
    { codice: '0001-0001-0001', tier: 2, valuta: function (c) {
      return requisiti([[c.contrM >= c.sogliaAnt,
        'Servono ' + fmt(c.sogliaAnt) + ' di contributi (hai ' + fmt(c.contrM) + ').', c.sogliaAnt - c.contrM]],
        'Contributi sufficienti per la pensione anticipata ordinaria (' + fmt(c.sogliaAnt) + ').');
    } },
    { codice: '0001-0001-0017', tier: 2, valuta: function (c) {
      if (c.ante96) return NO(['Hai contributi prima del 1996: la pensione a 64 anni riguarda solo il sistema contributivo puro.']);
      const base = requisiti([
        [c.etaM >= c.P.contributiva64, 'Servono ' + fmt(c.P.contributiva64) + ' di età (hai ' + fmt(c.etaM) + ').', c.P.contributiva64 - c.etaM],
        [c.contrM >= 240, 'Servono 20 anni di contributi (hai ' + fmt(c.contrM) + ').', 240 - c.contrM]
      ]);
      if (base.stato !== 'accessibile') return base;
      return OK(['Pensione anticipata contributiva a ' + fmt(c.P.contributiva64) + ' (la soglia di importo è verificata in istruttoria, non dal motore).']);
    } },
    { codice: '0001-0001-0045', tier: 2, valuta: function (c) {
      if (!c.gsPiuAltre || !c.ante96) return null;
      if (c.lt18 === false) return NO(['Il computo in Gestione separata richiede meno di 18 anni di contributi al 31/12/1995.']);
      if (c.lt18 === null) return VER(['Gestione separata con periodi in altre gestioni: verificare meno di 18 anni al 1995 (computo DM 282/1996).']);
      return requisiti([[c.contrM >= c.sogliaAnt, 'Servono ' + fmt(c.sogliaAnt) + ' di contributi.', c.sogliaAnt - c.contrM]],
        'Computo in Gestione separata dei periodi in altre gestioni.');
    } },
    { codice: '0001-0001-0030', tier: 2, valuta: function (c) {
      if (!c.ante96 || !c.cert.has('OPZIONE_CONTRIBUTIVO')) return null;
      if (c.lt18 === false) return NO(['Con almeno 18 anni di contributi al 31/12/1995 l\'opzione non è ammessa.']);
      return requisiti([[c.contrM >= c.sogliaAnt, 'Servono ' + fmt(c.sogliaAnt) + ' di contributi (anticipata ordinaria con calcolo contributivo).', c.sogliaAnt - c.contrM]],
        'Opzione contributiva certificata in FELPE.');
    } },

    // ── Tier 3: percorsi speciali (certificazione FELPE e diritti acquisiti) ─
    { codice: '0001-0001-0051', tier: 3, valuta: function (c) {
      if (!c.cert.has('PRECOCI')) return null;
      return requisiti([[c.contrM >= c.P.precoci, 'Servono ' + fmt(c.P.precoci) + ' di contributi (precoci).', c.P.precoci - c.contrM]],
        'Lavoratore precoce certificato in FELPE.');
    } },
    { codice: '0001-0001-0140', tier: 3, valuta: function (c) {
      if (!c.cert.has('USURANTI')) return null;
      const quota = (c.etaM + c.contrM) / 12;
      return requisiti([
        [c.etaM >= c.P.usurantiEta, 'Servono ' + fmt(c.P.usurantiEta) + ' di età (dipendenti; autonomi +1 anno).', c.P.usurantiEta - c.etaM],
        [c.contrM >= 420, 'Servono 35 anni di contributi.', 420 - c.contrM],
        [quota >= 97.6, 'Quota 97,6 non raggiunta (età + contributi = ' + quota.toFixed(1) + ').', Math.ceil((97.6 - quota) * 6)]
      ], 'Lavori usuranti certificati in FELPE.');
    } },
    { codice: '0001-0001-0161', tier: 0, valuta: function (c) {
      if (!c.cert.has('AMIANTO')) return null;
      return VER(['Esposizione all\'amianto certificata: la maggiorazione contributiva può anticipare il diritto. Il calcolo va fatto dalla procedura sui periodi qualificati.']);
    } },
    { codice: '0001-0002-0161', tier: 0, valuta: function (c) {
      if (!c.cert.has('AMIANTO')) return null;
      return VER(['Esposizione all\'amianto certificata: la maggiorazione può migliorare importo e diritto alla vecchiaia.']);
    } },
    { codice: '0001-0001-0158', tier: 3, valuta: function (c) {
      if (!c.cert.has('VITTIMA_TERRORISMO') || !c.p.vittimaInvalidita80) return null;
      return VER(['Vittima del terrorismo/stragi con invalidità ≥ 80%: benefici L. 206/2004, riconoscimento della Prefettura/UTG.']);
    } },
    { codice: '0001-0001-0159', tier: 3, valuta: function (c) {
      if (!c.cert.has('VITTIMA_TERRORISMO') || c.p.vittimaInvalidita80) return null;
      return VER(['Familiare di vittima o invalidità < 80%: benefici L. 206/2004, riconoscimento della Prefettura/UTG.']);
    } },
    { codice: '0001-0002-0159', tier: 3, valuta: function (c) {
      if (!c.cert.has('VITTIMA_TERRORISMO')) return null;
      return VER(['Benefici L. 206/2004 sulla vecchiaia: verificare la maggiorazione di anzianità.']);
    } },
    { codice: '0001-0001-0190', tier: 3, valuta: function (c) {
      if (c.sesso !== 'F') return null;
      const st = c.alla(new Date(2024, 11, 31));
      const etaMin = (61 - Math.min(2, c.figli)) * 12;
      if (st.etaM < etaMin || st.contrM < 35 * 12) return null;
      return VER(['Opzione donna: requisiti anagrafico-contributivi stimati al 31/12/2024; serve inoltre una condizione soggettiva (caregiver, invalidità ≥ 74%, lavoratrice licenziata/in azienda in crisi). La misura non è stata rinnovata.']);
    } },
    { codice: '0001-0001-0162', tier: 3, valuta: function (c) {
      if (!c.p.editoria) return null;
      return VER(['Prepensionamento editoria dichiarato: verificare crisi aziendale accertata e CIGS per accordi di procedura.']);
    } },
    // Salvaguardie (anticipata e vecchiaia): una regola per ciascuna legge, se certificata
    ...Object.keys(SALV).map(function (k) { return salvRegola(k, 'anticipata'); }),
    ...Object.keys(SALV).map(function (k) { return salvRegola(k, 'vecchiaia'); }),

    // ── Tier 4: già pensionato (supplementari e trasformazioni) ─
    { codice: '0001-0002-0009', tier: 4, valuta: function (c) {
      if (!c.p.pensionato || c.hasGS) return null;
      return requisiti([[c.etaM >= c.P.vecchiaia, 'Servono ' + fmt(c.P.vecchiaia) + ' di età.', c.P.vecchiaia - c.etaM]],
        'Titolare di pensione diretta con contributi ulteriori: supplementare (domanda dopo 5 anni dalla decorrenza).');
    } },
    { codice: '0001-0002-0192', tier: 4, valuta: function (c) {
      if (!c.p.pensionato || !c.hasGS) return null;
      return requisiti([[c.etaM >= c.P.vecchiaia, 'Servono ' + fmt(c.P.vecchiaia) + ' di età.', c.P.vecchiaia - c.etaM]],
        'Supplementare con computo in Gestione separata (DM 282/1996).');
    } },
    { codice: '0001-0002-0002', tier: 4, valuta: function (c) {
      if (!c.p.titolareAOI) return null;
      return requisiti([[c.etaM >= c.P.vecchiaia, 'Servono ' + fmt(c.P.vecchiaia) + ' di età.', c.P.vecchiaia - c.etaM],
        [c.contrM >= 240, 'Servono 20 anni di contributi.', 240 - c.contrM]], 'Trasformazione dell\'assegno ordinario di invalidità in vecchiaia.');
    } },
    { codice: '0001-0002-0003', tier: 4, valuta: function (c) {
      if (!c.p.titolareInvalidita) return null;
      return requisiti([[c.etaM >= c.P.vecchiaia, 'Servono ' + fmt(c.P.vecchiaia) + ' di età.', c.P.vecchiaia - c.etaM],
        [c.contrM >= 240, 'Servono 20 anni di contributi.', 240 - c.contrM]], 'Trasformazione della pensione di invalidità in vecchiaia.');
    } }
  ];

  function salvRegola(chiave, via) {
    const idx = via === 'anticipata' ? 1 : 0;
    const t = SALV[chiave][idx];
    return {
      codice: via === 'anticipata' ? '0001-0001-' + (t || '0160') : '0001-0002-' + (t || '0000'),
      tier: 3, salvaguardia: chiave, via: via,
      valuta: function (c) {
        if (!t || !c.cert.has('SALVAGUARDIA') || (c.p.felpe && c.p.felpe.salvaguardia !== chiave)) return null;
        if (via === 'anticipata') {
          return c.contrM >= 480
            ? OK(['Salvaguardia ' + chiave + ' certificata: 40 anni di contributi (requisiti ante Fornero).'])
            : VER(['Salvaguardia ' + chiave + ' certificata: servono 40 anni di contributi oppure quota 96/97 (' + fmt(c.contrM) + ' presenti). Verificare le quote.']);
        }
        const etaMin = (c.sesso === 'F' ? 60 : 65) * 12;
        return requisiti([
          [c.etaM >= etaMin, 'Servono ' + fmt(etaMin) + ' di età (requisiti ante Fornero).', etaMin - c.etaM],
          [c.contrM >= 240, 'Servono 20 anni di contributi (15 con deroghe).', 240 - c.contrM]
        ], 'Salvaguardia ' + chiave + ' certificata in FELPE.');
      }
    };
  }
  // elimina eventuali regole di salvaguardia vuote (nessun codice vecchiaia)
  for (let i = REGOLE_DIRETTA_LEGACY.length - 1; i >= 0; i--) {
    if (REGOLE_DIRETTA_LEGACY[i].salvaguardia && /-0000$/.test(REGOLE_DIRETTA_LEGACY[i].codice)) REGOLE_DIRETTA_LEGACY.splice(i, 1);
  }

  // ───────────────────────── Regole: ramo INVALIDITA ─────────────────────────
  function contributiInvalidita(c, dati, soggetto) {
    const tot = mesiDa(dati.contributi);
    const ult5 = typeof dati.contributiUltimoQuinquennio === 'number' ? dati.contributiUltimoQuinquennio * 12 : null;
    const l = [[tot >= 60, 'Servono 5 anni di contributi (' + (soggetto || 'hai') + ' ' + fmt(tot) + ').', 60 - tot]];
    if (ult5 === null) return { esito: tot >= 60 ? VER(['Verificare 3 anni di contributi nell\'ultimo quinquennio.']) : requisiti(l), ult5: null };
    l.push([ult5 >= 36, 'Servono 3 anni di contributi negli ultimi 5 anni (' + fmt(ult5) + ' presenti).', 36 - ult5]);
    return { esito: requisiti(l, '5 anni di contributi, di cui 3 nell\'ultimo quinquennio.'), ult5: ult5 };
  }
  const REGOLE_INVALIDITA_LEGACY = [
    { codice: '0002-0011-0001', tier: 1, valuta: function (c) {
      const inv = c.p.invalidita || {};
      if (inv.grado !== 'parziale') return null;
      return contributiInvalidita(c, c.p).esito;
    } },
    { codice: '0002-0011-0045', tier: 1, valuta: function (c) {
      const inv = c.p.invalidita || {};
      if (inv.grado !== 'parziale' || !c.gsPiuAltre) return null;
      return contributiInvalidita(c, c.p).esito;
    } },
    { codice: '0002-0012-0001', tier: 1, valuta: function (c) {
      const inv = c.p.invalidita || {};
      if (inv.grado !== 'assoluta') return null;
      if (!c.ante96 && !c.p.ante96Esplicito) { /* sia misto sia contributivo puro: stessa tipologia ordinaria */ }
      return contributiInvalidita(c, c.p).esito;
    } },
    { codice: '0002-0012-0045', tier: 1, valuta: function (c) {
      const inv = c.p.invalidita || {};
      if (inv.grado !== 'assoluta' || !c.gsPiuAltre) return null;
      return contributiInvalidita(c, c.p).esito;
    } },
    { codice: '0002-0012-0052', tier: 1, valuta: function (c) {
      const inv = c.p.invalidita || {};
      if (inv.grado !== 'assoluta' || c.ante96) return null;
      const e = contributiInvalidita(c, c.p).esito;
      return e.stato === 'accessibile' ? VER(['Contributivo puro: pensione di inabilità ex art. 2 c. 12 L. 335/1995 (calcolo contributivo con maggiorazione). Verificare se sostituisce la tipologia ordinaria.']) : e;
    } },
    { codice: '0002-0011-0005', tier: 3, valuta: function (c) {
      const inv = c.p.invalidita || {};
      if (!inv.causaServizio || inv.grado !== 'parziale') return null;
      return VER(['Infermità dipendente da causa di servizio (gestione pubblica): assegno privilegiato, senza minimo contributivo.']);
    } },
    { codice: '0002-0012-0046', tier: 3, valuta: function (c) {
      const inv = c.p.invalidita || {};
      if (!inv.causaServizio || inv.grado !== 'assoluta' || !c.hasEsc) return null;
      return VER(['Inabilità per causa di servizio nella gestione pubblica (ex INPDAP).']);
    } },
    { codice: '0002-0012-0005', tier: 3, valuta: function (c) {
      const inv = c.p.invalidita || {};
      if (!inv.causaServizio || inv.grado !== 'assoluta' || c.hasEsc) return null;
      return VER(['Pensione privilegiata di inabilità per causa di servizio.']);
    } },
    { codice: '0002-0012-0047', tier: 3, valuta: function (c) {
      const inv = c.p.invalidita || {};
      if (inv.causaServizio || !c.hasEsc || (inv.grado !== 'assoluta')) return null;
      return VER(['Gestione pubblica: inabilità a proficuo lavoro/mansioni per infermità non dipendente da causa di servizio. Verificare il minimo di servizio.']);
    } },
    { codice: '0002-0012-0010', tier: 3, valuta: function (c) {
      const inv = c.p.invalidita || {};
      if (!inv.marittimo || inv.grado !== 'assoluta') return null;
      return VER(['Marittimo: inabilità alla navigazione, verificare la contribuzione marittima.']);
    } },
    { codice: '0002-0012-0168', tier: 3, valuta: function (c) {
      const inv = c.p.invalidita || {};
      if (!c.cert.has('AMIANTO') || inv.grado !== 'assoluta') return null;
      return VER(['Esposizione all\'amianto certificata: possibile pensione di inabilità ex art. 1 c. 250 L. 232/2016 (da verificare).']);
    } },
    { codice: '0002-0013-0009', tier: 4, valuta: function (c) {
      if (!c.p.pensionato) return null;
      return VER(['Già titolare di pensione: supplementare di invalidità sulla contribuzione ulteriore.']);
    } },
    { codice: '0002-0013-0077', tier: 4, valuta: function (c) {
      if (!c.hasEst) return null;
      return VER(['Periodi all\'estero: prestazione a carico di Stato estero.']);
    } },
    { codice: '0002-0014-0001', tier: 4, valuta: function (c) {
      const inv = c.p.invalidita || {};
      if (!inv.soloRiconoscimento) return null;
      return OK(['Domanda di solo riconoscimento dello stato di invalidità/inabilità, senza liquidazione di pensione.']);
    } }
  ];

  // ───────────────────────── Regole: ramo SUPERSTITI ─────────────────────────
  function dante(c) { return (c.p.superstiti && c.p.superstiti.dante) || {}; }
  function danteGSAltre(d) { const g = new Set((d.gestioni || []).map(function (x) { return String(x).toUpperCase(); })); return g.has('GS') && (g.has('AGO') || g.has('ESCLUSIVA') || g.has('CASSA')); }
  function reqIndiretta(d) {
    const tot = mesiDa(d.contributi);
    const ult5 = typeof d.contributiUltimoQuinquennio === 'number' ? d.contributiUltimoQuinquennio * 12 : null;
    if (tot >= 180) return OK(['Il dante causa aveva almeno 15 anni di contributi.']);
    if (tot >= 60 && ult5 !== null && ult5 >= 36) return OK(['Il dante causa aveva 5 anni di contributi, di cui 3 nell\'ultimo quinquennio.']);
    if (tot >= 60 && ult5 === null) return VER(['Il dante causa aveva almeno 5 anni: verificare 3 anni nell\'ultimo quinquennio.']);
    return NO(['Il dante causa non aveva i requisiti (15 anni, oppure 5 di cui 3 nell\'ultimo quinquennio): ha ' + fmt(tot) + '.'], 0);
  }
  const REGOLE_SUPERSTITI_LEGACY = [
    { codice: '0003-0021-0001', tier: 1, valuta: function (c) {
      const d = dante(c); if (!d.pensionato) return null;
      return OK(['Il dante causa era titolare di pensione: reversibilità.']);
    } },
    { codice: '0003-0021-0009', tier: 4, valuta: function (c) {
      const d = dante(c); if (!d.pensionato || !d.titolareSupplementare) return null;
      return OK(['Il dante causa era titolare di pensione supplementare.']);
    } },
    { codice: '0003-0022-0001', tier: 1, valuta: function (c) {
      const d = dante(c); if (d.pensionato || d.marittimoScomparso) return null;
      return reqIndiretta(d);
    } },
    { codice: '0003-0022-0045', tier: 1, valuta: function (c) {
      const d = dante(c); if (d.pensionato || !danteGSAltre(d)) return null;
      return reqIndiretta(d);
    } },
    { codice: '0003-0022-0005', tier: 3, valuta: function (c) {
      const d = dante(c); if (d.pensionato || !d.causaServizio) return null;
      return VER(['Decesso del dante causa per causa di servizio: pensione privilegiata indiretta.']);
    } },
    { codice: '0003-0022-0046', tier: 3, valuta: function (c) {
      const d = dante(c); const g = new Set((d.gestioni || []).map(function (x) { return String(x).toUpperCase(); }));
      if (d.pensionato || !d.causaServizio || !g.has('ESCLUSIVA')) return null;
      return VER(['Dante causa della gestione pubblica deceduto per causa di servizio.']);
    } },
    { codice: '0003-0022-0052', tier: 3, valuta: function (c) {
      const d = dante(c); if (d.pensionato || !d.inabileAlDecesso) return null;
      return VER(['Dante causa inabile al decesso (art. 2 c. 12 L. 335/1995): verificare i requisiti.']);
    } },
    { codice: '0003-0023-0001', tier: 3, valuta: function (c) {
      const d = dante(c); if (!d.marittimoScomparso) return null;
      return OK(['Scomparsa in mare del marittimo, equiparata al decesso.']);
    } },
    { codice: '0003-0024-0077', tier: 4, valuta: function (c) {
      const d = dante(c); const g = new Set((d.gestioni || []).map(function (x) { return String(x).toUpperCase(); }));
      if (!g.has('ESTERO')) return null;
      return VER(['Pensione ai superstiti a carico di Stato estero.']);
    } },
    { codice: '0003-0025-0001', tier: 4, valuta: function (c) {
      const d = dante(c); if (d.pensionato || d.marittimoScomparso) return null;
      const e = reqIndiretta(d);
      return e.stato === 'non_accessibile' ? VER(['Il dante causa non ha i requisiti per l\'indiretta: valutare l\'indennità una tantum.']) : null;
    } }
  ];


  // ───────────────────────── Interprete della tabella delle regole ─────────────────────────
  // Ogni riga di regole.json: { codice, ramo, tier, se[], no[{c,msg}], req[{k,min,msg}], mancano, esito, msg, pred }
  // - se: condizioni tutte vere, altrimenti la tipologia non è pertinente (null)
  // - no: se una condizione è vera → non accessibile con quel motivo
  // - req: requisiti numerici (eta, contr, quota); mancano → non_accessibile (o da_verificare)
  // - pred: la logica è nel codice (REGOLE_LEGACY, per codice)
  function condizione(tok, c) {
    const p = c.p, inv = p.invalidita || {}, d = (p.superstiti && p.superstiti.dante) || {};
    const dg = new Set((d.gestioni || []).map(function (x) { return String(x).toUpperCase(); }));
    let m;
    if ((m = /^(gest|noGest)\.(\w+)$/.exec(tok))) return (m[1] === 'gest') === c.gest.has(m[2]);
    if ((m = /^cert\.(\w+)$/.exec(tok))) return c.cert.has(m[1]);
    if ((m = /^salv\.(\w+)$/.exec(tok))) return c.cert.has('SALVAGUARDIA') && !!p.felpe && p.felpe.salvaguardia === m[1];
    if ((m = /^deroga\.(\w+)$/.exec(tok))) return !!(p.deroga && p.deroga[m[1]]);
    if ((m = /^grado\.(\w+)$/.exec(tok))) return inv.grado === m[1];
    switch (tok) {
      case 'ante96': return c.ante96;
      case 'post95': return !c.ante96;
      case 'pensionato': return !!p.pensionato;
      case 'titolareAOI': return !!p.titolareAOI;
      case 'titolareInvalidita': return !!p.titolareInvalidita;
      case 'invalidita80': return !!p.invalidita80;
      case 'editoria': return !!p.editoria;
      case 'vittima80': return !!p.vittimaInvalidita80;
      case 'noVittima80': return !p.vittimaInvalidita80;
      case 'sesso.F': return c.sesso === 'F';
      case 'gsPiuAltre': return c.gsPiuAltre;
      case 'causaServizio': return !!inv.causaServizio;
      case 'noCausaServizio': return !inv.causaServizio;
      case 'marittimo': return !!inv.marittimo;
      case 'soloRiconoscimento': return !!inv.soloRiconoscimento;
      case 'dante.pensionato': return !!d.pensionato;
      case 'dante.noPensionato': return !d.pensionato;
      case 'dante.supplementare': return !!d.titolareSupplementare;
      case 'dante.causaServizio': return !!d.causaServizio;
      case 'dante.marittimoScomparso': return !!d.marittimoScomparso;
      case 'noMarittimoScomparso': return !d.marittimoScomparso;
      case 'dante.inabile': return !!d.inabileAlDecesso;
      case 'dante.estero': return dg.has('ESTERO');
      case 'dante.esclusiva': return dg.has('ESCLUSIVA');
      case 'dante.gsPiuAltre': return dg.has('GS') && (dg.has('AGO') || dg.has('ESCLUSIVA') || dg.has('CASSA'));
    }
    throw new Error('Condizione sconosciuta nella tabella delle regole: ' + tok);
  }
  function sogliaRichiesta(m, c) {
    if (typeof m === 'number') return m;
    if (typeof m === 'object') return c.sesso === 'F' ? sogliaRichiesta(m.F, c) : sogliaRichiesta(m.M, c);
    const par = { vecchiaia: c.P.vecchiaia, vecchiaiaContributiva71: c.P.vecchiaiaContributiva71, contributiva64: c.P.contributiva64,
      anticipata: c.sogliaAnt, precoci: c.P.precoci, gravosiEta: c.P.gravosiEta, usurantiEta: c.P.usurantiEta };
    if (!(m in par)) throw new Error('Parametro normativo sconosciuto: ' + m);
    return par[m];
  }
  function valutaRiga(riga, c) {
    if (!riga.se.every(function (t) { return condizione(t, c); })) return null;
    for (let i = 0; i < riga.no.length; i++) if (condizione(riga.no[i].c, c)) return NO([riga.no[i].msg]);
    if (!riga.req.length) return riga.esito === 'accessibile' ? OK([riga.msg]) : VER([riga.msg]);
    const lista = riga.req.map(function (r) {
      // "Una tra": basta che sia vera almeno una delle alternative
      if (r.k === 'una_tra') {
        const ok = r.alt.some(function (a) { return condizione(a.c, c); });
        return [ok, r.msg + ' ' + r.alt.map(function (a) { return '(' + a.msg + ')'; }).join(' oppure '), 0];
      }
      const min = sogliaRichiesta(r.min, c);
      // requisito "alla data D": età/contributi stimati a quella data; se manca non maturerà più (nessun mese mancante)
      const st = r.data ? c.alla(new Date(r.data + 'T00:00:00')) : null;
      const x = r.k === 'eta' ? (st ? st.etaM : c.etaM) : r.k === 'contr' ? (st ? st.contrM : c.contrM)
        : (c.etaM + c.contrM) / 12;
      const q = r.k === 'quota';
      const msg = r.msg.replace('{min}', q ? String(min) : fmt(min)).replace('{x}', q ? x.toFixed(1) : fmt(x));
      return [x >= min, msg, st ? 0 : q ? Math.ceil((min - x) * 6) : min - x];
    });
    const e = requisiti(lista, riga.msg);
    if (e.stato === 'accessibile') return riga.esito === 'accessibile' ? e : VER(e.motivi);
    return riga.mancano === 'da_verificare' ? VER(e.motivi) : e;
  }
  const LEGACY = {};
  [REGOLE_DIRETTA_LEGACY, REGOLE_INVALIDITA_LEGACY, REGOLE_SUPERSTITI_LEGACY].forEach(function (arr) {
    arr.forEach(function (r) { LEGACY[r.codice] = r; });
  });
  function regoleDaTabella(ramo, legacy) {
    if (!TABELLA) return legacy;
    return TABELLA.filter(function (r) { return r.ramo === ramo; }).map(function (r) {
      if (r.pred) {
        const l = LEGACY[r.codice];
        if (!l) throw new Error('Predicato mancante nel codice per ' + r.codice);
        return { codice: r.codice, tier: r.tier, valuta: l.valuta };
      }
      return { codice: r.codice, tier: r.tier, valuta: function (c) { return valutaRiga(r, c); } };
    });
  }
  const REGOLE_DIRETTA = regoleDaTabella('diretta', REGOLE_DIRETTA_LEGACY);
  const REGOLE_INVALIDITA = regoleDaTabella('invalidita', REGOLE_INVALIDITA_LEGACY);
  const REGOLE_SUPERSTITI = regoleDaTabella('superstiti', REGOLE_SUPERSTITI_LEGACY);

  // ───────────────────────── Traccia del percorso (id dei nodi del diagramma) ─────────────────────────
  function traccia(c, ramo, candidati) {
    const t = ['INIZIO', 'B'];
    const acc = function (tier) { return candidati.some(function (x) { return x.tier === tier && x.stato === 'accessibile'; }); };
    if (ramo === 'diretta') {
      t.push('D1');
      if (c.p.pensionato || c.p.titolareAOI || c.p.titolareInvalidita) { t.push('D1S'); return t; }
      t.push('D2', c.ante96 ? 'D2M' : 'D2P', 'D3');
      if (c.hasEst) t.push('D3d');
      if (c.gsPiuAltre) t.push('D3b');
      else if (c.hasEsc || c.gest.has('CASSA')) t.push('D3c');
      else t.push('D3a');
      t.push('D4');
      if (c.cert.size) t.push('D5');
      t.push('D6');
      if (acc(1)) { t.push('E1'); return t; }
      t.push('D7');
      if (acc(2)) { t.push('E2'); return t; }
      t.push('D8');
      t.push(candidati.some(function (x) { return x.tier === 3 && x.stato !== 'non_accessibile'; }) ? 'E3' : 'E4');
      return t;
    }
    if (ramo === 'invalidita') {
      const inv = c.p.invalidita || {};
      t.push('I1');
      if (inv.soloRiconoscimento) { t.push('IR'); return t; }
      if (inv.causaServizio) { t.push('I1S'); return t; }
      t.push('I2', inv.grado === 'assoluta' ? 'I2b' : 'I2a', 'I3');
      t.push(candidati.some(function (x) { return x.tier === 1 && x.stato === 'accessibile'; }) ? 'IE1' : 'IE2');
      return t;
    }
    const d = dante(c);
    t.push('S1');
    if (d.marittimoScomparso) { t.push('S1M'); return t; }
    if (d.pensionato) { t.push('S1R'); return t; }
    t.push('S2');
    t.push(candidati.some(function (x) { return x.codice === '0003-0022-0001' && x.stato === 'accessibile'; }) ? 'S2I'
      : candidati.some(function (x) { return x.codice === '0003-0025-0001'; }) ? 'S2U' : 'S2N');
    return t;
  }

  // ───────────────────────── API pubblica ─────────────────────────
  function valuta(profilo, opzioni) {
    const p = profilo || {};
    const domande = [];
    const ramo = p.ramo;
    if (['diretta', 'invalidita', 'superstiti'].indexOf(ramo) < 0) {
      return { errore: 'Specificare il ramo: diretta | invalidita | superstiti', domandeAperte: ['ramo'] };
    }
    if (ramo !== 'superstiti' && !parseData(p.dataNascita || '')) domande.push('dataNascita');
    if (ramo !== 'superstiti' && !p.contributi) domande.push('contributi');
    if (ramo === 'superstiti' && !(p.superstiti && p.superstiti.dante)) domande.push('superstiti.dante');
    if (domande.length) return { ramo: ramo, errore: 'Dati obbligatori mancanti', domandeAperte: domande };

    const c = contesto(p, opzioni);
    const regole = ramo === 'diretta' ? REGOLE_DIRETTA : ramo === 'invalidita' ? REGOLE_INVALIDITA : REGOLE_SUPERSTITI;
    const candidati = [];
    const nonPertinenti = [];
    regole.forEach(function (r, ordine) {
      const cat = byCodice[r.codice];
      if (!cat) { nonPertinenti.push(r.codice + ' (non in catalogo)'); return; }
      if (cat.obsoleta) { nonPertinenti.push(r.codice); return; }
      // Per il momento si escludono le domande presentabili solo dagli operatori INPS (non da cittadino/patronato)
      if (!cat.cittadino && !(opzioni && opzioni.includiSoloOperatori)) { nonPertinenti.push(r.codice); return; }
      const e = r.valuta(c);
      if (!e) { nonPertinenti.push(r.codice); return; }
      const cand = {
        codice: r.codice, descrizione: cat.desc, tier: r.tier, ordine: ordine,
        stato: e.stato, motivi: e.motivi,
        canale: { webdom: cat.webdom, cittadino: cat.cittadino }
      };
      if (e.stato === 'non_accessibile' && e.mancano > 0) {
        cand.maturazione = iso(aggiungiMesi(c.oggi, Math.ceil(e.mancano)));
      }
      if (e.stato === 'accessibile' && !cat.webdom && !cat.cittadino) cand.motivi.push('Tipologia non presentabile da cittadino o patronato.');
      candidati.push(cand);
    });

    // Priorità di dominio: vecchiaia accessibile assorbe le altre vie (tranne le segnalazioni)
    const accessibili = candidati.filter(function (x) { return x.stato === 'accessibile'; });
    const vecchiaia = accessibili.filter(function (x) { return x.tier === 1; });
    if (ramo === 'diretta' && vecchiaia.length) {
      candidati.forEach(function (x) {
        if (x.stato === 'accessibile' && x.tier >= 2) { x.assorbita = true; x.motivi.push('Disponibile, ma con i requisiti della vecchiaia questa è la via principale.'); }
      });
    }
    const principali = accessibili.filter(function (x) { return !x.assorbita && x.tier > 0; })
      .sort(function (a, b) { return (a.tier - b.tier) || (a.ordine - b.ordine); });
    const proposta = principali.length ? principali[0] : null;
    const alternative = principali.slice(1);
    const daVerificare = candidati.filter(function (x) { return x.stato === 'da_verificare' && x.tier > 0; });
    const segnalazioni = candidati.filter(function (x) { return x.tier === 0; });

    // domande aperte utili a sciogliere i "da verificare" (per il wizard)
    const aperte = [];
    if (ramo === 'diretta') {
      if (c.ante96 && c.gest.has('GS') && c.lt18 === null) aperte.push('contributiAl1995');
      if (c.ante96 && c.gsPiuAltre && c.dopo96M === null) aperte.push('contributiDopo1996');
    }
    if (ramo === 'diretta' && c.cert.has('SALVAGUARDIA') && !(p.felpe && p.felpe.salvaguardia)) aperte.push('felpe.salvaguardia');
    if (ramo === 'invalidita' && typeof p.contributiUltimoQuinquennio !== 'number') aperte.push('contributiUltimoQuinquennio');

    return {
      ramo: ramo,
      data: iso(c.oggi),
      riepilogo: ramo === 'superstiti' ? null : {
        eta: fmt(c.etaM), contributi: fmt(c.contrM), regime: c.ante96 ? 'misto (contributi ante 1996)' : 'contributivo puro',
        gestioni: Array.from(c.gest), certificazioniFelpe: Array.from(c.cert)
      },
      proposta: proposta,
      alternative: alternative,
      daVerificare: daVerificare,
      segnalazioni: segnalazioni,
      candidati: candidati,
      nonPertinenti: nonPertinenti,
      domandeAperte: aperte,
      traccia: traccia(c, ramo, candidati)
    };
  }

  return {
    valuta: valuta, parametri: parametri, formattaMesi: fmt, catalogo: CATALOGO,
    // per i test di equivalenza tra tabella e logica scritta nel codice
    _interno: {
      contesto: contesto,
      legacy: { diretta: REGOLE_DIRETTA_LEGACY, invalidita: REGOLE_INVALIDITA_LEGACY, superstiti: REGOLE_SUPERSTITI_LEGACY },
      tabella: { diretta: REGOLE_DIRETTA, invalidita: REGOLE_INVALIDITA, superstiti: REGOLE_SUPERSTITI }
    }
  };
});
