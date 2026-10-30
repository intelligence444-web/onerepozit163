#!/usr/bin/env python3
"""Пересобирает FAQPage в JSON-LD из видимого блока .faq страницы.

Использование: python3 faq_jsonld.py page.html [page2.html ...]

Ищет первый <div class="faq"> внутри <main>, берёт пары
<summary>вопрос</summary><p>ответ</p> и записывает их в объект
"@type": "FAQPage" первого <script type="application/ld+json"> в <head>.
Если FAQPage там нет — добавляет его.
"""
import html, json, re, sys


def clean(t):
    t = html.unescape(re.sub(r"<[^>]+>", "", t)).replace("\xa0", " ")
    return re.sub(r"\s+", " ", t).strip()


def rebuild(path):
    s = open(path, encoding="utf-8").read()
    main = s[s.index("<main"):] if "<main" in s else s
    block = main[main.index('class="faq"'):]
    block = block[:block.index("</section>")] if "</section>" in block else block
    qa = re.findall(r"<summary>(.*?)</summary>\s*<p>(.*?)</p>", block, re.S)
    faq = {"@context": "https://schema.org", "@type": "FAQPage",
           "mainEntity": [{"@type": "Question", "name": clean(q),
                           "acceptedAnswer": {"@type": "Answer", "text": clean(a)}} for q, a in qa]}
    m = re.search(r'(<script type="application/ld\+json">\s*)(.*?)(\s*</script>)', s, re.S)
    if not m:
        sys.exit(f"{path}: нет <script type=\"application/ld+json\"> — сначала добавь ProfessionalService")
    data = json.loads(m.group(2))
    items = data if isinstance(data, list) else [data]
    items = [x for x in items if x.get("@type") != "FAQPage"] + [faq]
    s = s[:m.start(2)] + json.dumps(items, ensure_ascii=False, indent=2) + s[m.end(2):]
    open(path, "w", encoding="utf-8").write(s)
    print(f"{path}: FAQPage — {len(qa)} вопросов")


for p in sys.argv[1:]:
    rebuild(p)
