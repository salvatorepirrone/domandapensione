/* Posizioni fittizie per provare il motore e la demo.
   Ogni posizione descrive le CARATTERISTICHE del richiedente (età, contributi, gestioni, certificazioni FELPE...),
   non il tipo di domanda: quello si sceglie nel simulatore. Le persone sono indicate solo con le iniziali; i dati e i codici fiscali sono inventati
   (i codici fiscali usano lettere di fantasia e un codice catastale inesistente: non corrispondono a persone reali).
   `deCuius` (solo per alcune posizioni) = dati della persona deceduta, usati per le pensioni ai superstiti.
   `scenario` = richiesta e domanda attesa usate dai test automatici (non compaiono nella demo). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ESEMPI_POSIZIONI = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  const GEST = { AGO: 'FPLD', GS: 'Gestione separata', ESCLUSIVA: 'ex-INPDAP', CASSA: 'Cassa professionale', ESTERO: 'periodi esteri' };
  const CERT = { PRECOCI: 'lavoratore precoce', USURANTI: 'lavori usuranti', GRAVOSI: 'attività gravose', SALVAGUARDIA: 'salvaguardia', AMIANTO: 'amianto', OPZIONE_CONTRIBUTIVO: 'opzione contributivo', VITTIMA_TERRORISMO: 'vittima del terrorismo' };
  const lista = (a, m) => a.map(x => m[x] || x).join(' + ');
  function eta(iso, oggi) {
    const n = new Date(iso), o = oggi || new Date();
    let e = o.getFullYear() - n.getFullYear();
    if (o < new Date(o.getFullYear(), n.getMonth(), n.getDate())) e--;
    return e;
  }
  const lista_ = [
  {
    "id": "E01",
    "anagrafica": {
      "cf": "RXXMXX58C52Z001W",
      "annoPrimoContributo": 1983
    },
    "personale": {
      "sesso": "F",
      "dataNascita": "1958-03-12",
      "contributi": {
        "anni": 30,
        "mesi": 0
      },
      "ante96": true,
      "gestioni": [
        "AGO"
      ]
    },
    "scenario": {
      "ramo": "diretta",
      "atteso": "0001-0002-0001"
    },
    "iniziali": "M. R."
  },
  {
    "id": "E02",
    "anagrafica": {
      "cf": "BXXGXX64A20Z002A",
      "annoPrimoContributo": 1983
    },
    "personale": {
      "sesso": "M",
      "dataNascita": "1964-01-20",
      "contributi": {
        "anni": 43,
        "mesi": 0
      },
      "ante96": true,
      "gestioni": [
        "AGO"
      ]
    },
    "scenario": {
      "ramo": "diretta",
      "atteso": "0001-0001-0001"
    },
    "iniziali": "G. B."
  },
  {
    "id": "E03",
    "anagrafica": {
      "cf": "VXXLXX61H01Z003B",
      "annoPrimoContributo": 1997
    },
    "personale": {
      "sesso": "M",
      "dataNascita": "1961-06-01",
      "contributi": {
        "anni": 25,
        "mesi": 0
      },
      "ante96": false,
      "gestioni": [
        "AGO"
      ]
    },
    "scenario": {
      "ramo": "diretta",
      "atteso": "0001-0001-0017"
    },
    "iniziali": "L. V."
  },
  {
    "id": "E04",
    "anagrafica": {
      "cf": "NXXAXX59B50Z004X",
      "annoPrimoContributo": 1986
    },
    "personale": {
      "sesso": "F",
      "dataNascita": "1959-02-10",
      "contributi": {
        "anni": 22,
        "mesi": 0
      },
      "ante96": true,
      "gestioni": [
        "AGO",
        "GS"
      ],
      "contributiAl1995": 12,
      "contributiDopo1996": 10
    },
    "scenario": {
      "ramo": "diretta",
      "atteso": "0001-0002-0001"
    },
    "iniziali": "A. N."
  },
  {
    "id": "E05",
    "anagrafica": {
      "cf": "GXXPXX66D05Z005Y",
      "annoPrimoContributo": 1984
    },
    "personale": {
      "sesso": "M",
      "dataNascita": "1966-04-05",
      "contributi": {
        "anni": 41,
        "mesi": 2
      },
      "ante96": true,
      "gestioni": [
        "AGO"
      ],
      "felpe": {
        "certificazioni": [
          "PRECOCI"
        ]
      }
    },
    "scenario": {
      "ramo": "diretta",
      "atteso": "0001-0001-0051"
    },
    "iniziali": "P. G."
  },
  {
    "id": "E06",
    "anagrafica": {
      "cf": "BXXCXX64P41Z006J",
      "annoPrimoContributo": 1989
    },
    "personale": {
      "sesso": "F",
      "dataNascita": "1964-09-01",
      "contributi": {
        "anni": 36,
        "mesi": 0
      },
      "ante96": true,
      "gestioni": [
        "AGO"
      ],
      "felpe": {
        "certificazioni": [
          "USURANTI"
        ]
      }
    },
    "scenario": {
      "ramo": "diretta",
      "atteso": "0001-0001-0140"
    },
    "iniziali": "C. B."
  },
  {
    "id": "E07",
    "anagrafica": {
      "cf": "RXXFXX60E20Z007X",
      "annoPrimoContributo": 1985
    },
    "personale": {
      "sesso": "M",
      "dataNascita": "1960-05-20",
      "contributi": {
        "anni": 21,
        "mesi": 0
      },
      "ante96": true,
      "gestioni": [
        "AGO"
      ],
      "felpe": {
        "certificazioni": [
          "SALVAGUARDIA"
        ],
        "salvaguardia": "L214"
      }
    },
    "scenario": {
      "ramo": "diretta",
      "atteso": "0001-0002-0144"
    },
    "iniziali": "F. R."
  },
  {
    "id": "E08",
    "anagrafica": {
      "cf": "CXXRXX50S43Z008R",
      "annoPrimoContributo": 1975
    },
    "personale": {
      "sesso": "F",
      "dataNascita": "1950-11-03",
      "contributi": {
        "anni": 3,
        "mesi": 0
      },
      "ante96": true,
      "gestioni": [
        "AGO"
      ],
      "pensionato": true
    },
    "scenario": {
      "ramo": "diretta",
      "atteso": "0001-0002-0009"
    },
    "iniziali": "R. C."
  },
  {
    "id": "E09",
    "anagrafica": {
      "cf": "VXXEXX80L54Z009M",
      "annoPrimoContributo": 2012
    },
    "personale": {
      "sesso": "F",
      "dataNascita": "1980-07-14",
      "contributi": {
        "anni": 12,
        "mesi": 0
      },
      "ante96": false,
      "gestioni": [
        "AGO"
      ],
      "contributiUltimoQuinquennio": 4,
      "invalidita": {
        "grado": "parziale"
      }
    },
    "scenario": {
      "ramo": "invalidita",
      "atteso": "0002-0011-0001"
    },
    "iniziali": "E. V."
  },
  {
    "id": "E10",
    "anagrafica": {
      "cf": "AXXMXX75A30Z010I",
      "annoPrimoContributo": 2022
    },
    "personale": {
      "sesso": "M",
      "dataNascita": "1975-01-30",
      "contributi": {
        "anni": 4,
        "mesi": 0
      },
      "ante96": false,
      "gestioni": [
        "AGO"
      ],
      "contributiUltimoQuinquennio": 3,
      "invalidita": {
        "grado": "assoluta"
      }
    },
    "scenario": {
      "ramo": "invalidita",
      "atteso": null
    },
    "iniziali": "M. A."
  },
  {
    "id": "E11",
    "anagrafica": {
      "cf": "GXXGXX55C42Z011U",
      "annoPrimoContributo": 1984
    },
    "relazione": "coniuge",
    "personale": {
      "sesso": "F",
      "dataNascita": "1955-03-02",
      "contributi": {
        "anni": 18,
        "mesi": 0
      },
      "ante96": true,
      "gestioni": [
        "AGO"
      ]
    },
    "deCuius": {
      "iniziali": "E. G.",
      "annoNascita": 1952,
      "cf": "GXXEXX52D18Z011C",
      "annoPrimoContributo": 1975,
      "dante": {
        "pensionato": true,
        "contributi": {
          "anni": 35
        },
        "gestioni": [
          "AGO"
        ]
      }
    },
    "scenario": {
      "ramo": "superstiti",
      "atteso": "0003-0021-0001"
    },
    "iniziali": "G. G."
  },
  {
    "id": "E12",
    "anagrafica": {
      "cf": "MXXSXX90R20Z012O",
      "annoPrimoContributo": 2012
    },
    "relazione": "figlio",
    "personale": {
      "sesso": "M",
      "dataNascita": "1990-10-20",
      "contributi": {
        "anni": 14,
        "mesi": 0
      },
      "ante96": false,
      "gestioni": [
        "AGO"
      ]
    },
    "deCuius": {
      "iniziali": "A. M.",
      "annoNascita": 1962,
      "cf": "MXXAXX62P09Z012F",
      "annoPrimoContributo": 1988,
      "dante": {
        "pensionato": false,
        "contributi": {
          "anni": 16
        },
        "contributiUltimoQuinquennio": 4,
        "gestioni": [
          "AGO"
        ]
      }
    },
    "scenario": {
      "ramo": "superstiti",
      "atteso": "0003-0022-0001"
    },
    "iniziali": "S. M."
  }
];
  /* Caratteristiche in una riga, es. «66 anni, 35 anni di contributi in FPLD, primo contributo 1985 (misto)». */
  lista_.descrivi = function (e, oggi) {
    const p = e.personale, c = p.contributi;
    const parti = [eta(p.dataNascita, oggi) + ' anni', c.anni + ' anni' + (c.mesi ? ' e ' + c.mesi + ' mesi' : '') + ' di contributi in ' + lista(p.gestioni, GEST),
      'primo contributo ' + e.anagrafica.annoPrimoContributo + (e.anagrafica.annoPrimoContributo < 1996 ? ' (misto)' : ' (contributivo)')];
    const cert = (p.felpe && p.felpe.certificazioni) || [];
    if (cert.length) parti.push('FELPE: ' + lista(cert, CERT));
    if (p.pensionato) parti.push('già titolare di pensione');
    if (p.invalidita) parti.push('capacità lavorativa ' + (p.invalidita.grado === 'assoluta' ? 'assolutamente ridotta' : 'ridotta a meno di un terzo') + ' (riconosciuta)');
    if (e.deCuius) parti.push(e.relazione + ' di ' + e.deCuius.iniziali + ', deceduto' + (e.deCuius.dante.pensionato ? ' (pensionato)' : ' (lavoratore)'));
    return parti.join(', ');
  };
  /* Profilo nel formato del motore per lo scenario di prova (ramo + dati). */
  lista_.profiloMotore = function (e, ramo) {
    ramo = ramo || e.scenario.ramo;
    if (ramo === 'superstiti') return e.deCuius ? { ramo: ramo, superstiti: { dante: e.deCuius.dante } } : null;
    return Object.assign({ ramo: ramo }, JSON.parse(JSON.stringify(e.personale)));
  };
  return lista_;
}));
