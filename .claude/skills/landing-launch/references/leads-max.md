# Заявки: Yandex Cloud Function → Яндекс Почта + группа MAX

Код и тесты — `server/lead-mail/` (`index.js`, `test.js`, `README.md` с пошаговой настройкой для клиента).

## Как устроено

1. Форма шлёт POST JSON на `CONFIG.formEndpoint` (публичная функция `https://functions.yandexcloud.net/…`).
2. Функция проверяет `Origin` по `ALLOWED_ORIGINS`, обязательные поля (`name`, `contact`, `consent`), берёт IP из `event.requestContext.identity.sourceIp`.
3. Параллельно шлёт письмо (SMTP Яндекса) и сообщение ботом в группу MAX. Заявка принята, если дошла хотя бы в один канал.
4. Ответ функции: `{"ok":true,"mail":"ok","max":"ok"}` или текст ошибки по каждому каналу — так видно проблему без логов.

## Переменные функции

| Ключ | Что это |
|---|---|
| `SMTP_USER`, `SMTP_PASS`, `MAIL_TO` | ящик Яндекса и пароль приложения |
| `ALLOWED_ORIGINS` | адреса сайта через запятую (`https://ad-engine.ru,https://www.ad-engine.ru`) |
| `MAX_TOKEN` | токен бота MAX (business.max.ru → бот → «Интеграция» → «Получить токен») |
| `MAX_CHAT_ID` | номер группы, отрицательное число: из адреса группы в web.max.ru |

Если `MAX_TOKEN` не задан, MAX выключен и работает только почта.

## MAX Bot API (что проверено на практике 30.10.2026)

- База `https://platform-api.max.ru`, токен в заголовке `Authorization: <токен>`.
- Отправка: `POST /messages?chat_id=<id>&disable_link_preview=true`, тело `{"text": "...", "format": "html"}`, текст до ~4000 символов. `disable_link_preview` работает — карточки ссылки нет. Адреса пишем без `https://`.
- `GET /chats` больше нет (404 `method.not.found`). Номер группы — из адреса web.max.ru или из `GET /updates` (поле `message.recipient.chat_id` при `chat_type: "chat"`).
- Бот должен быть в группе администратором.
- Из облачной среды Claude сервера MAX, dev.max.ru и функции Yandex Cloud недоступны (прокси 403) — проверять может только Александр.

## Формат сообщения

Заголовок «Заявка с сайта: <source>», блоки «Контактные данные», «Ответы» (квиз разложен по строкам «Город», «Кто вы»…), «UTM-метки»: IP, `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, остальные параметры (`yclid`), `_ym_uid`, «Пришёл с», «Страница».

## Настройка у клиента (коротко)

1. Бот на business.max.ru, токен.
2. Группа, бот — администратор.
3. В функции: заменить `index.js` кодом из репозитория (raw-ссылка на GitHub), добавить `MAX_TOKEN` и `MAX_CHAT_ID`, «Сохранить изменения». Токен вписывать в переменные, не в код.
4. Проверка во вкладке «Тестирование», входные данные:

```json
{"httpMethod":"POST","headers":{"Origin":"https://ad-engine.ru","Content-Type":"application/json"},"body":"{\"name\":\"Тест\",\"contact\":\"+79000000000\",\"request\":\"Проверка MAX\",\"source\":\"Тест из консоли\",\"utm\":\"?utm_source=test&utm_campaign=check\",\"consent\":\"2026-10-30\"}","isBase64Encoded":false}
```

5. Потом настоящая заявка с сайта по ссылке `?utm_source=test&utm_campaign=check`.

## Частые проблемы

| Симптом | Причина |
|---|---|
| Логи недоступны, «ограниченный режим» | нет платёжного аккаунта в Yandex Cloud; смотреть ответ во «Тестировании» |
| `max: выключено: нет MAX_TOKEN` | переменная не сохранена |
| `max … 401` | неверный токен |
| `max … 403/404` | бот не в группе или неверный `MAX_CHAT_ID` |
| `max chats 404 method.not.found` | старый код функции, обновить `index.js` |
| Ответы без подписи «Кто вы» | на сайте старый `main.js` в кэше: Ctrl+F5 |
| Токен попал в чат | выпустить новый, старые сообщения удалить |

## Автодеплой (не подключён, Александр отложил)

GitHub Actions `yc-actions/yc-sls-function`: сервисный аккаунт с ролями `functions.admin` и `iam.serviceAccounts.user`, авторизованный ключ в секрете `YC_SA_JSON`, пароли и токен в Lockbox (переменные из консоли при деплое не переносятся). Нужны ID каталога и ID секрета Lockbox.
