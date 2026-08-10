import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AddRowFormProps {
  onAdd: (label: string, amount: number) => void
  className?: string
}

export function AddRowForm({ onAdd, className }: AddRowFormProps) {
  const [label, setLabel] = useState('')
  const [amount, setAmount] = useState('')

  function handleAdd() {
    const trimmedLabel = label.trim()
    const parsedAmount = Number(amount)
    if (!trimmedLabel || !Number.isFinite(parsedAmount) || parsedAmount <= 0) return

    onAdd(trimmedLabel, parsedAmount)
    setLabel('')
    setAmount('')
  }

  return (
    <div className={cn('flex w-full items-center gap-1.5 sm:w-auto sm:flex-1 sm:gap-2', className)}>
      <Input
        placeholder="New expense name"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        className="min-w-0 flex-1 sm:max-w-48"
      />
      <Input
        type="number"
        min={0}
        step={10}
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        className="min-w-0 flex-1 sm:max-w-28 sm:flex-none"
      />
      <Button type="button" size="sm" onClick={handleAdd}>
        <Plus className="size-3.5" />
        Add
      </Button>
    </div>
  )
}
