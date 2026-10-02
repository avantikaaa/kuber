# Finance Tracking App — Mobile UI Wireframes & Specifications

## Wireframes

### 1. Tab Bar / Navigation

```text
┌─────────────────────────────────────────────────────────┐
│  [🏠]         [➕]🔴        [📋]          [👤]     │
│  Home    Add Trans (3)  Transactions    Profile     │
└─────────────────────────────────────────────────────────┘

```

### 2. Home Screen

```text
┌─────────────────────────────────────────────────────────┐
│ ☰  Dashboard                          [ Month ▾ ]       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                   ─── PRIMARY CHART ───                 │
│                 [Pie / Donut Chart View]                │
│                         (50% VH)                        │
│                                                         │
│                     ┌──────────────┐                    │
│                     │   $2,450.00  │                    │
│                     │ Total Spent  │                    │
│                     └──────────────┘                    │
│                                                         │
│  [●] Groceries $850 (34%)    [●] Utilities $400 (16%)   │
│  [●] Dining    $500 (20%)    [●] Transport $200 (8%)    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ ⚙️ Change Layout                                        │
├─────────────────────────────────────────────────────────┤
│ SECONDARY WIDGETS (Vertical Scroll)                     │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Top 5 Categories                                    │ │
│ │ 1. Groceries   ████████████████       $850.00       │ │
│ │ 2. Dining      ████████             $500.00       │ │
│ │ 3. Utilities   ████████               $400.00       │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Payment Mode Breakdown                              │ │
│ │ Credit Card  ████████████             $1,200.00     │ │
│ │ UPI          ████████                 $800.00       │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Monthly Comparison (Trend Line)                     │ │
│ │   📈  Jul: $2.1k  |  Aug: $2.3k  |  Sep: $2.45k    │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘

```

### 3. Add Transaction Screen

```text
┌─────────────────────────────────────────────────────────┐
│ ←  Add Transaction                                      │
├─────────────────────────────────────────────────────────┤
│ 📧 Suggested from Email (3 pending)                     │
│ ┌─────────────────────────────────────────────────────┐ │
│ │  [🛍️] Amazon.com                       $129.99      │ │
│ │  Card •••• 4242  |  HDFC Bank                       │ │
│ │  ─────────────────────────────────────────────────  │ │
│ │  [ Quick Add ]      [ Skip ]         [ Edit ]       │ │
│ └─────────────────────────────────────────────────────┘ │
│   ● ○ ○  (Swipeable Card Stack)                         │
├─────────────────────────────────────────────────────────┤
│ TRANSACTION FORM                                        │
│                                                         │
│ Description                                             │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ What did you buy?                            [🔍]   │ │
│ └─────────────────────────────────────────────────────┘ │
│ │ Autocomplete: Starbucks, Amazon, Uber, Walmart...  │
│                                                         │
│ Amount                                                  │
│ ┌───────────────┬─────────────────────────────────────┐ │
│ │  [$ USD ▾]    │  0.00                               │ │
│ └───────────────┴─────────────────────────────────────┘ │
│                                                         │
│ Mode of Payment                                         │
│ ┌──────────┬──────────┬──────────┬──────────┬─────────┐ │
│ │  Card    │ Bank Trsf│   UPI    │  Wallet  │ Cash... │ │
│ └──────────┴──────────┴──────────┴──────────┴─────────┘ │
│                                                         │
│ Bank Account                                            │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Select Bank Account (e.g., Chase Savings)       ▾   │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Category & Subcategory                                  │
│ ┌──────────────────────┬──────────────────────────────┐ │
│ │ 🍔 Food & Dining  ▾  │ Fast Food                  ▾ │ │
│ └──────────────────────┴──────────────────────────────┘ │
│                                                         │
│ Date                                                    │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📅 Today, Sep 29, 2026                          ▾   │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌──────────────────────┬──────────────────────────────┐ │
│ │       Cancel         │       Save Transaction       │ │
│ └──────────────────────┴──────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘

```

### 4. Transactions List Screen

```text
┌─────────────────────────────────────────────────────────┐
│ 🔍 Search description or merchant...      [⚡ Filters]  │
├─────────────────────────────────────────────────────────┤
│ TODAY                                                   │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [☕]  Starbucks Coffee                    -$5.75    │ │
│ │      Card • 09:30 AM                           >    │ │
│ ├─────────────────────────────────────────────────────┤ │
│ │ [🛒]  Whole Foods Market                -$84.20     │ │
│ │      UPI • 02:15 PM                            >    │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ YESTERDAY                                               │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [⚡]  Electric Utility Bill             -$120.00    │ │
│ │      Bank Transfer • Sep 28                    >    │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ─── EMPTY STATE (When no items match search/filter) ─ │
│                                                         │
│                        📂                               │
│                No transactions yet                      │
│             Add one to get started                      │
│                                                         │
│               [ + Add Transaction ]                     │
└─────────────────────────────────────────────────────────┘

```

### 5. Transaction Detail / Edit Screen & Delete States

```text
┌─────────────────────────────────────────────────────────┐
│ READ-ONLY VIEW                                  [ Edit ]│
├─────────────────────────────────────────────────────────┤
│                     [ 🍔 Category ]                     │
│                        -$45.50                          │
│                     Dinner at Bistro                    │
│                                                         │
│ Category:        Food & Dining                          │
│ Subcategory:     Restaurants                            │
│ Payment Mode:    Credit Card                            │
│ Bank Account:    Chase Freedom (••4242)                  │
│ Date:            September 29, 2026                     │
│ Created At:      Sep 29, 2026, 08:45 PM                 │
│                                                         │
│ [ Close ]                                  [ 🗑️ Delete ] │
└─────────────────────────────────────────────────────────┘

                     ┌──────────────────────────┐
                     │ DELETE CONFIRMATION      │
                     ├──────────────────────────┤
                     │ Are you sure? This       │
                     │ action cannot be undone. │
                     │                          │
                     │ [Cancel]   [Confirm]     │
                     └──────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  ⓘ Transaction deleted                     [ UNDO ]     │
└─────────────────────────────────────────────────────────┘

```

