/* Posizioni fittizie per provare il motore e la demo (nomi, codici fiscali e dati inventati:
   i codici fiscali usano un codice catastale inesistente e non corrispondono a persone reali).
   `atteso` = codice della domanda proposta dal motore (null = nessuna proposta con certezza). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ESEMPI_POSIZIONI = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  return [
  {
    "id": "E01",
    "nome": "Maria Rossi",
    "nota": "Vecchiaia, sistema misto",
    "atteso": "0001-0002-0001",
    "anagrafica": {
      "cognome": "Rossi",
      "nome": "Maria",
      "cf": "RSSMRA58C52Z001Q",
      "annoPrimoContributo": 1983
    },
    "profilo": {
      "ramo": "diretta",
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
    }
  },
  {
    "id": "E02",
    "nome": "Giuseppe Bianchi",
    "nota": "Anticipata ordinaria (43 anni di contributi)",
    "atteso": "0001-0001-0001",
    "anagrafica": {
      "cognome": "Bianchi",
      "nome": "Giuseppe",
      "cf": "BNCGPP64A20Z002S",
      "annoPrimoContributo": 1983
    },
    "profilo": {
      "ramo": "diretta",
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
    }
  },
  {
    "id": "E03",
    "nome": "Luca Verdi",
    "nota": "Contributivo puro, 65 anni, 25 di contributi",
    "atteso": "0001-0001-0017",
    "anagrafica": {
      "cognome": "Verdi",
      "nome": "Luca",
      "cf": "VRDLCU61H01Z003G",
      "annoPrimoContributo": 1997
    },
    "profilo": {
      "ramo": "diretta",
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
    }
  },
  {
    "id": "E04",
    "nome": "Anna Neri",
    "nota": "AGO + Gestione separata, vecchiaia con alternativa del computo",
    "atteso": "0001-0002-0001",
    "anagrafica": {
      "cognome": "Neri",
      "nome": "Anna",
      "cf": "NRENNA59B50Z004M",
      "annoPrimoContributo": 1986
    },
    "profilo": {
      "ramo": "diretta",
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
    }
  },
  {
    "id": "E05",
    "nome": "Paolo Gialli",
    "nota": "Lavoratore precoce certificato in FELPE",
    "atteso": "0001-0001-0051",
    "anagrafica": {
      "cognome": "Gialli",
      "nome": "Paolo",
      "cf": "GLLPLA66D05Z005Z",
      "annoPrimoContributo": 1984
    },
    "profilo": {
      "ramo": "diretta",
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
    }
  },
  {
    "id": "E06",
    "nome": "Carla Blu",
    "nota": "Lavori usuranti certificati in FELPE",
    "atteso": "0001-0001-0140",
    "anagrafica": {
      "cognome": "Blu",
      "nome": "Carla",
      "cf": "BLUCRL64P41Z006L",
      "annoPrimoContributo": 1989
    },
    "profilo": {
      "ramo": "diretta",
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
    }
  },
  {
    "id": "E07",
    "nome": "Franco Rosa",
    "nota": "Salvaguardia L. 214/2011 certificata, 66 anni",
    "atteso": "0001-0002-0144",
    "anagrafica": {
      "cognome": "Rosa",
      "nome": "Franco",
      "cf": "RSOFNC60E20Z007E",
      "annoPrimoContributo": 1985
    },
    "profilo": {
      "ramo": "diretta",
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
    }
  },
  {
    "id": "E08",
    "nome": "Rita Celeste",
    "nota": "Già pensionata: supplementare",
    "atteso": "0001-0002-0009",
    "anagrafica": {
      "cognome": "Celeste",
      "nome": "Rita",
      "cf": "CLSRTI50S43Z008S",
      "annoPrimoContributo": 1975
    },
    "profilo": {
      "ramo": "diretta",
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
    }
  },
  {
    "id": "E09",
    "nome": "Elena Viola",
    "nota": "Assegno ordinario di invalidità (parziale, 4 anni nell'ultimo quinquennio)",
    "atteso": "0002-0011-0001",
    "anagrafica": {
      "cognome": "Viola",
      "nome": "Elena",
      "cf": "VLILNE80L54Z009D",
      "annoPrimoContributo": 2012
    },
    "profilo": {
      "ramo": "invalidita",
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
    }
  },
  {
    "id": "E10",
    "nome": "Marco Arancio",
    "nota": "Inabilità con soli 4 anni di contributi: non accessibile",
    "atteso": null,
    "anagrafica": {
      "cognome": "Arancio",
      "nome": "Marco",
      "cf": "RNCMRC75A30Z010Z",
      "annoPrimoContributo": 2022
    },
    "profilo": {
      "ramo": "invalidita",
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
    }
  },
  {
    "id": "E11",
    "nome": "Giulia Grigi",
    "nota": "Vedova di un pensionato: reversibilità",
    "atteso": "0003-0021-0001",
    "anagrafica": {
      "cognome": "Grigi",
      "nome": "Giulia",
      "cf": "GRGGLI75A01Z011L"
    },
    "relazione": "coniuge",
    "deCuius": {
      "cognome": "Grigi",
      "nome": "Enrico",
      "annoNascita": 1952,
      "cf": "GRGNRC52D18Z011J",
      "annoPrimoContributo": 1975
    },
    "profilo": {
      "ramo": "superstiti",
      "superstiti": {
        "dante": {
          "pensionato": true,
          "contributi": {
            "anni": 35
          },
          "gestioni": [
            "AGO"
          ]
        }
      }
    }
  },
  {
    "id": "E12",
    "nome": "Sergio Marrone",
    "nota": "Dante causa non pensionato con 16 anni: indiretta",
    "atteso": "0003-0022-0001",
    "anagrafica": {
      "cognome": "Marrone",
      "nome": "Sergio",
      "cf": "MRRSRG75A01Z012A"
    },
    "relazione": "figlio",
    "deCuius": {
      "cognome": "Marrone",
      "nome": "Alberto",
      "annoNascita": 1978,
      "cf": "MRRLRT78P09Z012G",
      "annoPrimoContributo": 2008
    },
    "profilo": {
      "ramo": "superstiti",
      "superstiti": {
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
      }
    }
  }
];
}));
