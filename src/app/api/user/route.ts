import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const userPayload = await verifyAuth(req as any); // Cast req to any for now, will fix type later if needed
    // In a real application, you would fetch more user data from the database
    // using userPayload.userId or userPayload.email
    return NextResponse.json({
      message: "Protected data",
      user: { id: userPayload.userId, email: userPayload.email },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}
