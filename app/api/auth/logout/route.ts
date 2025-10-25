import { HEADER_KEYS } from "@/coreConstants";
import db from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
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

    // Find user by id
    const userResult = await db.query(
      'SELECT id, name, email, password, created_at as "createdAt" FROM users WHERE id = $1 AND deleted_at IS NULL',
      [validatedToken.userId]
    );

    const user = userResult.rows[0];

    // Check if user exists
    if (!user) {
      return NextResponse.json({ error: "Invalid user" }, { status: 401 });
    }

    // Store token in database
    const expiresAt = new Date(Date.now());
    await db.query(
      "UPDATE auth_tokens set expires_at = $3 where user_id = $1 and token = $2",
      [user.id, token, expiresAt]
    );

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}
