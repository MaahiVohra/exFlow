"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const expenseFormSchema = z.object({
    amount: z
        .string()
        .min(1, "Amount is required")
        .regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format"),
    category: z.string().min(1, "Category is required"),
    date: z.string().min(1, "Date is required"),
    description: z.string().optional(),
});

interface EditExpenseDialogProps {
    expense: Expense;
    onUpdate: () => void;
}

export function EditExpenseDialog({
    expense,
    onUpdate,
}: EditExpenseDialogProps) {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof expenseFormSchema>>({
        resolver: zodResolver(expenseFormSchema),
        defaultValues: {
            amount: expense.amount?.toString(),
            category: expense.category,
            date: expense.date,
            description: expense.description || "",
        },
    });

    async function onSubmit(values: z.infer<typeof expenseFormSchema>) {
        try {
            const response = await fetch(`/api/expenses/${expense.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...values,
                    amount: parseFloat(values.amount),
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update expense");
            }

            toast({
                title: "Success",
                description: "Expense updated successfully",
            });

            setOpen(false);
            onUpdate();
        } catch (error) {
            console.error("Error updating expense:", error);
            toast({
                title: "Error",
                description: "Failed to update expense. Please try again.",
                variant: "destructive",
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Expense</DialogTitle>
                    <DialogDescription>
                        Make changes to your expense here.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input placeholder="0.00" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Enter the expense amount
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="food">
                                                Food
                                            </SelectItem>
                                            <SelectItem value="transportation">
                                                Transportation
                                            </SelectItem>
                                            <SelectItem value="utilities">
                                                Utilities
                                            </SelectItem>
                                            <SelectItem value="entertainment">
                                                Entertainment
                                            </SelectItem>
                                            <SelectItem value="other">
                                                Other
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Select the expense category
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Enter the date of the expense
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Description (Optional)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter a description"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Provide additional details about the
                                        expense
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
