'use client';

import AuthLayout from "../components/AuthLayout";

export default function SignUp() {
  return (
    <AuthLayout title="Create Account" buttonText="Create Account" buttonColor="#bcd9be">
      <input
        type="text"
        placeholder="Name or Username"
        className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
        style={{ fontFamily: 'Poppins' }}
      />
      <input
        type="email"
        placeholder="Email"
        className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
        style={{ fontFamily: 'Poppins' }}
      />
      <input
        type="password"
        placeholder="Password"
        className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
        style={{ fontFamily: 'Poppins' }}
      />
    </AuthLayout>
  );
}
