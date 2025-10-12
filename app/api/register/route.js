import User from "../../../models/user";
import connectDB from "../../../config/db";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await connectDB();

    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return Response.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ message: "User already exists" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashed });

    return Response.json(
      {
        message: "Registration successful",
        user: { id: newUser._id, email: newUser.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
