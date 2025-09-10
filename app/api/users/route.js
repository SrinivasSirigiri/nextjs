import { NextResponse } from "next/server";

// Handle GET requests → /api/users
export async function GET() {
  return NextResponse.json([
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" }
  ]);
}

// Handle POST requests → /api/users
export async function POST(request) {
  const body = await request.json();
  return NextResponse.json({
    message: "User created successfully",
    user: body
  });
}
