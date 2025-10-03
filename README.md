# Account Manager — форма учётных записей (Vue 3 + TS + Pinia + Element Plus)

Реализация тестового задания: форма управления учётными записями с добавлением/удалением, валидацией и сохранением состояния между перезагрузками.

---

## ✨ Стек

- **Vue 3** + **Composition API**
- **TypeScript**
- **Pinia** (+ `pinia-plugin-persistedstate` для `localStorage`)
- **Element Plus** (UI)
- **Vite** (dev/build)
- **Vitest** (юнит-тесты)

---

## 🚀 Быстрый старт

```bash
npm i
npm run dev
```

Открой приложение: http://localhost:5173

---

## 🏗️ Сборка и предпросмотр

```bash
npm run build
npm run preview
```

---

## 🧪 Тесты

```bash
npm run test       
npm run test:watch 
npm run test:ui    
```
---

## 🧱 Архитектура / структура

```
src/
  components/
    AccountList.vue      # список записей
    AccountItem.vue      # один ряд формы
  stores/
    accounts.ts          # Pinia store: addEmpty, upsert, remove; persist
  lib/
    label.ts             # парсер меток "a; b;; c" -> [{text:'a'}, ...]
    validation.ts        # лимиты: MAX_LABEL / MAX_LOGIN / MAX_PASSWORD
    label.test.ts        # тест: парсер меток
  App.vue                # шапка, подсказка, кнопка + список
  main.ts                # регистрация Pinia, Element Plus, persist
  types.ts               # типы Account / AccountDraft
  env.d.ts               # типы для .vue и Vite
  auto-imports.d.ts      # (генерируется) типы авто-импортов
  components.d.ts        # (генерируется) типы авто-компонентов
```

`auto-imports.d.ts` и `components.d.ts` генерируются плагинами и закоммичены, чтобы типы работали в IDE/CI сразу.

---

## 🔎 Ключевая логика

**Добавить** — `store.addEmpty()` создаёт пустую запись.

**Сохранить/обновить** — из `AccountItem.vue` при `blur/change` → `validateAndSave()` → `emit('save')` → `store.upsert()`:
- парсинг `rawLabel` → `labels: { text: string }[]`,
- при `LDAP` → `password: null`,
- обновление/вставка в массив.

**Удалить** — `store.remove(id)`.

**Персист** — `pinia-plugin-persistedstate` хранит `items` в `localStorage`.

---

## 🧪 Покрытие тестами

- `src/lib/label.test.ts` — парсинг меток: тримминг, фильтр пустых, разделение по `;`.
- `src/stores/accounts.test.ts` — бизнес-правила стора:
  - добавление/удаление,
  - `upsert` для LDAP: пароль `null`, метки распарсены.

> Alias `@ -> src` настроен в `vitest.config.ts`, чтобы тесты понимали пути вида `@/lib/*`.

---

## 🖥️ UI/UX

- Компактная строка формы: лейблы сверху, размер `small`, сетка на 24 колонки.
- Колонки фиксированы — меняется только ширина «Логина» при LDAP (пароль скрыт, `span=0`), ряд не «прыгает».
- Инпут пароля — с иконкой «глаз» (`show-password`).
- Поля поддерживают `clearable` и `show-word-limit`.

---

## ⚙️ Скрипты (`package.json`)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

---

## 📦 Требования окружения

- Node.js 18+ (рекомендуется 18 LTS / 20)
- npm 9+

