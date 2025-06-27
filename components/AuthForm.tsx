"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase/client';
import Image from 'next/image';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    let result;
    if (mode === 'login') {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({ email, password });
    }
    if (result.error) setError(result.error.message);
    else router.replace('/dashboard');
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Image src="/logo.png" alt="Event-Org Logo" width={200} height={80} className="mb-4" />
      
      <div className="border-2 border-gray-100 bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-6 text-gray-700 text-center">Login Using</h2>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#f02e65]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#f02e65]"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f02e65] text-white p-2 rounded font-semibold transition-shadow hover:shadow-lg focus:shadow-lg"
          >
            {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <div className="flex items-center w-full my-4">
          <div className="flex-grow border-t border-gray-200" />
          <span className="mx-2 text-gray-400 text-xs">or</span>
          <div className="flex-grow border-t border-gray-200" />
        </div>
        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 p-2 rounded font-semibold transition-shadow hover:shadow-lg focus:shadow-lg"
        >
          <Image src="/google.jpg" alt="Google Logo" width={20} height={20} />
          Continue with Google
        </button>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      </div>
    </div>
  );
} 