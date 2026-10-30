// Приём заявок с сайта в Yandex Cloud Functions: проверяет заявку и отправляет письмо через SMTP Яндекса.
// Данные не покидают Россию: функция работает в Yandex Cloud, письмо уходит на Яндекс Почту.
// Если заданы MAX_TOKEN и MAX_CHAT_ID, заявка с метками дублируется ботом в группу MAX (тоже Россия).
// Переменные окружения: SMTP_USER (ящик-отправитель), SMTP_PASS (пароль приложения),
// MAIL_TO (куда слать заявки, по умолчанию SMTP_USER), ALLOWED_ORIGINS (адреса сайта через запятую),
// MAX_TOKEN (токен бота MAX), MAX_CHAT_ID (id группы; если не задан, берётся первая группа, куда добавлен бот).
const nodemailer = require("nodemailer");

const LABELS = {
  name: "Имя", contact: "Телефон или Telegram", request: "Что нужно", source: "Откуда заявка",
  plan: "Тариф", project: "Проект", extras: "Дополнительно", urgent: "Срочно", estimate: "Расчёт",
  page: "Страница", utm: "Метки UTM", ym_uid: "_ym_uid", referrer: "Пришёл с", ip: "IP",
  consent: "Согласие на обработку данных",
};
// Порядок блоков в сообщении MAX: контакты, ответы, источник
const ANSWERS = ["request", "plan", "project", "extras", "urgent", "estimate"];
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
const MAX_LEN = 500;

const allowed = () => (process.env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);

