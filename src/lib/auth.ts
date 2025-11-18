import prisma from "./prisma";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

interface UserPayload {
  userId: string;
  email: string;
}

export async function verifyAuth(req: NextRequest): Promise<UserPayload> {
  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    throw new Error("Unauthorized: No token provided");
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET as string
    ) as UserPayload;
    return decoded;
  } catch (error) {
    throw new Error("Unauthorized: Invalid token");
  }
}

export default prisma;