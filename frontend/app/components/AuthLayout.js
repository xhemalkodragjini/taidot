'use client';

import Image from "next/image";

export default function AuthLayout({
  title,
  buttonText,
  onSubmit,
  children,
  buttonColor = '#ffc857',
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8" >
      <Image
        src="/taidot_logo.png"
        alt="Taidot Logo"
        width={160}
        height={160}
        priority
        className="mb-6"
      />
      <div
        className="flex flex-col items-center w-full max-w-md p-12 rounded-2xl shadow-lg"
        style={{ background: '#f5f6fa' }}
      >
        <h1
          className="text-2xl font-bold mb-8"
          style={{ color: '#2e4052', fontFamily: 'Montserrat', marginTop: 0 }}
        >
          {title}
        </h1>
        <form className="flex flex-col gap-6 w-full" onSubmit={onSubmit}>
          {children}
          <button
            type="submit"
            className="px-6 py-3 rounded-lg font-semibold transition mt-2"
            style={{ backgroundColor: buttonColor, color: '#2e4052', fontFamily: 'Poppins' }}
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}
