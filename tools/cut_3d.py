"""Убирает белый фон у 3D-картинки из Kie и сохраняет webp до 240 px для assets/3d/.

    python3 tools/cut_3d.py исходник.png assets/3d/имя.webp
"""
import sys
import numpy as np
from PIL import Image, ImageDraw
src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGB")
a = np.asarray(im).astype(np.int16)
mn = a.min(axis=2)
mx = a.max(axis=2)
# цвет фона берём с краёв: Kie иногда даёт не белый, а светло-серый фон
border = np.concatenate([mn[0], mn[-1], mn[:, 0], mn[:, -1]])
bgv = int(np.median(border))
# фон: близкие к нему по яркости бесцветные пиксели, связанные с краями картинки
light = Image.fromarray((((np.abs(mn - bgv) <= 9) & (mx - mn < 14)) * 255).astype(np.uint8)).copy()  # copy: из numpy только для чтения
ImageDraw.floodfill(light, (0, 0), 128, thresh=0)
for xy in [(light.width - 1, 0), (0, light.height - 1), (light.width - 1, light.height - 1)]:
    if light.getpixel(xy) == 255:
        ImageDraw.floodfill(light, xy, 128, thresh=0)
bg = np.asarray(light) == 128
alpha = np.full(mn.shape, 255, np.uint8)
# в фоне прозрачность по светлоте: белое исчезает, мягкая тень остаётся полупрозрачной
soft = np.clip(np.abs(bgv - mn) * 255 / 27, 0, 255).astype(np.uint8)
alpha[bg] = soft[bg]
rgba = np.dstack([np.asarray(im), alpha])
res = Image.fromarray(rgba, "RGBA")
bbox = res.getchannel("A").point(lambda v: 255 if v > 60 else 0).getbbox()  # обрезаем по предмету, бледную тень не считаем
res = res.crop(bbox)
res.thumbnail((240, 240), Image.LANCZOS)
res.save(out, "WEBP", quality=82, method=6)
print(out, res.size)
