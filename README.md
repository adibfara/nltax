# NL Tax Calculator

**Live: https://adibfara.github.io/nltax/**

A standalone, client-only Netherlands salary/tax calculator. Enter your annual gross salary, toggle the 30%-ruling and tax credits, and stack up custom deduction/addition rows to see a running waterfall from gross to net.

No backend, no accounts — everything runs in the browser and state is persisted to `localStorage`.

## Features

- Box 1 income tax estimate using progressive brackets
- 30%-ruling toggle (taxes only 70% of gross income)
- Tax credits toggle (`algemene heffingskorting`, `arbeidskorting`)
- Add custom rows (bonuses, pension contributions, etc.) and see the gross → net waterfall update live
- Reset/restore individual rows, or reset the whole calculator
- Dark/light theme

## Development

```bash
npm install
npm run dev       # start dev server
npm run build     # type-check + production build → dist/
npm run lint      # eslint
npx tsc -b        # type-check only
```

## Tech stack

React 19 + TypeScript + Vite 7, Tailwind v4, shadcn/ui, React Compiler.

## Disclaimer

Tax credit formulas are simplified piecewise-linear approximations, not the exact Belastingdienst calculations. Bracket rates are for 2025 (2026 figures not yet published at time of writing). Use as an estimate, not tax advice.
