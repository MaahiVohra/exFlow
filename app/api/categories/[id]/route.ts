import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        let query =
            "SELECT e.id FROM expense e WHERE e.category IN (SELECT name FROM categories c WHERE c.id = $1)";
        const expenseCount = await db.query(query, [id]);

        query =
            "SELECT i.id FROM income i WHERE i.source IN (SELECT name FROM categories c WHERE c.id = $1)";

        const incomeCount = await db.query(query, [id]);

        if (
            (expenseCount.rowCount ?? 0) > 0 ||
            (incomeCount.rowCount ?? 0) > 0
        ) {
            return NextResponse.json(
                { error: "Cannot delete category that is in use" },
                { status: 400 }
            );
        }

        query = "DELETE FROM categories WHERE id = $1";
        const result = await db.query(query, [id]);

        if (result.rowCount === 0) {
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
