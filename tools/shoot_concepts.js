// Снимает скриншоты концептов: превью первого экрана и страницу целиком (PNG во временную папку)
// node tools/shoot_concepts.js <папка_для_png>
const path = require("path");
const { chromium } = require("playwright");
const slugs = ["realty", "doma", "kitchen", "remont", "azov", "bereg", "grafit", "park"];
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  for (const s of slugs) {
    await p.goto("file://" + path.resolve(__dirname, "../portfolio", `${s}.html`), { waitUntil: "load" });
    await p.evaluate(() => document.fonts.ready);
    // Фото с loading="lazy" должны загрузиться до снимка всей страницы
    await p.evaluate(() => Promise.all([...document.images].map((i) => { i.loading = "eager"; return i.complete ? 0 : new Promise((r) => (i.onload = i.onerror = r)); })));
    await p.screenshot({ path: `${process.argv[2]}/${s}-top.png` });
    await p.screenshot({ path: `${process.argv[2]}/${s}-full.png`, fullPage: true });
  }
  await b.close();
})();
