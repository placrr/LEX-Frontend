## Lex App (LEX-Frontend)

Lex is a Next.js 16 application (App Router) built with TypeScript and Tailwind CSS 4. It provides a KIIT-only authentication flow using Google OAuth (via `next-auth`), plus a Prisma‑backed data layer and a modern, component‑driven UI.

### Tech stack

- **Framework**: Next.js 16 (App Router, `app` directory)
- **Language**: TypeScript + React 18
- **Styling**: Tailwind CSS 4, Radix UI primitives, custom UI components
- **Auth**: `next-auth` with Google provider (restricted to `@kiit.ac.in` emails)
- **Data layer**: Prisma ORM (with a relational database via `DATABASE_URL`)
- **Other services**: Upstash Redis (tokens/rate limiting), email (Resend / Nodemailer), JSON Web Tokens

### Folder structure (high level)

Root of the project (simplified):

```text
LEX-Frontend/
├─ app/                 # Next.js App Router: pages, API routes, layouts
├─ components/          # Reusable React UI components
├─ lib/                 # Server-side utilities, configs, and services
├─ prisma/              # Prisma schema and migrations
├─ public/              # Static assets (if any)
├─ package.json         # Scripts and dependencies
├─ next.config.mjs      # Next.js configuration
├─ tsconfig.json        # TypeScript configuration
├─ tailwind.config.*    # Tailwind CSS configuration
└─ postcss.config.*     # PostCSS/Tailwind build configuration
```

### Detailed folder structure

#### `app/` – routing, pages, API

```text
app/
├─ layout.tsx                 # Root layout: fonts, global styles, navbar, analytics
├─ page.tsx                   # Landing page `/`
├─ (auth)/                    # Auth-related routes
│  ├─ login/                  # `/login` – KIIT Google login UI
│  ├─ after-oauth/            # `/after-oauth` – post Google OAuth step
│  └─ complete-profile/       # `/complete-profile` – profile/OTP completion steps
├─ dashboard/
│  └─ page.tsx                # `/dashboard` – main logged-in dashboard
└─ api/                       # Route handlers (server-side logic)
   ├─ auth/[...nextauth]/     # NextAuth handler wired to `authOptions`
   ├─ otp/                    # OTP issue/verify endpoints
   └─ users/complete-profile/ # Profile completion API
```

- **`app/layout.tsx`**: Loads Geist fonts, imports `globals.css`, wraps pages with `NavbarWrapper`, and includes Vercel `Analytics`.
- **`app/page.tsx`**: Public landing page combining `Hero` and `KeyFeaturesSection`.
- **`app/(auth)/*`**: Login, OAuth callback handling, profile completion, and OTP-related flows.
- **`app/dashboard/page.tsx`**: Simple dashboard shell that renders a heading and `LogoutButton` (expandable as the main product surface).
- **`app/api/*`**: API routes for auth, OTP, and profile logic, using `lib/*` utilities and Prisma.

#### `components/` – UI building blocks

```text
components/
├─ layouts/
│  └─ NavbarWrapper.tsx   # Wraps pages with top navigation
├─ navbar.tsx             # Nav bar UI
├─ hero.tsx               # Landing hero section
├─ key-features-section.tsx # Landing key-features grid/section
├─ auth/
│  └─ LogoutButton.tsx    # Logout button used in dashboard
└─ ui/                    # Shadcn/Radix-style primitives (buttons, inputs, etc.)
   ├─ button.tsx
   ├─ input.tsx
   ├─ dialog.tsx
   └─ ...                 # other generic UI elements
```

- **`components/...`**: Contains both page‑level sections (hero, features) and low‑level primitives (buttons, inputs, dialogs) so pages stay clean and composable.

#### `lib/` – server utilities and configuration

```text
lib/
├─ auth-options.ts    # NextAuth configuration (Google provider, callbacks)
├─ prisma.ts          # Prisma client singleton
├─ redis.ts           # Upstash Redis client
├─ tokens.ts          # Token generation / verification helpers
├─ rate-limit.ts      # Rate-limiting utilities (likely using Redis)
├─ email.ts           # Email sending helpers (Resend / Nodemailer)
├─ cookies.ts         # Cookie read/write helpers
├─ features-data.ts   # Static data powering key-features section, etc.
└─ utils.ts           # Generic helpers (e.g. `cn` className helper)
```

