# Implementation Checklist

## Phase 1: Core Setup & Auth (Weeks 1-2)

### Backend
- [x] Express app scaffold
- [x] Database schema
- [x] Database connection utilities
- [x] Input validators
- [x] Email pattern utilities
- [ ] User model & queries
- [ ] JWT token generation & verification
- [ ] Password hashing (bcrypt)
- [ ] Auth routes (signup, login, logout)
- [ ] Auth middleware
- [ ] User profile routes (GET, PUT)
- [ ] Change password route

### Frontend
- [x] React Native + React Web setup
- [x] Chakra UI theme configuration
- [x] Zustand stores (auth, transactions, categories, UI)
- [x] TypeScript types
- [x] API client with axios
- [x] React Query setup
- [x] Custom hooks (useTransactions, useCategories)
- [ ] Login screen/page
- [ ] Signup screen/page
- [ ] Profile screen/page
- [ ] Settings UI
- [ ] Theme toggle
- [ ] Password change form

### Database
- [x] Schema (users, categories, transactions, email accounts, etc.)
- [x] Initial seed data (default categories & subcategories)
- [ ] Migration system (optional)

---

## Phase 2: Transaction Management (Weeks 2-3)

### Backend
- [ ] Transaction model & queries
- [ ] Create transaction route
- [ ] Get transactions route (with filters)
- [ ] Get single transaction route
- [ ] Update transaction route
- [ ] Delete transaction route
- [ ] Category model & queries
- [ ] Create category route
- [ ] Get categories route
- [ ] Update category route
- [ ] Delete category route
- [ ] Subcategory routes (CRUD)
- [ ] Bank account routes (CRUD)
- [ ] CategorySuggester service (integrate)

### Frontend
- [ ] Add transaction screen/page
- [ ] Transaction form component
- [ ] Category dropdown with search
- [ ] Subcategory dropdown (filtered)
- [ ] Bank account selector
- [ ] Payment mode selector
- [ ] Date picker
- [ ] Amount & currency input
- [ ] Transactions list screen/page
- [ ] Transaction list component (infinite scroll)
- [ ] Search & filter UI
- [ ] Transaction detail modal
- [ ] Edit transaction form
- [ ] Delete confirmation modal
- [ ] Undo toast notification
- [ ] Category management screen
- [ ] Create category modal
- [ ] Edit category modal

### Services
- [x] CategorySuggester (implemented)
- [ ] Unit tests for CategorySuggester
- [ ] Integration tests

---

## Phase 3: Email Integration (Weeks 3-4)

### Backend
- [ ] Email account model & queries
- [ ] OAuth2 setup (Gmail, Outlook, iCloud)
- [ ] Email account routes (add, remove, list, sync)
- [ ] Email fetch service (using OAuth tokens)
- [ ] EmailParser service (integrate)
- [ ] Email transaction tracking table
- [ ] Create transaction from email route
- [ ] Get email suggestions route
- [ ] Email sync job (background task)
- [ ] Error handling & logging
- [ ] Unit tests for EmailParser

### Frontend
- [ ] Email account connection screen
- [ ] OAuth flow UI
- [ ] Connected email accounts list
- [ ] Add email account modal
- [ ] Remove email account confirmation
- [ ] Sync email button
- [ ] Email suggestions carousel (Add Transaction screen)
- [ ] Quick-add from email button
- [ ] Skip email action
- [ ] Edit before import flow

### Services
- [x] EmailParser (implemented)
- [ ] Unit tests for EmailParser
- [ ] Integration with OAuth providers
- [ ] Background email sync job

---

## Phase 4: Analytics & Visualization (Weeks 4-5)

### Backend
- [ ] Analytics queries (spending by category, trends, payment mode)
- [ ] Analytics routes (spending trends, dashboard widgets)
- [ ] Dashboard widget configuration
- [ ] Data aggregation & caching

### Frontend
- [ ] Home screen/page
- [ ] Primary chart (pie/donut - current month)
- [ ] Period selector (7d, 30d, 90d, 6m, 1y, custom)
- [ ] Chart customization (by category/payment mode)
- [ ] Widget selector modal
- [ ] Widget reorder UI (drag-drop, optional)
- [ ] Secondary widgets:
  - [ ] Top 5 Categories (bar chart)
  - [ ] Payment Mode Breakdown (pie)
  - [ ] Monthly Comparison (line chart)
  - [ ] Weekly spending (bar)
  - [ ] Top merchants (list)
- [ ] Widget visibility toggle
- [ ] Chart colors (match category colors)
- [ ] Responsive chart sizing
- [ ] Loading states
- [ ] Empty states

### Charts
- [ ] Recharts integration (web)
- [ ] React Native Charts integration (mobile)
- [ ] Color palette integration
- [ ] Legend & labels
- [ ] Tooltips
- [ ] Responsive behavior

---

## Phase 5: Polish & Testing (Weeks 5-6)

