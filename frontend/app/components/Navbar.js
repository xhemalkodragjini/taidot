'use client';

import Image from "next/image";
import Link from "next/link";

export default function Navbar({ username }) {
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
        <span className="flex items-center gap-2 text-lg font-medium" style={{ color: '#2e4052', fontFamily: 'Poppins' }}>
          {username && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#bcd9be',
                color: '#2e4052',
                fontWeight: 700,
                fontSize: 18,
                textTransform: 'uppercase',
              }}
            >
              {username[0]}
            </span>
          )}
          {username}
        </span>
      </div>
    </nav>
  );
}
