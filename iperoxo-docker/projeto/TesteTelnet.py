#!/usr/bin/env python3
# coding=UTF-8

import time
import json
from   telnetlib import Telnet

endereco = "localhost"
porta    = 8884

servico  = "com.joseflavio.iperoxo.docker.Exemplo"

objeto   = {
    "texto"  : "Ipê-roxo por Telnet!",
    "data"   : int(round(time.time() * 1000)),
    "arquivo": [
        {
            "nome"    : "ipe-roxo.html",
            "endereco": "https://joseflavio.com/iperoxo/index.html"
        }
    ],
    "classe" : {
        "classe": { "valor": "interna" },
        "valor" : "externa"
    }
}

with Telnet(endereco, porta) as tn:
    tn.write(b"SOLICITAR\n")
    tn.write(bytes(servico + "\n", "utf-8"))
    tn.write(b"executar\n")
    tn.write(bytes(json.dumps(objeto, ensure_ascii=False), "utf-8"))
    tn.write(b"|~\r\n")
    resposta = json.loads(tn.read_all().decode("utf-8"))
    print(json.dumps(resposta, indent=4, ensure_ascii=False))
