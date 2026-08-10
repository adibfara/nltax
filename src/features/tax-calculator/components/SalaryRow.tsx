import { Input } from '@/components/ui/input'
import { formatEuro } from '@/lib/format'
import { ROW_GRID_COLS } from './row-layout'

interface SalaryRowProps {
  grossAnnual: number
  grossMonthly: number
  netMonthly: number
  onChange: (value: number) => void
}

export function SalaryRow({ grossAnnual, grossMonthly, netMonthly, onChange }: SalaryRowProps) {
  return (
    <div className="flex items-center gap-3">
      <div className={`grid flex-1 items-center gap-4 rounded-lg border bg-card px-4 py-3 ${ROW_GRID_COLS}`}>
        <span className="truncate text-sm font-medium">Gross annual salary</span>
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
      <div className="w-32 shrink-0" />
    </div>
  )
}