function cors(origin) {
  const ok = allowed().includes(origin);
  return {
    "Access-Control-Allow-Origin": ok ? origin : allowed()[0] || "",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

const reply = (status, body, origin) => ({
  statusCode: status,
  headers: { "Content-Type": "application/json", ...cors(origin) },
  body: JSON.stringify(body),
});

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// Приводим значения к строкам: массивы через запятую, да/нет вместо true/false, без пустых полей
function rows(lead) {
  return Object.entries(lead)
    .filter(([key, v]) => key in LABELS && v != null && v !== "" && !(Array.isArray(v) && !v.length))
    .map(([key, v]) => {
      if (typeof v === "boolean") v = v ? "да" : "нет";
      if (Array.isArray(v)) v = v.join(", ");
      return [LABELS[key], String(v).slice(0, MAX_LEN)];
    });
}

// IP посетителя: Yandex Cloud Functions кладёт его в requestContext, запасной вариант — заголовок прокси
const clientIp = (event, headers) =>
  (event.requestContext && event.requestContext.identity && event.requestContext.identity.sourceIp) ||
  String(headers["X-Forwarded-For"] || headers["x-forwarded-for"] || "").split(",")[0].trim();

// Метки из строки вида ?utm_source=yandex&utm_term=...: известные UTM, остальные параметры — как есть
function utmRows(query) {
  let params;
  try { params = new URLSearchParams(String(query || "").slice(0, 2000)); } catch { return []; }
  const list = [];
  for (const [k, v] of params) if (v && list.length < 15) list.push([k.slice(0, 40), v.slice(0, MAX_LEN)]);
  return list.sort((a, b) => (UTM_KEYS.indexOf(a[0]) + 1 || 99) - (UTM_KEYS.indexOf(b[0]) + 1 || 99));
}

// Текст сообщения для группы MAX в разметке HTML
function maxText(lead) {
  const line = (k, v) => `${esc(k)}: <b>${esc(v)}</b>`;
  const parts = [`<b>Заявка с сайта: ${esc(String(lead.source || "форма").slice(0, 120))}</b>`];
  parts.push(["<b>Контактные данные</b>", line("Имя", lead.name), line("Телефон", lead.contact)].join("\n"));
  const answers = rows(Object.fromEntries(ANSWERS.filter((k) => k in lead).map((k) => [k, lead[k]])));
  if (answers.length) parts.push(["<b>Ответы</b>", ...answers.map(([k, v]) => line(k, v))].join("\n"));
  const utm = utmRows(lead.utm);
  const source = [
    lead.ip && `IP: ${esc(lead.ip)}`,
    ...utm.map(([k, v]) => `${esc(k)}: ${esc(v)}`),
    lead.ym_uid && `_ym_uid: ${esc(String(lead.ym_uid).slice(0, 40))}`,
    lead.referrer && `Пришёл с: ${esc(String(lead.referrer).slice(0, 300))}`,
    lead.page && `Страница: ${esc(String(lead.page).split("?")[0].slice(0, 300))}`,
  ].filter(Boolean);
  parts.push([`<b>${utm.length ? "UTM-метки" : "Источник (без UTM-меток)"}</b>`, ...source].join("\n"));
  return parts.join("\n\n").slice(0, 3900);
}

// Отправка в группу MAX через Bot API. fetch можно подменить в тестах
const MAX_API = "https://platform-api.max.ru";
let maxFetch = (...a) => fetch(...a);
let maxChat = null;

// Номер группы: из MAX_CHAT_ID или первая группа, куда добавлен бот (ищем один раз и запоминаем)
async function maxChatId() {
  if (process.env.MAX_CHAT_ID) return process.env.MAX_CHAT_ID;
  if (maxChat) return maxChat;
  const res = await maxFetch(`${MAX_API}/chats?count=100`, { headers: { Authorization: process.env.MAX_TOKEN } });
  if (!res.ok) throw new Error(`max chats ${res.status} ${(await res.text()).slice(0, 200)}`);
  const group = ((await res.json()).chats || []).find((c) => c.type === "chat");
  if (!group) throw new Error("max: бот не добавлен ни в одну группу");
  console.log(`max: заявки идут в группу «${group.title}», MAX_CHAT_ID=${group.chat_id}`);
  return (maxChat = String(group.chat_id));
}

async function sendMax(lead) {
  const res = await maxFetch(`${MAX_API}/messages?chat_id=${encodeURIComponent(await maxChatId())}`, {
    method: "POST",
    headers: { Authorization: process.env.MAX_TOKEN, "Content-Type": "application/json" },
    body: JSON.stringify({ text: maxText(lead), format: "html" }),
  });
  if (!res.ok) throw new Error(`max ${res.status} ${(await res.text()).slice(0, 200)}`);
}

// Транспорт можно подменить в тестах
let transport = null;
const getTransport = () => transport || (transport = nodemailer.createTransport({
  host: "smtp.yandex.ru",
  port: 465,
  secure: true,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
}));

module.exports.handler = async (event) => {
  const headers = event.headers || {};
  const origin = headers.Origin || headers.origin || "";
  if (event.httpMethod === "OPTIONS") return reply(204, {}, origin);
  if (event.httpMethod !== "POST") return reply(405, { ok: false, error: "method" }, origin);
  // Заявки принимаем только со своего сайта
  if (allowed().length && !allowed().includes(origin)) return reply(403, { ok: false, error: "origin" }, origin);

  let lead;
  try {
    const raw = event.isBase64Encoded ? Buffer.from(event.body || "", "base64").toString("utf8") : event.body || "";
    lead = JSON.parse(raw);
  } catch {
    return reply(400, { ok: false, error: "json" }, origin);
  }
  const name = String(lead.name || "").trim();
  const contact = String(lead.contact || "").trim();
  if (!name || !contact || name.length > 100 || contact.length > 100 || !lead.consent) {
    return reply(400, { ok: false, error: "fields" }, origin);
  }

  lead.ip = clientIp(event, headers);
  const table = rows(lead);
  const about = lead.request || lead.estimate || lead.project || "заявка";
  const mail = getTransport().sendMail({
    from: `Заявки с сайта <${process.env.SMTP_USER}>`,
    to: process.env.MAIL_TO || process.env.SMTP_USER,
    subject: `Заявка с сайта: ${name.slice(0, 60)}, ${String(about).slice(0, 80)}`,
    text: table.map(([k, v]) => `${k}: ${v}`).join("\n"),
    html: `<table cellpadding="8" style="border-collapse:collapse;font:15px Arial,sans-serif">${table
      .map(([k, v]) => `<tr><td style="border:1px solid #ddd;color:#666">${esc(k)}</td><td style="border:1px solid #ddd"><b>${esc(v)}</b></td></tr>`)
      .join("")}</table>`,
  });
  const channels = [mail];
  if (process.env.MAX_TOKEN) channels.push(sendMax(lead));
  // Заявка принята, если дошла хотя бы в один канал; сбой второго видно в логах функции
  const results = await Promise.allSettled(channels);
  results.forEach((r, i) => r.status === "rejected" && console.error(i ? "max" : "smtp", r.reason && r.reason.message));
  // Состояние каналов в ответе: видно во вкладке «Тестирование», даже если логи недоступны
  const state = (r) => (r.status === "fulfilled" ? "ok" : `ошибка: ${String(r.reason && r.reason.message).slice(0, 200)}`);
  const status = { mail: state(results[0]), max: results[1] ? state(results[1]) : "выключено: нет MAX_TOKEN" };
  if (!results.some((r) => r.status === "fulfilled")) return reply(502, { ok: false, error: "send", ...status }, origin);
  return reply(200, { ok: true, ...status }, origin);
};

module.exports._setTransport = (t) => { transport = t; };
module.exports._setFetch = (f) => { maxFetch = f; };
module.exports._maxText = maxText;
