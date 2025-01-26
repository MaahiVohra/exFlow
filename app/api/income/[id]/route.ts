import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get("id");
        const { amount, source, date, description } = body;

        const stmt = db.prepare(`
            UPDATE income 
            SET amount = ?, source = ?, date = ?, description = ?
            WHERE id = ?
        `);

        const result = stmt.run(amount, source, date, description, id);

        if (result.changes === 0) {
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

export async function DELETE(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get("id");

        const stmt = db.prepare("DELETE FROM income WHERE id = ?");
        const result = stmt.run(id);

        if (result.changes === 0) {
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
