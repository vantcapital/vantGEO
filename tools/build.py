#!/usr/bin/env python3
"""Inserta las tipografias (woff2, subconjunto latino) como data URI dentro del HTML.

Uso:  python3 tools/build.py src.html destino.html [--produccion]
Con --produccion se omite la barra de ajustes flotante.
El HTML de origen debe contener el marcador  /*@FONTS@*/  dentro de su <style>.
Opcionalmente, /*@CORE@*/ y /*@JS@*/ insertan src/core.css y src/core.js, y
/*@FILE:ruta@*/ o <!--@FILE:ruta@--> insertan cualquier otro parcial.
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

RAIZ = os.path.dirname(AQUI)

def parcial(ruta):
    return open(os.path.join(RAIZ, ruta)).read()


def incrusta_imagenes(html):
    """Mete las imagenes de assets/ como data URI.

    Solo para las compilaciones de desarrollo y de revision: el sitio real
    sirve los archivos sueltos, que se cachean y se eligen por srcset. Esto
    existe para que una copia unica del HTML pueda verse fuera del proyecto,
    sin la carpeta assets/ al lado.
    """
    import mimetypes
    for ruta in sorted(set(re.findall(r"assets/[\w.-]+\.(?:jpg|jpeg|png|webp|mp4)", html)), key=len, reverse=True):
        entera = os.path.join(RAIZ, ruta)
        if not os.path.exists(entera):
            continue
        tipo = mimetypes.guess_type(entera)[0] or "application/octet-stream"
        with open(entera, "rb") as f:
            datos = base64.b64encode(f.read()).decode()
        html = html.replace(ruta, "data:%s;base64,%s" % (tipo, datos))
    return html

if __name__ == "__main__":
    origen, destino = sys.argv[1], sys.argv[2]
    produccion = "--produccion" in sys.argv
    html = open(origen).read()
    # La barra de ajustes solo viaja en las compilaciones de desarrollo.
    html = html.replace("<!--@AJUSTES@-->", "" if produccion else parcial("src/ajustes.html"))
    if "/*@FONTS@*/" not in html:
        sys.exit("falta el marcador /*@FONTS@*/ en " + origen)
    html = html.replace("/*@FONTS@*/", fuentes())
    html = html.replace("/*@CORE@*/", parcial("src/core.css")).replace("/*@JS@*/", parcial("src/core.js"))
    # Inclusiones genericas:  /*@FILE:ruta@*/  o  <!--@FILE:ruta@-->
    html = re.sub(r"(?:/\*|<!--)@FILE:([^@]+)@(?:\*/|-->)", lambda m: parcial(m.group(1).strip()), html)
    # Despues de las inclusiones: las rutas de imagen viven en los parciales.
    if not produccion:
        html = incrusta_imagenes(html)
    open(destino, "w").write(html)
    print(destino, os.path.getsize(destino) // 1024, "KB")
