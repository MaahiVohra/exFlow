"use client";

import { Loader } from "@/components/common/loader";
import { DateRangeFilter } from "@/components/finance/DateRangeFilter";
import { UpcomingSidebar } from "@/components/finance/UpcomingSidebar";
import { AddIncomeDialog } from "@/components/income/AddIncomeDialog";
import { SearchInput } from "@/components/ui/search-input";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { IncomeCard } from "./IncomeCard";

interface Income {
    id: number;
    title: string;
    amount: number;
    source: string;
    sourceColor: string;
    date: string;
    description?: string;
}

export function IncomeList() {
    const [income, setIncome] = useState<Income[]>([]);
    const [filteredIncome, setFilteredIncome] = useState<Income[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const { toast } = useToast();
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    const fetchIncome = async () => {
        try {
            let url = "/api/income";
            if (dateRange?.from && dateRange?.to) {
                const params = new URLSearchParams({
                    startDate: format(dateRange.from, "yyyy-MM-dd"),
                    endDate: format(dateRange.to, "yyyy-MM-dd"),
                });
                url += `?${params.toString()}`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch income");
            }
            const data = await response.json();
            setIncome(data);
        } catch (error) {
            console.error("Error fetching income:", error);
            toast({
                title: "Error",
                description: "Failed to load income. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // Filter income based on search query
    useEffect(() => {
        const filtered = income.filter((item) => {
            const searchString = searchQuery.toLowerCase();
            return (
                item.title.toLowerCase().includes(searchString) ||
                item.description?.toLowerCase().includes(searchString) ||
                item.source.toLowerCase().includes(searchString)
            );
        });
        setFilteredIncome(filtered);
    }, [income, searchQuery]);

    useEffect(() => {
        fetchIncome();
    }, [dateRange]);

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row">
                <div className="w-full md:w-[300px]">
                    <SearchInput
                        placeholder="Search income..."
                        value={searchQuery}
                        onChange={setSearchQuery}
                    />
                </div>
                <DateRangeFilter onDateRangeChange={setDateRange} />
                <div className="ml-auto">
                    <AddIncomeDialog onSuccess={fetchIncome} />
                </div>
            </div>
            <div className="grid gap-4 grid-cols-4">
                {loading ? (
                    <div className="col-span-3 flex justify-center items-center">
                        <Loader />
                    </div>
                ) : filteredIncome.length === 0 ? (
                    <div className="text-center text-muted-foreground col-span-3">
                        {income.length === 0
                            ? "No income records found. Add your first income using the button above."
                            : "No income records match your search."}
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 col-span-3">
                        {filteredIncome.map((item) => (
                            <IncomeCard
                                key={item.id}
                                income={item}
                                onUpdate={fetchIncome}
                            />
                        ))}
                    </div>
                )}
                <div className="col-span-1 flex justify-end">
                    <UpcomingSidebar type="income" />
                </div>
            </div>
        </div>
    );
}
