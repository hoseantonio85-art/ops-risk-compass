## Перенос hint-а под заголовок + AI-стилизация в карточках «Зона внимания»

Файл: `src/components/oprisk/AttentionZone.tsx`.

**1. Перенос подсказки**
- Удалить блок `{card.hint && (...)}` после списка метрик (строки 255–259).
- Вставить его сразу после шапки карточки (после `</div>` на строке 232), перед `<div className="mt-6 flex-1 space-y-3">`.
- У контейнера метрик заменить `mt-6` на `mt-4` для аккуратного ритма.

**2. AI-оформление подсказки**
Сделать hint визуально «AI-сообщением»:
- Импортировать иконку `Sparkles` из `lucide-react` (она уже используется в `AISummary` — единый язык).
- Контейнер: `flex items-start gap-2`, мягкий AI-фон через существующий токен `bg-gradient-ai-soft` (используется в AISummary), скругление `rounded-xl`, паддинги `px-3 py-2.5`.
- Слева — маленький бейдж-иконка: квадрат `h-6 w-6 rounded-lg bg-gradient-ai` с белой иконкой `Sparkles` (`h-3.5 w-3.5 text-primary-foreground`).
- Текст: `text-xs leading-relaxed text-foreground/80`. Над текстом — мини-лейбл `AI` (`text-[10px] font-semibold uppercase tracking-wider text-primary`), затем сама подсказка.
- Никаких новых цветов: используем только существующие токены (`--gradient-ai`, `--gradient-ai-soft`, `--primary`, `--primary-foreground`, `--foreground`).

Других файлов и логики не трогаем.