### 6. Profile & Settings Screen

```text
┌─────────────────────────────────────────────────────────┐
│ Profile & Settings                                      │
├─────────────────────────────────────────────────────────┤
│ PROFILE SECTION                                         │
│                        ( JD )                           │
│                     [Edit Avatar]                       │
│ Username: [ John Doe                         ] [✏️]      │
│ Email:    john.doe@example.com (Display Only)           │
│ Phone:    +1 (555) 019-2834    (Display Only)           │
├─────────────────────────────────────────────────────────┤
│ PREFERENCES                                             │
│ Theme:           ( ) Light    ( ) Dark    (•) System    │
│ Default Currency: [ USD ($)                         ▾ ] │
│ Default Widgets for Home:                               │
│   [✓] Current Month Pie    [✓] Spending Trend           │
│   [✓] Top Categories       [ ] Monthly Comparison       │
│   [✓] Payment Mode Breakdown                            │
├─────────────────────────────────────────────────────────┤
│ CONNECTED EMAIL ACCOUNTS                                │
│ ✉️ john.doe@gmail.com                                    │
│    Last synced: 10 mins ago                [Active  🟢] │
│    [ Sync Now ]         [ Edit ]           [ Remove ]   │
│                                                         │
│ [ + Add Email Account ]                                 │
├─────────────────────────────────────────────────────────┤
│ CATEGORY MANAGEMENT                                     │
│ 🟢 Hobbies             [ Edit ]             [ Delete ]  │
│ 🔵 Freelance Tools     [ Edit ]             [ Delete ]  │
│ [ + Create New Category ]                               │
├─────────────────────────────────────────────────────────┤
│ DATA & ACCOUNT                                          │
│ [ Export Data (CSV/JSON) ]   [ Change Password ]        │
│ [ Sign Out ]                 [ Delete Account ]         │
└─────────────────────────────────────────────────────────┘

```

### 7. Email Account Setup Modal

```text
┌─────────────────────────────────────────────────────────┐
│ ⚙️ Connect Your Email Account               [ Close ] │
├─────────────────────────────────────────────────────────┤
│ Select your email provider to auto-import               │
│ transaction receipts and digital invoices.              │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │  [ G ]  Continue with Google (Gmail)                │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │  [ M ]  Continue with Outlook / Microsoft           │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │  [ ☁️]  Continue with iCloud Mail                    │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ─────────────────────────────────────────────────────── │
│                                                         │
│ SUCCESS STATE:                                          │
│   ✓ Connected successfully!                             │
│   [ Done ]                                              │
│                                                         │
│ ERROR STATE:                                            │
│   ⚠️ Connection failed. Please try again.                │
│   [ Retry ]                                             │
└─────────────────────────────────────────────────────────┘

```

---

## Screen & Interaction Specifications

* **Tab Bar / Navigation:** Fixed at the bottom of the viewport across all mobile screens. Height is 15% of viewport width (min 56px, max 64px). Active states highlight the primary color icon, text label, and top border line. A red circular badge on the "Add Trans" icon displays the pending email import count.
* **Home Dashboard:** Header bar features a left-aligned title and right-aligned date selector dropdown. The primary chart occupies 50% of viewport height with dynamic total spending text displayed in the center. A "Change Layout" button opens a modal to toggle and reorder widgets. Widget cards occupy 90% screen width with 5% horizontal margins.
* **Add Transaction Form:** The email suggestions card stack is only visible when pending emails exist, using horizontal swipe gestures. The description field features an autocomplete dropdown matching merchant names. Mode of payment utilizes segmented control tabs, which subsequently filters the bank account dropdown options. Subcategory dropdowns remain disabled until a primary category is selected.
* **Transactions List & Detail:** Includes a top text input for real-time list filtering. Tapping the filters icon opens a modal for date, category, and payment mode selections. The list relies on infinite scroll with sticky chronological section headers. The detail view opens in a read-only mode with a toggle button to switch to an editable form. Delete actions trigger a modal confirmation and a 24-hour undo snackbar toast.
* **Profile & Settings:** Profile section allows for editable avatars and usernames while locking email and phone fields. App preferences include theme toggles, currency selection, and widget visibility. Integrations handle email sync management via an OAuth modal trigger.

---

## Color Scheme Architecture

| Token Role | Usage & Applied Components |
| --- | --- |
| **Primary Color** | Active tab icons/labels, primary action buttons, selected inputs, focus states |
| **Secondary Color** | Visual accents, badge backgrounds, subtle card outlines, chart secondary series |
| **Success Color** | Income items, successful email import connections, delete undo snackbar button |
| **Warning / Danger** | Expense items, destructive delete actions, error state banners |
| **Neutral Base** | Backgrounds, surface cards, input field boundaries, horizontal dividers |
| **Category Palette** | 8 to 10 distinct, accessible colors assigned to categories on creation |

---

## Mobile Dimensions & Layout Breakpoints (< 768px Viewport)

| Specification Component | Dimension Metric |
| --- | --- |
| **Primary Chart Height** | 50% of viewport height |
| **Chart Padding** | 5% of chart container width |
| **Widget Card Dimensions** | Width: 90% screen width (5% side margins) <br>

<br> Height: 40% viewport height |
| **Tab Bar Height** | 15% viewport width (Min 56px, Max 64px) |
| **Modal Dialog Width** | Max 95% screen width (Padding: 5% horizontal, 4% vertical, Radius: 12px min) |
