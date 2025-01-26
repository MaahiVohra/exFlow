"use client";

import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { DeleteAlert } from "./delete-alert";
import { Input } from "./input";

interface Category {
    id: number;
    name: string;
    type: "expense" | "income";
    color: string;
}

interface CategorySelectProps {
    type: "expense" | "income";
    value: string;
    onValueChange: (value: string) => void;
}

function getCategoryColorClass(color: string) {
    return {
        bg: `bg-${color}-500/10 dark:bg-${color}-500/20`,
        text: `text-${color}-500 dark:text-${color}-400`,
        border: `border-${color}-500/20 dark:border-${color}-500/30`,
    };
}

export function CategorySelect({
    type,
    value,
    onValueChange,
}: CategorySelectProps) {
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [showNewCategoryDialog, setShowNewCategoryDialog] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        fetchCategories();
    }, [type]);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`/api/categories?type=${type}`);
            if (!response.ok) throw new Error("Failed to fetch categories");
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast({
                title: "Error",
                description: "Failed to load categories",
                variant: "destructive",
            });
        }
    };

    const handleCreateCategory = async () => {
        try {
            const response = await fetch("/api/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: newCategoryName,
                    type,
                }),
            });

            if (!response.ok) throw new Error("Failed to create category");

            toast({
                title: "Success",
                description: "Category created successfully",
            });

            setShowNewCategoryDialog(false);
            setNewCategoryName("");
            fetchCategories();
        } catch (error) {
            console.error("Error creating category:", error);
            toast({
                title: "Error",
                description: "Failed to create category",
                variant: "destructive",
            });
        }
    };

    const handleDeleteCategory = async (id: number) => {
        try {
            const response = await fetch(`/api/categories/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to delete category");
            }

            toast({
                title: "Success",
                description: "Category deleted successfully",
            });

            fetchCategories();
        } catch (error) {
            console.error("Error deleting category:", error);
            toast({
                title: "Error",
                description:
                    error instanceof Error
                        ? error.message
                        : "Failed to delete category",
                variant: "destructive",
            });
        }
    };

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {value ? (
                            <div className="flex items-center">
                                {(() => {
                                    const category = categories.find(
                                        (c) => c.name === value
                                    );
                                    if (category) {
                                        const colors = getCategoryColorClass(
                                            category.color
                                        );
                                        return (
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${colors.bg} ${colors.text} ${colors.border}`}
                                            >
                                                {category.name}
                                            </span>
                                        );
                                    }
                                    return value;
                                })()}
                            </div>
                        ) : (
                            `Select ${type} category...`
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command className="w-full">
                        <CommandInput
                            className="w-full"
                            placeholder={`Search ${type} category...`}
                        />
                        <CommandList className="w-full">
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                                {categories.map((category) => {
                                    const colors = getCategoryColorClass(
                                        category.color
                                    );
                                    return (
                                        <CommandItem
                                            key={category.id}
                                            value={category.name}
                                            onSelect={(currentValue) => {
                                                onValueChange(currentValue);
                                                setOpen(false);
                                            }}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex items-center">
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        value === category.name
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${colors.bg} ${colors.text} ${colors.border}`}
                                                >
                                                    {category.name}
                                                </span>
                                            </div>
                                            <DeleteAlert
                                                title="Delete Category"
                                                description="Are you sure you want to delete this category? This action cannot be undone."
                                                onDelete={() =>
                                                    handleDeleteCategory(
                                                        category.id
                                                    )
                                                }
                                            />
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup>
                                <CommandItem
                                    onSelect={() => {
                                        setOpen(false);
                                        setShowNewCategoryDialog(true);
                                    }}
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Create category
                                </CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            <Dialog
                open={showNewCategoryDialog}
                onOpenChange={setShowNewCategoryDialog}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create new category</DialogTitle>
                        <DialogDescription>
                            Add a new category for your {type}s.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Input
                                placeholder="Category name"
                                value={newCategoryName}
                                onChange={(e) =>
                                    setNewCategoryName(e.target.value)
                                }
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowNewCategoryDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleCreateCategory}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