- **`lib/auth-options.ts`**: Defines `authOptions` for NextAuth. Uses Google provider with `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`, restricts emails to `@kiit.ac.in`, uses JWT sessions, and redirects to `/after-oauth` after successful sign‑in.
- **`lib/prisma.ts`**: Centralized Prisma client to avoid multiple instances in serverless environments.
- **`lib/redis.ts`**, **`lib/tokens.ts`**, **`lib/rate-limit.ts`**, **`lib/email.ts`**: Shared infra utilities for OTP, token management, throttling, and email flows.

#### `prisma/` – database layer

```text
prisma/
├─ schema.prisma      # Prisma schema: User, OTP, and related models
└─ migrations/        # Generated migration folders with SQL
```

- **`schema.prisma`**: Source of truth for the database schema, used by Prisma Migrate.
- **`migrations/*`**: History of schema changes applied to your DB.

#### Root configuration files

- **`package.json`**: Defines scripts (`dev`, `build`, `start`, `lint`) and manages dependencies (`next`, `react`, `next-auth`, `prisma`, etc.).
- **`next.config.mjs`**: Next.js configuration (e.g. TypeScript error handling, image config).
- **`tsconfig.json`**: TypeScript configuration for the project.
- **`tailwind.config.*`** and **`postcss.config.*`**: Tailwind CSS v4 + PostCSS pipeline configuration.

### Application flow

- **1. Public landing page (`/`)**
  - Users visiting the root route see the marketing/landing experience, composed from `Hero` and `KeyFeaturesSection` components.
  - The global `NavbarWrapper` is rendered from `app/layout.tsx`, so navigation is consistent across all pages.

- **2. Login (`/(auth)/login`)**
  - The login page (`app/(auth)/login/page.tsx`) is a client component that shows a “KIIT Student Login” card.
  - Clicking “Login with KIIT Google” triggers `signIn("google")` from `next-auth/react`.

- **3. OAuth and domain restriction**
  - `lib/auth-options.ts` configures a Google provider using `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
  - The `signIn` callback ensures only users with an email ending in `@kiit.ac.in` can log in; others are rejected.
  - The `redirect` callback sends successfully authenticated users to `/after-oauth`.

- **4. Post‑OAuth and onboarding**
  - Under `app/(auth)/after-oauth` and `app/(auth)/complete-profile`, users can be asked to verify their email via OTP, fill in any additional profile fields, and finalize onboarding.
  - API routes under `app/api/otp/*` and `app/api/users/complete-profile/route.ts` handle OTP issuance/verification and profile updates using Prisma and (optionally) Redis/email utilities.

- **5. Authenticated experience (`/dashboard`)**
  - Once onboarding is complete, users can access `/dashboard` (`app/dashboard/page.tsx`), which is the main logged‑in experience for the app.
  - A `LogoutButton` component is rendered here to allow users to sign out.

### Getting started

#### Prerequisites

- **Node.js**: v18+ (LTS) is recommended.
- **Package manager**: npm, pnpm, or yarn (examples below use `npm`).
- **Database**: A relational database supported by Prisma (e.g. PostgreSQL, MySQL, etc.), configured via `DATABASE_URL`.

#### Installation

```bash
npm install
```

#### Environment variables

Create a `.env` file in the project root and define at least:

```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_SECRET=your-long-random-secret
DATABASE_URL=your-database-connection-string
# Add any Redis/email-related variables as needed (e.g. UPSTASH_REDIS_*, RESEND_API_KEY, EMAIL_FROM, etc.)
```

#### Database setup

Run Prisma migrations to set up the database schema:

```bash
npx prisma migrate deploy
# or, during development:
npx prisma migrate dev
```

#### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

#### Production build

```bash
npm run build
npm run start
```

### Linting

To run the linter:

```bash
npm run lint
```

### Notes

- Authentication is restricted to KIIT Google accounts (`@kiit.ac.in`) by design.
- All authenticated routes (such as `/dashboard`) should be considered protected and should be wrapped with appropriate session checks or middleware wherever necessary.

