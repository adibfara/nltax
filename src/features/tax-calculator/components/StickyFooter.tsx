import { AddRowForm } from './AddRowForm'
import { formatEuro } from '@/lib/format'

interface StickyFooterProps {
  initialGrossMonthly: number
  finalNet: number
  onAddRow: (label: string, amount: number) => void
}

export function StickyFooter({ initialGrossMonthly, finalNet, onAddRow }: StickyFooterProps) {
  return (
    <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-4 border-t bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <AddRowForm onAdd={onAddRow} />
      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Initial gross / mo</div>
          <div className="text-sm font-semibold tabular-nums">{formatEuro(initialGrossMonthly)}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Final net / mo</div>
          <div
            className={`text-lg font-bold tabular-nums ${finalNet < 0 ? 'text-destructive' : 'text-success'}`}
          >
            {formatEuro(finalNet)}
          </div>
        </div>
      </div>
    </div>
  )
}
