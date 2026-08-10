# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # vite dev server
npm run build     # tsc -b && vite build → dist/
npm run lint      # eslint .
npx tsc -b        # type-check only (no emit)
```

No test suite. There is no `preview`/single-test command beyond the above.

## What this is

A standalone, client-only Netherlands salary/tax calculator SPA. No backend, no accounts — see `ARCHITECTURE.md` for the original reusable scaffold this was derived from (that doc describes a Firebase/auth-enabled template; this app intentionally drops Firebase, `@tanstack/react-router`, and `@tanstack/react-query` since it's a single screen with no server state). What's kept from that scaffold: React 19 + TS + Vite 7, React Compiler, Tailwind v4 (CSS-based `@theme`, no `tailwind.config.js`), shadcn/ui in `src/components/ui/`, `cn()` in `src/lib/utils.ts`, `@/` path alias, Geist font, lucide-react, folder conventions (`shared/`, `features/`, `lib/`).

`src/main.tsx` renders `ThemeProvider` → `TaxCalculatorPage` directly — no router, no `App.tsx`.

## Architecture

### Tax calculation (`src/lib/nlTax.ts`)

Pure, no React imports. `calculateNetSalary(grossAnnual, thirtyPercentRuling, applyTaxCredits)` implements a Box 1 income tax estimate:
- Progressive bracket constants (`BRACKETS`) — currently 2025 published rates, since 2026 figures are not yet published. Update these constants in place when new rates are announced.
- 30%-ruling: taxes only 70% of gross annual income when enabled.
- Tax credits (`algemeneHeffingskorting`, `arbeidskorting`) are simplified piecewise-linear approximations of the real Belastingdienst formulas, gated by the `applyTaxCredits` flag — not exact, documented as estimates in the module's header comment.

This module is the correctness gate for the whole app — if you change constants or formulas here, sanity-check against known take-home ranges (see git history / PR discussion for reference figures) before trusting the UI.

### State (`src/features/tax-calculator/hooks/useTaxCalculator.ts`)

Single `useReducer` holds all app state (`grossAnnual`, `thirtyPercentRuling`, `applyTaxCredits`, `rows[]`). Persisted wholesale to `localStorage` under `nl-tax-calc-state` on every change, loaded on init with a `try/catch` fallback to `DEFAULT_STATE`.

The hook also computes the **waterfall**: starting from `calculateNetSalary(...).netMonthly`, each row in `rows[]` is reduced in order so every row's "gross" column is the running balance *before* that row's amount is subtracted, and "net" is the balance *after*. The last row's net is `finalNet`, shown in the sticky footer. This derivation is recomputed from state every render (no memoization needed — React Compiler handles it per the scaffold's convention of not hand-adding `useMemo`/`useCallback`).

Each row has an `amount`/`previousAmount` pair implementing the reset↔restore toggle button: zeroing a row stashes the old amount in `previousAmount`; restoring reads it back. Only non-`isDefault` (user-added) rows can be deleted.

`RESET_ALL` wipes state back to `DEFAULT_STATE` (fresh copies of `DEFAULT_ROWS`), effectively clearing `localStorage` on the next persist effect.

### Row layout (`src/features/tax-calculator/components/row-layout.ts`)

Shared Tailwind grid-column/width constants (`ROW_GRID_COLS`, `ROW_ACTIONS_WIDTH`) used by the header, `SalaryRow`, and `DeductionRow` so titles/amount/gross/net columns stay pixel-aligned across all rows despite each row being its own flex/grid container. Row actions (reset/restore, delete) live in a fixed-width slot *outside* the bordered card, not inside it — keep new row types consistent with this pattern rather than adding buttons inside the card.

### Component structure

```
features/tax-calculator/
  hooks/useTaxCalculator.ts     # state, reducer, derived waterfall, localStorage persistence
  components/
    TaxCalculatorPage.tsx       # composes everything; owns the header grid + confirm-guarded reset
    TopToggles.tsx              # 30%-ruling switch, tax-credits switch, ThemeToggle, reset-all button
    SalaryRow.tsx                # annual gross input row (no reset button)
    DeductionRow.tsx            # generic row: label, amount input, gross/net cols, reset/restore, delete
    AddRowForm.tsx               # title + amount + Add, used inside the sticky footer
    StickyFooter.tsx             # AddRowForm + initial gross + final net
    row-layout.ts                 # shared grid/width constants (see above)
```
