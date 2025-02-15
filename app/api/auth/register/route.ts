import db from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email, password }: RegisterRequest = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.query(
      "SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const result = await db.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at as "createdAt"',
      [name, email, hashedPassword]
    );

    const newUser = result.rows[0];

    // Generate JWT token
    const expiresIn = 24 * 60 * 60; // 24 hours in seconds
    const token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn }
    );

    // Store token in database
    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    await db.query(
      "INSERT INTO auth_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [newUser.id, token, expiresAt]
    );

    // Prepare response
    const response: AuthToken = {
      token,
      expiresIn,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
