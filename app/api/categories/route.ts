import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type");

        let query = "SELECT * FROM categories";

        if (type) {
            query += " WHERE type = $1";
        }

        query += " ORDER BY name ASC";

        const result = await db.query(query, [type]);

        console.log("Categories:", result.rows); // Debug log

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json(
            { error: "Failed to fetch categories" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const { name, type, color } = await request.json();

        if (!name || !type) {
            return NextResponse.json(
                { error: "Name and type are required" },
                { status: 400 }
            );
        }

        const randomColor = [
            "rose",
            "pink",
            "fuchsia",
            "purple",
            "violet",
            "indigo",
            "blue",
            "cyan",
            "teal",
            "emerald",
            "green",
            "lime",
            "yellow",
            "amber",
            "orange",
            "red",
        ][Math.floor(Math.random() * 16)];

        const query =
            "INSERT INTO categories (name, type, color) VALUES ($1, $2, $3)";

        const result = await db.query(query, [
            name,
            type,
            color || randomColor,
        ]);

        return NextResponse.json(
            {
                message: "Category created successfully",
                id: result.rows.at(0).id,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating category:", error);
        return NextResponse.json(
            { error: "Failed to create category" },
            { status: 500 }
        );
    }
}
