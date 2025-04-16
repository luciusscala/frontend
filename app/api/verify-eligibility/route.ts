import { NextResponse } from "next/server";

// Replace this with your FastAPI service URL
const FASTAPI_SERVICE_URL = process.env.FASTAPI_SERVICE_URL || "http://localhost:8000";

export async function POST(request: Request) {
  try {
    const { fullName, email } = await request.json();

    // Call your FastAPI service
    const response = await fetch(`${FASTAPI_SERVICE_URL}/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: fullName,
        email: email,
      }),
    });

    if (!response.ok) {
      throw new Error(`FastAPI service returned ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({ valid: data.is_eligible });
  } catch (error) {
    console.error("Error verifying eligibility:", error);
    return NextResponse.json(
      { error: "Failed to verify eligibility" },
      { status: 500 }
    );
  }
} 