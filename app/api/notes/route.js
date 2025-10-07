import Note from "../../../models/note";
import connectDB from "../../../config/db";
import { verifyToken } from "../../../utils/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectDB();
  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = verifyToken(token);
  const notes = await Note.find({ userId: id }).sort({ createdAt: -1 });
  return NextResponse.json(notes);
}

export async function POST(req) {
  await connectDB();
  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { id } = verifyToken(token);

  const { title, content } = await req.json();
  const note = await Note.create({ title, content, userId: id });
  return NextResponse.json(note);
}

export async function PUT(req) {
  await connectDB();
  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = verifyToken(token);
  const { noteId, title, content } = await req.json();

  const note = await Note.findOneAndUpdate(
    { _id: noteId, userId: id },
    { title, content },
    { new: true }
  );
  return NextResponse.json(note);
}

export async function DELETE(req) {
  await connectDB();
  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = verifyToken(token);
  const { noteId } = await req.json();

  await Note.deleteOne({ _id: noteId, userId: id });
  return NextResponse.json({ message: "Deleted" });
}
