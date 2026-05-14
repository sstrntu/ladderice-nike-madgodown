# Integrations Roadmap

Status of the POC: all 9 user flows exist as UI, but the "backend" is `localStorage`. This document lists every external service / integration needed to turn it into a real ticketing product, grouped by criticality and what it replaces in the current code.

---

## 1. Core — required to actually sell a ticket

| Layer | Why | Recommended (Thailand context) | Replaces in POC |
|---|---|---|---|
| **Database** | Persist events, sessions, ticket types, bookings, holds, users | **Supabase** (Postgres + auth + storage + realtime). Fastest path. Alternative: Neon + Prisma. | `lib/store.ts` localStorage |
| **Auth / accounts** | Buyers log in to see their tickets across devices; admins gated by role | **Supabase Auth** (email/OTP, Google, Apple, **LINE login** is critical in TH) or Clerk / Auth.js | "stored on this device" note on `/my-tickets` |
| **Payments** | Charge cards + Thai rails | **Omise** — Cards, **PromptPay QR**, TrueMoney, Rabbit LINE Pay, installments. Alt: 2C2P. Stripe is fine for international cards but weak on PromptPay. | "PAY · MOCK" button on `/review` |
| **Seat-lock service** | Real 10-min hold with TTL across concurrent buyers (prevents overbooking) | Postgres row lock + expiring `holds` table, or Redis with `SET EX` | The `holdUntil` state in `/schedule` |
| **QR generation + signed payloads** | Tickets must be cryptographically signed so they can't be forged or reused | Server-issued JWTs encoded as QR; verify on scan. Library: `qrcode` + `jose` for signing. | `PseudoQR` component (visual only) |
| **Email** | Confirmation, e-ticket PDF, reminders | **Resend** or **Postmark** + **React Email** for templates | The "email is on its way" copy |

## 2. Operations — admin / event creation

| Layer | Why | Recommended |
|---|---|---|
| **CMS for events** | Admins create new events, ticket types, sessions, capacity, prices, dates, hero copy without a deploy | **Sanity** or **Payload CMS** as a headless layer, or build CRUD on top of Supabase (admin shell already exists) |
| **Asset storage** | Event posters, OG images, ticket art, partner logos | Supabase Storage, **Cloudinary**, or Cloudflare **R2** + CDN |
| **Role-based access** | Separate buyer, scanner, organizer, super-admin | Supabase **RLS** policies (cleanest) or Auth.js + middleware |
| **Check-in scanner app** | Staff at the inner gate scan QRs, mark as used, flag duplicates | A `/scan` route using `html5-qrcode` or `react-zxing`. Optionally wrap as a PWA. |
| **Audit log** | "Admin X cancelled booking Y at T" — required for disputes | Postgres trigger → `audit_log` table |

## 3. Communications

| Layer | Why | Recommended |
|---|---|---|
| **SMS** | Thai users care more about SMS than email for tickets, esp. for last-mile address drop | Omise SMS, **Twilio**, or **Thaibulksms** |
| **LINE messaging** | Thailand runs on LINE — official ticket-drop channel + reminders | **LINE Notify** or **LINE Messaging API** (LINE Official Account) |
| **Push notifications** | "Doors open in 1 hour", "address unlocked" | **OneSignal** or **Firebase Cloud Messaging** (works for PWAs) |
| **Email automation** | Reminder N-1 day, post-event survey, refund status | Resend + scheduled job, or **Customer.io** for flows |

## 4. Convenience features users expect

| Layer | Why | Recommended |
|---|---|---|
| **Apple Wallet / Google Wallet passes** | Tap-and-go at the gate, lock-screen reminders | Apple PassKit + Google Wallet API. Wrappers: `passkit-generator` (npm) |
| **Calendar invites** | The "+ CALENDAR" button must drop an `.ics` | Server-render `.ics` per booking |
| **Ticket PDF** | The "DOWNLOAD" button | **@react-pdf/renderer** or Puppeteer server-side |
| **Live capacity** | Tickets page shows "FEW LEFT" / "SOLD OUT" reactively | Supabase **Realtime** subscription on `sessions` table |

## 5. Compliance & finance (Thai-market specific)

| Layer | Why | Recommended |
|---|---|---|
| **PDPA** (Thai GDPR) | Consent, data export, deletion. You collect name/email/phone — mandatory. | Cookie consent banner + `/privacy` page + DSR endpoint |
| **VAT 7%** | Noted in the brief estimates | Add to receipt math; tax invoice template |
| **e-Tax invoice** | Revenue Department requires electronic tax invoices over a threshold | **Leceipt**, **INET**, or **OneTax** |
| **Receipts** | Stored, downloadable, emailable | PDF generator + S3 |
| **Refund accounting** | Track refunds vs. revenue, payouts | Stripe/Omise dashboards + reconciliation |

