"""Собирает два сайта ЖК (portfolio/grafit.html и portfolio/park.html): планировки и карта рисуются SVG."""
from pathlib import Path

OUT = Path("/home/user/onerepozit163/portfolio")


def plan(kind, wall="#222", fill="#fff", zone="#eee"):
    """Схематичная планировка: внешние стены, перегородки, санузел, окна."""
    w = f'stroke="{wall}" stroke-width="5" fill="none" stroke-linecap="square"'
    t = f'stroke="{wall}" stroke-width="2.5" fill="none"'
    win = f'stroke="{fill}" stroke-width="5"'
    body = f'<rect x="12" y="12" width="236" height="156" fill="{fill}"/>'
    rooms = {
        "studio": f'<rect x="12" y="12" width="64" height="58" fill="{zone}"/><path d="M76 12v58H12" {t}/><path d="M76 120h70" stroke="{wall}" stroke-width="1.5" stroke-dasharray="4 4"/><line x1="150" y1="168" x2="210" y2="168" {win}/><line x1="248" y1="40" x2="248" y2="100" {win}/>',
        "k1": f'<rect x="12" y="12" width="64" height="58" fill="{zone}"/><path d="M76 12v58H12M140 12v110M140 140v28" {t}/><line x1="170" y1="168" x2="225" y2="168" {win}/><line x1="40" y1="168" x2="100" y2="168" {win}/>',
        "k2": f'<rect x="96" y="12" width="56" height="50" fill="{zone}"/><path d="M96 12v50h56V12M96 62v36M12 98h60M90 98h62v70M152 98h20M190 98h58" {t}/><line x1="30" y1="168" x2="80" y2="168" {win}/><line x1="180" y1="168" x2="230" y2="168" {win}/><line x1="12" y1="30" x2="12" y2="80" {win}/>',
        "k3": f'<rect x="100" y="12" width="60" height="46" fill="{zone}"/><path d="M100 12v46h60V12M12 92h70M100 58v34h60V58M160 92h88M86 92v76M172 92v76" {t}/><line x1="25" y1="168" x2="70" y2="168" {win}/><line x1="105" y1="168" x2="150" y2="168" {win}/><line x1="190" y1="168" x2="235" y2="168" {win}/><line x1="248" y1="25" x2="248" y2="70" {win}/>',
    }[kind]
    return f'<svg viewBox="0 0 260 180" aria-hidden="true">{body}{rooms}<rect x="12" y="12" width="236" height="156" {w}/></svg>'


def city_map(bg, road, water, park, acc, ink, label_bg, pois):
    """Схема района: река, парк, дороги, точка ЖК и объекты рядом."""
    out = f'<svg viewBox="0 0 640 460" aria-hidden="true"><rect width="640" height="460" fill="{bg}"/>'
    out += f'<path d="M0 360 C140 330 220 400 360 380 S560 330 640 350 V460 H0Z" fill="{water}"/>'
    out += f'<rect x="420" y="60" width="170" height="120" rx="22" fill="{park}"/>'
    for d in ("M0 120 H640", "M0 250 H640", "M140 0 V340", "M330 0 V360", "M520 0 V330", "M0 40 L260 300"):
        out += f'<path d="{d}" stroke="{road}" stroke-width="14" fill="none"/>'
    for x, y, name in pois:
        out += f'<circle cx="{x}" cy="{y}" r="9" fill="#fff" stroke="{ink}" stroke-width="3"/><rect x="{x + 14}" y="{y - 14}" width="{len(name) * 8 + 18}" height="28" rx="8" fill="{label_bg}"/><text x="{x + 23}" y="{y + 5}" font-size="14" font-family="Onest, sans-serif" fill="{ink}">{name}</text>'
    out += f'<circle cx="250" cy="190" r="38" fill="{acc}" opacity=".22"/><circle cx="250" cy="190" r="20" fill="{acc}"/><text x="250" y="196" text-anchor="middle" font-size="15" font-weight="700" font-family="Onest, sans-serif" fill="#fff">ЖК</text>'
    return out + "</svg>"


