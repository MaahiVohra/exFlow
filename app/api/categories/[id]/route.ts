import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

type FinanceCount = {
    count: number;
};

export async function DELETE(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get("id");

        // Check if category is in use
        const expenseCount = db
            .prepare(
                "SELECT COUNT(*) as count FROM expenses WHERE category IN (SELECT name FROM categories WHERE id = ?)"
            )
            .get(id) as FinanceCount;

        const incomeCount = db
            .prepare(
                "SELECT COUNT(*) as count FROM income WHERE source IN (SELECT name FROM categories WHERE id = ?)"
            )
            .get(id) as FinanceCount;

        if (expenseCount.count > 0 || incomeCount.count > 0) {
            return NextResponse.json(
                { error: "Cannot delete category that is in use" },
                { status: 400 }
            );
        }

        const stmt = db.prepare("DELETE FROM categories WHERE id = ?");
        const result = stmt.run(id);

        if (result.changes === 0) {
            return NextResponse.json(
                { error: "Category not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Category deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting category:", error);
        return NextResponse.json(
            { error: "Failed to delete category" },
            { status: 500 }
        );
    }
}
