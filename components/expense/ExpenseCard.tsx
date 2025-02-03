"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteAlert } from "@/components/ui/delete-alert";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { EditExpenseDialog } from "./EditExpenseDialog";

function getCategoryColorClass(color: string = "gray") {
    return {
        bg: `bg-${color}-500/10 dark:bg-${color}-500/20`,
        text: `text-${color}-500 dark:text-${color}-400`,
        border: `border-${color}-500/20 dark:border-${color}-500/30`,
    };
}

export function ExpenseCard({
    expense,
    onUpdate,
}: {
    expense: Expense;
    onUpdate: () => void;
}) {
    const { toast } = useToast();
    const colors = getCategoryColorClass(expense.categoryColor);

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/expenses/${expense.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete expense");
            }

            toast({
                title: "Success",
                description: "Expense deleted successfully",
            });

            onUpdate();
        } catch (error) {
            console.error("Error deleting expense:", error);
            toast({
                title: "Error",
                description: "Failed to delete expense. Please try again.",
                variant: "destructive",
            });
        }
    };
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                    <CardTitle className="text-base font-semibold">
                        {expense.title}
                    </CardTitle>
                    <div className="mt-1">
                        <Badge
                            className={`!${colors.bg} !${colors.text} !${colors.border}`}
                        >
                            {expense.category}
                        </Badge>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold">
                        ₹{expense.amount?.toFixed(2)}
                    </div>
                    <EditExpenseDialog expense={expense} onUpdate={onUpdate} />
                    <DeleteAlert
                        title="Delete Expense"
                        description="Are you sure you want to delete this expense? This action cannot be undone."
                        onDelete={handleDelete}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-xs text-muted-foreground">
                    {expense.date && formatDate(expense.date)}
                </div>
                {expense.description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                        {expense.description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
