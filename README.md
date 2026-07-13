# Bundle Builder

A data-driven, multi-step "security system" bundle builder (React + Vite + Tailwind CSS v4): a 4-step accordion product picker on the left with a live-syncing review/checkout panel on the right.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (default `http://localhost:5173`). `npm run build` produces a production build; `npm run preview` serves it.

## Data

Everything renders from `src/data/products.json` — steps, products, variants, pricing, shipping, guarantee copy, and financing text all live there. Nothing is hardcoded per-product in the components.

Product images referenced in that file (`/img/*.png`) aren't included in this repo yet — drop matching files into `public/img/` and they'll pick up automatically. Until then, cards/review lines fall back to a small placeholder box so the layout never breaks.

## Notable decisions / tradeoffs

- **State**: a single `useBundle` hook (`src/hooks/useBundle.js`) owns `quantities` (per variant id), `activeVariant` (which variant's stepper a card currently shows), and the open accordion step. Card steppers and review-panel steppers both call the same `setQty`, so they're always in sync by construction rather than being reconciled after the fact.
- **Per-variant quantities**: each variant has its own entry in `quantities`; switching a card's color chip only changes which variant is "active" for that card's stepper — it doesn't touch other variants' counts. The review panel lists every variant across every product with qty > 0, independent of which one is currently active on its card.
- **Pricing**: totals are computed as `Σ price×qty` (and `Σ compareAtPrice×qty`) across every line with qty > 0, plus shipping — this reconciles cleanly with "total / struck-through total / savings" from the design without special-casing the recurring plan line.
- **Persistence**: "Save my system for later" writes `{quantities, activeVariant}` to `localStorage`. On load, if a saved snapshot exists it's merged over the JSON's seed defaults; otherwise the JSON's `defaultQty` values seed the initial (pre-populated) state shown in the design.
- **Not finished / known gaps**:
  - The `products.json` seed values don't reproduce every exact dollar amount from the Figma screenshots pixel-for-pixel (this file predates the implementation pass and was reused as-is per the take-home's "JSON source you define" allowance) — the math itself (recompute, sync, savings) is verified correct against whatever values are in the JSON.
  - Product photography isn't included (see Data section above) — placeholders stand in.
  - Checkout is a placeholder confirmation state, no real flow, per the spec.
  - No automated tests; verification was manual (dev server + build) plus a scripted check of the pricing/selection-count math against the seed data.
