"use client"

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type AddItemFormProps = {
  onAdd: (name: string, amount: number) => void
  placeholder: string
}

export default function AddItemForm({ onAdd, placeholder }: AddItemFormProps) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && amount) {
      onAdd(name, parseFloat(amount))
      setName('')
      setAmount('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2 mb-4">
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={placeholder}
        className="flex-grow"
      />
      <Input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        className="w-24"
      />
      <Button type="submit" className="w-10 h-10 rounded-full p-0">+</Button>
    </form>
  )
}

