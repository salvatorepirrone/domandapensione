#!/usr/bin/env python3
"""Legge il foglio "Regole motore" di motore/dati/Requisiti_domande_pensione.xlsx e genera
motore/regole.json e motore/regole.js (usato dal browser). Uso: python3 motore/tools/xlsx_to_regole.py"""
import json, os, re, sys
import openpyxl

QUI = os.path.dirname(os.path.abspath(__file__))
XLSX = os.path.join(QUI, '..', 'dati', 'Requisiti_domande_pensione.xlsx')
OUT = os.path.join(QUI, '..')
RAMI = {'diretta', 'invalidita', 'superstiti'}
STATI = {'accessibile', 'da_verificare'}


def lista(s, sep):
    return [x.strip() for x in str(s or '').split(sep) if x.strip()]


def soglia(s):
    s = s.strip()
    m = re.fullmatch(r'M:(\S+?)/F:(\S+)', s)
    if m:
        return {'M': soglia(m.group(1)), 'F': soglia(m.group(2))}
    m = re.fullmatch(r'(\d+)a', s)
    if m:
        return int(m.group(1)) * 12
    m = re.fullmatch(r'(\d+)m', s)
    if m:
        return int(m.group(1))
    if re.fullmatch(r'\d+(\.\d+)?', s):
        return float(s)
    if re.fullmatch(r'[A-Za-z0-9]+', s):
        return s  # parametro normativo calcolato dal motore
    raise ValueError('soglia non valida: ' + s)


def con_messaggio(s):
    cond, _, msg = s.partition('=>')
    return cond.strip(), msg.strip()


def leggi():
    ws = openpyxl.load_workbook(XLSX, data_only=True)['Regole motore']
    regole, visti = [], set()
    for n, r in enumerate(ws.iter_rows(min_row=2, values_only=True), start=2):
        if not r[0]:
            continue
        cod, _, ramo, tier, se, no, req, mancano, esito, msg, pred, _note = (list(r) + [None] * 12)[:12]
        cod = str(cod).strip()
        try:
            if not re.fullmatch(r'\d{4}-\d{4}-\d{4}', cod): raise ValueError('codice non valido')
            if ramo not in RAMI: raise ValueError('ramo non valido: %s' % ramo)
            tier = int(tier)
            esito = (esito or 'accessibile').strip()
            if esito not in STATI: raise ValueError('esito non valido: %s' % esito)
            regola = {'codice': cod, 'ramo': ramo, 'tier': tier, 'se': lista(se, ';'), 'no': [], 'req': [],
                      'mancano': 'non_accessibile', 'esito': esito, 'msg': (msg or '').strip(), 'pred': (pred or '').strip() or None}
            for x in lista(no, ' | '):
                c, m = con_messaggio(x)
                regola['no'].append({'c': c, 'msg': m})
            for x in lista(req, ' | '):
                c, m = con_messaggio(x)
                mu = re.fullmatch(r'una_tra\((.*)\)', c)
                if mu:
                    alt = []
                    for a in lista(mu.group(1), ' ; '):
                        tok, _, testo = a.partition(' : ')
                        if not testo.strip(): raise ValueError('alternativa senza testo: ' + a)
                        alt.append({'c': tok.strip(), 'msg': testo.strip()})
                    if len(alt) < 2: raise ValueError('una_tra richiede almeno 2 alternative')
                    regola['req'].append({'k': 'una_tra', 'alt': alt, 'msg': m})
                    continue
                mm = re.fullmatch(r'(eta|contr|quota)(?:@(\d{2})/(\d{2})/(\d{4}))?>=(.+)', c)
                if not mm: raise ValueError('requisito non valido: ' + c)
                req = {'k': mm.group(1), 'min': soglia(mm.group(5)), 'msg': m}
                if mm.group(2):
                    if mm.group(1) == 'quota': raise ValueError('quota non supporta @data')
                    req['data'] = '%s-%s-%s' % (mm.group(4), mm.group(3), mm.group(2))
                regola['req'].append(req)
            mc = (mancano or 'non_accessibile').strip()
            if mc not in ('non_accessibile', 'da_verificare'): raise ValueError('"Se i requisiti mancano" non valido: ' + mc)
            regola['mancano'] = mc
            if not regola['pred'] and not regola['req'] and not regola['msg']:
                raise ValueError('serve un messaggio')
        except ValueError as e:
            sys.exit('Riga %d (%s): %s' % (n, cod, e))
        chiave = (cod, ramo, regola['se'].__str__())
        if chiave in visti: sys.exit('Riga %d: regola duplicata %s' % (n, cod))
        visti.add(chiave)
        regole.append(regola)
    return regole


if __name__ == '__main__':
    regole = leggi()
    with open(os.path.join(OUT, 'regole.json'), 'w', encoding='utf-8') as f:
        json.dump(regole, f, ensure_ascii=False, indent=1)
    with open(os.path.join(OUT, 'regole.js'), 'w', encoding='utf-8') as f:
        f.write('/* Generato da motore/tools/xlsx_to_regole.py dal foglio "Regole motore": non modificare a mano. */\n'
                '(function(root,f){if(typeof module==="object"&&module.exports)module.exports=f();else root.REGOLE_MOTORE=f();})'
                '(typeof self!=="undefined"?self:this,function(){return ')
        json.dump(regole, f, ensure_ascii=False, indent=1)
        f.write(';});\n')
    print(len(regole), 'regole scritte')
