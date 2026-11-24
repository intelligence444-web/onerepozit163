"""Перекрашивает сине-фиолетовые пиксели картинки в изумрудный (смена фирменного цвета), прозрачность сохраняется.

    python3 tools/recolor.py картинка.webp [ещё картинки]          # перезаписывает файлы
    python3 tools/recolor.py --dark logo.png og-image.png           # плюс затемнение: логотип и текст на белом
"""
import sys
import numpy as np
from PIL import Image

TARGET = 160 / 360  # изумрудный оттенок (#0e7c5a)


def recolor(path, dark=False):
    im = Image.open(path)
    fmt = im.format
    rgba = np.asarray(im.convert("RGBA")).astype(np.float32) / 255
    hsv = np.asarray(Image.fromarray((rgba[..., :3] * 255).astype(np.uint8)).convert("HSV")).astype(np.float32) / 255
    h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    # синие и фиолетовые тона: 200–300°; плавно гасим сдвиг на краях диапазона
    deg = h * 360
    weight = np.clip((deg - 195) / 15, 0, 1) * np.clip((305 - deg) / 15, 0, 1) * np.clip(s / 0.08, 0, 1)
    shift = TARGET - h
    h2 = (h + shift * weight) % 1
    # зелёный при той же яркости кажется светлее синего — немного притемняем насыщенные пиксели
    # в режиме dark затемняем только насыщенные пиксели (логотип, цена), мягкое свечение фона не трогаем
    v2 = v * (1 - (0.42 * np.clip((s - 0.25) / 0.35, 0, 1) if dark else 0.12 * s) * weight)
    out = np.stack([h2, s, v2], -1)
    rgb = Image.fromarray((out * 255).astype(np.uint8), "HSV").convert("RGB")
    res = Image.merge("RGBA", (*rgb.split(), Image.fromarray((rgba[..., 3] * 255).astype(np.uint8))))
    if im.mode != "RGBA" and "A" not in im.getbands():
        res = res.convert("RGB")
    kw = {"quality": 90, "method": 6} if fmt == "WEBP" else {"optimize": True}
    res.save(path, fmt, **kw)


dark = "--dark" in sys.argv
for p in [a for a in sys.argv[1:] if a != "--dark"]:
    recolor(p, dark)
    print("перекрашено:", p)
