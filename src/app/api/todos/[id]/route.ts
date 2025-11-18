import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userPayload = await verifyAuth(req as any); // Authenticate user
    const awaitedParams = await params;
    const { id } = awaitedParams;
    const { title, completed } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "Todo ID is required" }, { status: 400 });
    }

    const existingTodo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!existingTodo) {
      return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    if (existingTodo.userId !== userPayload.userId) {
      return NextResponse.json(
        { message: "Unauthorized to update this todo" },
        { status: 403 }
      );
    }

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existingTodo.title,
        completed: completed !== undefined ? completed : existingTodo.completed,
      },
    });

    return NextResponse.json(updatedTodo, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userPayload = await verifyAuth(req as any); // Authenticate user
    const awaitedParams = await params;
    const { id } = awaitedParams;

    if (!id) {
      return NextResponse.json({ message: "Todo ID is required" }, { status: 400 });
    }

    const existingTodo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!existingTodo) {
      return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    if (existingTodo.userId !== userPayload.userId) {
      return NextResponse.json(
        { message: "Unauthorized to delete this todo" },
        { status: 403 }
      );
    }

    await prisma.todo.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}
