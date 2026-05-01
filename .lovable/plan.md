
# Аудит стилей и план фиксов

После аудита нашёл 4 группы расхождений с целевой дизайн-системой (минималистичные карточки без обводок, скруглённые «soft-fill» бейджи, дроверы со скруглением слева).

## Что не так сейчас

### 1. Базовый `Sheet` (фундамент всех дроверов) — нет общего скругления
`src/components/ui/sheet.tsx` задаёт `border-l` для side="right" и не имеет `rounded-l-2xl` по умолчанию. Каждый компонент проставляет `rounded-l-2xl border-0` руками — где забыли, там прямые углы и серая обводка слева. Кроме того, у side="right" жёсткий `sm:max-w-sm` (384px) перебивает наш `sm:max-w-[640px]` в некоторых браузерах из-за порядка классов.

### 2. Чипы и бейджи остались с `border`
- `src/components/ui/badge.tsx` — базовый компонент всё ещё начинается с `border` и `font-semibold` (мы договаривались на `border-0` + `font-medium`).
- `src/components/oprisk/FocusCases.tsx` (стр. 85) — «причина в фокусе» нарисована как `rounded-md border px-3 py-1.5 ... uppercase tracking-wide font-bold`. Это самый заметный «старый» бейдж: квадратные углы, обводка, капс, жирный — всё против новой системы.

### 3. Внутренние «секции» и списки в дроверах обведены рамкой
В референсе внутри дровера используются soft-fill блоки без рамок. У нас:
- `LimitCards.tsx`: hero-блок с большой цифрой (`border border-border bg-secondary/40`), контейнеры графиков (`border border-border bg-card`), таблица инцидентов, factor-карточки.
- `ContributionWidget.tsx`: переключатель «По сценариям/По рискам», строки инцидентов в дровере.
- `AttentionZone.tsx`: hint-плашка под метриками, блок «Разбивка», строки «что попадает в эту цифру», CTA-кнопка, пустое состояние.
- `RiskHeatmap.tsx`: hint-область, строки рисков в дровере, CTA-кнопка.
- `AISummary.tsx`: рамка `border-primary/15` вокруг AI-карточки и `border-primary/10` у inner-tile (по референсу AI-блок — gradient-fill без обводок).

### 4. Мелочи
- `FocusCases.tsx`: разделитель `border-t border-border` внутри карточки — лучше заменить на отступ + тонкий `divide-y` или мягкий фон, чтобы убрать «коробочный» вид.
- `TopBar.tsx`: `border-b border-border` под шапкой — допустимо (это структурный divider), оставляем.
- `RiskHeatmap.tsx`: пустые ячейки — `border border-dashed` оставляем (это семантика «нет данных», а не декор).

## План правок

### A. Сделать скругление и `border-0` дефолтом для `Sheet`
В `src/components/ui/sheet.tsx`:
- side="right": убрать `border-l`, убрать `sm:max-w-sm`, добавить `rounded-l-2xl`.
- side="left": симметрично — `rounded-r-2xl`, без `border-r`.
- Тогда во всех экранных компонентах можно убрать дублирующие `rounded-l-2xl border-0` (оставить только ширину `sm:max-w-[640px]` и внутренний padding).

### B. Базовый `Badge` без обводки
В `src/components/ui/badge.tsx`:
- Убрать `border` из общих классов, сделать `font-medium` вместо `font-semibold`, варианты `default/secondary/destructive` оставить с `border-transparent` → станут чистыми pill-фиксами.

### C. Перерисовать «reason»-бейдж в `FocusCases.tsx`
Заменить `rounded-md border ... uppercase font-bold` на `rounded-full ... font-medium normal-case` + `border-0`. Стили в `reasonStyles` оставляем по цвету (soft-fill уже правильный), просто без рамки и без капса.
А разделитель `border-t border-border` поменять на отступ `mt-5 pt-4` без линии (контраст уже даёт фон карточки).

### D. Убрать обводки внутри дроверов
Во всех четырёх компонентах (`LimitCards`, `ContributionWidget`, `AttentionZone`, `RiskHeatmap`):
- Контейнеры с `rounded-xl border border-border bg-secondary/40` → `rounded-xl bg-secondary/60` (без border).
- Контейнеры с `rounded-xl border border-border bg-card` (графики, факторы) → `rounded-xl bg-secondary/40` (мягкая подложка вместо «карточки в карточке»).
- Списки `border border-border bg-card` → `bg-card` + `divide-y divide-border` для разделения строк, без внешней рамки.
- Кнопки CTA `border border-border bg-card` → перевести на `Button variant="outline"` или сделать solid-secondary без border (`bg-secondary hover:bg-secondary/80`).
- Pill-переключатель в `ContributionWidget` (`border border-border bg-secondary/60 p-0.5`) → `bg-secondary p-1 rounded-full` (как сегментированный контрол в iOS).

### E. AI-карточка
В `AISummary.tsx` убрать `border border-primary/15` у внешнего блока и `border border-primary/10` у inner-tile — gradient-fill + лёгкая тень `shadow-ai` уже дают достаточный контраст.

### F. Heatmap hint
В `RiskHeatmap.tsx` строка `rounded-xl border border-border bg-secondary/40` → `rounded-xl bg-secondary/60` без рамки.

## Технические детали

Файлы под правку:
- `src/components/ui/sheet.tsx`
- `src/components/ui/badge.tsx`
- `src/components/oprisk/FocusCases.tsx`
- `src/components/oprisk/AISummary.tsx`
- `src/components/oprisk/LimitCards.tsx`
- `src/components/oprisk/ContributionWidget.tsx`
- `src/components/oprisk/AttentionZone.tsx`
- `src/components/oprisk/RiskHeatmap.tsx`

После правок дополнительно `rg "border border-border" src/components/oprisk` чтобы убедиться, что декоративных рамок не осталось (структурные dividers в шапке/между секциями страницы оставляем).

Подтверди — переключаюсь в build mode и применяю.
