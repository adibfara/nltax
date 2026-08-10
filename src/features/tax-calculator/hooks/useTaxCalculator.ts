import { useEffect, useReducer } from 'react'
import { calculateNetSalary } from '@/lib/nlTax'

export interface RowState {
  id: string
  label: string
  amount: number
  previousAmount: number
  isDefault: boolean
}

export interface CalculatorState {
  grossAnnual: number
  thirtyPercentRuling: boolean
  applyTaxCredits: boolean
  rows: RowState[]
}

type Action =
  | { type: 'SET_GROSS_ANNUAL'; value: number }
  | { type: 'TOGGLE_RULING' }
  | { type: 'TOGGLE_TAX_CREDITS' }
  | { type: 'SET_ROW_AMOUNT'; id: string; amount: number }
  | { type: 'TOGGLE_ROW_ZERO'; id: string }
  | { type: 'ADD_ROW'; label: string; amount: number }
  | { type: 'REMOVE_ROW'; id: string }
  | { type: 'RESET_ALL' }

const STORAGE_KEY = 'nl-tax-calc-state'

function genId(): string {
  return crypto.randomUUID()
}

const DEFAULT_ROWS: RowState[] = [
  { id: 'rent', label: 'Rent', amount: 2000, previousAmount: 2000, isDefault: true },
  {
    id: 'health-insurance',
    label: 'Insurance',
    amount: 140,
    previousAmount: 140,
    isDefault: true,
  },
  { id: 'utilities', label: 'Utilities', amount: 175, previousAmount: 175, isDefault: true },
  {
    id: 'groceries',
    label: 'Groceries',
    amount: 350,
    previousAmount: 350,
    isDefault: true,
  },
  { id: 'transport', label: 'Transport', amount: 100, previousAmount: 100, isDefault: true },
  {
    id: 'phone-internet',
    label: 'Phone & internet',
    amount: 50,
    previousAmount: 50,
    isDefault: true,
  },
]

const DEFAULT_STATE: CalculatorState = {
  grossAnnual: 100_000,
  thirtyPercentRuling: true,
  applyTaxCredits: true,
  rows: DEFAULT_ROWS,
}

function loadInitialState(): CalculatorState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    const parsed = JSON.parse(raw) as CalculatorState
    if (!parsed || !Array.isArray(parsed.rows)) return DEFAULT_STATE
    return parsed
  } catch {
    return DEFAULT_STATE
  }
}

function reducer(state: CalculatorState, action: Action): CalculatorState {
  switch (action.type) {
    case 'SET_GROSS_ANNUAL':
      return { ...state, grossAnnual: Math.max(0, action.value) }
    case 'TOGGLE_RULING':
      return { ...state, thirtyPercentRuling: !state.thirtyPercentRuling }
    case 'TOGGLE_TAX_CREDITS':
      return { ...state, applyTaxCredits: !state.applyTaxCredits }
    case 'SET_ROW_AMOUNT':
      return {
        ...state,
        rows: state.rows.map((row) =>
          row.id === action.id
            ? { ...row, amount: Math.max(0, action.amount), previousAmount: row.amount > 0 ? row.amount : row.previousAmount }
            : row,
        ),
      }
    case 'TOGGLE_ROW_ZERO':
      return {
        ...state,
        rows: state.rows.map((row) => {
          if (row.id !== action.id) return row
          if (row.amount > 0) {
            return { ...row, amount: 0, previousAmount: row.amount }
          }
          return { ...row, amount: row.previousAmount }
        }),
      }
    case 'ADD_ROW':
      return {
        ...state,
        rows: [
          ...state.rows,
          {
            id: genId(),
            label: action.label,
            amount: action.amount,
            previousAmount: action.amount,
            isDefault: false,
          },
        ],
      }
    case 'REMOVE_ROW':
      return { ...state, rows: state.rows.filter((row) => row.id !== action.id) }
    case 'RESET_ALL':
      return { ...DEFAULT_STATE, rows: DEFAULT_ROWS.map((row) => ({ ...row })) }
    default:
      return state
  }
}

export interface RowWaterfall extends RowState {
  grossBefore: number
  netAfter: number
}

export function useTaxCalculator() {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const salaryResult = calculateNetSalary(
    state.grossAnnual,
    state.thirtyPercentRuling,
    state.applyTaxCredits,
  )

  const waterfall: RowWaterfall[] = []
  let runningBalance = salaryResult.netMonthly
  for (const row of state.rows) {
    const grossBefore = runningBalance
    const netAfter = grossBefore - row.amount
    waterfall.push({ ...row, grossBefore, netAfter })
    runningBalance = netAfter
  }

  const finalNet = waterfall.length > 0 ? waterfall[waterfall.length - 1].netAfter : salaryResult.netMonthly

  return {
    state,
    dispatch,
    salaryResult,
    waterfall,
    finalNet,
  }
}
