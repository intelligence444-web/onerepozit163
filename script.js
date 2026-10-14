// Настройки сайта
const CONFIG = {
  // Адрес, куда отправлять заявки (POST JSON): вебхук Telegram-бота, amoCRM, Bitrix24, Make и т.п.
  // Пока пусто — форма предложит написать в Telegram.
  formEndpoint: "",
  // Номер счётчика Яндекс Метрики, для цели "lead" при отправке формы.
  metrikaId: null,
  telegram: "https://t.me/your_username",
};

// Сборка чертежа на первом экране
const blueprint = document.querySelector(".blueprint");
if (blueprint) {
  requestAnimationFrame(() => blueprint.classList.add("is-built"));
}

// Кнопки тарифов подставляют тариф в заявку
const form = document.getElementById("brief-form");
const planField = form.querySelector('input[name="plan"]');
document.querySelectorAll("[data-plan]").forEach((link) => {
  link.addEventListener("click", () => {
    planField.value = link.dataset.plan;
    const about = form.querySelector("#f-about");
    if (!about.value) about.placeholder = `Тариф: ${link.dataset.plan}`;
  });
});

// Отправка заявки
const status = form.querySelector(".form-status");

function setStatus(text, kind) {
  status.textContent = text;
  status.className = `form-status ${kind}`;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  status.textContent = "";

  const data = Object.fromEntries(new FormData(form));
  if (data.website) return; // скрытое поле заполнил бот

  const required = ["name", "contact"];
  let firstInvalid = null;
  required.forEach((name) => {
    const input = form.elements[name];
    const empty = !input.value.trim();
    input.closest(".field").classList.toggle("has-error", empty);
    input.setAttribute("aria-invalid", String(empty));
    if (empty && !firstInvalid) firstInvalid = input;
  });
  if (firstInvalid) {
    setStatus("Укажите имя и телефон или Telegram, чтобы я мог ответить.", "err");
    firstInvalid.focus();
    return;
  }

  if (!CONFIG.formEndpoint) {
    setStatus("Форма ещё не подключена. Напишите мне в Telegram, отвечу в течение часа.", "err");
    return;
  }

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  button.textContent = "Отправляю…";

  try {
    const response = await fetch(CONFIG.formEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, page: location.href, utm: location.search }),
    });
    if (!response.ok) throw new Error(response.status);
    form.reset();
    setStatus("Заявка отправлена. Свяжусь с вами в течение часа в рабочее время.", "ok");
    if (CONFIG.metrikaId && window.ym) window.ym(CONFIG.metrikaId, "reachGoal", "lead");
  } catch {
    setStatus("Заявка не отправилась. Проверьте интернет и попробуйте ещё раз или напишите в Telegram.", "err");
  } finally {
    button.disabled = false;
    button.textContent = "Отправить заявку";
  }
});
