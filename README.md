# MAD GODOWN BKK 26 — Ticketing POC

Mobile-first Next.js POC for the Ladderice × Nike Football "MAD GODOWN" pop-up (Songwat, Bangkok, 11–21 Jun 2026).

Covers all 9 flows from the brief:
1. **Landing** — `/`
2. **Ticket Selection** — `/tickets`
3. **Date / Time Slot** — `/schedule`
4. **Attendee Info** — `/attendee`
5. **Booking Review** — `/review`
6. **Confirmation + QR** — `/confirmation/[id]`
7. **My Tickets** — `/my-tickets`
8. **Admin Dashboard** — `/admin` (seed demo data via the `+ SEED` button)
9. **Cancellation / Refund / Transfer** — `/cancel/[id]`

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000 on a phone or DevTools mobile viewport (440px max width).

## Notes

- All data is mocked. Bookings persist in `localStorage` so My Tickets / Admin / Cancellation work end-to-end without a backend.
- QR codes are deterministic visual mocks (not scannable).
- Promo codes: `SONGWAT26` (15%) and `KOLONLY` (100%).
- Use the Admin page's `+ SEED` to populate demo bookings.
