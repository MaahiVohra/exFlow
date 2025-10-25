"use client";

import { ExpenseList } from "@/components/expense/ExpenseList";
import { IncomeList } from "@/components/income/IncomeList";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FinanceTrackerPage() {
  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <Tabs defaultValue="expenses" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="expenses" className="space-y-4">
          <ExpenseList />
        </TabsContent>

        <TabsContent value="income" className="space-y-4">
          <IncomeList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
