import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type TotalDisplayProps = {
  income: number
  expense: number
  surplus: number
}

export default function TotalDisplay({ income, expense, surplus }: TotalDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <span>Total Income:</span>
          <span className="font-semibold text-green-600">${income.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span>Total Expenses:</span>
          <span className="font-semibold text-red-600">${expense.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t">
          <span>Surplus/Deficit:</span>
          <span className={`font-bold ${surplus >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${surplus.toFixed(2)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

