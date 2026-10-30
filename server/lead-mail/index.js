// Приём заявок с сайта в Yandex Cloud Functions: проверяет заявку и отправляет письмо через SMTP Яндекса.
// Данные не покидают Россию: функция работает в Yandex Cloud, письмо уходит на Яндекс Почту.
// Переменные окружения: SMTP_USER (ящик-отправитель), SMTP_PASS (пароль приложения),
// MAIL_TO (куда слать заявки, по умолчанию SMTP_USER), ALLOWED_ORIGINS (адреса сайта через запятую).
const nodemailer = require("nodemailer");

const LABELS = {
  name: "Имя", contact: "Телефон или Telegram", request: "Что нужно", source: "Откуда заявка",
  plan: "Тариф", project: "Проект", extras: "Дополнительно", urgent: "Срочно", estimate: "Расчёт",
  page: "Страница", utm: "Метки UTM", consent: "Согласие на обработку данных",
};
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
    .filter(([key, v]) => key in LABELS && v !== null && v !== "" && !(Array.isArray(v) && !v.length))
    .map(([key, v]) => {
      if (typeof v === "boolean") v = v ? "да" : "нет";
      if (Array.isArray(v)) v = v.join(", ");
      return [LABELS[key], String(v).slice(0, MAX_LEN)];
    });
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

  const table = rows(lead);
  const about = lead.request || lead.estimate || lead.project || "заявка";
  try {
    await getTransport().sendMail({
      from: `Заявки с сайта <${process.env.SMTP_USER}>`,
      to: process.env.MAIL_TO || process.env.SMTP_USER,
      subject: `Заявка с сайта: ${name.slice(0, 60)}, ${String(about).slice(0, 80)}`,
      text: table.map(([k, v]) => `${k}: ${v}`).join("\n"),
      html: `<table cellpadding="8" style="border-collapse:collapse;font:15px Arial,sans-serif">${table
        .map(([k, v]) => `<tr><td style="border:1px solid #ddd;color:#666">${esc(k)}</td><td style="border:1px solid #ddd"><b>${esc(v)}</b></td></tr>`)
        .join("")}</table>`,
    });
  } catch (err) {
    console.error("smtp", err && err.message);
    return reply(502, { ok: false, error: "mail" }, origin);
  }
  return reply(200, { ok: true }, origin);
};

module.exports._setTransport = (t) => { transport = t; };
