// Настройки сайта
const CONFIG = {
  // Адрес, куда отправлять заявки (POST JSON): вебхук Telegram-бота, amoCRM, Bitrix24, Make и т.п.
  // Заявки принимает функция в Yandex Cloud (server/lead-mail) и отправляет их на Яндекс Почту.
  formEndpoint: "https://functions.yandexcloud.net/d4er6d31bf29uc92fked",
  // Номер счётчика Яндекс Метрики, для цели "lead" при отправке формы.
  metrikaId: null,
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Витрина на первом экране ---------- */

const ART = {
  remont: `<svg viewBox="0 0 200 150" aria-hidden="true"><rect width="200" height="150" fill="var(--m-soft)"/><path d="M0 118h200" stroke="var(--m-ink)" stroke-opacity=".18" stroke-width="2"/><rect x="20" y="22" width="66" height="58" rx="3" fill="#fff" stroke="var(--m-ink)" stroke-width="3"/><path d="M53 22v58M20 51h66" stroke="var(--m-ink)" stroke-width="2"/><path d="M104 40c26-8 50 4 78-6" stroke="var(--m-accent)" stroke-width="18" stroke-linecap="round" fill="none"/><rect x="122" y="60" width="50" height="16" rx="5" fill="var(--m-accent)"/><path d="M147 76v14h-14v34" stroke="var(--m-ink)" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  doma: `<svg viewBox="0 0 200 150" aria-hidden="true"><rect width="200" height="150" fill="var(--m-soft)"/><path d="M0 128h200" stroke="var(--m-ink)" stroke-opacity=".2" stroke-width="2"/><path d="M44 128V74l46-36 46 36v54z" fill="#fff" stroke="var(--m-ink)" stroke-width="3" stroke-linejoin="round"/><path d="M32 80l58-48 58 48" fill="none" stroke="var(--m-accent)" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><rect x="58" y="86" width="22" height="18" rx="2" fill="var(--m-soft)" stroke="var(--m-ink)" stroke-width="2.5"/><rect x="98" y="92" width="22" height="36" rx="2" fill="var(--m-accent)"/><path d="M160 128V44h-24M160 44v-8" stroke="var(--m-ink)" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M146 44v22" stroke="var(--m-ink)" stroke-width="2" stroke-dasharray="3 3"/><rect x="140" y="66" width="12" height="9" fill="var(--m-accent)"/></svg>`,
  banya: `<svg viewBox="0 0 200 150" aria-hidden="true"><rect width="200" height="150" fill="var(--m-soft)"/><path d="M0 124h200" stroke="var(--m-ink)" stroke-opacity=".2" stroke-width="2"/><rect x="46" y="58" width="118" height="62" rx="31" fill="#8a5a36"/><path d="M60 62v54M76 59v60M92 58v62M108 58v62M124 58v62M140 59v60M152 62v54" stroke="#6b4428" stroke-width="2"/><path d="M70 58v62M140 58v62" stroke="var(--m-accent)" stroke-width="4"/><ellipse cx="46" cy="89" rx="20" ry="31" fill="#a8744a" stroke="#6b4428" stroke-width="2.5"/><rect x="38" y="76" width="16" height="30" rx="3" fill="var(--m-soft)"/><path d="M150 50c-6-8 6-12 0-20M164 50c-6-8 6-12 0-20" stroke="var(--m-accent)" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/></svg>`,
  homes: `<svg viewBox="0 0 200 150" aria-hidden="true"><rect width="200" height="150" fill="var(--m-soft)"/><path d="M0 126c40-8 80-8 200 0v24H0z" fill="var(--m-accent)" opacity=".18"/><circle cx="34" cy="96" r="18" fill="var(--m-accent)" opacity=".55"/><rect x="32" y="108" width="4" height="20" fill="var(--m-ink)"/><path d="M62 126V78l42-30 42 30v48z" fill="#fff" stroke="var(--m-ink)" stroke-width="3" stroke-linejoin="round"/><path d="M54 82l50-38 50 38" fill="none" stroke="var(--m-ink)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><rect x="76" y="88" width="20" height="16" rx="2" fill="var(--m-soft)" stroke="var(--m-ink)" stroke-width="2.5"/><rect x="110" y="92" width="18" height="34" rx="2" fill="var(--m-ink)"/><path d="M150 26h30v18h-30l-7-9z" fill="var(--m-accent)"/><circle cx="152" cy="35" r="2.5" fill="#fff"/><path d="M164 31h10M164 39h7" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></svg>`,
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
    theme: { bg: "#fbf7f2", ink: "#2a2118", accent: "#c2501c", on: "#fff", soft: "#f2e4d4", line: "rgba(42,33,24,.14)", field: "#fff", display: 'var(--font)' },
  },
  doma: {
    url: "doma-pod-klyuch.rf", logo: "СтройДом", phone: "+7 900 000-00-00",
    title: "Строим дома под ключ по фиксированной смете",
    text: "Проект, фундамент и коробка по договору. Цена не меняется во время стройки.",
    cta: "Рассчитать дом",
    b: ["Смета за 2 дня", "Гарантия 10 лет", "Ипотека и маткапитал"],
    q: "Какая площадь дома нужна?", o: ["до 100 м²", "100–150 м²", "150–200 м²", "200+ м²"],
    formBtn: "Получить смету", toast: "Дом из газобетона, 140 м²",
    theme: { bg: "#f5f8fa", ink: "#18242e", accent: "#2f5d7c", on: "#fff", soft: "#dde7ee", line: "rgba(24,36,46,.14)", field: "#fff", display: "var(--font)" },
  },
  banya: {
    url: "bani-bochki.rf", logo: "Банный Двор", phone: "+7 900 000-00-00",
    title: "Бани-бочки из кедра с доставкой за 14 дней",
    text: "Собираем на производстве и привозим готовой. Монтаж за 1 день.",
    cta: "Подобрать баню",
    b: ["Кедр и сосна", "Доставка по области", "Гарантия 3 года"],
    q: "Какой длины нужна баня?", o: ["3 м", "4 м", "5 м", "6 м"],
    formBtn: "Узнать цену", toast: "Баня-бочка 4 м с печью",
    theme: { bg: "#241912", ink: "#f5ebe0", accent: "#e0a15e", on: "#241912", soft: "#33251a", line: "rgba(245,235,224,.16)", field: "#2d2017", display: 'Georgia, "Times New Roman", serif', size: "21px" },
  },
  homes: {
    url: "doma-za-gorodom.rf", logo: "Загород", phone: "+7 900 000-00-00",
    title: "Готовые дома в коттеджных посёлках рядом с городом",
    text: "Подберём дом под ваш бюджет и покажем в удобный день.",
    cta: "Подобрать дом",
    b: ["Готовые дома", "Ипотека и маткапитал", "Показ в выходные"],
    q: "Какой бюджет на дом?", o: ["до 8 млн", "8–12 млн", "12–18 млн", "18+ млн"],
    formBtn: "Получить подборку", toast: "Подбор дома до 12 млн",
    theme: { bg: "#f4f8f5", ink: "#1b2b22", accent: "#2e7458", on: "#fff", soft: "#dcebe2", line: "rgba(27,43,34,.14)", field: "#fff", display: "var(--font)" },
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
    theme: { bg: "#101c2e", ink: "#f2ede3", accent: "#c9a45c", on: "#101c2e", soft: "#1b2a42", line: "rgba(242,237,227,.16)", field: "#16243a", display: 'Georgia, "Times New Roman", serif', size: "22px" },
  },
  school: {
    url: "design-school.online", logo: "Design School", phone: "+7 900 000-00-00",
    title: "Курс графического дизайна с нуля до первых заказов",
    text: "Живые разборы работ, наставник и помощь с поиском клиентов.",
    cta: "Записаться на курс",
    b: ["4 месяца", "Наставник", "Диплом"],
    q: "Какой у вас опыт в дизайне?", o: ["Нет опыта", "Пробовал сам", "Есть заказы", "Работаю"],
    formBtn: "Получить программу", toast: "Заявка на бесплатный урок",
    theme: { bg: "#ffffff", ink: "#16181d", accent: "#1f9d55", on: "#fff", soft: "#e6f5ec", line: "rgba(22,24,29,.12)", field: "#fff", display: 'var(--font)', size: "18px" },
  },
  mebel: {
    url: "kuhni-na-zakaz.rf", logo: "Кухни Мастер", phone: "+7 900 000-00-00",
    title: "Кухни на заказ по вашим размерам за 21 день",
    text: "Бесплатный замер и 3D-проект. Своё производство, без посредников.",
    cta: "Рассчитать кухню",
    b: ["Замер бесплатно", "3D-проект", "Своё производство"],
    q: "Какой формы кухня?", o: ["Прямая", "Угловая", "П-образная", "С островом"],
    formBtn: "Получить расчёт", toast: "Расчёт угловой кухни",
    theme: { bg: "#f7f5f0", ink: "#22261f", accent: "#4a6741", on: "#fff", soft: "#e4e8db", line: "rgba(34,38,31,.14)", field: "#fff", display: 'Georgia, "Times New Roman", serif', size: "20px" },
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
  avito: { label: "Авито Реклама", price: 35000, days: 0, monthly: true },
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
  if (!["type", "extra", "speed"].includes(e.target.name)) return; // поля контактов и согласие расчёт не меняют
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

// Что ушло бы в заявку по текущему расчёту калькулятора (тариф из попапа тоже выставлен в калькуляторе)
function calcLead() {
  const c = readCalc();
  return {
    summary: `${c.plan ? `тариф «${c.plan.name}»` : TYPES[c.type].label}, ${priceText(c)}, ${c.dMin}–${c.dMax} ${daysWord(c.dMax)}`,
    fields: {
      plan: c.plan ? c.plan.name : null,
      project: TYPES[c.type].label,
      extras: c.extras.map((e) => EXTRAS[e].label),
      urgent: c.fast,
      estimate: `${priceText(c)}, ${c.dMin}–${c.dMax} ${daysWord(c.dMax)}`,
      source: document.getElementById("lead-modal").open ? "Попап тарифа" : "Калькулятор",
    },
  };
}

// Маска телефона. Поле общее для телефона и Telegram: если человек начинает с цифры или «+», форматируем
// номер как +7 (900) 123-45-67, а ник в Telegram (@username) оставляем как есть.
const looksLikePhone = (v) => /^[\s(+]*\d/.test(v) || v.trim() === "+";
function formatPhone(v) {
  let d = v.replace(/\D/g, "");
  if (v.trim().startsWith("+7")) {
    // «+7» — код страны, дальше номер. Набрали после «+7» ещё 8 или 7 по привычке — лишняя цифра в начале отбрасывается
    let rest = v.trim().slice(2).replace(/\D/g, "");
    if (rest.length > 10 && (rest[0] === "8" || rest[0] === "7")) rest = rest.slice(1);
    d = "7" + rest;
  }
  else if (d[0] === "8" || d[0] === "7") d = "7" + d.slice(1);
  else d = "7" + d;
  d = d.slice(0, 11);
  let out = "+7";
  if (d.length > 1) out += ` (${d.slice(1, 4)}`;
  if (d.length >= 4) out += ")";
  if (d.length > 4) out += ` ${d.slice(4, 7)}`;
  if (d.length > 7) out += `-${d.slice(7, 9)}`;
  if (d.length > 9) out += `-${d.slice(9, 11)}`;
  return out;
}
// Что не так с контактом: null — всё в порядке
function contactError(v) {
  v = v.trim();
  if (!v) return "Оставьте телефон или ник в Telegram, чтобы мы прислали расчёт";
  if (looksLikePhone(v)) return v.replace(/\D/g, "").length === 11 ? null : "Номер неполный: нужно 10 цифр после +7";
  return /^(@|https?:\/\/t\.me\/|t\.me\/)?[a-zA-Z0-9_]{4,32}$/.test(v) ? null : "Ник в Telegram — латиница, цифры и «_», например @username";
}
function phoneMask(input) {
  const onlyCode = () => input.value.replace(/\D/g, "") === "7" && input.value.trim().startsWith("+7");
  // Пустое поле при фокусе сразу получает «+7 », дальше человек набирает номер
  input.addEventListener("focus", () => {
    if (input.value.trim()) return;
    input.value = "+7 ";
    requestAnimationFrame(() => input.setSelectionRange(input.value.length, input.value.length));
  });
  input.addEventListener("input", (e) => {
    // Вместо номера начали писать ник в Telegram — убираем подставленный «+7»
    const nick = input.value.match(/^\+7[\s(]*([@a-zA-Z_].*)$/);
    if (nick) { input.value = nick[1]; return; }
    // При стирании не переформатируем, иначе скобки и дефисы не дают удалить цифру
    if (e.inputType && e.inputType.startsWith("delete")) return;
    if (looksLikePhone(input.value) && /\d/.test(input.value)) input.value = formatPhone(input.value);
  });
  input.addEventListener("blur", () => {
    if (onlyCode()) input.value = ""; // номер так и не начали — поле снова пустое
    else if (looksLikePhone(input.value) && input.value.replace(/\D/g, "").length > 1) input.value = formatPhone(input.value);
  });
}

// Общая логика формы заявки: проверка полей, согласие, отправка. Используется калькулятором и попапом.
// getLead возвращает, что именно человек заказывает: текст для страницы благодарности и поля для заявки.
function leadForm(el, getLead, onSent) {
  const status = el.querySelector(".form-status");
  const button = el.querySelector('button[type="submit"]');
  const buttonText = button.textContent;
  const contact = el.elements.contact;
  const fields = [el.elements.name, contact, el.elements.consent];
  phoneMask(contact);
  const problem = (i) => {
    if (i === contact) return contactError(i.value);
    return (i.type === "checkbox" ? i.checked : i.value.trim() !== "") ? null : "";
  };
  const mark = (i) => {
    const err = problem(i);
    const ok = err === null;
    const errEl = i.closest(".field").querySelector(".field-err");
    i.closest(".field").classList.toggle("has-error", !ok);
    i.setAttribute("aria-invalid", String(!ok));
    if (err) errEl.textContent = err;
    errEl.hidden = ok;
    return ok;
  };
  const setStatus = (text, kind) => {
    status.textContent = text;
    status.className = `form-status ${kind}`;
  };

  // Ошибка поля пропадает, как только значение становится правильным
  fields.forEach((i) => i.addEventListener(i.type === "checkbox" ? "change" : "input", () => { if (problem(i) === null) mark(i); }));

  el.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "";
    if (el.elements.website.value) return; // скрытое поле заполнил бот

    const firstInvalid = fields.filter((i) => !mark(i))[0];
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    const lead = getLead();
    const payload = {
      name: el.elements.name.value.trim(),
      contact: contact.value.trim(),
      ...lead.fields,
      page: location.href,
      utm: location.search,
      consent: new Date().toISOString(), // когда человек отметил согласие на обработку данных
    };

    // Страница благодарности открывается в новой вкладке. Вкладку открываем сразу, пока идёт нажатие
    // кнопки, — иначе браузер заблокирует её как всплывающее окно. Если всё же заблокировал, откроем здесь же.
    const tab = window.open("", "_blank");
    const url = "thanks.html?v=3"; // версия в адресе, чтобы браузер не показал старую копию страницы
    const done = () => {
      // Имя и суть заявки страница благодарности берёт из localStorage — он общий для вкладок сайта
      try { localStorage.setItem("lead", JSON.stringify({ name: payload.name, summary: lead.summary })); } catch {}
      if (CONFIG.metrikaId && window.ym) window.ym(CONFIG.metrikaId, "reachGoal", "lead");
      fields.forEach((i) => { if (i.type === "checkbox") i.checked = false; else i.value = ""; });
      setStatus("Заявка отправлена, спасибо! Свяжемся в течение часа в рабочее время.", "ok");
      if (onSent) onSent();
      if (tab) tab.location.href = url;
      else location.assign(url);
    };

    if (!CONFIG.formEndpoint) {
      done(); // приём заявок ещё не подключён — сразу на страницу благодарности
      return;
    }

    button.disabled = true;
    button.textContent = "Отправляю…";
    try {
      const response = await fetch(CONFIG.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(response.status);
      done();
    } catch {
      if (tab) tab.close();
      setStatus("Заявка не отправилась. Проверьте интернет и попробуйте ещё раз или напишите в Telegram.", "err");
    } finally {
      button.disabled = false;
      button.textContent = buttonText;
    }
  });
}

leadForm(form, calcLead);

/* ---------- Попап заявки: тариф или общий запрос с первого экрана ---------- */

const modal = document.getElementById("lead-modal");
const modalForm = document.getElementById("lead-form");
const modalTitle = document.getElementById("modal-title");

function generalLead() {
  const need = modalForm.elements.need.value;
  return {
    summary: need ? need.toLowerCase() : "обсудить проект",
    fields: { request: need || "Пока не знаю", source: `Попап «${modal.dataset.source || "Обсудить проект"}»` },
  };
}
leadForm(modalForm, () => (modal.dataset.mode === "plan" ? calcLead() : generalLead()), () => modal.close());

function openModal(mode, link) {
  modal.dataset.mode = mode;
  modal.dataset.source = link.textContent.replace(/\s+/g, " ").trim(); // какая кнопка открыла попап — уходит в заявку
  modal.querySelectorAll("[data-mode]").forEach((el) => { el.hidden = el.dataset.mode !== mode; });
  if (mode === "plan") {
    const c = readCalc();
    modalTitle.textContent = c.plan.name;
    document.getElementById("modal-price").textContent = rub(c.plan.price);
    document.getElementById("modal-days").textContent = `${c.dMin}–${c.dMax} ${daysWord(c.dMax)}`;
    // Состав берём из карточки тарифа, чтобы не дублировать тексты
    const list = document.getElementById("modal-list");
    list.replaceChildren(...[...link.closest(".plan").querySelectorAll("li")].map((li) => li.cloneNode(true)));
  } else {
    modalTitle.textContent = link.dataset.title || "Обсудим ваш проект";
    // Кнопка может сразу отметить формат, например «Лендинг и реклама» из блока про трафик
    const need = [...modalForm.elements.need].find((r) => r.value === (link.dataset.need || ""));
    if (need) need.checked = true;
  }
  modalForm.querySelector(".form-status").textContent = "";
  modal.showModal();
}

// Старый браузер без <dialog>: ссылки просто ведут к калькулятору
document.querySelectorAll("[data-preset], [data-modal]").forEach((link) => {
  link.addEventListener("click", (e) => {
    if (!modal.showModal) return;
    e.preventDefault();
    openModal(link.dataset.preset ? "plan" : "general", link);
  });
});

modal.addEventListener("click", (e) => {
  // Закрываем по крестику, по клику на затемнение вокруг окна и по ссылке на калькулятор
  if (e.target === modal || e.target.closest("[data-close]")) modal.close();
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

/* ---------- Бегущие строки ниш: крутятся только на экране ---------- */

const marquees = document.querySelector(".marquees");
if (marquees && "IntersectionObserver" in window) {
  marquees.classList.add("is-off");
  new IntersectionObserver(([entry]) => marquees.classList.toggle("is-off", !entry.isIntersecting)).observe(marquees);
}

// Сайт целиком: полный скриншот в окне с прокруткой
const workModal = document.getElementById("work-modal");
const workImg = document.getElementById("work-full");
if (workModal) {
  document.querySelectorAll("[data-full]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const work = btn.closest(".work");
      workImg.src = btn.dataset.full;
      workImg.alt = `Сайт «${work.querySelector("h3").textContent.split("»")[0].slice(1)}» целиком`;
      workModal.querySelector(".work-scroll").scrollTop = 0;
      if (workModal.showModal) workModal.showModal(); else window.open(btn.dataset.full, "_blank");
    });
  });
  workModal.addEventListener("click", (e) => {
    if (e.target === workModal || e.target.closest("[data-close]")) workModal.close();
  });
}
