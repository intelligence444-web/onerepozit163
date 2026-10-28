// Проверка функции без настоящей отправки: письмо собирается транспортом nodemailer в JSON
const assert = require("assert");
const nodemailer = require("nodemailer");
const fn = require("./index");

process.env.SMTP_USER = "box@yandex.ru";
process.env.MAIL_TO = "box@yandex.ru";
process.env.ALLOWED_ORIGINS = "https://site.ru,https://intelligence444-web.github.io";
const sent = [];
const json = nodemailer.createTransport({ jsonTransport: true });
fn._setTransport({ sendMail: async (m) => { sent.push(m); return json.sendMail(m); } });

const call = (body, origin = "https://site.ru", method = "POST") =>
  fn.handler({ httpMethod: method, headers: { Origin: origin }, body: typeof body === "string" ? body : JSON.stringify(body) });

(async () => {
  const lead = { name: "Иван <script>", contact: "+7 (900) 123-45-67", request: "Лендинг и реклама", source: "Попап «Обсудить сайт и рекламу»", extras: ["Квиз", "Аналитика"], urgent: true, page: "https://site.ru/", utm: "", consent: "2026-10-28T10:00:00Z", hacker: "x" };

  let r = await call(lead);
  assert.strictEqual(r.statusCode, 200);
  assert.strictEqual(r.headers["Access-Control-Allow-Origin"], "https://site.ru");
  const m = sent[0];
  assert.match(m.subject, /^Заявка с сайта: Иван <script>, Лендинг и реклама$/);
  assert.ok(m.html.includes("Иван &lt;script&gt;"), "HTML экранирован");
  assert.ok(m.text.includes("Дополнительно: Квиз, Аналитика") && m.text.includes("Срочно: да"));
  assert.ok(!m.text.includes("hacker") && !m.text.includes("Метки UTM"), "лишние и пустые поля не попадают в письмо");

  r = await call(lead, "https://evil.ru");
  assert.strictEqual(r.statusCode, 403, "чужой сайт");
  r = await call({}, "https://site.ru", "OPTIONS");
  assert.strictEqual(r.statusCode, 204);
  assert.strictEqual(r.headers["Access-Control-Allow-Methods"], "POST, OPTIONS");
  r = await call({ name: "Иван", contact: "+7" });
  assert.strictEqual(r.statusCode, 400, "без согласия");
  r = await call("{oops");
  assert.strictEqual(r.statusCode, 400, "битый JSON");
  r = await fn.handler({ httpMethod: "POST", headers: { origin: "https://site.ru" }, isBase64Encoded: true, body: Buffer.from(JSON.stringify(lead)).toString("base64") });
  assert.strictEqual(r.statusCode, 200, "тело в base64");

  fn._setTransport({ sendMail: async () => { throw new Error("auth"); } });
  r = await call(lead);
  assert.strictEqual(r.statusCode, 502, "почта не приняла письмо");
  console.log("Все проверки пройдены:", sent.length, "письма собрано");
})().catch((e) => { console.error(e); process.exit(1); });
