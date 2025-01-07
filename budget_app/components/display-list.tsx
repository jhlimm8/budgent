import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import EditItemForm from './edit-item-form'

type Item = {
  id: number
  name: string
  amount: number
}

type DisplayListProps = {
  items: Item[]
  onEdit: (id: number, name: string, amount: number) => void
  onDelete: (id: number) => void
  isExpense: boolean
  isMinimized: boolean
  onToggleMinimize: () => void
}

export default function DisplayList({ items, onEdit, onDelete, isExpense, isMinimized, onToggleMinimize }: DisplayListProps) {
  const [editingId, setEditingId] = useState<number | null>(null)

  return (
    <div>
      <div className="flex justify-end mb-2">
        <button 
          onClick={onToggleMinimize}
          className="p-1 rounded-full hover:bg-gray-200 transition-colors"
        >
          {isMinimized ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>
      </div>
      <ul className={`space-y-2 transition-all duration-200 ease-in-out ${isMinimized ? 'h-0 overflow-hidden' : ''}`}>
        {items.map((item) => (
          <li key={item.id} className="flex items-center text-sm">
            {editingId === item.id ? (
              <EditItemForm
                item={item}
                onSave={(id, name, amount) => {
                  onEdit(id, name, amount)
                  setEditingId(null)
                }}
                onCancel={() => setEditingId(null)}
                onDelete={onDelete}
              />
            ) : (
              <div
                className="flex justify-between items-center w-full cursor-pointer"
                onDoubleClick={() => setEditingId(item.id)}
              >
                <span>{item.name}</span>
                <span className={`font-semibold ${isExpense ? 'text-red-600' : 'text-green-600'}`}>
                  ${item.amount.toFixed(2)}
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

