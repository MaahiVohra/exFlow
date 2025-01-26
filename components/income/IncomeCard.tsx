"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DeleteAlert } from "@/components/ui/delete-alert"
import { useToast } from "@/hooks/use-toast"
import { formatDate } from "@/lib/utils"
import { EditIncomeDialog } from "./EditIncomeDialog"

interface IncomeCardProps {
  income: {
    id: number
    title: string
    amount: number
    source: string
    sourceColor: string
    date: string
    description?: string
  }
  onUpdate: () => void
}

function getCategoryColorClass(color: string) {
  return {
    bg: `bg-${color}-500/10 dark:bg-${color}-500/20`,
    text: `text-${color}-500 dark:text-${color}-400`,
    border: `border-${color}-500/20 dark:border-${color}-500/30`
  };
}

export function IncomeCard({ income, onUpdate }: IncomeCardProps) {
  const { toast } = useToast()
  const colors = getCategoryColorClass(income.sourceColor)

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/income/${income.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete income');
      }

      toast({
        title: "Success",
        description: "Income deleted successfully",
      });

      onUpdate();
    } catch (error) {
      console.error('Error deleting income:', error);
      toast({
        title: "Error",
        description: "Failed to delete income. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-emerald-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-semibold">
            {income.title}
          </CardTitle>
          <div className="mt-1">
            <Badge className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${colors.bg} ${colors.text} ${colors.border}`}>
              {income.source}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold text-emerald-400">
          ₹{income.amount.toFixed(2)}
          </div>
          <EditIncomeDialog income={income} onUpdate={onUpdate} />
          <DeleteAlert
            title="Delete Income"
            description="Are you sure you want to delete this income record? This action cannot be undone."
            onDelete={handleDelete}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          {formatDate(income.date)}
        </div>
        {income.description && (
          <p className="mt-2 text-sm text-muted-foreground">
            {income.description}
          </p>
        )}
      </CardContent>
    </Card>
  )
} 