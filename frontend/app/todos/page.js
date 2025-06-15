"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [planMessage, setPlanMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored) setUsername(stored);
    if (stored) {
      fetch(`http://localhost:8000/user/${stored}/todos`)
        .then((res) => res.json())
        .then((data) => setTodos(data));
    }
  }, []);

  const handleStartPlan = async () => {
    setLoading(true);
    setPlanMessage("");
    const res = await fetch(`http://localhost:8000/user/${username}/todos/plan`, {
      method: "POST",
    });
    if (res.ok) {
      setPlanMessage("Your plan has been created!");
      const data = await res.json();
      setTodos(data);
    } else {
      setPlanMessage("Failed to create plan.");
    }
    setLoading(false);
  };

  return (
    <div style={{ background: "#f5f6fa", minHeight: "100vh" }}>
      <Navbar username={username} />
      <div className="flex flex-col items-center p-8 gap-10">
        <h1 className="text-4xl font-bold" style={{ color: "#2e4052", fontFamily: "Montserrat" }}>
          My Todos
        </h1>
        {todos.length === 0 ? (
          <div className="flex flex-col items-center gap-4 bg-white rounded-xl shadow-md p-8">
            <p className="text-lg text-gray-700 mb-2">Start planning your journey!</p>
            <button
              className="px-6 py-3 rounded-lg font-semibold transition mt-2"
              style={{ backgroundColor: "#bcd9be", color: "#2e4052", fontFamily: "Poppins" }}
              onClick={handleStartPlan}
              disabled={loading}
            >
              {loading ? "Planning..." : "Plan"}
            </button>
            {planMessage && <div className="text-green-600 mt-2">{planMessage}</div>}
          </div>
        ) : (
          <ul className="w-full max-w-2xl flex flex-col gap-4">
            {todos.map((todo, idx) => (
              <li key={idx} className="border rounded p-4 bg-white shadow flex flex-col gap-2">
                <div className="font-semibold">{todo.title}</div>
                <div className="text-sm text-gray-700">Due: {todo.due_date}</div>
                <div className="text-sm text-gray-500">{todo.description}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
