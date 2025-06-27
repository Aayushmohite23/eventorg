"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "../lib/supabase/client";

export default function AuthRedirectListener() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      // Only redirect if on login, signup, or callback
      if (
        session &&
        ["/login", "/signup", "/callback", "/auth/login", "/auth/signup", "/auth/callback"].includes(pathname)
      ) {
        router.replace("/dashboard");
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router, pathname]);
  return null;
} 