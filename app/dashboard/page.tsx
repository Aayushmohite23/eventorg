"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiDownload, FiUsers, FiHeadphones, FiShield } from "react-icons/fi";
import { supabase } from "@/lib/supabase/client";
import { IoCreateOutline } from "react-icons/io5";
const stats = [
  { icon: <FiDownload size={40} className="text-[#f02e65] mx-auto" />, value: "2.7K", label: "Downloads" },
  { icon: <FiUsers size={40} className="text-[#f02e65] mx-auto" />, value: "1.3K", label: "Users" },
  { icon: <FiHeadphones size={40} className="text-[#f02e65] mx-auto" />, value: "74", label: "Files" },
  { icon: <FiShield size={40} className="text-[#f02e65] mx-auto" />, value: "46", label: "Places" },
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center">
          <Image src="/logo.png" alt="Event-Ally Logo" width={180} height={60} className="mb-2" />
          <h1 className="text-4xl font-bold text-center mb-2 mt-4">Experience hassle free event</h1>
          <p className="text-gray-500 text-center max-w-2xl mb-10">
            Welcome to our innovative event management application Event-Org, where organizing and executing unforgettable events becomes effortless. Streamline your planning process and create extraordinary experiences with our intuitive platform.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl border p-8 flex flex-col items-center shadow-sm">
              {stat.icon}
              <div className="text-3xl font-bold mt-4">{stat.value}</div>
              <div className="text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <Link href="/create">
            <button className="flex items-center gap-2 bg-[#f02e65] hover:bg-[#ab073d] text-white font-semibold rounded-full px-8 py-4 text-lg shadow-md transition-all">
              <IoCreateOutline size={24} /> Create Event
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
} 