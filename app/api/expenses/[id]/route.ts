import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { amount, category, date, description } = await request.json();
        const { id } = await params;

        const query = `
            UPDATE expense
            SET amount = $1, category = $2, date = $3, description = $4
            WHERE id = $5
        `;

        const result = await db.query(query, [
            amount,
            category,
            date,
            description,
            id,
        ]);

        if (result.rowCount === 0) {
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

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const query = "DELETE FROM expense WHERE id = $1";

        const result = await db.query(query, [id]);

        if (result.rowCount === 0) {
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
