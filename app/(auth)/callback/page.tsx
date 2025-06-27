"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase/client';

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    };
    checkSession();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <span>Loading...</span>
    </div>
  );
} 