# ---------------- ЖК «Графит»: тёмный графит, бизнес-класс ----------------
G_PLANS = [("studio", "Студия", "26,4 м²", "8 этаж", "6 840 000 ₽"), ("k1", "1-комнатная", "41,8 м²", "12 этаж", "9 120 000 ₽"), ("k2", "2-комнатная", "63,2 м²", "17 этаж", "12 960 000 ₽"), ("k3", "3-комнатная", "86,5 м²", "21 этаж", "16 750 000 ₽")]
grafit_plans = "".join(f'<article class="pl"><div class="pic">{plan(k, "#e8e6e1", "#1c1d20", "#2a2c31")}</div><div class="pb"><h3>{n}</h3><p>{a} · {fl}</p><div class="pr"><b>{p}</b><a href="#f">Забронировать</a></div></div></article>' for k, n, a, fl, p in G_PLANS)
grafit_map = city_map("#1f2024", "#2c2e33", "#22303a", "#253226", "#ff6a2b", "#e8e6e1", "#2c2e33", [(120, 90, "Набережная · 7 мин"), (400, 210, "Парк Горького · 5 мин"), (470, 300, "Школа № 5 · 3 мин"), (60, 220, "Ростов-Арена · 12 мин")])

grafit = f'''<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=1440">
<meta name="robots" content="noindex, nofollow">
<title>ЖК «Графит» — концепт Land Engine</title>
<link rel="stylesheet" href="base.css">
<style>
:root {{ --bg: #141518; --card: #1c1d20; --ink: #e8e6e1; --muted: #8f8e8a; --acc: #ff6a2b; --line: #2c2e33; }}
body {{ background: var(--bg); color: var(--ink); }}
.up {{ text-transform: uppercase; letter-spacing: .02em; }}
.btn {{ display: inline-flex; align-items: center; justify-content: center; height: 58px; padding: 0 26px; background: var(--acc); color: #141518; font-weight: 700; white-space: nowrap; }}
.btn.line {{ background: transparent; color: var(--ink); box-shadow: inset 0 0 0 1px var(--ink); }}
.lbl {{ color: var(--acc); font-size: 13px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; }}
header {{ position: absolute; inset: 0 0 auto; z-index: 2; }}
.hd {{ display: flex; align-items: center; gap: 40px; height: 92px; }}
.logo {{ font-weight: 700; font-size: 24px; letter-spacing: .3em; }}
.nav {{ display: flex; gap: 30px; margin-left: auto; font-size: 15px; color: rgba(232,230,225,.8); }}
.ph {{ font-weight: 700; }}
.hero {{ position: relative; height: 900px; background: url("img/realty-hero.webp") center 35% / cover; }}
.hero::before {{ content: ""; position: absolute; inset: 0; background: linear-gradient(0deg, var(--bg) 2%, rgba(20,21,24,.15) 45%, rgba(20,21,24,.55) 100%); }}
.hero .w {{ position: relative; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; padding-bottom: 70px; }}
.hero h1 {{ font-size: 190px; line-height: .82; font-weight: 700; letter-spacing: -0.05em; }}
.hero .row {{ display: flex; justify-content: space-between; align-items: end; margin-top: 36px; padding-top: 30px; border-top: 1px solid rgba(232,230,225,.25); }}
.hero .sub {{ max-width: 340px; font-size: 18px; }}
.facts {{ display: flex; gap: 36px; }}
.facts b {{ display: block; font-size: 26px; white-space: nowrap; }}
.facts span {{ color: var(--muted); font-size: 14px; }}
.acts {{ display: flex; gap: 12px; }}
.sec {{ padding: 120px 0; }}
.sec h2 {{ margin-top: 18px; font-size: 56px; line-height: 1; letter-spacing: -0.035em; font-weight: 700; }}
.head {{ display: flex; justify-content: space-between; align-items: end; margin-bottom: 52px; }}
.head p {{ max-width: 400px; color: var(--muted); }}
.about {{ display: grid; grid-template-columns: 1fr 1fr; gap: 80px; }}
.about .txt {{ font-size: 24px; line-height: 1.45; }}
.about .txt span {{ color: var(--muted); }}
.grid4 {{ display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--line); border-left: 1px solid var(--line); }}
.grid4 div {{ padding: 30px; border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); }}
.grid4 b {{ display: block; font-size: 52px; letter-spacing: -0.04em; line-height: 1; }}
.grid4 span {{ display: block; margin-top: 10px; color: var(--muted); }}
.loc {{ display: grid; grid-template-columns: 640px 1fr; gap: 64px; align-items: center; }}
.loc svg {{ display: block; width: 100%; }}
.loc li {{ display: flex; justify-content: space-between; padding: 18px 0; border-bottom: 1px solid var(--line); font-size: 18px; }}
.loc li b {{ color: var(--acc); }}
.tabs {{ display: flex; gap: 8px; margin-bottom: 30px; }}
.tabs span {{ padding: 12px 22px; border: 1px solid var(--line); font-weight: 600; font-size: 15px; }}
.tabs .on {{ background: var(--ink); color: var(--bg); border-color: var(--ink); }}
.plans {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }}
.pl {{ background: var(--card); }}
.pl .pic {{ padding: 26px 22px; border-bottom: 1px solid var(--line); }}
.pl svg {{ display: block; width: 100%; }}
.pl .pb {{ padding: 22px; }}
.pl h3 {{ font-size: 20px; }}
.pl p {{ margin-top: 4px; color: var(--muted); font-size: 15px; }}
.pl .pr {{ display: flex; justify-content: space-between; align-items: center; margin-top: 18px; }}
.pl .pr b {{ font-size: 19px; }}
.pl .pr a {{ color: var(--acc); font-weight: 600; font-size: 14px; }}
.finish {{ display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 16px; }}
.finish figure {{ position: relative; height: 440px; overflow: hidden; }}
.finish img {{ width: 100%; height: 100%; object-fit: cover; }}
.finish figcaption {{ position: absolute; left: 0; right: 0; bottom: 0; padding: 60px 24px 22px; background: linear-gradient(0deg, rgba(20,21,24,.9), transparent); font-weight: 600; }}
.finish figcaption span {{ display: block; color: var(--muted); font-weight: 400; font-size: 14px; }}
.buy {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }}
.buy div {{ padding: 32px 26px; background: var(--card); }}
.buy b {{ display: block; font-size: 44px; letter-spacing: -0.03em; color: var(--acc); }}
.buy h3 {{ margin-top: 12px; font-size: 19px; }}
.buy p {{ margin-top: 8px; color: var(--muted); font-size: 15px; }}
.build {{ display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }}
.bar {{ height: 8px; margin-top: 30px; background: var(--line); }}
.bar i {{ display: block; width: 64%; height: 100%; background: var(--acc); }}
.pct {{ display: flex; justify-content: space-between; margin-top: 12px; color: var(--muted); }}
.pct b {{ color: var(--ink); font-size: 22px; }}
.months li {{ display: grid; grid-template-columns: 160px 1fr; padding: 18px 0; border-bottom: 1px solid var(--line); }}
.months span {{ color: var(--muted); }}
.final {{ display: grid; grid-template-columns: 1fr 480px; gap: 80px; padding: 72px; background: var(--card); }}
.final h2 {{ margin-top: 18px; font-size: 52px; line-height: 1; letter-spacing: -0.035em; font-weight: 700; }}
.office {{ margin-top: 30px; color: var(--muted); line-height: 1.8; }}
.office b {{ color: var(--ink); }}
.form {{ display: grid; gap: 12px; }}
.inp {{ height: 58px; display: flex; align-items: center; padding: 0 20px; border: 1px solid var(--line); color: var(--muted); }}
.form small {{ color: var(--muted); font-size: 12px; }}
footer {{ padding: 40px 0; color: var(--muted); font-size: 14px; }}
footer .w {{ display: flex; justify-content: space-between; }}
</style></head>
<body>
<header><div class="w hd"><span class="logo">ГРАФИТ</span><nav class="nav"><span>О проекте</span><span>Расположение</span><span>Квартиры</span><span>Ипотека</span><span>Ход строительства</span></nav><span class="ph">+7 900 000-00-09</span></div></header>
<section class="hero"><div class="w">
  <span class="lbl">Жилой комплекс бизнес-класса · Ростов-на-Дону</span>
  <h1 class="up">Графит</h1>
  <div class="row"><p class="sub">Три башни у&nbsp;парка Горького: тихий двор без машин, панорамные окна и&nbsp;подземный паркинг.</p><div class="facts"><div><b>IV кв. 2027</b><span>сдача</span></div><div><b>24 этажа</b><span>3 корпуса</span></div><div><b>от 6,8 млн ₽</b><span>студии</span></div></div><div class="acts"><a class="btn" href="#plans">Выбрать квартиру</a><a class="btn line" href="#f">Презентация</a></div></div>
</div></section>

<section class="sec"><div class="w about">
  <div><span class="lbl">О проекте</span><h2>Город за&nbsp;окном, тишина во&nbsp;дворе</h2><p class="txt" style="margin-top:28px">Фасады из&nbsp;графитового клинкера, лобби с&nbsp;консьержем и&nbsp;двор на&nbsp;уровне второго этажа. <span>Машины остаются в&nbsp;подземном паркинге, а&nbsp;дети гуляют без&nbsp;присмотра.</span></p></div>
  <div class="grid4"><div><b>612</b><span>квартир</span></div><div><b>3,1 м</b><span>высота потолков</span></div><div><b>480</b><span>мест в паркинге</span></div><div><b>1,2 га</b><span>двор без машин</span></div></div>
</div></section>

<section class="sec" style="padding-top:0"><div class="w loc">
  {grafit_map}
  <div><span class="lbl">Расположение</span><h2>Центр в&nbsp;10 минутах пешком</h2><ul style="margin-top:32px"><li>Парк Горького<b>5 мин</b></li><li>Набережная Дона<b>7 мин</b></li><li>Школа и детский сад<b>3 мин</b></li><li>ТЦ «Горизонт»<b>9 мин</b></li></ul></div>
</div></section>

<section class="sec" id="plans" style="padding-top:0"><div class="w">
  <div class="head"><div><span class="lbl">Квартиры</span><h2>Планировки и&nbsp;цены</h2></div><p>В продаже 214 квартир. Цены обновлены 28 октября.</p></div>
  <div class="tabs"><span class="on">Все</span><span>Студии</span><span>1-комнатные</span><span>2-комнатные</span><span>3-комнатные</span><span>С террасой</span></div>
  <div class="plans">{grafit_plans}</div>
</div></section>

<section class="sec" style="padding-top:0"><div class="w">
  <div class="head"><div><span class="lbl">Отделка</span><h2>Въезжайте сразу</h2></div><p>Квартиры сдаются с чистовой отделкой или в white box — на выбор.</p></div>
  <div class="finish"><figure><img src="img/remont-hero.webp" alt="Гостиная с отделкой"><figcaption>Чистовая отделка<span>Инженерная доска, итальянская плитка</span></figcaption></figure><figure><img src="img/kitchen-2.webp" alt="Кухня"><figcaption>Кухня-гостиная<span>Окна от пола до потолка</span></figcaption></figure><figure><img src="img/remont-bath.webp" alt="Санузел"><figcaption>Санузел<span>Инсталляция и тропический душ</span></figcaption></figure></div>
</div></section>

<section class="sec" style="padding-top:0"><div class="w">
  <div class="head"><div><span class="lbl">Способы покупки</span><h2>Как купить</h2></div></div>
  <div class="buy"><div><b>6%</b><h3>Семейная ипотека</h3><p>Для семей с ребёнком до 6 лет</p></div><div><b>0%</b><h3>Рассрочка</h3><p>До окончания строительства</p></div><div><b>−7%</b><h3>Полная оплата</h3><p>Скидка при 100% оплате</p></div><div><b>Trade-in</b><h3>Обмен квартиры</h3><p>Зачтём вашу квартиру в цену</p></div></div>
</div></section>

<section class="sec" style="padding-top:0"><div class="w build">
  <div><span class="lbl">Ход строительства</span><h2>Строим по&nbsp;графику</h2><div class="bar"><i></i></div><div class="pct"><span>Корпус 1 · монолит 18 из 24 этажей</span><b>64%</b></div></div>
  <ul class="months"><li><b>Октябрь 2026</b><span>Монолит корпуса 1 — 18 этаж</span></li><li><b>Сентябрь 2026</b><span>Начат фасад корпуса 1</span></li><li><b>Август 2026</b><span>Корпус 2 — 12 этаж</span></li><li><b>Июль 2026</b><span>Завершён подземный паркинг</span></li></ul>
</div></section>

<section class="sec" id="f" style="padding-top:0"><div class="w final">
  <div><span class="lbl">Офис продаж</span><h2>Запишитесь на&nbsp;показ</h2><p class="office"><b>ул. Пушкинская, 120</b><br>Ежедневно 9:00–21:00<br>Покажем макет, шоурум и строительную площадку</p></div>
  <div class="form"><span class="inp">Ваше имя</span><span class="inp">+7 (___) ___-__-__</span><a class="btn" href="#f">Записаться на показ</a><small>Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</small></div>
</div></section>
<footer><div class="w"><span>ЖК «Графит» · Ростов-на-Дону</span><span>Концепт сайта от Land Engine</span></div></footer>
</body></html>
'''

