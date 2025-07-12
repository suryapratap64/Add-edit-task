import User from '../../../models/user';
import connectDB from '../../../config/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export async function POST(request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return Response.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // create JWT
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    // set cookie
    return new Response(JSON.stringify({ message: 'Login successful' }), {
      status: 200,
      headers: {
        'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=604800`, // 7 days
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ message: 'Server error' }, { status: 500 });
  }
}