### Frontend UI/UX
- [ ] Responsive design refinements
- [ ] Mobile touch targets (44px minimum)
- [ ] Swipe gestures (email suggestions, etc.)
- [ ] Loading spinners
- [ ] Empty states (all screens)
- [ ] Error messages
- [ ] Success notifications
- [ ] Accessibility (ARIA labels, keyboard nav)
- [ ] Keyboard handling (on focus, submit, etc.)
- [ ] Form validation UI
- [ ] Form error messages
- [ ] Tab bar active states
- [ ] Badge on Add Transaction tab (pending emails count)
- [ ] Animation transitions
- [ ] Dark mode refinements

### Testing
- [ ] Unit tests (backend services)
- [ ] Unit tests (frontend hooks, utils)
- [ ] Integration tests (API + database)
- [ ] E2E tests (auth flow, transaction creation, etc.)
- [ ] Component tests (React Testing Library)
- [ ] Email parser tests (with sample emails)
- [ ] Category suggester tests

### Performance
- [ ] Database query optimization
- [ ] React component memoization
- [ ] Lazy loading
- [ ] Code splitting
- [ ] Asset optimization
- [ ] API caching strategy

### Backend Production
- [ ] Error logging
- [ ] Request logging
- [ ] Rate limiting
- [ ] Input sanitization
- [ ] HTTPS/TLS setup
- [ ] CORS configuration
- [ ] Database backups
- [ ] Environment variables validation

### Deployment
- [ ] Docker setup (optional)
- [ ] Environment configuration
- [ ] Database migrations
- [ ] Seed production data
- [ ] API documentation
- [ ] Web app deployment (Vercel/Netlify)
- [ ] Mobile app build (EAS for Expo)
- [ ] App store submission guidelines

### Documentation
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Setup guide
- [ ] Architecture documentation
- [ ] Code comments
- [ ] Contributing guide
- [ ] Changelog

---

## Critical Paths

### Must Complete Before Phase 2
- Phase 1 all items

### Must Complete Before Phase 3
- Phase 1 & 2 all items
- Email pattern utilities (done)
- EmailParser service (done)

### Must Complete Before Phase 4
- Phase 1, 2, & 3 all items
- Analytics queries & routes

### Must Complete Before Launch
- All phases
- Testing
- Security review
- Performance testing
- Documentation

---

## Testing Checklist

### Unit Tests
- [ ] Email pattern extraction (amount, date, merchant, mode)
- [ ] Category suggester (fuzzy matching, frequency ranking)
- [ ] Validators (email, password, currency, amount, payment mode)
- [ ] API client (request/response handling)
- [ ] Store mutations (Zustand)

### Integration Tests
- [ ] Auth flow (signup → login → logout)
- [ ] Transaction CRUD (create, read, update, delete)
- [ ] Category management
- [ ] Email account connection
- [ ] Email import flow
- [ ] Analytics queries

### E2E Tests
- [ ] Complete user journey:
  1. Signup
  2. Login
  3. Set profile
  4. Connect email account
  5. Receive email with transaction
  6. View email suggestion
  7. Create transaction from email (with category suggestion)
  8. View transaction
  9. Edit transaction
  10. View home dashboard
  11. Check spending trends
  12. Change settings
  13. Logout

### Manual Testing
- [ ] All screens on multiple devices
- [ ] Responsive breakpoints (mobile, tablet, web)
- [ ] Theme switching (light/dark)
- [ ] Offline mode (web PWA)
- [ ] Error handling
- [ ] Form validation
- [ ] Loading states
- [ ] Empty states

---

## Known Issues & TODOs

- [ ] Currency conversion (v2 feature)
- [ ] Recurring transactions (v2 feature)
- [ ] Budgets & alerts (v2 feature)
- [ ] Data export (CSV/JSON)
- [ ] Account linking (multiple banks same user)
- [ ] Transaction attachments (receipts)
- [ ] Mobile push notifications
- [ ] Offline transaction sync
- [ ] Dark mode image assets

---

## Notes

- **Email Patterns**: Currently supports HDFC, ICICI, Axis. More banks can be added in `backend/src/utils/email-patterns.ts`
- **Category Suggester**: Uses Levenshtein distance (weighted 3 chars per mismatch). Threshold can be adjusted based on testing
- **OAuth2**: Requires client credentials from Gmail, Outlook, iCloud developer consoles
- **Database**: Migration to PostgreSQL assumed. Update connection string in `.env` if using different host/port
- **Theme**: Uses Chakra UI semantic tokens for dark/light mode. Category colors defined in `frontend/src/utils/theme.ts`
- **Responsive Design**: Mobile sizes use viewport-relative percentages. Web uses fixed pixel values

---

## Success Criteria

### MVP (Minimum Viable Product)
- [x] User authentication (signup/login)
- [ ] Transaction CRUD
- [ ] Email account connection (OAuth2)
- [ ] Email import with suggestions
- [ ] Category management with subcategories
- [ ] Smart category suggestions
- [ ] Home dashboard with pie chart
- [ ] Spending trends visualization
- [ ] Settings & profile management
- [ ] Cross-platform (iOS, Android, web)

### Post-MVP (v1.1)
- [ ] Advanced analytics
- [ ] Budget tracking
- [ ] Recurring transactions
- [ ] Data export
- [ ] Mobile notifications
- [ ] More email providers
- [ ] Improved email parser accuracy
