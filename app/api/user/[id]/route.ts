import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let query = 'SELECT id, name, email, created_at as "createdAt" FROM users';

    if (id) {
      query += " WHERE id = $1 and deleted_at is null;";
    }

    console.log(query);

    const result = await db.query(query, [id]);

    console.log("User:", result.rows); // Debug log

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
