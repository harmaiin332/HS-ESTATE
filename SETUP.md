# HS ESTATE — Supabase Full-Stack Architecture & Setup Guide

This guide explains how to connect your **Supabase PostgreSQL database and Supabase Authentication** to the **HS ESTATE** Dubai luxury real estate platform.

---

## 1. Environment Configuration

Copy `.env.example` to `.env` in the project root:

```bash
cp .env.example .env
```

Set your Supabase credentials:

```env
# Browser-facing client variables (VITE_ prefixed)
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOi..."

# Server-side key (used only by server.ts for admin verification, NEVER exposed to browser)
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..."

# Server port (default 3000)
PORT=3000
NODE_ENV="development"
```

> **Note on Standby Mode**: When Supabase credentials are not yet entered, the application automatically runs in an interactive **Local Demonstration Mode** with full offline persistence (localStorage caching for properties, favorites, saved searches, and inquiries), allowing complete functional testing.

---

## 2. Database Schema & Migrations

The database schema is located at:
`supabase/migrations/20261020000000_init_schema.sql`

### How to apply:
1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to **SQL Editor**.
3. Paste the contents of `supabase/migrations/20261020000000_init_schema.sql` and click **Run**.

### Tables Created:
- **`user_roles`**: System roles (`admin`, `broker`, `investor`, `buyer`).
- **`user_profiles`**: Linked to `auth.users(id)` via trigger with investor type, phone, and target budget.
- **`properties`**: Complete Dubai real estate records (price in AED, typology, bedrooms, bathrooms, sqft, plot, developer, RERA numbers, ROI estimates).
- **`property_images`**: Multi-image gallery relations with display order.
- **`favorites`**: User-specific saved properties (`user_id`, `property_id`).
- **`saved_searches`**: User-specific query filters and names.
- **`property_inquiries`**: Private viewing and consultation bookings linked to properties.

---

## 3. Seed Demo Data

To populate initial Dubai luxury properties (Palm Jumeirah beachfront villa, Downtown sky duplex penthouse, Marina waterfront apartment, Emirates Hills golf mansion) and sample inquiries:

1. In Supabase **SQL Editor**, open:
   `supabase/seed.sql`
2. Click **Run**.

---

## 4. Row Level Security (RLS) Policies

All tables have RLS enabled with strict security policies:
- **Properties**: Anyone can read `published` properties. Only users with the `admin` role in `user_profiles` can insert, update, or delete properties.
- **Favorites & Saved Searches**: Strict ownership verification (`auth.uid() = user_id`). Users can only access and delete their own items.
- **Inquiries**: Anyone (guest or authenticated) can submit an inquiry. Users can view only their own submitted inquiries; Admins can view and update statuses of all inquiries.
- **Service Role Key**: Handled exclusively on the Express backend (`server.ts`) for admin operations; never bundled into browser code.

---

## 5. Testing & Authentication Roles

- **Sign In / Registration**: Click **Client Login** in the top navigation bar.
- **1-Click Test Credentials**:
  - **Demo VIP Investor**: Tests client portal, saved favorites, custom saved searches, and personal inquiries.
  - **Demo Admin Desk**: Tests the RERA inventory management console, property creation, deletion, and inquiry status updater.
- **Property Comparison**:
  - Click **+ Compare** on any property card or detail page.
  - Floating dock appears at the bottom.
  - Click **Compare Now** to view a side-by-side comparison matrix (up to 4 residences) comparing price/sqft, built-up area, and signature amenities.

---

## 6. Running the Application

```bash
# Start development server on port 3000
npm run dev

# Build for production
npm run build
```
