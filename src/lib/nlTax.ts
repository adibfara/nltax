/**
 * Netherlands Box 1 income tax estimator.
 *
 * Figures below are the published 2025 rates/thresholds (2026 brackets are
 * not yet published by the Belastingdienst as of writing). Swap the
 * constants in this file once 2026 numbers are confirmed. Tax credits are
 * simplified piecewise-linear approximations of the real (more granular)
 * arbeidskorting/algemene heffingskorting formulas — close enough for
 * estimation, not payroll-accurate.
 */

const BRACKETS = [
  { upTo: 38_441, rate: 0.3582 },
  { upTo: 76_817, rate: 0.3748 },
  { upTo: null, rate: 0.495 },
] as const

const ALGEMENE_HEFFINGSKORTING_MAX = 3_068
const ALGEMENE_HEFFINGSKORTING_PHASEOUT_START = 28_406
const ALGEMENE_HEFFINGSKORTING_PHASEOUT_END = 76_817

const ARBEIDSKORTING_MAX = 5_599
const ARBEIDSKORTING_PEAK_INCOME = 43_000
const ARBEIDSKORTING_PHASEOUT_END = 129_000

export interface NetSalaryResult {
  grossAnnual: number
  grossMonthly: number
  taxableAnnual: number
  incomeTaxAnnual: number
  algemeneHeffingskorting: number
  arbeidskorting: number
  netAnnual: number
  netMonthly: number
}

function taxOnBrackets(taxableIncome: number): number {
  let tax = 0
  let lowerBound = 0

  for (const bracket of BRACKETS) {
    const upperBound = bracket.upTo ?? Infinity
    if (taxableIncome <= lowerBound) break
    const amountInBracket = Math.min(taxableIncome, upperBound) - lowerBound
    tax += amountInBracket * bracket.rate
    lowerBound = upperBound
  }

  return tax
}

function algemeneHeffingskorting(income: number): number {
  if (income <= ALGEMENE_HEFFINGSKORTING_PHASEOUT_START) return ALGEMENE_HEFFINGSKORTING_MAX
  if (income >= ALGEMENE_HEFFINGSKORTING_PHASEOUT_END) return 0

  const phaseoutSpan = ALGEMENE_HEFFINGSKORTING_PHASEOUT_END - ALGEMENE_HEFFINGSKORTING_PHASEOUT_START
  const progress = (income - ALGEMENE_HEFFINGSKORTING_PHASEOUT_START) / phaseoutSpan
  return ALGEMENE_HEFFINGSKORTING_MAX * (1 - progress)
}

function arbeidskorting(income: number): number {
  if (income <= 0) return 0
  if (income < ARBEIDSKORTING_PEAK_INCOME) {
    return ARBEIDSKORTING_MAX * (income / ARBEIDSKORTING_PEAK_INCOME)
  }
  if (income >= ARBEIDSKORTING_PHASEOUT_END) return 0

  const phaseoutSpan = ARBEIDSKORTING_PHASEOUT_END - ARBEIDSKORTING_PEAK_INCOME
  const progress = (income - ARBEIDSKORTING_PEAK_INCOME) / phaseoutSpan
  return ARBEIDSKORTING_MAX * (1 - progress)
}

export function calculateNetSalary(
  grossAnnual: number,
  thirtyPercentRuling: boolean,
  applyTaxCredits: boolean,
): NetSalaryResult {
  const safeGrossAnnual = Math.max(0, grossAnnual)
  const taxableAnnual = thirtyPercentRuling ? safeGrossAnnual * 0.7 : safeGrossAnnual

  const incomeTaxAnnual = taxOnBrackets(taxableAnnual)

  const credits = applyTaxCredits
    ? {
        algemeneHeffingskorting: algemeneHeffingskorting(safeGrossAnnual),
        arbeidskorting: arbeidskorting(safeGrossAnnual),
      }
    : { algemeneHeffingskorting: 0, arbeidskorting: 0 }

  const netTaxAnnual = Math.max(
    0,
    incomeTaxAnnual - credits.algemeneHeffingskorting - credits.arbeidskorting,
  )

  const netAnnual = safeGrossAnnual - netTaxAnnual

  return {
    grossAnnual: safeGrossAnnual,
    grossMonthly: safeGrossAnnual / 12,
    taxableAnnual,
    incomeTaxAnnual: netTaxAnnual,
    algemeneHeffingskorting: credits.algemeneHeffingskorting,
    arbeidskorting: credits.arbeidskorting,
    netAnnual,
    netMonthly: netAnnual / 12,
  }
}
