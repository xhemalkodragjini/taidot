'use client';

import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-12 bg-white dark:bg-gray-900">
      <Image
        src="/taidot_logo.png"
        alt="Taidot Logo"
        width={180}
        height={180}
        priority
        className="mb-6"
      />
    
      <div className="flex gap-6">
        <button
          className="px-6 py-3 rounded-lg font-semibold transition"
          style={{ backgroundColor: '#ffc857', color: '#2e4052', fontFamily: 'Poppins' }}
          onClick={() => (window.location.href = "/signin")}
        >
          Sign In
        </button>
        <button
          className="px-6 py-3 rounded-lg font-semibold transition"
          style={{ backgroundColor: '#bcd9be', color: '#2e4052', fontFamily: 'Poppins' }}
          onClick={() => (window.location.href = "/signup")}
        >
          Create New Account
        </button>
      </div>
    </div>
  );
}
