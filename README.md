# OLX Web

Веб-приложение на Next.js с TypeScript, Zustand и Tailwind CSS.

## Технологии

- **Next.js 15** - React фреймворк для продакшена
- **TypeScript** - типизированный JavaScript
- **Zustand** - легковесное управление состоянием
- **Tailwind CSS** - utility-first CSS фреймворк

## Установка

```bash
npm install
```

## Запуск

Запуск в режиме разработки:

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Сборка

Создание production сборки:

```bash
npm run build
```

Запуск production сервера:

```bash
npm start
```

## Структура проекта

```
olxweb/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # Корневой layout
│   │   ├── page.tsx      # Главная страница
│   │   └── globals.css   # Глобальные стили с Tailwind
│   └── store/            # Zustand stores
│       └── useStore.ts   # Пример store
├── public/               # Статические файлы
├── next.config.ts        # Конфигурация Next.js
├── tailwind.config.ts    # Конфигурация Tailwind CSS
└── tsconfig.json         # Конфигурация TypeScript
```

## Использование Zustand

Пример использования store находится в `src/store/useStore.ts`. Вы можете создать дополнительные stores для различных частей приложения.
