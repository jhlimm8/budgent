import { useState, useEffect, useRef } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type EditItemFormProps = {
  item: { id: number; name: string; amount: number }
  onSave: (id: number, name: string, amount: number) => void
  onCancel: () => void
  onDelete: (id: number) => void
}

export default function EditItemForm({ item, onSave, onCancel, onDelete }: EditItemFormProps) {
  const [name, setName] = useState(item.name)
  const [amount, setAmount] = useState(item.amount.toString())
  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    nameInputRef.current?.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && amount) {
      onSave(item.id, name, parseFloat(amount))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <Input
        ref={nameInputRef}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-24 flex-shrink-0"
      />
      <div className="flex space-x-2 ml-2">
        <Button type="submit" className="rounded-full px-4">✓</Button>
        <Button type="button" onClick={() => onDelete(item.id)} className="rounded-full px-4 bg-red-500 hover:bg-red-600">-</Button>
        <Button type="button" onClick={onCancel} className="rounded-full px-4">×</Button>
      </div>
    </form>
  )
}

