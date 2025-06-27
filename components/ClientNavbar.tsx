"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

const HIDE_NAVBAR_PATHS = [
  "/",
  "/login",
  "/signup",
  "/callback",
  "/auth/login",
  "/auth/signup",
  "/auth/callback",
];

function isRSVPPage(pathname: string) {
  // Matches /events/[eventId]/rsvp or /[eventId]/rsvp
  return /^\/events\/[^/]+\/rsvp$/.test(pathname) || /^\/[\w-]+\/rsvp$/.test(pathname);
}

export default function ClientNavbar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = HIDE_NAVBAR_PATHS.includes(pathname) || isRSVPPage(pathname);
  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
} 