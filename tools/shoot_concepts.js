// Снимает скриншоты концептов: превью первого экрана и страницу целиком (PNG во временную папку)
// node tools/shoot_concepts.js <папка_для_png>  — сервер должен отдавать сайт на localhost:8766
const { chromium } = require("playwright");
const slugs = ["realty", "doma", "kitchen", "remont", "banya", "dental", "land"];
(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  for (const s of slugs) {
    await p.goto(`http://localhost:8766/onerepozit163/portfolio/${s}.html`, { waitUntil: "networkidle" });
    await p.screenshot({ path: `${process.argv[2]}/${s}-top.png` });
    await p.screenshot({ path: `${process.argv[2]}/${s}-full.png`, fullPage: true });
  }
  await b.close();
})();
