'use client';

import { useRouter } from "next/navigation";
import AuthLayout from "../components/AuthLayout";

export default function SignUp() {
  const router = useRouter();
  const handleSignUp = async (e) => {
    e.preventDefault();
    const username = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    try {
      const res = await fetch("http://localhost:8000/user/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      if (res.ok) {
        localStorage.setItem("username", username);
        router.push("/myjourneys");
      }
    } catch (err) {}
  };

  return (
    <AuthLayout title="Create Account" buttonText="Create Account" buttonColor="#bcd9be" onSubmit={handleSignUp}>
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
