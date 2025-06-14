'use client';

import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-white shadow-md">
      <div className="flex items-center gap-2">
        <Image
          src="/taidot_logo.png"
          alt="Taidot Logo"
          width={90}
          height={90}
          priority
        />
      </div>
      <div className="flex items-center gap-8">
        <Link href="/journeys" className="text-lg font-medium" style={{ color: '#2e4052', fontFamily: 'Poppins', textDecoration: 'none' }}>
          My Journeys
        </Link>
        <Link href="/todos" className="text-lg font-medium" style={{ color: '#2e4052', fontFamily: 'Poppins', textDecoration: 'none' }}>
          My Todos
        </Link>
        <Link href="/account" className="text-lg font-medium" style={{ color: '#2e4052', fontFamily: 'Poppins', textDecoration: 'none' }}>
          Account
        </Link>
      </div>
    </nav>
  );
}
