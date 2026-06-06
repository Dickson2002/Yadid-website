# Vault Literary Archive

A full-stack literary archive for the poet **Mbithe Jeddie**. Features a public-facing archive with a private admin dashboard for managing poems, collections, analytics, and subscribers.

## Tech Stack

**Backend** — `server/`
- Python 3.12, FastAPI, SQLAlchemy 2.0 (async), Alembic
- PostgreSQL (production), aiosqlite (tests)
- Custom JWT auth with access + refresh token rotation
- bcrypt password hashing

**Frontend** — `services/web/`
- React 18, TypeScript, Vite, Tailwind CSS v3
- React Router v6, TanStack Query, Zustand + persist

**Infrastructure**
- Docker Compose: Postgres 16 + API server
- Dockerfile with multi-stage build

## Quick Start

### Backend (Docker)

```bash
cd server
cp .env .env.local        # edit JWT_SECRET for production
docker compose up -d       # starts Postgres (5433) + API (8000)
```

The seed script runs automatically on container start, creating the admin user.

### Backend (local dev)

```bash
cd server
python -m venv .venv && source .venv/bin/activate
pip install -e .
uvicorn app.main:app --reload
```

### Frontend

```bash
cd services/web
npm install
npm run dev               # → http://localhost:5173
```

### Admin Login

Navigate to `/admin/login` and authenticate with the credentials in `server/.env` (default: `admin` / `vault-admin`).

## Project Structure

```
server/
├── alembic/               # Database migrations
├── app/
│   ├── models/            # SQLAlchemy models
│   │   ├── poem.py        # Poem, PoemCategory, PoemStatus enums
│   │   ├── collection.py  # Collection with poem association
│   │   ├── admin.py       # Admin user
│   │   ├── activity.py    # Activity log
│   │   ├── poem_view.py   # IP-deduped view tracking
│   │   ├── refresh_token  # Hashed refresh tokens
│   │   └── subscriber.py  # Newsletter subscribers
│   ├── routers/           # API route handlers
│   ├── schemas/           # Pydantic request/response models
│   ├── services/          # Business logic layer
│   ├── config.py          # Pydantic settings (from .env)
│   ├── database.py        # Async engine + session
│   ├── main.py            # FastAPI app + middleware
│   └── seed.py            # Admin-only seed script
├── tests/                 # Async pytest suite
├── Dockerfile
└── docker-compose.yml

services/web/
├── src/
│   ├── components/        # Shared UI, layout, feature components
│   ├── features/          # Feature-specific components
│   ├── hooks/             # React hooks + TanStack Query wrappers
│   ├── lib/
│   │   ├── api/           # API client + typed endpoints
│   │   ├── auth-store.ts  # Zustand auth state + persistence
│   │   └── cn.ts          # clsx + tailwind-merge utility
│   ├── pages/             # Route-level page components
│   │   ├── public/        # Home, Archive, Poem, About, 404
│   │   └── admin/         # Dashboard, Analytics, Manuscripts,
│   │                      # Collections, Editor, Settings, Login
│   ├── routes/            # React Router config
│   └── styles/            # Global CSS + Tailwind layers
├── tailwind.config.ts     # Design token mapping
└── vite.config.ts
```

## API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | — | Health check |
| GET | `/api/poems` | — | List published poems |
| GET | `/api/poems/{slug}` | — | Get poem by slug |
| POST | `/api/poems/{slug}/view` | — | Record poem view (24h IP dedup) |
| GET | `/api/collections` | — | List collections |
| GET | `/api/collections/{slug}` | — | Get collection with poems |
| POST | `/api/subscribe` | — | Subscribe to newsletter |
| POST | `/api/admin/login` | — | Login, returns access + refresh tokens |
| POST | `/api/admin/refresh` | — | Rotate refresh token |
| POST | `/api/admin/logout` | Admin | Revoke refresh token |
| GET | `/api/admin/me` | Admin | Current admin profile |
| POST | `/api/poems` | Admin | Create poem |
| PUT | `/api/poems/{slug}` | Admin | Update poem |
| DELETE | `/api/poems/{slug}` | Admin | Delete poem |
| POST | `/api/collections` | Admin | Create collection |
| PUT | `/api/collections/{slug}` | Admin | Update collection |
| DELETE | `/api/collections/{slug}` | Admin | Delete collection |
| GET | `/api/analytics/dashboard` | Admin | Dashboard stats |
| GET | `/api/analytics/growth` | Admin | Growth chart data |
| GET | `/api/analytics/activity` | Admin | Activity log |
| GET | `/api/analytics/export` | Admin | Export ledger (CSV default, JSON via `?format=json`) |
| GET | `/api/subscribe` | Admin | List subscribers |
| POST | `/api/admin/reset` | Admin | Wipe all archive data |

## Database Models

- **Poem** — title, slug (unique), content, excerpt, status (draft/published/archived), category, collection FK, timestamps
- **Collection** — name, slug (unique), description, cover image, sort order, timestamps
- **Admin** — username, hashed password, display name, email
- **ActivityLog** — admin FK, action, target type, target ID, timestamp
- **PoemView** — poem FK, viewer IP, timestamp (unique per IP + poem within 24h)
- **RefreshToken** — admin FK, hashed token, expires at, revoked flag
- **Subscriber** — email (unique), subscribed at

## Auth Flow

1. `POST /api/admin/login` returns `access_token` (30 min) and `refresh_token` (30 days)
2. Access token sent as `Authorization: Bearer <token>` header
3. On 401, frontend intercepts and calls `POST /api/admin/refresh` with the refresh token
4. Old refresh token is revoked (DB-hashed), new pair is issued
5. If refresh fails, user is redirected to login

## Tests

```bash
# Backend
cd server
pip install -e .
pytest                     # async, uses aiosqlite

# Frontend
cd services/web
npm test                   # vitest run
npm run lint               # tsc --noEmit
```

## Configuration

Backend settings via `server/.env`:

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql+asyncpg://vault:vault@localhost:5432/vault` | Production database |
| `JWT_SECRET` | `change-me-in-production-use-a-...` | Signing key (change before deployment) |
| `JWT_ALGORITHM` | `HS256` | JWT signing algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` | Access token TTL |
| `REFRESH_TOKEN_EXPIRE_DAYS` | `30` | Refresh token TTL |
| `ADMIN_USERNAME` | `admin` | Admin login username |
| `ADMIN_PASSWORD` | `vault-admin` | Admin login password |

Frontend API URL defaults to `http://localhost:8000/api` via `client.ts`.

## License

Private — all rights reserved.
