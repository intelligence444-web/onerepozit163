// Главная ad-engine.ru: формы заявки, попап, мобильная кнопка, появление блоков
const CONFIG = {
  // Та же функция Yandex Cloud, что и у Land Engine (server/lead-mail): письмо уходит на Яндекс Почту.
  formEndpoint: "https://functions.yandexcloud.net/d4er6d31bf29uc92fked",
  // Номер счётчика Яндекс Метрики, для цели "lead_estate" при отправке формы.
  metrikaId: 99790839,
  // Своя страница благодарности, отдельно от Land Engine
  thanksUrl: "thanks.html?v=1",
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Формы заявки ---------- */

// Телефон из 11 цифр или ник в Telegram — как в формах Land Engine
const looksLikePhone = (v) => /^[\s(+]*\d/.test(v) || v.trim() === "+";
function contactError(v) {
  v = v.trim();
  if (!v) return "";
  if (looksLikePhone(v)) return v.replace(/\D/g, "").length === 11 ? null : "Номер неполный: нужно 10 цифр после +7";
  return /^(@|https?:\/\/t\.me\/|t\.me\/)?[a-zA-Z0-9_]{4,32}$/.test(v) ? null : "Ник в Telegram — латиница, цифры и «_», например @username";
}

// Маска телефона — как в формах Land Engine: цифры форматируем в +7 (900) 123-45-67, ник в Telegram не трогаем
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


function problem(input) {
  if (input.name === "contact") return contactError(input.value);
  if (input.type === "radio") return input.form.querySelector(`[name="${input.name}"]:checked`) ? null : ""; // группа: выбран любой вариант
  return (input.type === "checkbox" ? input.checked : input.value.trim() !== "") ? null : "";
}

function leadForm(form, getLead, onSent) {
  const required = [...form.querySelectorAll("[required]")];
  const fields = () => required.filter((i) => !i.disabled); // поля скрытого режима попапа выключены
  const status = form.querySelector(".form-status");
  const submitButton = () => [...form.querySelectorAll("[type=submit]")].find((b) => !b.hidden);
  phoneMask(form.elements.contact);

  const mark = (input) => {
    const err = problem(input);
    const ok = err === null;
    const box = input.closest(".field");
    const errEl = box.querySelector(".field-err");
    if (!errEl.dataset.text) errEl.dataset.text = errEl.textContent;
    box.classList.toggle("has-error", !ok);
    input.setAttribute("aria-invalid", String(!ok));
    errEl.textContent = err || errEl.dataset.text;
    errEl.hidden = ok;
    return ok;
  };
  const setStatus = (text, kind) => {
    status.textContent = text;
    status.className = `form-status ${kind}`;
  };

  required.forEach((i) => {
    // у группы кнопок-вариантов required стоит на первой, а выбрать можно любую
    const targets = i.type === "radio" ? [...form.querySelectorAll(`[name="${i.name}"]`)] : [i];
    targets.forEach((t) => t.addEventListener(i.type === "checkbox" || i.type === "radio" ? "change" : "input", () => { if (problem(i) === null) mark(i); }));
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "";
    if (form.elements.website.value) return; // скрытое поле заполнил бот

    const firstInvalid = fields().filter((i) => !mark(i))[0];
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    const lead = getLead();
    const payload = {
      name: form.elements.name.value.trim(),
      contact: form.elements.contact.value.trim(),
      ...lead.fields,
      page: location.href,
      utm: location.search,
      consent: new Date().toISOString(), // когда человек отметил согласие на обработку данных
    };

    // Вкладку благодарности открываем сразу, пока идёт нажатие, иначе браузер заблокирует её как всплывающее окно
    const tab = window.open("", "_blank");
    const thanks = new URL(CONFIG.thanksUrl, location.href).href;
    const done = () => {
      try { localStorage.setItem("lead", JSON.stringify({ name: payload.name, summary: lead.summary })); } catch {}
      if (CONFIG.metrikaId && window.ym) window.ym(CONFIG.metrikaId, "reachGoal", "lead_estate");
      form.reset();
      setStatus("Заявка отправлена, спасибо! Свяжемся в течение часа в рабочее время.", "ok");
      if (onSent) onSent();
      if (tab) tab.location.href = thanks;
      else location.assign(thanks);
    };

    if (!CONFIG.formEndpoint) {
      done();
      return;
    }

    const button = submitButton();
    const buttonText = button.textContent;
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

// Форма аудита внизу страницы: квиз из 5 вопросов, потом контакты
const auditForm = document.getElementById("audit-form");
const steps = [...auditForm.querySelectorAll(".quiz-step")];
const quizCount = auditForm.querySelector(".quiz-count");
const quizBar = document.getElementById("quiz-bar");
const quizBack = auditForm.querySelector(".quiz-back");
const QUESTIONS = steps.length - 1; // последний шаг — контакты
let step = 0;

function showStep(i, focus) {
  step = i;
  steps.forEach((el, n) => el.classList.toggle("is-active", n === i));
  const last = i === QUESTIONS;
  quizCount.innerHTML = last ? "Последний шаг" : `Вопрос <b>${i + 1}</b> из&nbsp;${QUESTIONS}`;
  quizBar.style.width = `${((i + 1) / (QUESTIONS + 1)) * 100}%`;
  quizBack.hidden = i === 0;
  if (focus) (steps[i].querySelector("input:checked, input:not(.hp)") || steps[i]).focus({ preventScroll: true });
}
showStep(0);

// Ответ на вопрос с одним вариантом сразу ведёт к следующему. Слушаем click, а не change:
// после «Назад» человек может снова нажать уже выбранный ответ
auditForm.querySelectorAll(".quiz-step input[type=radio]").forEach((input) => {
  input.addEventListener("click", () => setTimeout(() => showStep(Math.min(step + 1, QUESTIONS), true), reduceMotion ? 0 : 250));
});
auditForm.querySelector(".quiz-next").addEventListener("click", () => showStep(step + 1, true));
quizBack.addEventListener("click", () => showStep(Math.max(step - 1, 0), true));

const answer = (name) => (auditForm.querySelector(`[name=${name}]:checked`) || {}).value;
leadForm(auditForm, () => {
  const channels = [...auditForm.querySelectorAll("[name=channels]:checked")].map((i) => i.value);
  const quiz = [
    answer("role"),
    answer("leads") && `заявок в месяц: ${answer("leads")}`,
    answer("manager") && `менеджер по продажам: ${answer("manager")}`,
    answer("crm") && `CRM: ${answer("crm")}`,
    channels.length && `реклама сейчас: ${channels.join(", ")}`,
  ].filter(Boolean);
  return {
    summary: "бесплатный аудит рекламы",
    fields: { request: "Аудит рекламы", project: quiz.join("; ") || "без ответов на квиз", source: auditForm.dataset.source },
  };
});

/* ---------- Попап ---------- */

const modal = document.getElementById("lead-modal");
const modalForm = document.getElementById("modal-form");
const modalTitle = document.getElementById("modal-title");

// Режимы попапа: calc — встреча с расчётом стоимости лида, audit — бесплатный аудит рекламы
const MODES = {
  calc: { title: "Рассчитаем стоимость лида в\u00a0вашем городе", need: "Расчёт стоимости лида" },
  audit: { title: "Бесплатный аудит рекламы", need: "Аудит рекламы" },
};

leadForm(modalForm, () => {
  const mode = modal.dataset.mode;
  const need = MODES[mode].need;
  const city = modalForm.elements.city.value.trim();
  const role = (modalForm.querySelector("[name=role]:checked") || {}).value;
  return {
    summary: mode === "calc" ? `расчёт стоимости лида: ${city}` : need.toLowerCase(),
    fields: {
      request: need,
      project: mode === "calc" ? [`город: ${city}`, role].filter(Boolean).join("; ") : "",
      source: `Попап «${modal.dataset.source}»`,
    },
  };
}, () => modal.close());

function setMode(mode) {
  modal.dataset.mode = mode;
  modal.querySelectorAll("[data-for]").forEach((el) => {
    el.hidden = el.dataset.for !== mode;
    el.querySelectorAll("input").forEach((i) => { i.disabled = el.hidden; });
  });
  modalTitle.textContent = MODES[mode].title;
}

document.querySelectorAll("[data-modal]").forEach((link) => {
  link.addEventListener("click", (e) => {
    if (!modal.showModal) return; // старый браузер: ссылка просто ведёт к форме аудита
    e.preventDefault();
    setMode(link.dataset.mode || "audit");
    modal.dataset.source = (link.querySelector(".lbl-full") || link).textContent.replace(/\s+/g, " ").trim(); // какая кнопка открыла попап — уходит в заявку
    modalForm.querySelector(".form-status").textContent = "";
    modal.showModal();
  });
});
modal.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", () => modal.close()));
modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); }); // клик по затемнению

/* ---------- Мобильная кнопка: как только главная кнопка первого экрана не видна, и не поверх формы ---------- */

const mobileCta = document.getElementById("mobile-cta");
if ("IntersectionObserver" in window) {
  const hero = document.querySelector(".hero-actions");
  const audit = document.getElementById("audit");
  const seen = new Map();
  const update = () => mobileCta.classList.toggle("show", !seen.get(hero) && !seen.get(audit));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => seen.set(e.target, e.isIntersecting));
    update();
  });
  io.observe(hero);
  io.observe(audit);
}

/* ---------- Этапы «Как работаем»: заполняются при прокрутке (как в Land Engine) ---------- */

const processSteps = [...document.getElementById("steps").children];

function updateSteps() {
  // Шаг заполняется, когда его кружок проходит линию на экране; линия для каждого следующего шага чуть выше,
  // поэтому в один ряд на компьютере шаги загораются по очереди, а не все сразу
  const vh = window.innerHeight;
  const n = processSteps.length;
  const tops = processSteps.map((li) => li.getBoundingClientRect().top); // сначала читаем, потом меняем классы
  processSteps.forEach((li, i) => li.classList.toggle("is-done", tops[i] < vh * (0.8 - 0.4 * i / n)));
}

let ticking = false;
window.addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { updateSteps(); ticking = false; });
}, { passive: true });
updateSteps();

/* ---------- Появление блоков ---------- */

if (!reduceMotion && "IntersectionObserver" in window) {
  const items = document.querySelectorAll(".channel, .included li, .funnel li, .clients li, .steps li");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      io.unobserve(e.target);
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  items.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${(i % 3) * 80}ms`;
    io.observe(el);
  });
}
