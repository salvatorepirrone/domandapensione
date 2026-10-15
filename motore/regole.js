/* Generato da motore/tools/xlsx_to_regole.py dal foglio "Regole motore": non modificare a mano. */
(function(root,f){if(typeof module==="object"&&module.exports)module.exports=f();else root.REGOLE_MOTORE=f();})(typeof self!=="undefined"?self:this,function(){return [
 {
  "codice": "0001-0002-0001",
  "ramo": "diretta",
  "tier": 1,
  "se": [],
  "no": [
   {
    "c": "post95",
    "msg": "Primo contributo dopo il 1995: si applica la vecchiaia con sistema contributivo."
   }
  ],
  "req": [
   {
    "k": "eta",
    "min": "vecchiaia",
    "msg": "Servono {min} di età (hai {x})."
   },
   {
    "k": "contr",
    "min": 240,
    "msg": "Servono 20 anni di contributi (hai {x})."
   }
  ],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "Età e contributi sufficienti per la vecchiaia ordinaria (sistema misto).",
  "pred": null
 },
 {
  "codice": "0001-0002-0017",
  "ramo": "diretta",
  "tier": 1,
  "se": [],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "",
  "pred": "vecchiaiaContributiva"
 },
 {
  "codice": "0001-0002-0030",
  "ramo": "diretta",
  "tier": 1,
  "se": [],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "",
  "pred": "opzioneContributivo"
 },
 {
  "codice": "0001-0002-0045",
  "ramo": "diretta",
  "tier": 1,
  "se": [],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "",
  "pred": "computoGS"
 },
 {
  "codice": "0001-0002-0043",
  "ramo": "diretta",
  "tier": 1,
  "se": [
   "ante96",
   "noVecchiaiaOrdinaria",
   "deroga.qualsiasi"
  ],
  "no": [],
  "req": [
   {
    "k": "eta",
    "min": "vecchiaia",
    "msg": "Servono {min} di età (hai {x})."
   },
   {
    "k": "contr",
    "min": 180,
    "msg": "Servono 15 anni di contributi (hai {x})."
   },
   {
    "k": "una_tra",
    "alt": [
     {
      "c": "deroga.contr92",
      "msg": "15 anni di contributi maturati entro il 31/12/1992"
     },
     {
      "c": "deroga.volontari92",
      "msg": "autorizzazione ai versamenti volontari entro il 31/12/1992"
     },
     {
      "c": "deroga.anz92",
      "msg": "25 anni di anzianità assicurativa al 1992 con almeno 1 contributo prima del 1993"
     }
    ],
    "msg": "Serve una tra le condizioni di deroga (deroghe Amato, art. 2 c. 3 D.Lgs. 503/1992):"
   }
  ],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "Vecchiaia in deroga: età di vecchiaia, 15 anni di contributi e una delle condizioni Amato.",
  "pred": null
 },
 {
  "codice": "0001-0002-0008",
  "ramo": "diretta",
  "tier": 1,
  "se": [
   "invalidita80"
  ],
  "no": [],
  "req": [
   {
    "k": "eta",
    "min": {
     "M": 732,
     "F": 672
    },
    "msg": "Servono {min} di età (invalidi ≥ 80%, dipendenti)."
   },
   {
    "k": "contr",
    "min": 240,
    "msg": "Servono 20 anni di contributi."
   }
  ],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "Invalidità ≥ 80%: pensione anticipata di vecchiaia.",
  "pred": null
 },
 {
  "codice": "0001-0002-0172",
  "ramo": "diretta",
  "tier": 1,
  "se": [
   "cert.GRAVOSI"
  ],
  "no": [],
  "req": [
   {
    "k": "eta",
    "min": "gravosiEta",
    "msg": "Servono {min} di età (requisito non adeguato)."
   },
   {
    "k": "contr",
    "min": 360,
    "msg": "Servono 30 anni di contributi."
   }
  ],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "Attività gravose certificate in FELPE (con opzione contributivo la variante è 0001-0002-0173).",
  "pred": null
 },
 {
  "codice": "0001-0002-0173",
  "ramo": "diretta",
  "tier": 1,
  "se": [
   "cert.GRAVOSI",
   "cert.OPZIONE_CONTRIBUTIVO"
  ],
  "no": [],
  "req": [
   {
    "k": "eta",
    "min": "gravosiEta",
    "msg": "Servono {min} di età."
   },
   {
    "k": "contr",
    "min": 360,
    "msg": "Servono 30 anni di contributi."
   }
  ],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "Attività gravose con opzione per il calcolo contributivo.",
  "pred": null
 },
 {
  "codice": "0001-0002-0077",
  "ramo": "diretta",
  "tier": 1,
  "se": [
   "gest.ESTERO"
  ],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "da_verificare",
  "msg": "Periodi all'estero: la prestazione a carico di Stato estero segue la legislazione estera; INPS opera come organismo di collegamento.",
  "pred": null
 },
 {
  "codice": "0001-0001-0001",
  "ramo": "diretta",
  "tier": 2,
  "se": [],
  "no": [],
  "req": [
   {
    "k": "contr",
    "min": "anticipata",
    "msg": "Servono {min} di contributi (hai {x})."
   }
  ],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "Contributi sufficienti per la pensione anticipata ordinaria.",
  "pred": null
 },
 {
  "codice": "0001-0001-0017",
  "ramo": "diretta",
  "tier": 2,
  "se": [],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "",
  "pred": "anticipataContributiva"
 },
 {
  "codice": "0001-0001-0045",
  "ramo": "diretta",
  "tier": 2,
  "se": [],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "",
  "pred": "anticipataComputoGS"
 },
 {
  "codice": "0001-0001-0030",
  "ramo": "diretta",
  "tier": 2,
  "se": [],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "",
  "pred": "anticipataOpzioneContributivo"
 },
 {
  "codice": "0001-0001-0051",
  "ramo": "diretta",
  "tier": 3,
  "se": [
   "cert.PRECOCI"
  ],
  "no": [],
  "req": [
   {
    "k": "contr",
    "min": "precoci",
    "msg": "Servono {min} di contributi (precoci)."
   }
  ],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "Lavoratore precoce certificato in FELPE.",
  "pred": null
 },
 {
  "codice": "0001-0001-0140",
  "ramo": "diretta",
  "tier": 3,
  "se": [
   "cert.USURANTI"
  ],
  "no": [],
  "req": [
   {
    "k": "eta",
    "min": "usurantiEta",
    "msg": "Servono {min} di età (dipendenti; autonomi +1 anno)."
   },
   {
    "k": "contr",
    "min": 420,
    "msg": "Servono 35 anni di contributi."
   },
   {
    "k": "quota",
    "min": 97.6,
    "msg": "Quota 97,6 non raggiunta (età + contributi = {x})."
   }
  ],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "Lavori usuranti certificati in FELPE.",
  "pred": null
 },
 {
  "codice": "0001-0001-0161",
  "ramo": "diretta",
  "tier": 0,
  "se": [
   "cert.AMIANTO"
  ],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "da_verificare",
  "msg": "Esposizione all'amianto certificata: la maggiorazione contributiva può anticipare il diritto. Il calcolo va fatto dalla procedura sui periodi qualificati.",
  "pred": null
 },
 {
  "codice": "0001-0002-0161",
  "ramo": "diretta",
  "tier": 0,
  "se": [
   "cert.AMIANTO"
  ],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "da_verificare",
  "msg": "Esposizione all'amianto certificata: la maggiorazione può migliorare importo e diritto alla vecchiaia.",
  "pred": null
 },
 {
  "codice": "0001-0001-0158",
  "ramo": "diretta",
  "tier": 3,
  "se": [
   "cert.VITTIMA_TERRORISMO",
   "vittima80"
  ],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "da_verificare",
  "msg": "Vittima del terrorismo/stragi con invalidità ≥ 80%: benefici L. 206/2004, riconoscimento della Prefettura/UTG.",
  "pred": null
 },
 {
  "codice": "0001-0001-0159",
  "ramo": "diretta",
  "tier": 3,
  "se": [
   "cert.VITTIMA_TERRORISMO",
   "noVittima80"
  ],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "da_verificare",
  "msg": "Familiare di vittima o invalidità < 80%: benefici L. 206/2004, riconoscimento della Prefettura/UTG.",
  "pred": null
 },
 {
  "codice": "0001-0002-0159",
  "ramo": "diretta",
  "tier": 3,
  "se": [
   "cert.VITTIMA_TERRORISMO"
  ],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "da_verificare",
  "msg": "Benefici L. 206/2004 sulla vecchiaia: verificare la maggiorazione di anzianità.",
  "pred": null
 },
 {
  "codice": "0001-0001-0201",
  "ramo": "diretta",
  "tier": 3,
  "se": [],
  "no": [],
  "req": [
   {
    "k": "eta",
    "min": 744,
    "msg": "Servono 62 anni di età al 31/12/2025 (avevi {x}).",
    "data": "2025-12-31"
   },
   {
    "k": "contr",
    "min": 492,
    "msg": "Servono 41 anni di contributi al 31/12/2025 (avevi {x}).",
    "data": "2025-12-31"
   }
  ],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "Flessibile (Quota 103): 62 anni di età e 41 di contributi maturati entro il 31/12/2025 e requisiti raggiunti entro il 31/12/2025. Stima sui dati attuali: verificare in UNEX.",
  "pred": null
 },
 {
  "codice": "0001-0001-0189",
  "ramo": "diretta",
  "tier": 3,
  "se": [],
  "no": [],
  "req": [
   {
    "k": "eta",
    "min": 744,
    "msg": "Servono 62 anni di età al 31/12/2023 (avevi {x}).",
    "data": "2023-12-31"
   },
   {
    "k": "contr",
    "min": 492,
    "msg": "Servono 41 anni di contributi al 31/12/2023 (avevi {x}).",
    "data": "2023-12-31"
   }
  ],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "Flessibile (Quota 103): 62 anni di età e 41 di contributi maturati entro il 31/12/2023 e requisiti raggiunti entro il 31/12/2025. Stima sui dati attuali: verificare in UNEX.",
  "pred": null
 },
 {
  "codice": "0001-0001-0195",
  "ramo": "diretta",
  "tier": 3,
  "se": [
   "ante96",
   "cert.OPZIONE_CONTRIBUTIVO"
  ],
  "no": [],
  "req": [
   {
    "k": "eta",
    "min": 744,
    "msg": "Servono 62 anni di età al 31/12/2025 (avevi {x}).",
    "data": "2025-12-31"
   },
   {
    "k": "contr",
    "min": 492,
    "msg": "Servono 41 anni di contributi al 31/12/2025 (avevi {x}).",
    "data": "2025-12-31"
   }
  ],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "Flessibile (Quota 103): 62 anni di età e 41 di contributi maturati entro il 31/12/2025 e requisiti raggiunti entro il 31/12/2025. Stima sui dati attuali: verificare in UNEX. Calcolo con opzione contributivo (FELPE).",
  "pred": null
 },
 {
  "codice": "0001-0001-0202",
  "ramo": "diretta",
  "tier": 3,
  "se": [
   "ante96",
   "cert.OPZIONE_CONTRIBUTIVO"
  ],
  "no": [],
  "req": [
   {
    "k": "eta",
    "min": 744,
    "msg": "Servono 62 anni di età al 31/12/2025 (avevi {x}).",
    "data": "2025-12-31"
   },
   {
    "k": "contr",
    "min": 492,
    "msg": "Servono 41 anni di contributi al 31/12/2025 (avevi {x}).",
    "data": "2025-12-31"
   }
  ],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "Flessibile (Quota 103): 62 anni di età e 41 di contributi maturati entro il 31/12/2025 e requisiti raggiunti entro il 31/12/2025. Stima sui dati attuali: verificare in UNEX. Calcolo con opzione contributivo (FELPE).",
  "pred": null
 },
 {
  "codice": "0001-0001-0190",
  "ramo": "diretta",
  "tier": 3,
  "se": [],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "",
  "pred": "opzioneDonna"
 },
 {
  "codice": "0001-0001-0162",
  "ramo": "diretta",
  "tier": 3,
  "se": [
   "editoria"
  ],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "da_verificare",
  "msg": "Prepensionamento editoria dichiarato: verificare crisi aziendale accertata e CIGS per accordi di procedura.",
  "pred": null
 },
 {
  "codice": "0001-0001-0144",
  "ramo": "diretta",
  "tier": 3,
  "se": [
   "cert.SALVAGUARDIA",
   "salv.L214"
  ],
  "no": [],
  "req": [
   {
    "k": "contr",
    "min": 480,
    "msg": "Salvaguardia L214 certificata: servono 40 anni di contributi oppure quota 96/97 ({x} presenti). Verificare le quote."
   }
  ],
  "mancano": "da_verificare",
  "esito": "accessibile",
  "msg": "Salvaguardia L214 certificata: 40 anni di contributi (requisiti ante Fornero).",
  "pred": null
 },
 {
  "codice": "0001-0001-0145",
  "ramo": "diretta",
  "tier": 3,
  "se": [
   "cert.SALVAGUARDIA",
   "salv.L135"
  ],
  "no": [],
  "req": [
   {
    "k": "contr",
    "min": 480,
    "msg": "Salvaguardia L135 certificata: servono 40 anni di contributi oppure quota 96/97 ({x} presenti). Verificare le quote."
   }
  ],
  "mancano": "da_verificare",
  "esito": "accessibile",
  "msg": "Salvaguardia L135 certificata: 40 anni di contributi (requisiti ante Fornero).",
  "pred": null
 },
 {
  "codice": "0001-0001-0146",
  "ramo": "diretta",
  "tier": 3,
  "se": [
   "cert.SALVAGUARDIA",
   "salv.L228"
  ],
  "no": [],
  "req": [
   {
    "k": "contr",
    "min": 480,
    "msg": "Salvaguardia L228 certificata: servono 40 anni di contributi oppure quota 96/97 ({x} presenti). Verificare le quote."
   }
  ],
  "mancano": "da_verificare",
  "esito": "accessibile",
  "msg": "Salvaguardia L228 certificata: 40 anni di contributi (requisiti ante Fornero).",
  "pred": null
 },
 {
  "codice": "0001-0001-0151",
  "ramo": "diretta",
  "tier": 3,
  "se": [
   "cert.SALVAGUARDIA",
   "salv.DL102"
  ],
  "no": [],
  "req": [
   {
    "k": "contr",
    "min": 480,
    "msg": "Salvaguardia DL102 certificata: servono 40 anni di contributi oppure quota 96/97 ({x} presenti). Verificare le quote."
   }
  ],
  "mancano": "da_verificare",
  "esito": "accessibile",
  "msg": "Salvaguardia DL102 certificata: 40 anni di contributi (requisiti ante Fornero).",
  "pred": null
 },
 {
  "codice": "0001-0001-0155",
  "ramo": "diretta",
  "tier": 3,
  "se": [
   "cert.SALVAGUARDIA",
   "salv.L147_2013"
  ],
  "no": [],
  "req": [
   {
    "k": "contr",
    "min": 480,
    "msg": "Salvaguardia L147_2013 certificata: servono 40 anni di contributi oppure quota 96/97 ({x} presenti). Verificare le quote."
   }
  ],
  "mancano": "da_verificare",
  "esito": "accessibile",
  "msg": "Salvaguardia L147_2013 certificata: 40 anni di contributi (requisiti ante Fornero).",
  "pred": null
 },
 {
  "codice": "0001-0001-0157",
  "ramo": "diretta",
  "tier": 3,
  "se": [
   "cert.SALVAGUARDIA",
   "salv.L147_2014"
  ],
  "no": [],
  "req": [
   {
    "k": "contr",
    "min": 480,
    "msg": "Salvaguardia L147_2014 certificata: servono 40 anni di contributi oppure quota 96/97 ({x} presenti). Verificare le quote."
   }
  ],
  "mancano": "da_verificare",
  "esito": "accessibile",
  "msg": "Salvaguardia L147_2014 certificata: 40 anni di contributi (requisiti ante Fornero).",
  "pred": null
 },
 {
  "codice": "0001-0001-0160",
  "ramo": "diretta",
  "tier": 3,
  "se": [
   "cert.SALVAGUARDIA",
   "salv.L208"
  ],
  "no": [],
  "req": [
   {
    "k": "contr",
    "min": 480,
    "msg": "Salvaguardia L208 certificata: servono 40 anni di contributi oppure quota 96/97 ({x} presenti). Verificare le quote."
   }
  ],
  "mancano": "da_verificare",
  "esito": "accessibile",
  "msg": "Salvaguardia L208 certificata: 40 anni di contributi (requisiti ante Fornero).",
  "pred": null
 },
 {
  "codice": "0001-0001-0165",
  "ramo": "diretta",
  "tier": 3,
  "se": [
   "cert.SALVAGUARDIA",
   "salv.L232"
  ],
  "no": [],
  "req": [
   {
    "k": "contr",
    "min": 480,
    "msg": "Salvaguardia L232 certificata: servono 40 anni di contributi oppure quota 96/97 ({x} presenti). Verificare le quote."
   }
  ],
  "mancano": "da_verificare",
  "esito": "accessibile",
  "msg": "Salvaguardia L232 certificata: 40 anni di contributi (requisiti ante Fornero).",
  "pred": null
 },
 {
  "codice": "0001-0001-0181",
  "ramo": "diretta",
  "tier": 3,
  "se": [
   "cert.SALVAGUARDIA",
   "salv.L178"
  ],
  "no": [],
  "req": [
   {
    "k": "contr",
    "min": 480,
    "msg": "Salvaguardia L178 certificata: servono 40 anni di contributi oppure quota 96/97 ({x} presenti). Verificare le quote."
   }
  ],
  "mancano": "da_verificare",
  "esito": "accessibile",
  "msg": "Salvaguardia L178 certificata: 40 anni di contributi (requisiti ante Fornero).",
  "pred": null
 },
 {
  "codice": "0001-0002-0144",
  "ramo": "diretta",
  "tier": 3,
  "se": [
   "cert.SALVAGUARDIA",
   "salv.L214"
  ],
  "no": [],
  "req": [
   {
    "k": "eta",
    "min": {
     "M": 780,
     "F": 720
    },
    "msg": "Servono {min} di età (requisiti ante Fornero)."
   },
   {
    "k": "contr",
    "min": 240,
    "msg": "Servono 20 anni di contributi (15 con deroghe)."
   }
  ],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "Salvaguardia L214 certificata in FELPE.",
  "pred": null
 },
 {
  "codice": "0001-0002-0145",
  "ramo": "diretta",
  "tier": 3,
  "se": [
   "cert.SALVAGUARDIA",
   "salv.L135"
  ],
  "no": [],
  "req": [
   {
    "k": "eta",
    "min": {
     "M": 780,
     "F": 720
    },
    "msg": "Servono {min} di età (requisiti ante Fornero)."
   },
   {
    "k": "contr",
    "min": 240,
    "msg": "Servono 20 anni di contributi (15 con deroghe)."
   }
  ],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "Salvaguardia L135 certificata in FELPE.",
  "pred": null
 },
 {
  "codice": "0001-0002-0146",
  "ramo": "diretta",
  "tier": 3,
  "se": [
   "cert.SALVAGUARDIA",
   "salv.L228"
  ],
  "no": [],
  "req": [
   {
    "k": "eta",
    "min": {
     "M": 780,
     "F": 720
    },
    "msg": "Servono {min} di età (requisiti ante Fornero)."
   },
   {
    "k": "contr",
    "min": 240,
    "msg": "Servono 20 anni di contributi (15 con deroghe)."
   }
  ],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "Salvaguardia L228 certificata in FELPE.",
  "pred": null
 },
 {
  "codice": "0001-0002-0151",
  "ramo": "diretta",
  "tier": 3,
  "se": [
   "cert.SALVAGUARDIA",
   "salv.DL102"
  ],
  "no": [],
  "req": [
   {
    "k": "eta",
    "min": {
     "M": 780,
     "F": 720
    },
    "msg": "Servono {min} di età (requisiti ante Fornero)."
   },
   {
    "k": "contr",
    "min": 240,
    "msg": "Servono 20 anni di contributi (15 con deroghe)."
   }
  ],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "Salvaguardia DL102 certificata in FELPE.",
  "pred": null
 },
 {
  "codice": "0001-0002-0155",
  "ramo": "diretta",
  "tier": 3,
  "se": [
   "cert.SALVAGUARDIA",
   "salv.L147_2013"
  ],
  "no": [],
  "req": [
   {
    "k": "eta",
    "min": {
     "M": 780,
     "F": 720
    },
    "msg": "Servono {min} di età (requisiti ante Fornero)."
   },
   {
    "k": "contr",
    "min": 240,
    "msg": "Servono 20 anni di contributi (15 con deroghe)."
   }
  ],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "Salvaguardia L147_2013 certificata in FELPE.",
  "pred": null
 },
 {
  "codice": "0001-0002-0157",
  "ramo": "diretta",
  "tier": 3,
  "se": [
   "cert.SALVAGUARDIA",
   "salv.L147_2014"
  ],
  "no": [],
  "req": [
   {
    "k": "eta",
    "min": {
     "M": 780,
     "F": 720
    },
    "msg": "Servono {min} di età (requisiti ante Fornero)."
   },
   {
    "k": "contr",
    "min": 240,
    "msg": "Servono 20 anni di contributi (15 con deroghe)."
   }
  ],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "Salvaguardia L147_2014 certificata in FELPE.",
  "pred": null
 },
 {
  "codice": "0001-0002-0165",
  "ramo": "diretta",
  "tier": 3,
  "se": [
   "cert.SALVAGUARDIA",
   "salv.L232"
  ],
  "no": [],
  "req": [
   {
    "k": "eta",
    "min": {
     "M": 780,
     "F": 720
    },
    "msg": "Servono {min} di età (requisiti ante Fornero)."
   },
   {
    "k": "contr",
    "min": 240,
    "msg": "Servono 20 anni di contributi (15 con deroghe)."
   }
  ],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "Salvaguardia L232 certificata in FELPE.",
  "pred": null
 },
 {
  "codice": "0001-0002-0181",
  "ramo": "diretta",
  "tier": 3,
  "se": [
   "cert.SALVAGUARDIA",
   "salv.L178"
  ],
  "no": [],
  "req": [
   {
    "k": "eta",
    "min": {
     "M": 780,
     "F": 720
    },
    "msg": "Servono {min} di età (requisiti ante Fornero)."
   },
   {
    "k": "contr",
    "min": 240,
    "msg": "Servono 20 anni di contributi (15 con deroghe)."
   }
  ],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "Salvaguardia L178 certificata in FELPE.",
  "pred": null
 },
 {
  "codice": "0001-0002-0009",
  "ramo": "diretta",
  "tier": 4,
  "se": [
   "pensionato",
   "noGest.GS"
  ],
  "no": [],
  "req": [
   {
    "k": "eta",
    "min": "vecchiaia",
    "msg": "Servono {min} di età (hai {x})."
   }
  ],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "Titolare di pensione diretta con contributi ulteriori: supplementare (domanda dopo 5 anni dalla decorrenza).",
  "pred": null
 },
 {
  "codice": "0001-0002-0192",
  "ramo": "diretta",
  "tier": 4,
  "se": [
   "pensionato",
   "gest.GS"
  ],
  "no": [],
  "req": [
   {
    "k": "eta",
    "min": "vecchiaia",
    "msg": "Servono {min} di età (hai {x})."
   }
  ],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "Supplementare con computo in Gestione separata (DM 282/1996).",
  "pred": null
 },
 {
  "codice": "0001-0002-0002",
  "ramo": "diretta",
  "tier": 4,
  "se": [
   "titolareAOI"
  ],
  "no": [],
  "req": [
   {
    "k": "eta",
    "min": "vecchiaia",
    "msg": "Servono {min} di età (hai {x})."
   },
   {
    "k": "contr",
    "min": 240,
    "msg": "Servono 20 anni di contributi (hai {x})."
   }
  ],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "Trasformazione dell'assegno ordinario di invalidità in vecchiaia.",
  "pred": null
 },
 {
  "codice": "0001-0002-0003",
  "ramo": "diretta",
  "tier": 4,
  "se": [
   "titolareInvalidita"
  ],
  "no": [],
  "req": [
   {
    "k": "eta",
    "min": "vecchiaia",
    "msg": "Servono {min} di età (hai {x})."
   },
   {
    "k": "contr",
    "min": 240,
    "msg": "Servono 20 anni di contributi (hai {x})."
   }
  ],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "Trasformazione della pensione di invalidità in vecchiaia.",
  "pred": null
 },
 {
  "codice": "0002-0011-0001",
  "ramo": "invalidita",
  "tier": 1,
  "se": [
   "grado.parziale"
  ],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "",
  "pred": "contributiInvalidita"
 },
 {
  "codice": "0002-0011-0045",
  "ramo": "invalidita",
  "tier": 1,
  "se": [
   "grado.parziale",
   "gsPiuAltre"
  ],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "",
  "pred": "contributiInvalidita"
 },
 {
  "codice": "0002-0012-0001",
  "ramo": "invalidita",
  "tier": 1,
  "se": [
   "grado.assoluta"
  ],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "",
  "pred": "contributiInvalidita"
 },
 {
  "codice": "0002-0012-0045",
  "ramo": "invalidita",
  "tier": 1,
  "se": [
   "grado.assoluta",
   "gsPiuAltre"
  ],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "",
  "pred": "contributiInvalidita"
 },
 {
  "codice": "0002-0012-0052",
  "ramo": "invalidita",
  "tier": 1,
  "se": [
   "grado.assoluta",
   "post95"
  ],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "",
  "pred": "inabilitaContributivoPuro"
 },
 {
  "codice": "0002-0011-0005",
  "ramo": "invalidita",
  "tier": 3,
  "se": [
   "causaServizio",
   "grado.parziale"
  ],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "da_verificare",
  "msg": "Infermità dipendente da causa di servizio (gestione pubblica): assegno privilegiato, senza minimo contributivo.",
  "pred": null
 },
 {
  "codice": "0002-0012-0046",
  "ramo": "invalidita",
  "tier": 3,
  "se": [
   "causaServizio",
   "grado.assoluta",
   "gest.ESCLUSIVA"
  ],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "da_verificare",
  "msg": "Inabilità per causa di servizio nella gestione pubblica (ex INPDAP).",
  "pred": null
 },
 {
  "codice": "0002-0012-0005",
  "ramo": "invalidita",
  "tier": 3,
  "se": [
   "causaServizio",
   "grado.assoluta",
   "noGest.ESCLUSIVA"
  ],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "da_verificare",
  "msg": "Pensione privilegiata di inabilità per causa di servizio.",
  "pred": null
 },
 {
  "codice": "0002-0012-0047",
  "ramo": "invalidita",
  "tier": 3,
  "se": [
   "noCausaServizio",
   "gest.ESCLUSIVA",
   "grado.assoluta"
  ],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "da_verificare",
  "msg": "Gestione pubblica: inabilità a proficuo lavoro/mansioni per infermità non dipendente da causa di servizio. Verificare il minimo di servizio.",
  "pred": null
 },
 {
  "codice": "0002-0012-0010",
  "ramo": "invalidita",
  "tier": 3,
  "se": [
   "marittimo",
   "grado.assoluta"
  ],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "da_verificare",
  "msg": "Marittimo: inabilità alla navigazione, verificare la contribuzione marittima.",
  "pred": null
 },
 {
  "codice": "0002-0012-0168",
  "ramo": "invalidita",
  "tier": 3,
  "se": [
   "cert.AMIANTO",
   "grado.assoluta"
  ],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "da_verificare",
  "msg": "Esposizione all'amianto certificata: possibile pensione di inabilità ex art. 1 c. 250 L. 232/2016 (da verificare).",
  "pred": null
 },
 {
  "codice": "0002-0013-0009",
  "ramo": "invalidita",
  "tier": 4,
  "se": [
   "pensionato"
  ],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "da_verificare",
  "msg": "Già titolare di pensione: supplementare di invalidità sulla contribuzione ulteriore.",
  "pred": null
 },
 {
  "codice": "0002-0013-0077",
  "ramo": "invalidita",
  "tier": 4,
  "se": [
   "gest.ESTERO"
  ],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "da_verificare",
  "msg": "Periodi all'estero: prestazione a carico di Stato estero.",
  "pred": null
 },
 {
  "codice": "0002-0014-0001",
  "ramo": "invalidita",
  "tier": 4,
  "se": [
   "soloRiconoscimento"
  ],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "Domanda di solo riconoscimento dello stato di invalidità/inabilità, senza liquidazione di pensione.",
  "pred": null
 },
 {
  "codice": "0003-0021-0001",
  "ramo": "superstiti",
  "tier": 1,
  "se": [
   "dante.pensionato"
  ],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "Il dante causa era titolare di pensione: reversibilità.",
  "pred": null
 },
 {
  "codice": "0003-0021-0009",
  "ramo": "superstiti",
  "tier": 4,
  "se": [
   "dante.pensionato",
   "dante.supplementare"
  ],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "Il dante causa era titolare di pensione supplementare.",
  "pred": null
 },
 {
  "codice": "0003-0022-0001",
  "ramo": "superstiti",
  "tier": 1,
  "se": [
   "dante.noPensionato",
   "noMarittimoScomparso"
  ],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "",
  "pred": "indiretta"
 },
 {
  "codice": "0003-0022-0045",
  "ramo": "superstiti",
  "tier": 1,
  "se": [
   "dante.noPensionato",
   "dante.gsPiuAltre"
  ],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "",
  "pred": "indiretta"
 },
 {
  "codice": "0003-0022-0005",
  "ramo": "superstiti",
  "tier": 3,
  "se": [
   "dante.noPensionato",
   "dante.causaServizio"
  ],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "da_verificare",
  "msg": "Decesso del dante causa per causa di servizio: pensione privilegiata indiretta.",
  "pred": null
 },
 {
  "codice": "0003-0022-0046",
  "ramo": "superstiti",
  "tier": 3,
  "se": [
   "dante.noPensionato",
   "dante.causaServizio",
   "dante.esclusiva"
  ],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "da_verificare",
  "msg": "Dante causa della gestione pubblica deceduto per causa di servizio.",
  "pred": null
 },
 {
  "codice": "0003-0022-0052",
  "ramo": "superstiti",
  "tier": 3,
  "se": [
   "dante.noPensionato",
   "dante.inabile"
  ],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "da_verificare",
  "msg": "Dante causa inabile al decesso (art. 2 c. 12 L. 335/1995): verificare i requisiti.",
  "pred": null
 },
 {
  "codice": "0003-0023-0001",
  "ramo": "superstiti",
  "tier": 3,
  "se": [
   "dante.marittimoScomparso"
  ],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "Scomparsa in mare del marittimo, equiparata al decesso.",
  "pred": null
 },
 {
  "codice": "0003-0024-0077",
  "ramo": "superstiti",
  "tier": 4,
  "se": [
   "dante.estero"
  ],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "da_verificare",
  "msg": "Pensione ai superstiti a carico di Stato estero.",
  "pred": null
 },
 {
  "codice": "0003-0025-0001",
  "ramo": "superstiti",
  "tier": 4,
  "se": [
   "dante.noPensionato",
   "noMarittimoScomparso"
  ],
  "no": [],
  "req": [],
  "mancano": "non_accessibile",
  "esito": "accessibile",
  "msg": "",
  "pred": "unaTantum"
 }
];});
