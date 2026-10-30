"""Убирает тёмный фон у 3D-картинки из Kie (для тёмных блоков) и сохраняет webp до 240 px для assets/3d/.

    python3 tools/cut_3d_dark.py исходник.png assets/3d/имя.webp
"""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGB")
a = np.asarray(im).astype(np.int16)
mx, mn = a.max(axis=2), a.min(axis=2)
# фон: тёмные серые пиксели (без цвета), связанные с краями картинки
dark = Image.fromarray((((mx < 95) & (mx - mn < 18)) * 255).astype(np.uint8)).copy()  # copy: из numpy только для чтения
w, h = dark.size
for xy in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]:
    if dark.getpixel(xy) == 255:
        ImageDraw.floodfill(dark, xy, 128, thresh=0)
alpha = Image.fromarray(np.where(np.asarray(dark) == 128, 0, 255).astype(np.uint8))
alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2))  # мягкий край без тёмной каймы
res = im.convert("RGBA")
res.putalpha(alpha)
res = res.crop(alpha.point(lambda v: 255 if v > 60 else 0).getbbox())
res.thumbnail((240, 240), Image.LANCZOS)
res.save(out, "WEBP", quality=82, method=6)
print(out, res.size)
