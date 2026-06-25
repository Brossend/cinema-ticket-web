# Cinema-ticket-web

Frontend для тестового задания Fullstack-разработчика. Приложение показывает будущие киносеансы, позволяет временно забронировать место, оплатить билет и автоматически освобождает место при отмене или истечении срока брони.

Backend-репозиторий реализован отдельно на Laravel и предоставляет REST API.

## Возможности

- загрузка списка будущих киносеансов из API
- отображение общего и доступного количества мест
- обновление списка каждые 10 секунд
- создание временной брони **до** открытия формы оплаты
- блокировка повторного создания брони во время запроса
- обратный отсчёт до истечения временной брони
- валидация имени и email через React Hook Form и Zod
- имитация оплаты через API
- отмена временной брони при закрытии модального окна
- обновление доступных мест после создания, отмены и оплаты брони
- обработка ошибок API, включая `409 Conflict` и Laravel validation errors `422`
- адаптивный интерфейс с прокруткой только внутри списка сеансов

## Стек

- Next.js
- React
- TypeScript
- SCSS Modules
- TanStack Query
- React Hook Form
- Zod

## Запуск

### Требования

- Node.js 20+
- npm
- запущенный backend Cinema Ticket API

### Установка зависимостей

```bash
npm install
```

### Переменные окружения

Создайте файл `.env.local` в корне проекта:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

Шаблон также находится в `.env.example`.

### Запуск в development-режиме

```bash
npm run dev
```

Приложение будет доступно по адресу:

```text
http://localhost:3000
```

### Production-сборка

```bash
npm run build
npm run start
```

### Проверка линтером

```bash
npm run lint
```

## Пользовательский сценарий

```text
Пользователь нажимает "Оформить билет"
↓
POST /screenings/{screeningId}/reservations
↓
Backend атомарно проверяет доступность места и создаёт временную бронь
↓
Frontend сохраняет id, токен и expiresAt только в React state
↓
Открывается модальное окно с формой и обратным отсчётом
↓
Пользователь оплачивает билет или закрывает модальное окно
↓
POST /reservations/{reservationId}/pay
или
DELETE /reservations/{reservationId}
↓
TanStack Query обновляет список сеансов
```

Если пользователь просто закроет вкладку, запрос отмены может не успеть уйти. Это допустимо: backend автоматически перестанет учитывать временную бронь после `expiresAt`.

## API-интеграция

Базовый URL задаётся через `NEXT_PUBLIC_API_URL`.

### Получение сеансов

```http
GET /screenings
Accept: application/json
```

Ответ:

```json
[
  {
    "id": 1,
    "title": "Интерстеллар",
    "startsAt": "2026-06-26T14:00:00Z",
    "totalSeats": 10,
    "availableSeats": 7
  }
]
```

`availableSeats` уже учитывает оплаченные и активные временные брони.

### Создание временной брони

```http
POST /screenings/{screeningId}/reservations
Accept: application/json
```

Ответ `201 Created`:

```json
{
  "id": "56f96ec8-8bd9-41dc-9c34-a785dfdb9f6e",
  "reservationToken": "secret-token",
  "expiresAt": "2026-06-26T14:02:00Z"
}
```

Модальное окно открывается только после успешного ответа `201`.

### Оплата брони

```http
POST /reservations/{reservationId}/pay
Accept: application/json
Content-Type: application/json
X-Reservation-Token: {reservationToken}
```

```json
{
  "name": "Иван Иванов",
  "email": "ivan@example.com"
}
```

После успешной оплаты бронь не отменяется через `DELETE`.

### Отмена брони

```http
DELETE /reservations/{reservationId}
Accept: application/json
X-Reservation-Token: {reservationToken}
```

Отправляется при обычном закрытии модального окна до успешной оплаты.

## Архитектура

Проект использует адаптированный Feature-Sliced Design.

```text
src/
├── app/        # Next App Router, root layout, провайдеры, глобальные стили
├── views/      # композиция экранов
├── widgets/    # крупные блоки интерфейса
├── features/   # пользовательские сценарии
├── entities/   # доменные модели и UI сущностей
└── shared/     # общий UI-kit, HTTP-клиент, конфигурация
```

### Слои

| Слой | Ответственность |
| --- | --- |
| `app` | Next.js routing, глобальные стили, Query Provider |
| `views` | Экран киносеансов и его композиция |
| `widgets` | Список киносеансов и orchestration UI-состояния |
| `features` | Создание, оплата и отмена временной брони |
| `entities` | Модель киносеанса, типы брони, карточка киносеанса |
| `shared` | Button, Input, Modal, HTTP-клиент, обработка ошибок, env-конфигурация |

Зависимости направлены сверху вниз:

```text
app
↓
views
↓
widgets
↓
features
↓
entities
↓
shared
```

Нижние слои не импортируют верхние.

## Работа с состоянием

### Server state

TanStack Query используется для данных backend API:

- список сеансов
- статусы запросов
- кэш и повторная загрузка
- обновление списка через `invalidateQueries`

Список сеансов обновляется:

- каждые 10 секунд через polling
- после создания временной брони
- после отмены брони
- после оплаты
- после истечения таймера

### Локальное UI-состояние

React state хранит:

- выбранный киносеанс
- активную бронь
- признак успешной оплаты
- признак истечения брони
- локальные сообщения об ошибках

`reservationToken` хранится только в памяти браузера, пока открыта модалка. Он не передаётся через URL и не сохраняется в `localStorage`.

## Форматирование даты

Backend возвращает даты в ISO 8601 и UTC. Frontend создаёт объект через `new Date(startsAt)` и форматирует его через `Intl.DateTimeFormat`, поэтому пользователь видит время в локальном часовом поясе браузера.

## Обработка ошибок

HTTP-клиент приводит ошибки Laravel к единому классу `ApiError`.

Поддерживаются:

- `422` - ошибки валидации полей формы
- `403` - токен не соответствует брони
- `404` - сеанс или бронь не найдены
- `409` - мест нет, сеанс уже начался или срок брони истёк
- сетевые и неизвестные ошибки с fallback-сообщением

Ошибки `422` для `name` и `email` выводятся под соответствующими полями формы.

## Основные файлы

```text
src/shared/api/http-client.ts
    Базовый HTTP-клиент и единый формат ошибок

src/entities/screening/model/use-screenings-query.ts
    Query списка киносеансов

src/features/create-reservation/api
    Запросы на создание, оплату и отмену брони

src/features/create-reservation/model
    Mutation hooks, Zod-схема формы, таймер брони

src/widgets/screenings-list/ui/screenings-list.tsx
    Координация полного booking-flow
```
