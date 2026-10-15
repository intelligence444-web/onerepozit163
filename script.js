// Настройки сайта
const CONFIG = {
  // Адрес, куда отправлять заявки (POST JSON): вебхук Telegram-бота, amoCRM, Bitrix24, Make и т.п.
  // Пока пусто — форма предложит написать в Telegram.
  formEndpoint: "",
  // Номер счётчика Яндекс Метрики, для цели "lead" при отправке формы.
  metrikaId: null,
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Витрина на первом экране ---------- */

const ART = {
  remont: `<svg viewBox="0 0 200 150" aria-hidden="true"><rect width="200" height="150" fill="var(--m-soft)"/><path d="M0 118h200" stroke="var(--m-ink)" stroke-opacity=".18" stroke-width="2"/><rect x="20" y="22" width="66" height="58" rx="3" fill="#fff" stroke="var(--m-ink)" stroke-width="3"/><path d="M53 22v58M20 51h66" stroke="var(--m-ink)" stroke-width="2"/><path d="M104 40c26-8 50 4 78-6" stroke="var(--m-accent)" stroke-width="18" stroke-linecap="round" fill="none"/><rect x="122" y="60" width="50" height="16" rx="5" fill="var(--m-accent)"/><path d="M147 76v14h-14v34" stroke="var(--m-ink)" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  dental: `<svg viewBox="0 0 200 150" aria-hidden="true"><rect width="200" height="150" fill="var(--m-soft)"/><circle cx="100" cy="76" r="52" fill="#fff" opacity=".7"/><path d="M76 42c13-9 22-2 24 0 2-2 11-9 24 0 13 9 8 31 3 42-4 9-6 32-13 32s-7-22-14-22-7 22-14 22-9-23-13-32c-5-11-10-33 3-42z" fill="#fff" stroke="var(--m-accent)" stroke-width="3.5" stroke-linejoin="round"/><path d="M148 34v14M141 41h14M50 98v10M45 103h10" stroke="var(--m-accent)" stroke-width="3" stroke-linecap="round"/></svg>`,
  realty: `<svg viewBox="0 0 200 150" aria-hidden="true"><defs><pattern id="win" width="10" height="12" patternUnits="userSpaceOnUse"><rect x="2" y="3" width="5" height="6" fill="var(--m-accent)" opacity=".75"/></pattern></defs><rect width="200" height="150" fill="var(--m-soft)"/><circle cx="150" cy="40" r="18" fill="var(--m-accent)"/><rect x="22" y="58" width="40" height="92" fill="#2a3b57"/><rect x="22" y="58" width="40" height="92" fill="url(#win)"/><rect x="70" y="30" width="46" height="120" fill="#33486a"/><rect x="70" y="30" width="46" height="120" fill="url(#win)"/><rect x="124" y="76" width="54" height="74" fill="#2a3b57"/><rect x="124" y="76" width="54" height="74" fill="url(#win)"/></svg>`,
  school: `<svg viewBox="0 0 200 150" aria-hidden="true"><rect width="200" height="150" fill="var(--m-soft)"/><rect x="40" y="30" width="120" height="76" rx="6" fill="#fff" stroke="var(--m-ink)" stroke-width="3"/><path d="M26 114h148l-10 10H36z" fill="var(--m-ink)"/><circle cx="76" cy="66" r="16" fill="var(--m-accent)"/><path d="M104 82l16-30 16 30z" fill="none" stroke="var(--m-ink)" stroke-width="3" stroke-linejoin="round"/><rect x="58" y="40" width="30" height="4" rx="2" fill="var(--m-ink)" opacity=".25"/></svg>`,
  mebel: `<svg viewBox="0 0 200 150" aria-hidden="true"><rect width="200" height="150" fill="var(--m-soft)"/><g fill="#fff" stroke="var(--m-ink)" stroke-width="2.5"><rect x="24" y="22" width="48" height="34" rx="2"/><rect x="76" y="22" width="48" height="34" rx="2"/><rect x="128" y="22" width="48" height="34" rx="2"/><rect x="24" y="84" width="74" height="46" rx="2"/><rect x="102" y="84" width="74" height="46" rx="2"/></g><rect x="18" y="76" width="164" height="9" rx="2" fill="var(--m-accent)"/><path d="M44 46h8M96 46h8M148 46h8M54 96h18M128 96h18" stroke="var(--m-ink)" stroke-width="3" stroke-linecap="round"/></svg>`,
};

const NICHES = {
  remont: {
    url: "remont-pod-klyuch.rf", logo: "Ремонт Про", phone: "+7 900 000-00-00",
    title: "Ремонт квартир под ключ с фиксированной сметой",
    text: "Смета за 1 день, работы по договору, оплата по этапам.",
    cta: "Рассчитать стоимость",
    b: ["Смета за 1 день", "Гарантия 3 года", "Фотоотчёты"],
    q: "Какая площадь квартиры?", o: ["до 40 м²", "40–70 м²", "70–100 м²", "100+ м²"],
    formBtn: "Получить смету", toast: "Ремонт 2-комнатной, 54 м²",
    theme: { bg: "#fbf7f2", ink: "#2a2118", accent: "#c2501c", on: "#fff", soft: "#f2e4d4", line: "rgba(42,33,24,.14)", field: "#fff", display: '"Rubik", var(--font)' },
  },
  dental: {
    url: "smile-clinic.rf", logo: "Smile Clinic", phone: "+7 900 000-00-00",
    title: "Имплантация зубов под ключ с гарантией 10 лет",
    text: "КТ и консультация хирурга бесплатно при записи с сайта.",
    cta: "Записаться",
    b: ["Без боли", "Рассрочка 0%", "Гарантия 10 лет"],
    q: "Сколько зубов нужно восстановить?", o: ["1 зуб", "2–3 зуба", "4 и больше", "Весь ряд"],
    formBtn: "Записаться", toast: "Консультация по имплантации",
    theme: { bg: "#f4fafa", ink: "#0f2f38", accent: "#0f9d97", on: "#fff", soft: "#dcf0ee", line: "rgba(15,47,56,.14)", field: "#fff", display: "var(--font)" },
  },
  realty: {
    url: "novostroyki-sochi.rf", logo: "Sochi Estate", phone: "+7 900 000-00-00",
    title: "Квартиры в новостройках Сочи у моря",
    text: "Подберём 5 вариантов под ваш бюджет за 15 минут. Без комиссии.",
    cta: "Подобрать квартиру",
    b: ["Без комиссии", "Ипотека от 6%", "Онлайн-показ"],
    q: "Сколько комнат нужно?", o: ["Студия", "1 комната", "2 комнаты", "3 и больше"],
    formBtn: "Получить подборку", toast: "Подбор 2-комнатной у моря",
    theme: { bg: "#101c2e", ink: "#f2ede3", accent: "#c9a45c", on: "#101c2e", soft: "#1b2a42", line: "rgba(242,237,227,.16)", field: "#16243a", display: '"Cormorant Garamond", Georgia, serif', size: "25px" },
  },
  school: {
    url: "design-school.online", logo: "Design School", phone: "+7 900 000-00-00",
    title: "Курс графического дизайна с нуля до первых заказов",
    text: "Живые разборы работ, наставник и помощь с поиском клиентов.",
    cta: "Записаться на курс",
    b: ["4 месяца", "Наставник", "Диплом"],
    q: "Какой у вас опыт в дизайне?", o: ["Нет опыта", "Пробовал сам", "Есть заказы", "Работаю"],
    formBtn: "Получить программу", toast: "Заявка на бесплатный урок",
    theme: { bg: "#ffffff", ink: "#16181d", accent: "#1f9d55", on: "#fff", soft: "#e6f5ec", line: "rgba(22,24,29,.12)", field: "#fff", display: '"Unbounded", var(--font)', size: "17px" },
  },
  mebel: {
    url: "kuhni-na-zakaz.rf", logo: "Кухни Мастер", phone: "+7 900 000-00-00",
    title: "Кухни на заказ по вашим размерам за 21 день",
    text: "Бесплатный замер и 3D-проект. Своё производство, без посредников.",
    cta: "Рассчитать кухню",
    b: ["Замер бесплатно", "3D-проект", "Своё производство"],
    q: "Какой формы кухня?", o: ["Прямая", "Угловая", "П-образная", "С островом"],
    formBtn: "Получить расчёт", toast: "Расчёт угловой кухни",
    theme: { bg: "#f7f5f0", ink: "#22261f", accent: "#4a6741", on: "#fff", soft: "#e4e8db", line: "rgba(34,38,31,.14)", field: "#fff", display: '"Lora", Georgia, serif', size: "20px" },
  },
};

const stage = document.getElementById("stage");
const mock = stage.querySelector(".mock");
const page = stage.querySelector(".page");
const toast = stage.querySelector(".toast");
const nicheGroup = document.querySelector(".niche-chips");
const nicheButtons = [...nicheGroup.querySelectorAll("button")];
const wireToggle = document.getElementById("wire-toggle");
const order = Object.keys(NICHES);
const CYCLE_MS = 5500;
const field = (key) => stage.querySelector(`[data-k="${key}"]`);

let current = "remont";
let autoTimer = null;
let autoplay = !reduceMotion;
let stageVisible = true;

function fill(key) {
  const n = NICHES[key];
  const map = { url: n.url, logo: n.logo, phone: n.phone, title: n.title, text: n.text, cta: n.cta, q: n.q, formBtn: n.formBtn, toast: n.toast };
  Object.entries(map).forEach(([k, v]) => { field(k).textContent = v; });
  n.b.forEach((v, i) => { field(`b${i}`).textContent = v; });
  n.o.forEach((v, i) => { field(`o${i}`).textContent = v; });
  field("art").innerHTML = ART[key];
  const t = n.theme;
  const vars = { bg: t.bg, ink: t.ink, accent: t.accent, on: t.on, soft: t.soft, line: t.line, field: t.field, display: t.display, size: t.size || "19px" };
  Object.entries(vars).forEach(([k, v]) => mock.style.setProperty(`--m-${k}`, v));
  stage.dataset.niche = key;
  nicheButtons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.niche === key)));
}

function showToast() {
  if (stage.dataset.state === "wire") return;
  toast.classList.remove("show");
  void toast.offsetWidth;
  toast.classList.add("show");
}

function setNiche(key) {
  if (key === current) return;
  current = key;
  toast.classList.remove("show");
  if (reduceMotion) { fill(key); showToast(); return; }
  page.classList.add("is-swapping");
  setTimeout(() => {
    fill(key);
    page.classList.remove("is-swapping");
    setTimeout(showToast, 600);
  }, 280);
}

function restartProgress() {
  nicheGroup.classList.remove("is-auto");
  if (!autoplay) return;
  void nicheGroup.offsetWidth;
  nicheGroup.style.setProperty("--cycle", `${CYCLE_MS}ms`);
  nicheGroup.classList.add("is-auto");
}

function scheduleNext() {
  clearTimeout(autoTimer);
  if (!autoplay) return;
  restartProgress();
  autoTimer = setTimeout(() => {
    if (stageVisible && !document.hidden && stage.dataset.state === "design") {
      setNiche(order[(order.indexOf(current) + 1) % order.length]);
    }
    scheduleNext();
  }, CYCLE_MS);
}

function stopAutoplay() {
  autoplay = false;
  clearTimeout(autoTimer);
  nicheGroup.classList.remove("is-auto");
}

function setWire(on) {
  stage.dataset.state = on ? "wire" : "design";
  wireToggle.checked = on;
  if (on) toast.classList.remove("show"); else setTimeout(showToast, 500);
}

nicheButtons.forEach((btn) => btn.addEventListener("click", () => {
  stopAutoplay();
  if (stage.dataset.state === "wire") setWire(false);
  setNiche(btn.dataset.niche);
}));

wireToggle.addEventListener("change", () => {
  stopAutoplay();
  setWire(wireToggle.checked);
});

if ("IntersectionObserver" in window) {
  new IntersectionObserver(([entry]) => { stageVisible = entry.isIntersecting; }, { threshold: 0.3 }).observe(stage);
}

// Сначала собирается чертёж, затем он превращается в готовый дизайн
fill(current);
if (reduceMotion) {
  setWire(false);
} else {
  setTimeout(() => {
    if (wireToggle.checked) return;
    setWire(false);
    scheduleNext();
  }, 1900);
}

/* ---------- Калькулятор ---------- */

const TYPES = {
  quiz: { label: "Квиз", price: 25000, days: [5, 7] },
  landing: { label: "Лендинг", price: 45000, days: [7, 14] },
  catalog: { label: "Каталог", price: 60000, days: [14, 21] },
  site: { label: "Многостраничный сайт", price: 110000, days: [21, 28] },
};
const EXTRAS = {
  quizBlock: { label: "Квиз внутри страницы", price: 10000, days: 2 },
  motion: { label: "Анимации и интерактив", price: 30000, days: 3 },
  support: { label: "Сопровождение сайта", price: 20000, days: 0 },
  analytics: { label: "Сквозная аналитика", price: 15000, days: 2 },
  direct: { label: "Яндекс Директ", price: 45000, days: 0, monthly: true },
  vk: { label: "Реклама ВКонтакте", price: 35000, days: 0, monthly: true },
  avito: { label: "Авито", price: 35000, days: 0, monthly: true },
};
// Тарифы: фиксированная цена, состав отмечается в калькуляторе
const PRESETS = {
  start: { type: "quiz", extras: [], plan: { name: "Старт", price: 30000 } },
  business: { type: "landing", extras: ["quizBlock", "support"], plan: { name: "Лендинг под ключ", price: 65000 } },
  traffic: { type: "landing", extras: ["quizBlock", "direct", "analytics", "support"], plan: { name: "Бизнес", price: 120000 } },
};
let activePlan = null;


const form = document.getElementById("calc-form");
const sumList = document.getElementById("sum-list");
const sumPrice = document.getElementById("sum-price");
const sumDays = document.getElementById("sum-days");
const status = form.querySelector(".form-status");
const rub = (n) => `${n.toLocaleString("ru-RU")} ₽`;
let shownPrice = 0;

function daysWord(n) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "день";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "дня";
  return "дней";
}

function readCalc() {
  const type = form.elements.type.value;
  const extras = [...form.querySelectorAll('input[name="extra"]:checked')]
    .map((i) => i.value)
    .filter((v) => !(type === "quiz" && v === "quizBlock"));
  const fast = form.elements.speed.value === "fast";
  const t = TYPES[type];
  const plan = activePlan;
  let price = plan ? plan.price : t.price + extras.reduce((s, e) => s + EXTRAS[e].price, 0);
  let [dMin, dMax] = t.days;
  const addDays = extras.reduce((s, e) => s + EXTRAS[e].days, 0);
  dMin += addDays; dMax += addDays;
  if (fast) {
    price = Math.round((price * 1.3) / 1000) * 1000;
    dMin = Math.max(3, Math.round(dMin * 0.6));
    dMax = Math.max(dMin + 1, Math.round(dMax * 0.6));
  }
  return { type, extras, fast, price, dMin, dMax, plan };
}

// У тарифа цена точная, у собранного вручную набора — «от»
const priceText = (c) => `${c.plan ? "" : "от "}${rub(c.price)}`;

function animatePrice(to, prefix) {
  const from = shownPrice;
  shownPrice = to;
  if (reduceMotion || from === 0) { sumPrice.textContent = `${prefix}${rub(to)}`; return; }
  const start = performance.now();
  const step = (now) => {
    const k = Math.min(1, (now - start) / 450);
    const eased = 1 - Math.pow(1 - k, 3);
    const val = Math.round((from + (to - from) * eased) / 100) * 100;
    sumPrice.textContent = `${prefix}${rub(val)}`;
    if (k < 1 && shownPrice === to) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function renderCalc() {
  const c = readCalc();
  form.querySelectorAll("[data-hide-for]").forEach((el) => { el.hidden = el.dataset.hideFor === c.type; });
  const rows = c.plan
    ? [[`Тариф «${c.plan.name}»`, rub(c.plan.price)], [TYPES[c.type].label, "входит"], ...c.extras.map((e) => [EXTRAS[e].label, "входит"])]
    : [[TYPES[c.type].label, rub(TYPES[c.type].price)], ...c.extras.map((e) => [EXTRAS[e].label, `+${rub(EXTRAS[e].price)}${EXTRAS[e].monthly ? " в мес." : ""}`])];
  if (c.fast) rows.push(["Срочный запуск", "+30%"]);
  sumList.innerHTML = "";
  rows.forEach(([a, b]) => {
    const li = document.createElement("li");
    const s1 = document.createElement("span"); s1.textContent = a;
    const s2 = document.createElement("span"); s2.textContent = b;
    li.append(s1, s2);
    sumList.append(li);
  });
  animatePrice(c.price, c.plan ? "" : "от ");
  sumDays.textContent = `${c.dMin}–${c.dMax} ${daysWord(c.dMax)}`;
}

form.addEventListener("change", (e) => {
  // Любое изменение состава превращает тариф в собственный набор; срочность тариф не сбрасывает
  if (e.target.name !== "speed") activePlan = null;
  renderCalc();
});
renderCalc();

document.querySelectorAll("[data-preset]").forEach((link) => {
  link.addEventListener("click", () => {
    const p = PRESETS[link.dataset.preset];
    activePlan = p.plan;
    form.querySelector('input[name="speed"][value="normal"]').checked = true;
    form.querySelector(`input[name="type"][value="${p.type}"]`).checked = true;
    form.querySelectorAll('input[name="extra"]').forEach((i) => { i.checked = p.extras.includes(i.value); });
    renderCalc();
  });
});

/* ---------- Отправка заявки ---------- */

function setStatus(text, kind) {
  status.textContent = text;
  status.className = `form-status ${kind}`;
}

// Ошибка поля пропадает, как только человек начинает печатать
["name", "contact"].forEach((name) => {
  form.elements[name].addEventListener("input", (e) => {
    if (!e.target.value.trim()) return;
    e.target.closest(".field").classList.remove("has-error");
    e.target.setAttribute("aria-invalid", "false");
    document.getElementById(`err-${name}`).hidden = true;
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  status.textContent = "";
  if (form.elements.website.value) return; // скрытое поле заполнил бот

  let firstInvalid = null;
  ["name", "contact"].forEach((name) => {
    const input = form.elements[name];
    const empty = !input.value.trim();
    input.closest(".field").classList.toggle("has-error", empty);
    input.setAttribute("aria-invalid", String(empty));
    document.getElementById(`err-${name}`).hidden = !empty;
    if (empty && !firstInvalid) firstInvalid = input;
  });
  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  const c = readCalc();

  if (!CONFIG.formEndpoint) {
    // Пока отправка не подключена: предлагаем написать в Telegram и показываем расчёт, чтобы его можно было скопировать
    const tg = document.querySelector('a[href^="https://t.me/"]');
    status.className = "form-status info";
    status.replaceChildren(
      `Ваш расчёт: ${c.plan ? `тариф «${c.plan.name}»` : TYPES[c.type].label}, ${priceText(c)}, ${c.dMin}–${c.dMax} ${daysWord(c.dMax)}. Отправьте его нам в `,
      Object.assign(document.createElement("a"), { href: tg ? tg.href : "#calc", textContent: "Telegram", target: "_blank", rel: "noopener" }),
      ", ответим в течение часа."
    );
    return;
  }

  const payload = {
    name: form.elements.name.value.trim(),
    contact: form.elements.contact.value.trim(),
    plan: c.plan ? c.plan.name : null,
    project: TYPES[c.type].label,
    extras: c.extras.map((e) => EXTRAS[e].label),
    urgent: c.fast,
    estimate: `${priceText(c)}, ${c.dMin}–${c.dMax} ${daysWord(c.dMax)}`,
    page: location.href,
    utm: location.search,
  };

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  button.textContent = "Отправляю…";
  try {
    const response = await fetch(CONFIG.formEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(response.status);
    form.elements.name.value = "";
    form.elements.contact.value = "";
    setStatus("Заявка отправлена. Пришлём точный расчёт в течение часа в рабочее время.", "ok");
    if (CONFIG.metrikaId && window.ym) window.ym(CONFIG.metrikaId, "reachGoal", "lead");
  } catch {
    setStatus("Заявка не отправилась. Проверьте интернет и попробуйте ещё раз или напишите в Telegram.", "err");
  } finally {
    button.disabled = false;
    button.textContent = "Получить точный расчёт";
  }
});

/* ---------- Этапы: заполняются при прокрутке ---------- */

const steps = document.getElementById("steps");
const stepItems = steps ? [...steps.children] : [];

function updateSteps() {
  // Шаг заполняется, когда его кружок проходит линию на экране; линия для каждого следующего шага чуть выше,
  // поэтому в один ряд на компьютере шаги загораются по очереди, а не все сразу
  const vh = window.innerHeight;
  const n = stepItems.length;
  // Сначала читаем все позиции, потом меняем классы: так браузер не пересчитывает раскладку на каждом шаге
  const tops = stepItems.map((li) => li.getBoundingClientRect().top);
  stepItems.forEach((li, i) => li.classList.toggle("is-done", tops[i] < vh * (0.8 - 0.4 * i / n)));
}

/* ---------- Мобильная панель с кнопкой ---------- */

const mobileCta = document.getElementById("mobile-cta");
const hero = document.querySelector(".hero");
const calcSection = document.getElementById("calc");

function updateMobileCta() {
  const pastHero = hero.getBoundingClientRect().bottom < 0;
  const c = calcSection.getBoundingClientRect();
  const calcVisible = c.top < window.innerHeight && c.bottom > 0;
  mobileCta.classList.toggle("is-visible", pastHero && !calcVisible);
}

let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    if (steps) updateSteps();
    updateMobileCta();
    ticking = false;
  });
}
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
onScroll();

/* ---------- Шрифты примеров ниш: грузим после страницы, чтобы не тормозить первый экран ---------- */

window.addEventListener("load", () => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Rubik:wght@500;700&family=Cormorant+Garamond:wght@600;700&family=Unbounded:wght@600&family=Lora:wght@600&display=swap";
  document.head.append(link);
});
