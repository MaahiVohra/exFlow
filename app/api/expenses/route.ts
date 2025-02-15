import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, amount, category, date, description } = body;

    const query =
      "INSERT INTO expense (title, amount, category, date, description) VALUES ($1, $2, $3, $4, $5)";

    const result = await db.query(query, [
      title,
      amount,
      category,
      date,
      description,
    ]);

    return NextResponse.json(
      {
        message: "Expense created successfully",
        id: result.oid,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const query = `
      SELECT e.*, c.color as categoryColor 
      FROM expense e
      LEFT JOIN categories c ON e.category = c.name AND c.type = 'expense'
      ORDER BY e.date DESC, e.created_at DESC
    `;

    const expenses = await db.query(query);
    return NextResponse.json(expenses.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}
