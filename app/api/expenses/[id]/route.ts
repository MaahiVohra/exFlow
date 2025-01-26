import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get("id");
        const { amount, category, date, description } = body;

        const stmt = db.prepare(`
            UPDATE expenses 
            SET amount = ?, category = ?, date = ?, description = ?
            WHERE id = ?
        `);

        const result = stmt.run(amount, category, date, description, id);

        if (result.changes === 0) {
            return NextResponse.json(
                { error: "Expense not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Expense updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating expense:", error);
        return NextResponse.json(
            { error: "Failed to update expense" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get("id");

        const stmt = db.prepare("DELETE FROM expenses WHERE id = ?");
        const result = stmt.run(id);

        if (result.changes === 0) {
            return NextResponse.json(
                { error: "Expense not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Expense deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting expense:", error);
        return NextResponse.json(
            { error: "Failed to delete expense" },
            { status: 500 }
        );
    }
}
