import { toast } from "@/hooks/use-toast";

const expenseBasePath = "/api/expenses";

export async function getExpenseList() {
    try {
        const response = await fetch(expenseBasePath);
        if (!response.ok) throw new Error("Failed to fetch expenses");
        return await response.json();
    } catch (error) {
        console.error("Error fetching expenses:", error);
        toast({
            title: "Error",
            description: "Failed to load expenses. Please try again.",
            variant: "destructive",
        });
    }
}