# ---------------- ЖК «Северный парк»: светлый, семейный ----------------
P_PLANS = [("k1", "1-комнатная", "38,6 м²", "от 5 290 000 ₽", "от 19 800 ₽/мес"), ("k2", "2-комнатная", "56,4 м²", "от 7 140 000 ₽", "от 26 700 ₽/мес"), ("k3", "3-комнатная", "78,1 м²", "от 9 380 000 ₽", "от 35 100 ₽/мес")]
park_plans = "".join(f'<article class="pl"><div class="pic">{plan(k, "#2f4a3a", "#fff", "#e3eee6")}</div><h3>{n}</h3><p class="ar">{a}</p><div class="pr"><b>{p}</b><span>{m} в ипотеку 6%</span></div><a class="btn sm" href="#f">Узнать о наличии</a></article>' for k, n, a, p, m in P_PLANS)
park_map = city_map("#eef3ec", "#ffffff", "#cfe3ee", "#cfe6c8", "#2f8f5b", "#2f4a3a", "#ffffff", [(110, 80, "Детский сад · 2 мин"), (420, 215, "Северный парк · 1 мин"), (460, 300, "Школа · 5 мин"), (40, 210, "ТЦ «Мега» · 8 мин")])

park = f'''<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=1440">
<meta name="robots" content="noindex, nofollow">
<title>ЖК «Северный парк» — концепт Land Engine</title>
<link rel="stylesheet" href="base.css">
<style>
:root {{ --bg: #f7f5ef; --ink: #1f2e25; --muted: #66746b; --acc: #2f8f5b; --soft: #e3eee6; --sun: #f4b63f; --line: #e3e0d6; }}
body {{ background: var(--bg); color: var(--ink); font-family: "Manrope", sans-serif; }}
.btn {{ display: inline-flex; align-items: center; justify-content: center; height: 58px; padding: 0 30px; border-radius: 999px; background: var(--acc); color: #fff; font-weight: 700; }}
.btn.light {{ background: #fff; color: var(--ink); }}
.btn.sm {{ height: 48px; width: 100%; margin-top: 18px; }}
.chip {{ display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 999px; background: var(--soft); color: var(--acc); font-weight: 700; font-size: 14px; }}
.hd {{ display: flex; align-items: center; gap: 40px; height: 88px; }}
.logo {{ display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 20px; }}
.logo i {{ width: 36px; height: 36px; border-radius: 50% 50% 50% 4px; background: var(--acc); }}
.nav {{ display: flex; gap: 28px; margin-left: auto; color: var(--muted); font-size: 15px; font-weight: 600; }}
.ph {{ font-weight: 800; }}
.hero {{ display: grid; grid-template-columns: 560px 1fr; gap: 40px; align-items: stretch; height: 760px; }}
.hero .t {{ display: flex; flex-direction: column; justify-content: center; }}
.hero h1 {{ margin-top: 22px; font-weight: 800; font-size: 76px; line-height: .98; letter-spacing: -0.045em; }}
.hero h1 span {{ color: var(--acc); }}
.hero .lead {{ margin-top: 22px; color: var(--muted); font-size: 19px; }}
.hero .acts {{ display: flex; gap: 12px; margin-top: 34px; }}
.promo {{ display: flex; align-items: center; gap: 16px; margin-top: 34px; padding: 16px 20px; border-radius: 20px; background: #fff; }}
.promo b {{ display: grid; place-items: center; width: 56px; height: 56px; border-radius: 16px; background: var(--sun); font-size: 20px; }}
.promo span {{ font-size: 15px; color: var(--muted); }}
.promo strong {{ display: block; color: var(--ink); font-size: 17px; }}
.hero .pic {{ position: relative; border-radius: 40px; overflow: hidden; }}
.hero .pic img {{ width: 100%; height: 100%; object-fit: cover; }}
.hero .badge {{ position: absolute; right: 24px; bottom: 24px; padding: 18px 22px; border-radius: 22px; background: #fff; }}
.hero .badge b {{ display: block; font-size: 26px; letter-spacing: -0.03em; }}
.hero .badge span {{ color: var(--muted); font-size: 14px; }}
.sec {{ padding: 110px 0; }}
.sec h2 {{ margin-top: 16px; font-weight: 800; font-size: 50px; line-height: 1.04; letter-spacing: -0.035em; }}
.head {{ display: flex; justify-content: space-between; align-items: end; margin-bottom: 44px; }}
.head p {{ max-width: 400px; color: var(--muted); }}
.life {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }}
.life div {{ padding: 30px 26px; border-radius: 28px; background: #fff; }}
.life i {{ display: grid; place-items: center; width: 54px; height: 54px; border-radius: 16px; background: var(--soft); font-style: normal; font-size: 24px; }}
.life h3 {{ margin-top: 20px; font-weight: 800; font-size: 20px; }}
.life p {{ margin-top: 6px; color: var(--muted); font-size: 15px; }}
.yard {{ position: relative; height: 560px; border-radius: 40px; overflow: hidden; }}
.yard img {{ width: 100%; height: 100%; object-fit: cover; }}
.yard .card {{ position: absolute; left: 40px; top: 40px; width: 420px; padding: 36px; border-radius: 28px; background: #fff; }}
.yard .card h2 {{ font-size: 38px; }}
.yard .card ul {{ display: grid; gap: 10px; margin-top: 20px; font-weight: 600; }}
.yard .card li::before {{ content: "✓"; margin-right: 10px; color: var(--acc); }}
.loc {{ display: grid; grid-template-columns: 1fr 640px; gap: 64px; align-items: center; }}
.loc svg {{ display: block; width: 100%; border-radius: 32px; }}
.times {{ display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 30px; }}
.times div {{ padding: 20px; border-radius: 20px; background: #fff; }}
.times b {{ display: block; font-size: 30px; color: var(--acc); }}
.times span {{ color: var(--muted); font-size: 15px; }}
.picker {{ display: flex; gap: 40px; align-items: center; margin-bottom: 30px; padding: 26px 32px; border-radius: 28px; background: #fff; }}
.picker .f {{ flex: 1; }}
.picker .l {{ display: flex; justify-content: space-between; color: var(--muted); font-size: 15px; }}
.picker .l b {{ color: var(--ink); }}
.rng {{ position: relative; height: 6px; margin-top: 16px; border-radius: 3px; background: var(--soft); }}
.rng i {{ position: absolute; left: 0; width: 46%; height: 100%; border-radius: 3px; background: var(--acc); }}
.rng i::after {{ content: ""; position: absolute; right: -11px; top: -8px; width: 22px; height: 22px; border-radius: 50%; background: #fff; border: 3px solid var(--acc); }}
.seg {{ display: flex; gap: 6px; padding: 5px; border-radius: 999px; background: var(--bg); }}
.seg span {{ padding: 10px 18px; border-radius: 999px; font-weight: 700; font-size: 14px; color: var(--muted); }}
.seg .on {{ background: var(--acc); color: #fff; }}
.plans {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }}
.pl {{ padding: 26px; border-radius: 28px; background: #fff; }}
.pl .pic {{ padding: 16px; border-radius: 20px; background: var(--bg); }}
.pl svg {{ display: block; width: 100%; }}
.pl h3 {{ margin-top: 20px; font-weight: 800; font-size: 22px; }}
.pl .ar {{ color: var(--muted); }}
.pl .pr {{ margin-top: 14px; }}
.pl .pr b {{ display: block; font-size: 24px; letter-spacing: -0.02em; }}
.pl .pr span {{ color: var(--acc); font-weight: 700; font-size: 14px; }}
.steps {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }}
.steps div {{ padding: 26px; border-radius: 24px; background: #fff; }}
.steps b {{ font-size: 15px; color: var(--muted); }}
.steps h3 {{ margin-top: 8px; font-weight: 800; font-size: 19px; }}
.steps .st {{ display: inline-block; margin-top: 14px; padding: 5px 12px; border-radius: 999px; background: var(--soft); color: var(--acc); font-weight: 700; font-size: 13px; }}
.steps .now {{ background: var(--sun); color: var(--ink); }}
.final {{ display: grid; grid-template-columns: 1fr 440px; gap: 80px; align-items: center; padding: 70px 80px; border-radius: 40px; background: var(--acc); color: #fff; }}
.final h2 {{ color: #fff; }}
.final p {{ margin-top: 16px; color: rgba(255,255,255,.8); }}
.form {{ display: grid; gap: 12px; }}
.inp {{ height: 58px; display: flex; align-items: center; padding: 0 22px; border-radius: 999px; background: rgba(255,255,255,.16); color: rgba(255,255,255,.75); }}
.form .btn {{ background: var(--sun); color: var(--ink); }}
.form small {{ color: rgba(255,255,255,.65); font-size: 12px; }}
footer {{ padding: 36px 0 44px; color: var(--muted); font-size: 14px; }}
footer .w {{ display: flex; justify-content: space-between; }}
</style></head>
<body>
<header><div class="w hd"><span class="logo"><i></i>Северный парк</span><nav class="nav"><span>О ЖК</span><span>Двор</span><span>Квартиры</span><span>Ипотека</span><span>Стройка</span></nav><span class="ph">+7 900 000-00-10</span><a class="btn" style="height:48px;padding:0 22px" href="#f">Записаться на показ</a></div></header>

<section class="w hero">
  <div class="t">
    <span class="chip">● Старт продаж 3-го корпуса</span>
    <h1>Квартиры для&nbsp;семей <span>у&nbsp;парка</span></h1>
    <p class="lead">Жилой комплекс комфорт-класса на севере Ростова-на-Дону: свой детский сад, школа рядом и выход в парк прямо из двора.</p>
    <div class="acts"><a class="btn" href="#plans">Подобрать квартиру</a><a class="btn light" href="#f">Ипотека 6%</a></div>
    <div class="promo"><b>%</b><span><strong>Скидка 300 000 ₽ до 30 ноября</strong>на 2- и 3-комнатные квартиры в корпусе 3</span></div>
  </div>
  <div class="pic"><img src="img/realty-2.webp" alt="Дома жилого комплекса"><div class="badge"><b>от 5,29 млн ₽</b><span>1-комнатные квартиры</span></div></div>
</section>

<section class="sec"><div class="w">
  <div class="head"><div><span class="chip">Инфраструктура</span><h2>Всё нужное — в&nbsp;пешей доступности</h2></div></div>
  <div class="life"><div><i><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2f8f5b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="M12 15v6"/></svg></i><h3>Парк 40 га</h3><p>Выход прямо из двора</p></div><div><i><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2f8f5b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="5"/><path d="M10 9h.01M14 9h.01M10 11.5c1 1 3 1 4 0M6 21c1-4 3-6 6-6s5 2 6 6"/></svg></i><h3>Детский сад</h3><p>На 180 мест на территории</p></div><div><i><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2f8f5b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V8l8-4 8 4v11z"/><path d="M9 19v-6h6v6"/></svg></i><h3>Школа</h3><p>В 5 минутах пешком</p></div><div><i><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2f8f5b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.5 11h11L21 8H7"/><circle cx="9" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/></svg></i><h3>Магазины</h3><p>На первых этажах домов</p></div></div>
</div></section>

<section class="sec" style="padding-top:0"><div class="w"><div class="yard"><img src="img/realty-3.webp" alt="Двор" style="object-position:center 70%"><div class="card"><span class="chip">Двор без машин</span><h2>Двор, где&nbsp;дети гуляют сами</h2><ul><li>Площадки для разных возрастов</li><li>Видеонаблюдение и охрана</li><li>Зона барбекю и воркаут</li><li>Колясочные на каждом этаже</li></ul></div></div></div></section>

<section class="sec" style="padding-top:0"><div class="w loc">
  <div><span class="chip">Расположение</span><h2>Тихий район рядом с&nbsp;центром</h2><div class="times"><div><b>1 мин</b><span>до Северного парка</span></div><div><b>2 мин</b><span>до детского сада</span></div><div><b>5 мин</b><span>до школы № 112</span></div><div><b>15 мин</b><span>до центра на машине</span></div></div></div>
  {park_map}
</div></section>

<section class="sec" id="plans" style="padding-top:0"><div class="w">
  <div class="head"><div><span class="chip">Квартиры</span><h2>Подберите квартиру по&nbsp;бюджету</h2></div><p>В продаже 96 квартир в корпусе 3. Покажем любую на показе.</p></div>
  <div class="picker"><div class="f"><div class="l">Бюджет<b>до 8 000 000 ₽</b></div><div class="rng"><i></i></div></div><div class="seg"><span>Все</span><span class="on">1-комн.</span><span>2-комн.</span><span>3-комн.</span></div></div>
  <div class="plans">{park_plans}</div>
</div></section>

<section class="sec" style="padding-top:0"><div class="w">
  <div class="head"><div><span class="chip">Ход строительства</span><h2>Сдача по&nbsp;плану</h2></div></div>
  <div class="steps"><div><b>Корпус 1</b><h3>Дом сдан</h3><span class="st">Заселение</span></div><div><b>Корпус 2</b><h3>Отделка фасада</h3><span class="st">Сдача II кв. 2027</span></div><div><b>Корпус 3</b><h3>Монолит, 9 этаж</h3><span class="st now">Старт продаж</span></div><div><b>Детский сад</b><h3>Коробка готова</h3><span class="st">Открытие 2027</span></div></div>
</div></section>

<section class="sec" id="f" style="padding-top:0"><div class="w final">
  <div><h2>Приходите на&nbsp;показ в&nbsp;выходные</h2><p>Покажем двор, детский сад и квартиры в сданном корпусе. Рассчитаем ипотеку на месте.</p></div>
  <div class="form"><span class="inp">Ваше имя</span><span class="inp">+7 (___) ___-__-__</span><a class="btn" href="#f">Записаться на показ</a><small>Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</small></div>
</div></section>
<footer><div class="w"><span>ЖК «Северный парк» · Ростов-на-Дону</span><span>Концепт сайта от Land Engine</span></div></footer>
</body></html>
'''

(OUT / "grafit.html").write_text(grafit, encoding="utf-8")
(OUT / "park.html").write_text(park, encoding="utf-8")
print("ok")
