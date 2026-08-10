import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { formatEuro } from '@/lib/format'
import { RotateCcw } from 'lucide-react'
import { ROW_ACTIONS_WIDTH, ROW_GRID_COLS, ROW_TITLE_COLS } from './row-layout'

interface SalaryRowProps {
  grossAnnual: number
  grossMonthly: number
  netMonthly: number
  onChange: (value: number) => void
  onReset: () => void
}

export function SalaryRow({ grossAnnual, grossMonthly, netMonthly, onChange, onReset }: SalaryRowProps) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-3">
      <div
        className={`grid flex-1 items-center gap-x-2 gap-y-1 rounded-lg border bg-card px-2 py-2 sm:gap-4 sm:px-4 sm:py-3 ${ROW_GRID_COLS}`}
      >
        <span className={`truncate text-sm font-medium ${ROW_TITLE_COLS}`}>Gross annual salary</span>
        <Input
          type="number"
          min={0}
          step={1000}
          value={grossAnnual}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <div className="text-right text-sm tabular-nums text-muted-foreground">
          {formatEuro(grossMonthly)}
        </div>
        <div className="text-right text-sm font-semibold tabular-nums">
          {formatEuro(netMonthly)}
        </div>
      </div>
      <div className={`flex shrink-0 items-center justify-start gap-0.5 sm:gap-1 ${ROW_ACTIONS_WIDTH}`}>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onReset}
          aria-label="Reset to default"
          title="Reset to default"
        >
          <RotateCcw className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}
