'use client';

import { useRouter } from "next/navigation";
import AuthLayout from "../components/AuthLayout";

export default function SignIn() {
  const router = useRouter();
  const handleSignIn = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    try {
      const res = await fetch("http://localhost:8000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        // Support both { username } and { login: { username } }
        const username = data.username || (data.login && data.login.username);
        if (username) {
          localStorage.setItem("username", username);
        }
        router.push("/welcome");
      }
    } catch (err) {}
  };

  return (
    <AuthLayout title="Sign In" buttonText="Sign In" buttonColor="#ffc857" onSubmit={handleSignIn}>
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
