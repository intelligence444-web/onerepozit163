// Главная ad-engine.ru: формы заявки, попап, мобильная кнопка, появление блоков
const CONFIG = {
  // Та же функция Yandex Cloud, что и у Land Engine (server/lead-mail): письмо уходит на Яндекс Почту.
  formEndpoint: "https://functions.yandexcloud.net/d4er6d31bf29uc92fked",
  // Номер счётчика Яндекс Метрики, для цели "lead" при отправке формы.
  metrikaId: null,
  // Общая страница благодарности сайта
  thanksUrl: "landengine/thanks.html?v=3",
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

function problem(input) {
  if (input.name === "contact") return contactError(input.value);
  return (input.type === "checkbox" ? input.checked : input.value.trim() !== "") ? null : "";
}

function leadForm(form, getLead, onSent) {
  const fields = [...form.querySelectorAll("[required]")];
  const status = form.querySelector(".form-status");
  const button = form.querySelector("[type=submit]");
  const buttonText = button.textContent;

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

  fields.forEach((i) => i.addEventListener(i.type === "checkbox" ? "change" : "input", () => { if (problem(i) === null) mark(i); }));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "";
    if (form.elements.website.value) return; // скрытое поле заполнил бот

    const firstInvalid = fields.filter((i) => !mark(i))[0];
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
      if (CONFIG.metrikaId && window.ym) window.ym(CONFIG.metrikaId, "reachGoal", "lead");
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

// Форма аудита внизу страницы
const auditForm = document.getElementById("audit-form");
leadForm(auditForm, () => {
  const channels = [...auditForm.querySelectorAll("[name=channels]:checked")].map((i) => i.value);
  return {
    summary: "бесплатный аудит рекламы",
    fields: { request: channels.length ? `Аудит рекламы: ${channels.join(", ")}` : "Аудит рекламы", source: auditForm.dataset.source },
  };
});

/* ---------- Попап ---------- */

const modal = document.getElementById("lead-modal");
const modalForm = document.getElementById("modal-form");
const modalTitle = document.getElementById("modal-title");

leadForm(modalForm, () => ({
  summary: (modal.dataset.need || "консультация по рекламе").toLowerCase(),
  fields: { request: modal.dataset.need || "Консультация по рекламе", source: `Попап «${modal.dataset.source}»` },
}), () => modal.close());

document.querySelectorAll("[data-modal]").forEach((link) => {
  link.addEventListener("click", (e) => {
    if (!modal.showModal) return; // старый браузер: ссылка просто ведёт к форме аудита
    e.preventDefault();
    modal.dataset.need = link.dataset.need || "";
    modal.dataset.source = link.textContent.replace(/\s+/g, " ").trim(); // какая кнопка открыла попап — уходит в заявку
    modalTitle.textContent = link.dataset.title || "Обсудим рекламу";
    modalForm.querySelector(".form-status").textContent = "";
    modal.showModal();
  });
});
modal.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", () => modal.close()));
modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); }); // клик по затемнению

/* ---------- Мобильная кнопка: после первого экрана и не поверх формы ---------- */

const mobileCta = document.getElementById("mobile-cta");
if ("IntersectionObserver" in window) {
  const hero = document.querySelector(".hero");
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
