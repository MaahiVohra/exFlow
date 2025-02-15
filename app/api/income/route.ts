import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { title, amount, source, date, description } = await request.json();

    const query =
      "INSERT INTO income (title, amount, source, date, description) VALUES ($1, $2, $3, $4, $5)";

    const result = await db.query(query, [
      title,
      amount,
      source,
      date,
      description,
    ]);

    return NextResponse.json(
      {
        message: "Income created successfully",
        id: result.rows.at(0).id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating income:", error);
    return NextResponse.json(
      { error: "Failed to create income" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const query = `
      SELECT i.*, c.color as sourceColor 
      FROM income i
      LEFT JOIN categories c ON i.source = c.name AND c.type = 'income'
      ORDER BY i.date DESC, i.created_at DESC
    `;

    const result = await db.query(query);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching income:", error);
    return NextResponse.json(
      { error: "Failed to fetch income" },
      { status: 500 }
    );
  }
}
