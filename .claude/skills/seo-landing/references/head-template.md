# Шаблон <head> продающей страницы

```html
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="yandex-verification" content="…">   <!-- только на главной -->
<title>Главный запрос: уточнение — Бренд</title>
<meta name="description" content="Оффер, цифры, площадки — 140–170 символов.">
<link rel="canonical" href="https://домен/путь/">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="author" content="Имя Фамилия">
<meta name="theme-color" content="#ffffff">
<meta property="og:site_name" content="Бренд">
<meta property="og:locale" content="ru_RU">
<meta property="og:type" content="website">
<meta property="og:url" content="https://домен/путь/">
<meta property="og:title" content="…">
<meta property="og:description" content="…">
<meta property="og:image" content="https://домен/assets/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="…">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="…">
<meta name="twitter:description" content="…">
<meta name="twitter:image" content="https://домен/assets/og-image.png">
```

JSON-LD — в конце `<head>`, массив из двух объектов. FAQPage заполняет `scripts/faq_jsonld.py`.

```html
<script type="application/ld+json">
[
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://домен/#org",
    "name": "Бренд",
    "url": "https://домен/",
    "description": "Что делаем, для кого, на каких площадках.",
    "image": "https://домен/assets/og-image.png",
    "logo": "https://домен/assets/logo.png",
    "telephone": "+7-XXX-XXX-XX-XX",
    "priceRange": "от 25 000 ₽",
    "areaServed": "RU",
    "founder": {"@type": "Person", "name": "Имя Фамилия", "image": "https://домен/assets/founder.webp"},
    "sameAs": ["https://t.me/канал", "https://rutube.ru/channel/…", "https://vk.com/…"]
  },
  {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": []}
]
</script>
```

Для второй страницы того же владельца (отдельный продукт на подпапке) — свой `@id` и `"parentOrganization": {"@id": "https://домен/#org"}`.
