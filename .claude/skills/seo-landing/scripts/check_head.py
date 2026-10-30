#!/usr/bin/env python3
"""Быстрый SEO-аудит HTML-страниц: python3 check_head.py page.html [...]"""
import html, json, re, sys


def get(s, pat):
    m = re.search(pat, s, re.S | re.I)
    return html.unescape(m.group(1)).strip() if m else None


def check(path):
    s = open(path, encoding="utf-8").read()
    head = s[:s.find("</head>")]
    out = []
    def row(ok, text): out.append(("OK " if ok else "!! ") + text)
    t = get(head, r"<title>(.*?)</title>")
    row(t and 30 <= len(t) <= 80, f"title ({len(t) if t else 0}): {t}")
    d = get(head, r'<meta name="description" content="([^"]*)"')
    row(d and 120 <= len(d) <= 170, f"description ({len(d) if d else 0})")
    c = get(head, r'<link rel="canonical" href="([^"]*)"')
    row(bool(c and c.startswith("http")), f"canonical: {c}")
    r = get(head, r'<meta name="robots" content="([^"]*)"')
    out.append(f"   robots: {r or 'не задан (по умолчанию index)'}")
    for p in ["og:title", "og:description", "og:url", "og:image", "og:site_name", "og:locale"]:
        row(f'property="{p}"' in head, p)
    row('name="twitter:card"' in head, "twitter:card")
    if "meta name=\"keywords\"" in head:
        out.append("   meta keywords есть — не нужен")
    types = []
    for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', head, re.S):
        try:
            d = json.loads(m.group(1))
            types += [x.get("@type") for x in (d if isinstance(d, list) else [d])]
        except ValueError:
            row(False, "JSON-LD не парсится")
    row(bool(types), f"JSON-LD: {', '.join(map(str, types)) or 'нет'}")
    body = s[s.find("<body"):]
    h1 = len(re.findall(r"<h1[\s>]", body))
    row(h1 == 1, f"H1 на странице: {h1}")
    noalt = len(re.findall(r"<img(?![^>]*\balt=)[^>]*>", body))
    row(noalt == 0, f"картинок без атрибута alt: {noalt}")
    print(f"===== {path}\n" + "\n".join(out))


for p in sys.argv[1:]:
    check(p)
