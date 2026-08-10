import { useTaxCalculator } from '../hooks/useTaxCalculator'
import { TopToggles } from './TopToggles'
import { SalaryRow } from './SalaryRow'
import { DeductionRow } from './DeductionRow'
import { StickyFooter } from './StickyFooter'
import { ROW_ACTIONS_WIDTH, ROW_GRID_COLS } from './row-layout'

export function TaxCalculatorPage() {
  const { state, dispatch, salaryResult, waterfall, finalNet } = useTaxCalculator()

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col">
      <div className="flex-1 space-y-4 px-4 pt-8 pb-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">NL Salary Calculator</h1>
            <p className="text-sm text-muted-foreground">
              Estimate only, based on 2025 published Box 1 rates. Not payroll-accurate.
            </p>
          </div>
          <TopToggles
            thirtyPercentRuling={state.thirtyPercentRuling}
            applyTaxCredits={state.applyTaxCredits}
            onToggleRuling={() => dispatch({ type: 'TOGGLE_RULING' })}
            onToggleTaxCredits={() => dispatch({ type: 'TOGGLE_TAX_CREDITS' })}
            onResetAll={() => {
              if (confirm('Clear all data and restore defaults?')) {
                dispatch({ type: 'RESET_ALL' })
              }
            }}
          />
        </div>

        <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
          <div className={`grid flex-1 gap-4 px-4 ${ROW_GRID_COLS}`}>
            <span>Item</span>
            <span>Amount</span>
            <span className="text-right">Gross</span>
            <span className="text-right">Net</span>
          </div>
          <div className={`shrink-0 ${ROW_ACTIONS_WIDTH}`} />
        </div>

        <SalaryRow
          grossAnnual={state.grossAnnual}
          grossMonthly={salaryResult.grossMonthly}
          netMonthly={salaryResult.netMonthly}
          onChange={(value) => dispatch({ type: 'SET_GROSS_ANNUAL', value })}
        />

        <div className="space-y-2">
          {waterfall.map((row) => (
            <DeductionRow
              key={row.id}
              row={row}
              onAmountChange={(id, amount) => dispatch({ type: 'SET_ROW_AMOUNT', id, amount })}
              onToggleZero={(id) => dispatch({ type: 'TOGGLE_ROW_ZERO', id })}
              onRemove={(id) => dispatch({ type: 'REMOVE_ROW', id })}
            />
          ))}
        </div>
      </div>

      <StickyFooter
        initialGrossMonthly={salaryResult.grossMonthly}
        finalNet={finalNet}
        onAddRow={(label, amount) => dispatch({ type: 'ADD_ROW', label, amount })}
      />
    </div>
  )
}
