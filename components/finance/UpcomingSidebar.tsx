"use client";

import { formatDate } from "@/lib/utils";
import { addDays, format } from "date-fns";
import { useEffect, useState } from "react";
import { Loader } from "../common/loader";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";

interface FinanceItem {
    id: number;
    title: string;
    amount: number;
    date: string;
    category?: string;
    source?: string;
    categoryColor?: string;
    sourceColor?: string;
}

interface UpcomingSidebarProps {
    type: "expenses" | "income";
}

export function UpcomingSidebar({ type }: UpcomingSidebarProps) {
    const [loading, setLoading] = useState(true);
    const [upcomingItems, setUpcomingItems] = useState<FinanceItem[]>([]);

    useEffect(() => {
        const fetchUpcoming = async () => {
            setLoading(true);
            try {
                const today = new Date();
                const tenDaysLater = addDays(today, 10);
                const params = new URLSearchParams({
                    startDate: format(today, "yyyy-MM-dd"),
                    endDate: format(tenDaysLater, "yyyy-MM-dd"),
                });

                const endpoint =
                    type === "expenses" ? "/api/expenses" : "/api/income";
                const response = await fetch(`${endpoint}?${params}`);
                const data = await response.json();
                setUpcomingItems(data);
            } catch (error) {
                console.error("Error fetching upcoming items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUpcoming();
    }, [type]);

    function getCategoryColorClass(color: string) {
        return {
            bg: `bg-${color}-500/10 dark:bg-${color}-500/20`,
            text: `text-${color}-500 dark:text-${color}-400`,
            border: `border-${color}-500/20 dark:border-${color}-500/30`,
        };
    }

    return (
        <Card className="w-[300px]">
            <CardHeader>
                <CardTitle className="text-lg">
                    Upcoming {type === "expenses" ? "Expenses" : "Income"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                    {loading ? (
                        <div className="flex justify-center items-center h-[200px]">
                            <Loader />
                        </div>
                    ) : upcomingItems.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No upcoming{" "}
                            {type === "expenses" ? "expenses" : "income"} in the
                            next 10 days
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {upcomingItems.map((item) => {
                                const colors = getCategoryColorClass(
                                    (type === "expenses"
                                        ? item.categoryColor
                                        : item.sourceColor) || "gray"
                                );
                                return (
                                    <div
                                        key={item.id}
                                        className="flex flex-col gap-1"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {item.title}
                                                </span>
                                                <Badge
                                                    className={`w-fit ${colors.bg} ${colors.text} ${colors.border}`}
                                                >
                                                    {type === "expenses"
                                                        ? item.category
                                                        : item.source}
                                                </Badge>
                                            </div>
                                            <span
                                                className={`font-bold ${
                                                    type === "expenses"
                                                        ? "text-destructive"
                                                        : "text-emerald-500"
                                                }`}
                                            >
                                                ₹{item.amount.toFixed(2)}
                                            </span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDate(item.date)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
