'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      toast.success('Login successful');
      router.push('/');
    } catch (err) {
      console.error(err);
      setError(err.message);
      toast.error(err.message);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-100 via-green-200 to-gray-800 text-white">
      

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Login form */}
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4">
        <div className="max-w-md w-full bg-gray-800 bg-opacity-70 p-8 rounded-md">
          <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="bg-gray-700 text-white px-4 py-3 rounded focus:outline-none"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="bg-gray-700 text-white px-4 py-3 rounded focus:outline-none"
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-800 transition py-3 rounded font-semibold"
            >
             Login
            </button>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          </form>

        

          {/* <p className="text-gray-400 text-sm mt-6 text-center">
            New to our site?{' '}
            <a href="/register" className="text-white hover:underline">sign up now</a>.
          </p> */}
        </div>
      </div>
    </div>
  );
}
