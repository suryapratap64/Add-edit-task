import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
// 🧩 What is jose?

// jose is a modern JavaScript library for working with JWTs (JSON Web Tokens), JWKs (JSON Web Keys), and cryptographic operations — it’s essentially a replacement for older libraries like jsonwebtoken.

export async function middleware(req) {
  const token = req.cookies.get('token')?.value;

  if (!token) {

    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
 
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}


export const config = {
  matcher: ['/'], 
};
