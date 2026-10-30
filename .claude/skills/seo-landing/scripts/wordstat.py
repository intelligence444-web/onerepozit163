#!/usr/bin/env python3
"""Сбор топа запросов Wordstat через Yandex Cloud Search API.

Использование:
    python3 wordstat.py masks.txt out.csv [--region 225] [--top 300]

masks.txt — по одной маске в строке (пустые строки и # игнорируются).
Ключ: заголовок Authorization подставляет «Сетевой секрет» среды Claude.
Если секрета нет, ключ берётся из переменной YC_SEARCH_API_KEY.
Если API требует каталог, укажите YC_FOLDER_ID.
"""
import argparse, csv, json, os, sys, time, urllib.request, urllib.error

URL = "https://searchapi.api.cloud.yandex.net/v2/wordstat/topRequests"


def top(phrase, region, n):
    body = {"phrase": phrase, "numPhrases": str(n), "regions": [str(region)]}
    if os.environ.get("YC_FOLDER_ID"):
        body["folderId"] = os.environ["YC_FOLDER_ID"]
    headers = {"Content-Type": "application/json"}
    if os.environ.get("YC_SEARCH_API_KEY"):
        headers["Authorization"] = "Api-Key " + os.environ["YC_SEARCH_API_KEY"]
    req = urllib.request.Request(URL, data=json.dumps(body).encode(), headers=headers)
    try:
        return json.load(urllib.request.urlopen(req, timeout=30))
    except urllib.error.HTTPError as e:
        sys.exit(f"Ошибка API {e.code}: {e.read().decode()[:300]}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("masks")
    ap.add_argument("out")
    ap.add_argument("--region", default="225", help="225 — Россия, 213 — Москва")
    ap.add_argument("--top", type=int, default=300)
    a = ap.parse_args()
    masks = [l.strip() for l in open(a.masks, encoding="utf-8") if l.strip() and not l.startswith("#")]
    rows = []
    for m in masks:
        d = top(m, a.region, a.top)
        print(f"{m}: всего {d.get('totalCount', 0)}", file=sys.stderr)
        rows += [(m, r["phrase"], int(r["count"])) for r in d.get("results", [])]
        time.sleep(0.2)
    with open(a.out, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f, delimiter=";")
        w.writerow(["маска", "фраза", "показов в месяц"])
        w.writerows(rows)
    print(f"Сохранено {len(rows)} фраз в {a.out}", file=sys.stderr)


if __name__ == "__main__":
    main()
