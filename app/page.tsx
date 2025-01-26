'use client'
import { ExpenseList } from "@/components/expense/ExpenseList"
import { IncomeList } from "@/components/income/IncomeList"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet } from "lucide-react"

export default function FinanceTrackerPage() {

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold flex items-center"><Wallet />&nbsp;<span className="text-[#4CAF50]">ex</span>Flow</h1>
      </div>

      <Tabs defaultValue="expenses" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="expenses" className="space-y-4">
          <ExpenseList  />
        </TabsContent>

        <TabsContent value="income" className="space-y-4">
          <IncomeList  />
        </TabsContent>
      </Tabs>
    </div>
  )
}

