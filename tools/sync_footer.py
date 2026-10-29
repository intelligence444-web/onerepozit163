"""Вставляет общий подвал из partials/footer.html во все страницы ad-engine.ru и Land Engine.

Подвал правим только в partials/footer.html (разметка) и assets/footer.css (стили), потом запускаем:
    python3 tools/sync_footer.py
"""
from pathlib import Path
import hashlib
import re

ROOT = Path(__file__).resolve().parent.parent
BLANK = ' target="_blank" rel="noopener"'
AD = "<b>AD</b> ENGINE"
LAND = "<b>LAND</b> ENGINE"

# страница: (путь до корня сайта, знак в подвале, раздел сайта)
PAGES = {
    "index.html": ("", AD, "ad"),
    "landengine/index.html": ("../", LAND, "le"),
    "landengine/thanks.html": ("../", LAND, "le"),
    "landengine/privacy.html": ("../", LAND, "le"),
    "landengine/consent.html": ("../", LAND, "le"),
}

FOOTER = re.compile(r"<footer class=\"site-footer\">.*?</footer>", re.S)


def render(page, root, brand, section):
    html = (ROOT / "partials/footer.html").read_text(encoding="utf-8").strip()
    name = Path(page).name
    values = {
        "root": root,
        "brand": brand,
        # раздел, в котором человек сейчас, открываем в той же вкладке, другой — в новой
        "target_ad": "" if section == "ad" else BLANK,
        "target_le": "" if section == "le" else BLANK,
        "current_privacy": ' aria-current="page"' if name == "privacy.html" else "",
        "current_consent": ' aria-current="page"' if name == "consent.html" else "",
    }
    for key, value in values.items():
        html = html.replace("{{" + key + "}}", value)
    return html


def main():
    # версия в адресе стилей меняется вместе с содержимым файла, чтобы браузер не показывал старый подвал
    version = hashlib.md5((ROOT / "assets/footer.css").read_bytes()).hexdigest()[:8]
    for page, (root, brand, section) in PAGES.items():
        path = ROOT / page
        text = path.read_text(encoding="utf-8")
        if not FOOTER.search(text):
            raise SystemExit(f"{page}: не нашёл <footer class=\"site-footer\">")
        text = FOOTER.sub(lambda _: render(page, root, brand, section), text, count=1)
        # стили подвала: одна строка после основного файла стилей
        link = f'<link rel="stylesheet" href="{root}assets/footer.css?v={version}">'
        text = re.sub(r'\n\s*<link rel="stylesheet" href="[^"]*footer\.css[^"]*">', "", text)
        text = re.sub(r'(\n(\s*)<link rel="stylesheet" href="[^"]*(?:main|styles)\.css[^"]*">)', lambda m: m.group(1) + "\n" + m.group(2) + link, text, count=1)
        path.write_text(text, encoding="utf-8")
        print("подвал обновлён:", page)


if __name__ == "__main__":
    main()
