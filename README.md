# Finance Tracker

Email-based finance tracking app. Automatically extracts transactions from bank emails using text analysis (no AI/ML) and provides spending analytics.

## Stack

| Layer | Technology |
|---|---|
| Backend | Node.js / Express / TypeScript |
| Database | PostgreSQL |
| Auth | JWT + OAuth2 |
| Frontend (web) | React + Vite + Chakra UI |
| Frontend (mobile) | React Native + Expo |
| State | Zustand + React Query |
| Charts | Recharts (web) / React Native Charts (mobile) |

## Project Structure

```
kuber/
├── backend/          # Express API
│   ├── src/
│   │   ├── services/ # EmailParser, CategorySuggester
│   │   ├── routes/   # API route handlers
│   │   └── utils/    # email-patterns, validators, db
│   └── .env.example
├── frontend/         # React Native + React Web monorepo
│   ├── src/
│   ├── web/          # Vite entry point
│   └── mobile/       # Expo config
├── database/
│   ├── schema.sql
│   └── seed.sql
└── docs/
    ├── wireframes.md
    ├── colourscheme
    └── planning/     # Implementation history & phase summaries
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- Expo CLI (mobile only): `npm install -g expo-cli`

### 1. Install dependencies

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Set up the database

```bash
createdb finance_tracker
psql finance_tracker < database/schema.sql
psql finance_tracker < database/seed.sql
```

### 3. Configure environment

```bash
cd backend
cp .env.example .env
```

Minimum required fields in `.env`:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=finance_tracker
DB_USER=<your postgres user>
DB_PASSWORD=<your postgres password>
JWT_SECRET=<any random string>
```

OAuth credentials (`GMAIL_CLIENT_ID`, etc.) are only needed for email sync.

### 4. Start

**Backend** (port 3000):
```bash
cd backend && npm run dev
```

**Web frontend** (port 3001):
```bash
cd frontend && npm run web:dev
```

**Mobile** (Expo):
```bash
cd frontend && npm run mobile:start
# Press i → iOS simulator, a → Android emulator, or scan QR with Expo Go
```

## API

| Resource | Endpoints |
|---|---|
| Auth | `POST /api/auth/signup` · `POST /api/auth/login` · `POST /api/auth/logout` |
| Transactions | `GET/POST /api/transactions` · `GET/PUT/DELETE /api/transactions/:id` |
| Categories | `GET/POST /api/categories` · `GET /api/categories/:id/subcategories` |
| Email accounts | `GET/POST /api/email-accounts` · `POST /api/email-accounts/:id/sync` |
| Analytics | `GET /api/analytics/spending-trends` · `GET /api/email-suggestions` |

## License

MIT
