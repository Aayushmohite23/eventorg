"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase/client';

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
    else router.push('/my-events');
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto p-6 border rounded">
      <h2 className="text-xl font-bold text-center">{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <button type="submit" disabled={loading} className="bg-black text-white p-2 rounded">
        {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Sign Up'}
      </button>
      <button type="button" onClick={handleGoogle} disabled={loading} className="bg-red-500 text-white p-2 rounded">
        Continue with Google
      </button>
      {error && <p className="text-red-500 text-center">{error}</p>}
    </form>
  );
} 