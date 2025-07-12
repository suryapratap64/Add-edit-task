import Task from '../../../models/task';
import connectDB from '../../../config/db';
import { verifyToken } from '../../../utils/jwt';
import { NextResponse } from 'next/server';

export async function GET(req) {
  await connectDB();
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { id } = verifyToken(token);
  const tasks = await Task.find({ userId: id });
  return NextResponse.json(tasks);
}

export async function POST(req) {
  await connectDB();
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { id } = verifyToken(token);
  const { text } = await req.json();

  const task = await Task.create({ text, userId: id });
  return NextResponse.json(task);
}

export async function PUT(req) {
  await connectDB();
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { id } = verifyToken(token);
  const { taskId, text, done } = await req.json();

  const task = await Task.findOneAndUpdate(
    { _id: taskId, userId: id },
    { text, done },
    { new: true }
  );
  return NextResponse.json(task);
}

export async function DELETE(req) {
  await connectDB();
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { id } = verifyToken(token);
  const { taskId } = await req.json();

  await Task.deleteOne({ _id: taskId, userId: id });
  return NextResponse.json({ message: 'Deleted' });
}
