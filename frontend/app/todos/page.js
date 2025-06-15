"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

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
    const res = await fetch(`http://localhost:8000/user/${username}/todos/plan`, {
      method: "POST",
    });
    if (res.ok) {
      const data = await res.json();
      setTodos(data);
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
          </div>
        ) : (
          <ul className="w-full max-w-7xl flex flex-col gap-10">
            {todos.map((todo, idx) => (
              <li
                key={idx}
                className="rounded-xl p-7 bg-white shadow-xl flex flex-col gap-4 border-0 hover:shadow-2xl transition-all duration-200 group relative overflow-hidden"
                style={{ minHeight: '120px', borderLeft: '8px solid #bcd9be', boxShadow: '0 6px 32px 0 rgba(44, 62, 80, 0.10)' }}
              >
                {/* Decorative background blur */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#bcd9be] opacity-20 rounded-full blur-2xl z-0"></div>
                {/* First row: Start and Due Dates */}
                <div className="flex flex-row justify-between items-center w-full mb-2 z-10">
                  {/* Start date on the left */}
                  <span className="inline-flex items-center px-3 py-1 rounded bg-[#e3fcec] text-[#2e7d32] font-semibold text-xs font-poppins shadow-sm border border-[#bcd9be]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#2e7d32]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Start: {todo.date}
                  </span>
                  {/* Program due dates on the right */}
                  <div className="flex flex-row gap-2 items-center">
                    {todo.programs && todo.due_dates && todo.programs.length === todo.due_dates.length && todo.due_dates.length > 0 ? (
                      todo.due_dates.map((d, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-3 py-1 rounded bg-[#fff3e0] text-[#e65100] font-semibold text-xs font-poppins shadow-sm border border-[#ffe0b2]"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#e65100]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <span className="font-bold mr-1">Program due date:</span> {todo.programs[i]}: {d}
                        </span>
                      ))
                    ) : (
                      todo.due_dates && todo.due_dates.length > 0 ? todo.due_dates.map((d, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-3 py-1 rounded bg-[#fff3e0] text-[#e65100] font-semibold text-xs font-poppins shadow-sm border border-[#ffe0b2]"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#e65100]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <span className="font-bold mr-1">Program due date:</span> {d}
                        </span>
                      )) : <span className="text-gray-400">-</span>
                    )}
                  </div>
                </div>
                {/* Second row: two columns */}
                <div className="flex flex-row w-full gap-8 z-10">
                  {/* Task title and description */}
                  <div className="flex-[2_1_0%] flex flex-col justify-center min-w-[260px]">
                    <div className="font-bold text-xl mb-2 text-[#2e4052] font-montserrat tracking-tight">
                      {todo.title}
                    </div>
                    <div className="text-base text-gray-600 font-poppins leading-relaxed">
                      {todo.description}
                    </div>
                  </div>
                  {/* Programs */}
                  <div className="flex-[1_1_0%] flex flex-col justify-center min-w-[200px]">
                    <div className="text-sm text-gray-700 font-semibold mb-2 font-montserrat">Programs:</div>
                    <div className="flex flex-wrap gap-2">
                      {todo.programs && todo.programs.length > 0 ? todo.programs.map((prog, i) => (
                        <span
                          key={i}
                          className="inline-block px-3 py-1 rounded-full bg-[#bcd9be] text-[#2e4052] font-semibold text-xs shadow-sm border border-[#a3c9a8] font-poppins"
                        >
                          {prog}
                        </span>
                      )) : <span className="text-gray-400">-</span>}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
