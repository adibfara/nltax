import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { formatEuro } from '@/lib/format'
import { cn } from '@/lib/utils'
import { RotateCcw, Trash2 } from 'lucide-react'
import type { RowWaterfall } from '../hooks/useTaxCalculator'
import { ROW_ACTIONS_WIDTH, ROW_GRID_COLS, ROW_TITLE_COLS } from './row-layout'

interface DeductionRowProps {
  row: RowWaterfall
  onAmountChange: (id: string, amount: number) => void
  onToggleZero: (id: string) => void
  onRemove: (id: string) => void
}

export function DeductionRow({ row, onAmountChange, onToggleZero, onRemove }: DeductionRowProps) {
  const isNegative = row.netAfter < 0

  return (
    <div className="flex items-center gap-1.5 sm:gap-3">
      <div
        className={`grid flex-1 items-center gap-x-2 gap-y-1 rounded-lg border bg-card px-2 py-2 sm:gap-4 sm:px-4 sm:py-3 ${ROW_GRID_COLS}`}
      >
        <span className={`truncate text-sm font-medium ${ROW_TITLE_COLS}`}>{row.label}</span>
        <Input
          type="number"
          min={0}
          step={10}
          value={row.amount}
          onChange={(e) => onAmountChange(row.id, Number(e.target.value))}
        />
        <div className="text-right text-sm tabular-nums text-muted-foreground">
          {formatEuro(row.grossBefore)}
        </div>
        <div
          className={cn(
            'text-right text-sm font-semibold tabular-nums',
            isNegative && 'text-destructive',
          )}
        >
          {formatEuro(row.netAfter)}
        </div>
      </div>
      <div className={`flex shrink-0 items-center justify-start gap-0.5 sm:gap-1 ${ROW_ACTIONS_WIDTH}`}>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onToggleZero(row.id)}
          aria-label={row.amount > 0 ? 'Reset to 0' : 'Restore previous amount'}
          title={row.amount > 0 ? 'Reset to 0' : 'Restore previous amount'}
        >
          <RotateCcw className="size-3.5" />
        </Button>
        {!row.isDefault && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove(row.id)}
            aria-label="Delete row"
            title="Delete row"
          >
            <Trash2 className="size-3.5" />
          </Button>
        )}
      </div>
    </div>
  )
}
