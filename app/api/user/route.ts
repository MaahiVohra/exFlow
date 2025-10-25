import { HEADER_KEYS } from "@/coreConstants";
import db from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get(HEADER_KEYS.ACCESS_TOKEN)?.value;

    if (!token) {
      throw new Error("No access token found");
    }

    const validatedToken = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
    };

    if (!validatedToken?.userId) {
      throw new Error("Invalid or no access token found");
    }

    const result = await db.query(
      'SELECT id, name, email, created_at as "createdAt" FROM users WHERE id = $1 and deleted_at is null;',
      [validatedToken.userId]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
