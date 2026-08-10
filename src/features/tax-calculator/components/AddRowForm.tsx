import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface AddRowFormProps {
  onAdd: (label: string, amount: number) => void
}

export function AddRowForm({ onAdd }: AddRowFormProps) {
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
    <div className="flex flex-1 items-center gap-2">
      <Input
        placeholder="New expense name"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        className="max-w-48"
      />
      <Input
        type="number"
        min={0}
        step={10}
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        className="max-w-28"
      />
      <Button type="button" size="sm" onClick={handleAdd}>
        <Plus className="size-3.5" />
        Add
      </Button>
    </div>
  )
}
