// Kie.ai MCP-коннектор для claude.ai — один файл для Cloudflare Workers.
// Переменные (Settings → Variables and Secrets):
//   KIE_API_KEY — ключ Kie (тип Secret)
//   MCP_SECRET  — любая длинная случайная строка; адрес коннектора: https://<worker>/mcp/<MCP_SECRET>

const KIE = "https://api.kie.ai/api/v1";
const PROTOCOLS = ["2025-06-18", "2025-03-26", "2024-11-05"];
const WAIT_MS = 50000;
const POLL_MS = 4000;

const IMAGE_MODELS = [
  "google/nano-banana",
  "nano-banana-pro",
  "bytedance/seedream-v4-text-to-image",
  "flux-2/pro-text-to-image",
];

const TOOLS = [
  {
    name: "kie_balance",
    description: "Показать остаток кредитов на аккаунте Kie.ai.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "kie_generate_image",
    description:
      "Сгенерировать картинку через Kie.ai. Ждёт до ~50 секунд и возвращает ссылки на готовые файлы. " +
      "Если не успело — возвращает task_id, тогда вызови kie_check_task. " +
      "Если переданы image_urls, google/nano-banana работает в режиме редактирования по этим картинкам.",
    inputSchema: {
      type: "object",
      properties: {
        prompt: { type: "string", description: "Описание картинки (лучше на английском)." },
        model: { type: "string", enum: IMAGE_MODELS, default: "google/nano-banana" },
        aspect_ratio: {
          type: "string",
          description: "Соотношение сторон: 1:1, 16:9, 9:16, 4:3, 3:4, 4:5 и т.п.",
          default: "1:1",
        },
        image_urls: {
          type: "array",
          items: { type: "string" },
          description: "Публичные ссылки на исходные картинки для редактирования (необязательно).",
        },
        extra: {
          type: "object",
          description: "Доп. поля input модели по документации Kie — перекрывают значения по умолчанию.",
        },
      },
      required: ["prompt"],
    },
  },
  {
    name: "kie_generate_video",
    description:
      "Запустить генерацию видео Veo 3 через Kie.ai. Видео делается несколько минут: инструмент сразу " +
      "возвращает task_id, результат забирай через kie_check_task с type=veo. Veo дорогой — уточни у пользователя перед запуском.",
    inputSchema: {
      type: "object",
      properties: {
        prompt: { type: "string", description: "Описание ролика (лучше на английском)." },
        model: { type: "string", enum: ["veo3_fast", "veo3"], default: "veo3_fast" },
        aspect_ratio: { type: "string", enum: ["16:9", "9:16"], default: "16:9" },
        image_url: { type: "string", description: "Картинка-первый кадр (необязательно)." },
      },
      required: ["prompt"],
    },
  },
  {
    name: "kie_create_task",
    description:
      "Универсальный запуск любой модели из каталога Kie Market (Kling, Hailuo, Wan, Seedream, Ideogram и др.) " +
      "с произвольным input по документации docs.kie.ai. Возвращает task_id для kie_check_task.",
    inputSchema: {
      type: "object",
      properties: {
        model: { type: "string", description: "ID модели, например kling/v2-5-turbo-text-to-video-pro" },
        input: { type: "object", description: "Объект input модели, например {\"prompt\": \"...\"}" },
      },
      required: ["model", "input"],
    },
  },
  {
    name: "kie_check_task",
    description: "Проверить статус задачи Kie и получить ссылки на результат.",
    inputSchema: {
      type: "object",
      properties: {
        task_id: { type: "string" },
        type: {
          type: "string",
          enum: ["market", "veo"],
          default: "market",
          description: "veo — для задач из kie_generate_video, market — для всех остальных.",
        },
      },
      required: ["task_id"],
    },
  },
];

class KieError extends Error {}

