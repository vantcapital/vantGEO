#!/usr/bin/env python3
"""Inserta las tipografias (woff2, subconjunto latino) como data URI dentro del HTML.

Uso:  python3 tools/build.py src.html destino.html
El HTML de origen debe contener el marcador  /*@FONTS@*/  dentro de su <style>.
Las tipografias se cachean en tools/.fonts-cache.css para no depender de la red.
"""
import re, sys, base64, os, urllib.request

AQUI = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(AQUI, ".fonts-cache.css")
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                   "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"}
FAMILIAS = ["Fraunces:opsz,wght@9..144,300..500", "Inter:wght@400..600", "IBM+Plex+Mono:wght@400;500"]

def fuentes():
    if os.path.exists(CACHE):
        return open(CACHE).read()
    url = "https://fonts.googleapis.com/css2?" + "&".join("family=" + f for f in FAMILIAS) + "&display=swap"
    css = urllib.request.urlopen(urllib.request.Request(url, headers=UA)).read().decode()
    salida = []
    for subset, bloque in re.findall(r"/\*\s*([a-z\-\[\]0-9]+)\s*\*/\s*(@font-face\s*\{.*?\})", css, re.S):
        if subset != "latin":
            continue
        m = re.search(r"url\((https://[^)]+\.woff2)\)", bloque)
        if not m:
            continue
        datos = urllib.request.urlopen(urllib.request.Request(m.group(1), headers=UA)).read()
        bloque = bloque.replace(m.group(1), "data:font/woff2;base64," + base64.b64encode(datos).decode())
        bloque = re.sub(r"\s*unicode-range:[^;]+;", "", bloque)
        salida.append(re.sub(r"\s+", " ", bloque).strip())
    texto = "\n".join(salida)
    open(CACHE, "w").write(texto)
    return texto

if __name__ == "__main__":
    origen, destino = sys.argv[1], sys.argv[2]
    html = open(origen).read()
    if "/*@FONTS@*/" not in html:
        sys.exit("falta el marcador /*@FONTS@*/ en " + origen)
    open(destino, "w").write(html.replace("/*@FONTS@*/", fuentes()))
    print(destino, os.path.getsize(destino) // 1024, "KB")
