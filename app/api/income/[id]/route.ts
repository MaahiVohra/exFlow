import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { amount, source, date, description } = await request.json();

        const query = `
            UPDATE income 
            SET amount = $1, source = $2, date = $3, description = $4
            WHERE id = $5
        `;

        const result = await db.query(query, [
            amount,
            source,
            date,
            description,
            id,
        ]);

        if (result.rowCount === 0) {
            return NextResponse.json(
                { error: "Income record not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Income updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating income:", error);
        return NextResponse.json(
            { error: "Failed to update income" },
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

        const query = "DELETE FROM income WHERE id = $1";
        const result = await db.query(query, [id]);

        if (result.rowCount === 0) {
            return NextResponse.json(
                { error: "Income record not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Income deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting income:", error);
        return NextResponse.json(
            { error: "Failed to delete income" },
            { status: 500 }
        );
    }
}
