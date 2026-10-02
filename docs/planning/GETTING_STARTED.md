# Getting Started

## Project Overview

Finance Tracker is a cross-platform finance tracking app that automatically extracts transactions from bank emails using text analysis (no AI/ML).

**What's Built**: Phase 0 (Infrastructure & Scaffolding)
- Backend services (EmailParser, CategorySuggester, TransactionService)
- Database schema (8 tables)
- Frontend setup (React Native + React Web, Zustand, Chakra UI)
- Design system (wireframes, color scheme, responsive specs)

## Directory Structure

```
kuber/
├── backend/              # Node.js/Express API
├── frontend/             # React Native + React Web
├── database/             # SQL schemas
├── docs/                 # Design docs (wireframes, colors)
├── drawing_board/        # Initial planning (archived)
├── README.md             # Main documentation
├── BUILD_SUMMARY.md      # What's been built
├── IMPLEMENTATION.md     # 127-item checklist for next phases
└── GETTING_STARTED.md    # This file
```

## Quick Start

### 1. Install Dependencies

```bash
# Root workspace
npm install

# Backend
cd backend && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..
```

### 2. Setup Database

```bash
# Create PostgreSQL database
createdb finance_tracker

# Load schema
psql finance_tracker < database/schema.sql

# Seed default data
psql finance_tracker < database/seed.sql
```

### 3. Configure Backend

```bash
cd backend
cp .env.example .env

# Edit .env with:
# - DB credentials
# - JWT secret
# - OAuth2 credentials (Gmail, Outlook, iCloud)
```

### 4. Start Development

**Backend + Web (concurrent)**:
```bash
npm run dev
# Backend: http://localhost:3000
# Web: http://localhost:3001
```

**Mobile Only**:
```bash
cd frontend
npm run mobile:start
# Scan QR code with Expo app
```

## Next Phase: Authentication (Phase 1)

See **IMPLEMENTATION.md** for detailed checklist.

### Quick Overview:
1. **Backend** (1 day): JWT auth, password hashing, user routes
2. **Frontend** (1-2 days): Login/signup screens, profile settings
3. **Integration** (1 day): Wire routes, test flow

Estimated: 4-5 days

## File Organization

### Main Application Files
- `backend/src/app.ts` - Express server
- `frontend/src/App.tsx` - React app
- `database/schema.sql` - Database design

### Core Services
- `backend/src/services/EmailParser.ts` - Email extraction
- `backend/src/services/CategorySuggester.ts` - Smart suggestions
- `backend/src/services/TransactionService.ts` - CRUD + analytics

### Frontend Utilities
- `frontend/src/utils/store.ts` - Zustand stores
- `frontend/src/utils/api.ts` - API client
- `frontend/src/utils/theme.ts` - Chakra UI theme

### Design Reference
- `docs/wireframes.md` - All 7 screens
- `docs/colourscheme` - Light/dark colors

## Technology Stack

| Component | Tech |
|-----------|------|
| Backend | Node.js / Express |
| Frontend (Mobile) | React Native + Expo |
| Frontend (Web) | React + Vite |
| Database | PostgreSQL |
| UI | Chakra UI |
| State | Zustand + React Query |
| Auth | JWT + OAuth2 |
| Email Parsing | Regex + Keyword matching (no AI) |

## Device Targets

- **iOS**: iPhone 15, 14, 13, 12 (iOS 15+)
- **Android**: Android 11, 12, 13, 14
- **Web**: Chrome 90+, Firefox 88+, Safari 14+

## Useful Commands

```bash
# Development
npm run dev              # backend + web (concurrent)
cd frontend && npm run web:dev    # web only
cd frontend && npm run mobile:start # mobile only

# Building
npm run build            # production build

# Testing
npm run test             # run tests

# Database
psql finance_tracker < database/schema.sql    # load schema
psql finance_tracker < database/seed.sql      # seed data
```

## Documentation Files

Read in this order:
1. **README.md** - Features & overview
2. **BUILD_SUMMARY.md** - What's already built
3. **IMPLEMENTATION.md** - Detailed next steps (127 items)
4. **docs/wireframes.md** - UI specifications
5. **GETTING_STARTED.md** - This file

## Troubleshooting

**Database connection error**:
```bash
# Check PostgreSQL is running
psql --version

# Verify credentials in backend/.env
cat backend/.env
```

**Port already in use**:
- Backend default: 3000
- Web default: 3001
- Change in `backend/.env` or `frontend/vite.config.ts`

**Module not found**:
```bash
npm install
cd backend && npm install && cd ../frontend && npm install
```

## Next Steps

1. **Read**: BUILD_SUMMARY.md (15 mins)
2. **Setup**: Follow Quick Start above (10 mins)
3. **Code**: Start Phase 1 from IMPLEMENTATION.md (follow checklist)

## Contact

For questions on the codebase:
- Check code comments in `backend/src/services/`
- Review types in `frontend/src/types/index.ts`
- See `docs/wireframes.md` for UI specs

Happy coding! 🚀
