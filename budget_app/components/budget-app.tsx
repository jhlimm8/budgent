"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import AddItemForm from './add-item-form'
import DisplayList from './display-list'
import TotalDisplay from './total-display'

type Item = {
  id: number
  name: string
  amount: number
}

export default function BudgetApp() {
  const [incomes, setIncomes] = useState<Item[]>([])
  const [expenses, setExpenses] = useState<Item[]>([])
  const [isIncomeMinimized, setIsIncomeMinimized] = useState(false)
  const [isExpensesMinimized, setIsExpensesMinimized] = useState(false)
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false)

  const toggleIncomeMinimize = () => setIsIncomeMinimized(prev => !prev)
  const toggleExpensesMinimize = () => setIsExpensesMinimized(prev => !prev)

  const addIncome = (name: string, amount: number) => {
    setIncomes([...incomes, { id: Date.now(), name, amount }])
  }

  const addExpense = (name: string, amount: number) => {
    setExpenses([...expenses, { id: Date.now(), name, amount }])
  }

  const editItem = (items: Item[], setItems: React.Dispatch<React.SetStateAction<Item[]>>) => 
    (id: number, name: string, amount: number) => {
      setItems(items.map(item => 
        item.id === id ? { ...item, name, amount } : item
      ))
    }

  const deleteItem = (items: Item[], setItems: React.Dispatch<React.SetStateAction<Item[]>>) => 
    (id: number) => {
      setItems(items.filter(item => item.id !== id))
    }

  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0)
  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0)
  const surplus = totalIncome - totalExpense

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Income Name,Income Amount,Expense Name,Expense Amount\n"
      + incomes.map((income, index) => {
        const expense = expenses[index] || { name: '', amount: '' }
        return `${income.name},${income.amount},${expense.name},${expense.amount}`
      }).join("\n")
      + expenses.slice(incomes.length).map(expense => `,,${expense.name},${expense.amount}`).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "budget_data.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const loadData = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const lines = content.split('\n')
      const newIncomes: Item[] = []
      const newExpenses: Item[] = []
      
      lines.slice(1).forEach(line => {
        const [incomeName, incomeAmount, expenseName, expenseAmount] = line.split(',')
        if (incomeName && incomeAmount) {
          newIncomes.push({ id: Date.now() + newIncomes.length, name: incomeName, amount: parseFloat(incomeAmount) })
        }
        if (expenseName && expenseAmount) {
          newExpenses.push({ id: Date.now() + newExpenses.length, name: expenseName, amount: parseFloat(expenseAmount) })
        }
      })

      setIncomes(newIncomes)
      setExpenses(newExpenses)
      setIsLoadDialogOpen(false)
    }
    reader.readAsText(file)
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <Dialog open={isLoadDialogOpen} onOpenChange={setIsLoadDialogOpen}>
          <DialogTrigger asChild>
            <Button>Load Data</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Load Budget Data</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      loadData(file)
                    }
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <h1 className="text-3xl font-bold text-center">Budget App</h1>
        <Button onClick={exportData}>Export Data</Button>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Income</CardTitle>
          <span className="text-sm font-bold text-green-600">
            Total: ${totalIncome.toFixed(2)}
          </span>
        </CardHeader>
        <CardContent>
          <AddItemForm onAdd={addIncome} placeholder="Add an income" />
          <DisplayList 
            items={incomes} 
            onEdit={editItem(incomes, setIncomes)}
            onDelete={deleteItem(incomes, setIncomes)}
            isExpense={false}
            isMinimized={isIncomeMinimized}
            onToggleMinimize={toggleIncomeMinimize}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Expenses</CardTitle>
          <span className="text-sm font-bold text-red-600">
            Total: ${totalExpense.toFixed(2)}
          </span>
        </CardHeader>
        <CardContent>
          <AddItemForm onAdd={addExpense} placeholder="Add an expense" />
          <DisplayList 
            items={expenses} 
            onEdit={editItem(expenses, setExpenses)}
            onDelete={deleteItem(expenses, setExpenses)}
            isExpense={true}
            isMinimized={isExpensesMinimized}
            onToggleMinimize={toggleExpensesMinimize}
          />
        </CardContent>
      </Card>

      <TotalDisplay income={totalIncome} expense={totalExpense} surplus={surplus} />
    </div>
  )
}

