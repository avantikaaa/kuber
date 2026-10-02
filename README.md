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
- A [Neon](https://neon.tech) account (free tier) for the Postgres database
- `psql` client (for running schema/seed files) — `brew install libpq` on macOS
- Expo CLI (mobile only): `npm install -g expo-cli`

### 1. Install dependencies

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Set up the database (Neon)

1. Sign up at [neon.tech](https://neon.tech) and create a new project.
2. Create a database named `finance_tracker` (or use the default Neon creates).
3. From the project dashboard, copy the connection string (**Connection Details** → pick "Pooled connection" for the app, it looks like `postgresql://user:password@ep-xxxx.aws.neon.tech/finance_tracker?sslmode=require`).
4. Apply the schema and seed data using that connection string:

```bash
psql '<your-neon-connection-string>' -f database/schema.sql
psql '<your-neon-connection-string>' -f database/seed.sql
```

### 3. Configure environment

```bash
cd backend
cp .env.example .env
```

Minimum required fields in `.env`:

```
DATABASE_URL=<your-neon-connection-string>
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