async function kie(env, method, path, body) {
  const res = await fetch(KIE + path, {
    method,
    headers: { Authorization: `Bearer ${env.KIE_API_KEY}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => null);
  if (!json || json.code !== 200) {
    throw new KieError(`Kie API: ${json?.msg || `HTTP ${res.status}`}`);
  }
  return json.data;
}

function imageInput({ prompt, model, aspect_ratio = "1:1", image_urls, extra }) {
  const input = { prompt };
  if (model === "google/nano-banana") {
    input.image_size = aspect_ratio;
    input.output_format = "png";
    if (image_urls?.length) input.image_urls = image_urls;
  } else if (model === "nano-banana-pro") {
    input.aspect_ratio = aspect_ratio;
    if (image_urls?.length) input.image_input = image_urls;
  } else {
    input.aspect_ratio = aspect_ratio;
    if (image_urls?.length) input.image_urls = image_urls;
  }
  return { ...input, ...extra };
}

async function marketStatus(env, taskId) {
  const d = await kie(env, "GET", `/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`);
  let urls = [];
  if (d.resultJson) {
    try {
      urls = JSON.parse(d.resultJson).resultUrls || [];
    } catch {}
  }
  return { state: d.state, urls, error: d.failMsg || null };
}

async function veoStatus(env, taskId) {
  const d = await kie(env, "GET", `/veo/record-info?taskId=${encodeURIComponent(taskId)}`);
  const states = { 0: "generating", 1: "success", 2: "fail", 3: "fail" };
  return {
    state: states[d.successFlag] ?? "generating",
    urls: d.response?.resultUrls || [],
    error: d.errorMessage || null,
  };
}

function describe(taskId, s) {
  if (s.state === "success") {
    return `Готово (task_id ${taskId}):\n` + s.urls.map((u) => `- ${u}`).join("\n");
  }
  if (s.state === "fail") return `Ошибка генерации (task_id ${taskId}): ${s.error || "без описания"}`;
  return `Ещё в работе, статус: ${s.state}. task_id: ${taskId} — проверь позже через kie_check_task.`;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function callTool(env, name, args = {}) {
  switch (name) {
    case "kie_balance": {
      const credits = await kie(env, "GET", "/chat/credit");
      return `Баланс Kie: ${credits} кредитов.`;
    }
    case "kie_generate_image": {
      let model = args.model || "google/nano-banana";
      const input = imageInput({ ...args, model });
      if (model === "google/nano-banana" && input.image_urls) model = "google/nano-banana-edit";
      const { taskId } = await kie(env, "POST", "/jobs/createTask", { model, input });
      const deadline = Date.now() + WAIT_MS;
      let s = { state: "waiting" };
      while (Date.now() < deadline) {
        await sleep(POLL_MS);
        s = await marketStatus(env, taskId);
        if (s.state === "success" || s.state === "fail") break;
      }
      return describe(taskId, s);
    }
    case "kie_generate_video": {
      const body = {
        prompt: args.prompt,
        model: args.model || "veo3_fast",
        aspectRatio: args.aspect_ratio || "16:9",
      };
      if (args.image_url) body.imageUrls = [args.image_url];
      const { taskId } = await kie(env, "POST", "/veo/generate", body);
      return `Видео запущено. task_id: ${taskId}. Через 2–5 минут проверь kie_check_task с type=veo.`;
    }
    case "kie_create_task": {
      const { taskId } = await kie(env, "POST", "/jobs/createTask", { model: args.model, input: args.input });
      return `Задача создана. task_id: ${taskId}. Проверь результат через kie_check_task.`;
    }
    case "kie_check_task": {
      const s = args.type === "veo" ? await veoStatus(env, args.task_id) : await marketStatus(env, args.task_id);
      return describe(args.task_id, s);
    }
    default:
      throw new KieError(`Неизвестный инструмент: ${name}`);
  }
}

async function handleRpc(env, msg) {
  const { id, method, params } = msg;
  const ok = (result) => ({ jsonrpc: "2.0", id, result });

  switch (method) {
    case "initialize": {
      const asked = params?.protocolVersion;
      return ok({
        protocolVersion: PROTOCOLS.includes(asked) ? asked : PROTOCOLS[0],
        capabilities: { tools: {} },
        serverInfo: { name: "kie-ai", version: "1.0.0" },
      });
    }
    case "ping":
      return ok({});
    case "tools/list":
      return ok({ tools: TOOLS });
    case "tools/call":
      try {
        const text = await callTool(env, params?.name, params?.arguments);
        return ok({ content: [{ type: "text", text }] });
      } catch (e) {
        return ok({ content: [{ type: "text", text: String(e.message || e) }], isError: true });
      }
    default:
      if (id === undefined) return null; // уведомление — ответ не нужен
      return { jsonrpc: "2.0", id, error: { code: -32601, message: `Method not found: ${method}` } };
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!env.MCP_SECRET || !env.KIE_API_KEY) {
      return new Response("Не заданы переменные KIE_API_KEY и MCP_SECRET", { status: 500 });
    }
    if (url.pathname !== `/mcp/${env.MCP_SECRET}`) return new Response("Not found", { status: 404 });
    if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });

    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }, { status: 400 });
    }

    const replies = (await Promise.all((Array.isArray(body) ? body : [body]).map((m) => handleRpc(env, m)))).filter(Boolean);
    if (!replies.length) return new Response(null, { status: 202 });
    return Response.json(Array.isArray(body) ? replies : replies[0]);
  },
};
