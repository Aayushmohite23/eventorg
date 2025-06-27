"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { FiHome } from "react-icons/fi";
import type { User } from '@supabase/supabase-js';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="bg-white w-full">
      <div className="max-w-7xl mx-auto flex flex-wrap p-5 flex-row items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" height={40} width={180} alt="Event-Org Logo" />
        </Link>
        <nav className="flex items-center space-x-8 text-base ml-auto">
          <Link href="/dashboard" className="flex items-center">
            <span className="mr-2 flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition">
              <FiHome size={20} />
            </span>
          </Link>
          <Link href="/dashboard/my-events" className="text-gray-500 hover:text-gray-900 font-medium">My Events</Link>
          <Link href="/create" className="text-gray-500 hover:text-gray-900 font-medium">Create Event</Link>
        </nav>
        {user && (
          <button
            className="ml-8 inline-flex items-center bg-[#f02e65] border-0 py-2 px-6 focus:outline-none hover:bg-[#ab073d] rounded-full text-base text-white font-semibold shadow-sm transition-all"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        )}
      </div>
    </header>
  );
} 



