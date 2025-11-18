import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const userPayload = await verifyAuth(req as any); // Authenticate user

    const todos = await prisma.todo.findMany({
      where: {
        userId: userPayload.userId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(todos, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const userPayload = await verifyAuth(req as any); // Authenticate user
    const { title } = await req.json();

    if (!title) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 }
      );
    }

    const newTodo = await prisma.todo.create({
      data: {
        title,
        userId: userPayload.userId,
      },
    });

    return NextResponse.json(newTodo, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}