## 6. Anti-abuse (matters more than you'd think on launch day)

| Layer | Why | Recommended |
|---|---|---|
| **Bot protection** | Scalpers / bot-bought tickets | **hCaptcha** or **Cloudflare Turnstile** on reservation endpoint |
| **Virtual waiting room** | If "Hunter Pass FREE" goes viral, the site falls over | **Queue-it**, or build a Redis-backed FIFO with token grants |
| **Rate limiting** | Per IP + per user | **Upstash Ratelimit** (Redis) or API middleware |
| **Idempotency keys** | Prevent double-charging on retries | Standard on Omise/Stripe — pass `Idempotency-Key` |

## 7. Growth & insight

| Layer | Why | Recommended |
|---|---|---|
| **Analytics** | Conversion funnel (visits → ticket → date → form → review → paid), drop-off by step | **PostHog** (best for funnels) or GA4 + Mixpanel. PostHog also does session replays. |
| **Error tracking** | Production errors with stack traces | **Sentry** |
| **A/B testing** | Hero copy, CTA color, pricing | PostHog or **GrowthBook** |
| **SEO + OG** | Shareable preview cards | `app/layout.tsx` metadata + dynamic OG images via `@vercel/og` |
| **Localization** | TH/EN toggle (event is Thai, brand-led for Thai teens) | **next-intl** |

## 8. Infra

| Layer | Why | Recommended |
|---|---|---|
| **Hosting** | Run Next.js with edge/SSR | **Vercel** (zero-config), or Railway/Fly for cheaper |
| **Domain + DNS** | `madgodown.com` | Cloudflare DNS + bot WAF |
| **CDN / image** | Posters served fast | Cloudflare or Vercel built-in |
| **Background jobs** | Reminder N-1 day, release expired holds, refund cron | **Inngest** or **Trigger.dev**, or Vercel cron + queue |
| **Backups** | Supabase point-in-time recovery | Built-in on Pro tier |

---

## Build order

1. **Supabase** (db + auth + storage + RLS) — replaces `localStorage`.
2. **Omise** for payments + PromptPay (the dominant Thai rail).
3. **Resend + React Email** for confirmation + e-ticket flow.
4. **Real seat lock** (DB row + TTL).
5. **QR signing** (JWT) + a `/scan` route for gate staff.
6. **LINE Official Account** for the "address drops 24h before" message.
7. **PDPA banner + privacy page** before collecting a single email.
8. **Sentry + PostHog** so you can see what's happening day one.

After that: Apple/Google Wallet, e-Tax invoices, virtual waiting room (if Hunter Pass goes viral).

---

## Cost estimate at launch (~10k visitors, ~2k bookings / month)

- Supabase Pro: ~$25
- Resend: $0–20
- Sentry: free tier
- PostHog: free tier
- Vercel: ~$20
- Omise: 3.65% + 10 THB per card transaction; PromptPay ~1.5%
- Domain + Cloudflare: ~$10/yr + free

**Roughly $70–100/mo platform + payment fees before scaling.**

---

## UI gaps before any backend wiring

The POC has the 9 buyer + admin flows. To make it feel complete *as a product* (still pre-backend), these screens are missing:

1. **Auth screens** — sign in / sign up / OTP / forgot password / LINE & Google login buttons
2. **Admin CMS** — create event, edit ticket types, schedule sessions, upload poster (real CRUD, not just the existing list view)
3. **Scanner UI** — `/scan` route with viewfinder mock, success/duplicate/invalid states
4. **404 / error / loading / empty states** — every async path
5. **Cookie consent + privacy page + T&C page + FAQ** — PDPA-mandatory
6. **Email previews** — visualise the confirmation, reminder, refund-status emails
7. **Receipt / tax invoice preview** — so finance can validate the layout
8. **Waitlist / "notify me"** — for sold-out tickets
9. **Workshop detail page** — deeper than the card on `/tickets` (artist bio, materials, level)
10. **Notifications inbox** — in-app feed of receipts, address drops, reminders
11. **Profile / account settings** — preferred lang, marketing opt-in, saved info
12. **Wallet pass preview** — Apple/Google Wallet visual mock on `/confirmation`
13. **Waiting-room UI** — for launch-day surges (Queue-it visual mock)

See `README.md` for run/build instructions.
