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

// Отправка в группу MAX: метки, IP, _ym_uid; заявка не теряется, если один из каналов упал
(async () => {
  await new Promise((r) => setTimeout(r, 50));
  process.env.MAX_TOKEN = "token";
  process.env.MAX_CHAT_ID = "-123";
  const posts = [];
  fn._setFetch(async (url, opt) => { posts.push({ url, opt }); return { ok: true, text: async () => "" }; });
  const box = [];
  fn._setTransport({ sendMail: async (m) => { box.push(m); } });
  const lead = { name: "Наталья", contact: "+7 920 825-25-26", source: "Квиз «Аудит рекламы»", request: "Аудит рекламы", project: "Яндекс Директ; до 100 тыс.", page: "https://site.ru/?utm_source=yandex", utm: "?utm_term=none.mobile.Орёл&utm_source=yandex&utm_campaign=mariupol&yclid=55", ym_uid: "1793353291284324861", referrer: "https://yandex.ru/", consent: "2026-10-30T10:00:00Z" };
  let r = await fn.handler({ httpMethod: "POST", headers: { Origin: "https://site.ru" }, requestContext: { identity: { sourceIp: "212.59.107.98" } }, body: JSON.stringify(lead) });
  assert.strictEqual(r.statusCode, 200);
  assert.strictEqual(posts[0].url, "https://platform-api.max.ru/messages?chat_id=-123");
  assert.strictEqual(posts[0].opt.headers.Authorization, "token");
  const text = JSON.parse(posts[0].opt.body).text;
  for (const s of ["Наталья", "+7 920 825-25-26", "IP: 212.59.107.98", "utm_source: yandex", "utm_term: none.mobile.Орёл", "yclid: 55", "_ym_uid: 1793353291284324861", "Яндекс Директ; до 100 тыс."]) assert.ok(text.includes(s), s);
  assert.ok(!text.includes("undefined") && !text.includes("Тариф"), "пустые ответы не выводятся");
  assert.ok(text.indexOf("utm_source") < text.indexOf("utm_campaign") && text.indexOf("utm_campaign") < text.indexOf("utm_term"), "UTM по порядку");
  assert.ok(box[0].text.includes("IP: 212.59.107.98"), "IP и в письме");

  fn._setFetch(async () => ({ ok: false, status: 401, text: async () => "bad token" }));
  r = await fn.handler({ httpMethod: "POST", headers: { Origin: "https://site.ru" }, body: JSON.stringify(lead) });
  assert.strictEqual(r.statusCode, 200, "MAX упал, письмо ушло");
  assert.deepStrictEqual(JSON.parse(r.body), { ok: true, mail: "ok", max: "ошибка: max 401 bad token" }, "ошибка MAX видна в ответе");
  fn._setTransport({ sendMail: async () => { throw new Error("auth"); } });
  fn._setFetch(async () => ({ ok: true, text: async () => "" }));
  r = await fn.handler({ httpMethod: "POST", headers: { Origin: "https://site.ru" }, body: JSON.stringify(lead) });
  assert.strictEqual(r.statusCode, 200, "почта упала, MAX принял");
  fn._setFetch(async () => { throw new Error("net"); });
  r = await fn.handler({ httpMethod: "POST", headers: { Origin: "https://site.ru" }, body: JSON.stringify(lead) });
  assert.strictEqual(r.statusCode, 502, "оба канала упали");
  // Без MAX_CHAT_ID функция сама находит группу бота
  delete process.env.MAX_CHAT_ID;
  fn._setTransport({ sendMail: async () => {} });
  const urls = [];
  fn._setFetch(async (url) => {
    urls.push(url);
    return { ok: true, text: async () => "", json: async () => ({ chats: [{ chat_id: 555, type: "dialog", title: "Личка" }, { chat_id: -777, type: "chat", title: "Ad engine leads" }] }) };
  });
  await fn.handler({ httpMethod: "POST", headers: { Origin: "https://site.ru" }, body: JSON.stringify(lead) });
  await fn.handler({ httpMethod: "POST", headers: { Origin: "https://site.ru" }, body: JSON.stringify(lead) });
  assert.deepStrictEqual(urls, ["https://platform-api.max.ru/chats?count=100", "https://platform-api.max.ru/messages?chat_id=-777", "https://platform-api.max.ru/messages?chat_id=-777"], "группа найдена один раз");
  console.log("Проверки MAX пройдены. Пример сообщения:\n" + text);
})().catch((e) => { console.error(e); process.exit(1); });
