"use client";

import { Loader } from "@/components/common/loader";
import { AddExpenseDialog } from "@/components/expense/AddExpenseDialog";
import { ExpenseCard } from "@/components/expense/ExpenseCard";
import { DateRangeFilter } from "@/components/finance/DateRangeFilter";
import { UpcomingSidebar } from "@/components/finance/UpcomingSidebar";
import { SearchInput } from "@/components/ui/search-input";
import { getExpenseList } from "@/services/ExpenseService";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

export function ExpenseList() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    const fetchExpenses = async () => {
        setLoading(true);
        const response = await getExpenseList();
        setExpenses(response ?? []);
        setLoading(false);
    };

    // Filter expenses based on search query
    useEffect(() => {
        const filtered = expenses.filter((expense) => {
            const searchString = searchQuery.toLowerCase();
            return (
                expense.title?.toLowerCase().includes(searchString) ||
                expense.description?.toLowerCase().includes(searchString) ||
                expense.category?.toLowerCase().includes(searchString)
            );
        });
        setFilteredExpenses(filtered);
    }, [expenses, searchQuery]);

    useEffect(() => {
        fetchExpenses();
    }, [dateRange]);

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row">
                <div className="w-full md:w-[300px]">
                    <SearchInput
                        placeholder="Search expenses..."
                        value={searchQuery}
                        onChange={setSearchQuery}
                    />
                </div>
                <DateRangeFilter onDateRangeChange={setDateRange} />
                <div className="ml-auto">
                    <AddExpenseDialog onSuccess={fetchExpenses} />
                </div>
            </div>
            <div className="grid grid-cols-4 gap-4 w-full">
                {loading ? (
                    <div className="col-span-3 flex justify-center items-center">
                        <Loader />
                    </div>
                ) : filteredExpenses.length === 0 ? (
                    <div className="text-center text-muted-foreground col-span-3">
                        {expenses.length === 0
                            ? "No expenses found. Add your first expense using the button above."
                            : "No expenses match your search."}
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 col-span-3 h-fit">
                        {filteredExpenses.map((expense) => (
                            <ExpenseCard
                                key={expense.id}
                                expense={expense}
                                onUpdate={fetchExpenses}
                            />
                        ))}
                    </div>
                )}
                <div className="col-span-1 flex justify-end">
                    <UpcomingSidebar type="expenses" />
                </div>
            </div>
        </div>
    );
}
