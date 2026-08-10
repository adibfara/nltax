import { AddRowForm } from './AddRowForm'
import { formatEuro } from '@/lib/format'

interface StickyFooterProps {
  initialGrossMonthly: number
  finalNet: number
  onAddRow: (label: string, amount: number) => void
}

export function StickyFooter({ initialGrossMonthly, finalNet, onAddRow }: StickyFooterProps) {
  return (
    <div className="sticky bottom-0 flex flex-col gap-2 border-t bg-background/95 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:px-4 sm:py-3">
      <div className="order-1 flex items-center justify-between gap-3 sm:order-none sm:justify-end sm:gap-6">
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
      <AddRowForm onAdd={onAddRow} className="order-2 sm:order-none" />
    </div>
  )
}
