import { verifyToken } from "../../../utils/jwt";
import connectDB from "../../../config/db";
import User from "../../../models/user";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectDB();
  try {
    const token = req.cookies?.get?.("token")?.value;
    if (!token)
      return NextResponse.json({ authenticated: false }, { status: 401 });
    const payload = verifyToken(token);
    const user = await User.findById(payload.id).select("-password");
    if (!user)
      return NextResponse.json({ authenticated: false }, { status: 401 });
    return NextResponse.json({ authenticated: true, user });
  } catch (err) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
