'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function AdvisorLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/advisors/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store advisor session
      localStorage.setItem('advisor_session', JSON.stringify({
        id: data.advisor.id,
        name: data.advisor.name,
        email: data.advisor.email
      }));

      router.push('/advisor/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--blue-50)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/login-bg.png"
          alt=""
          fill
          className="object-cover opacity-15"
          priority
        />
      </div>

      {/* Login Form */}
      <div className="relative z-10 bg-white p-8 rounded-2xl shadow-xl border border-[var(--gray-200)] w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image src="/logo.png" alt="AssetPlanly" width={180} height={40} className="h-10 w-auto mx-auto" />
          </Link>
          <p className="text-[var(--gray-500)] mt-3">Advisor Portal</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="advisor@example.com"
              className="w-full px-4 py-3 border border-[var(--gray-300)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--blue-500)] focus:border-transparent"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-[var(--gray-300)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--blue-500)] focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-[var(--gray-500)] mt-6">
          <Link href="/" className="text-[var(--blue-600)] hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
