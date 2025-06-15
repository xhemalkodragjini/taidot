"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function TodoDetailPopup({ todo, open, onClose }) {
  const [links, setLinks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || !todo) return;
    // Only fetch for CV, English, or Motivation Letter
    const title = todo.title?.toLowerCase() || "";
    let topic = null;
    if (title.includes("cv") || title.includes("curriculum vitae") || title.includes("resume")) topic = "cv";
    else if (title.includes("english") || title.includes("ielts") || title.includes("toefl")) topic = "english language test";
    else if (title.includes("motivation") || title.includes("cover letter") || title.includes("letter of motivation")) topic = "motivation letter";
    else return setLinks(null);
    setLinks(null); // Clear previous links immediately when loading starts
    setLoading(true);
    setError(null);
    fetch("http://localhost:8000/search_resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    })
      .then((res) => res.json())
      .then((data) => setLinks(data.links || []))
      .catch((e) => setError("Could not fetch resources."))
      .finally(() => setLoading(false));
  }, [open, todo]);

  if (!open || !todo) return null;
  const title = todo.title?.toLowerCase() || "";
  if (!(
    title.includes("cv") ||
    title.includes("curriculum vitae") ||
    title.includes("resume") ||
    title.includes("english") ||
    title.includes("ielts") ||
    title.includes("toefl") ||
    title.includes("motivation") ||
    title.includes("cover letter") ||
    title.includes("letter of motivation")
  )) return null;

  return (
    <>
      {/* Overlay for focus: subtle blur and light tint, not black */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-200"
        style={{
          background: 'rgba(255,255,255,0.5)',
          backdropFilter: 'blur(2px) saturate(1.1)', // less blur, subtle focus
          WebkitBackdropFilter: 'blur(2px) saturate(1.1)',
          pointerEvents: 'auto',
        }}
        onClick={onClose}
      />
      {/* Popup slides in from right, above overlay and todos */}
      <div className="fixed top-0 right-0 z-50 bg-white shadow-2xl rounded-l-2xl p-8 m-0 mt-0 w-full max-w-md h-full min-h-screen flex flex-col gap-6 animate-slide-in-right" style={{ pointerEvents: 'auto' }}>
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold" onClick={onClose} aria-label="Close">&times;</button>
        <h2 className="text-2xl font-bold mb-6 text-[#2e4052]">Resources for this task</h2>
        {loading && (
          <div className="flex flex-col items-center justify-center gap-2 text-gray-500 min-h-[120px]">
            <svg className="animate-spin h-8 w-8 text-[#bcd9be]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <span className="text-base font-medium">Fetching the best resources for you...</span>
          </div>
        )}
        {error && <div className="text-red-500">{error}</div>}
        {links && links.length > 0 && (
          <ul className="flex flex-col gap-6">
            {links.map((link, i) => (
              <li key={i} className="rounded-xl shadow-sm p-4 border-2 border-[#e0e7ef] hover:shadow-md transition group">
                <a
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-lg font-semibold text-[#2e4052] group-hover:text-[#bcd9be] underline decoration-[#bcd9be] decoration-2 underline-offset-4 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#bcd9be] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 21a2 2 0 01-2.828 0l-7-7a2 2 0 010-2.828l7-7a2 2 0 012.828 0l7 7a2 2 0 010 2.828l-7 7z" /></svg>
                  <span>{link.title}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#bcd9be] ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </li>
            ))}
          </ul>
        )}
        {links && links.length === 0 && !loading && <div className="text-gray-500">No resources found.</div>}
      </div>
      <style jsx global>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s cubic-bezier(0.4,0,0.2,1) both;
        }
      `}</style>
    </>
  );
}

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [doneTodos, setDoneTodos] = useState([]);
  const [popupIdx, setPopupIdx] = useState(null);

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

  const handleToggleDone = (idx) => {
    setDoneTodos((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
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
                className={`rounded-xl p-7 bg-white shadow-xl flex flex-col gap-4 border-0 hover:shadow-2xl transition-all duration-200 group relative overflow-hidden ${doneTodos.includes(idx) ? 'opacity-40' : ''}`}
                style={{ minHeight: '120px', borderLeft: '8px solid #bcd9be', boxShadow: '0 6px 32px 0 rgba(44, 62, 80, 0.10)' }}
                aria-pressed={doneTodos.includes(idx)}
                onClick={e => { if (e.target.tagName !== 'BUTTON') setPopupIdx(idx); }}
              >
                {/* Tick button in the bottom-right corner, only the tick icon */}
                <button
                  className={`absolute bottom-4 right-4 flex items-center gap-1 transition z-20 bg-transparent border-none p-0`}
                  style={{ boxShadow: 'none' }}
                  onClick={e => { e.stopPropagation(); handleToggleDone(idx); }}
                  aria-label={doneTodos.includes(idx) ? 'Mark as Not Done' : 'Mark as Done'}
                >
                  {doneTodos.includes(idx) ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#bcd9be]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      <span className="text-[#bcd9be] font-semibold text-sm">Done</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-400 hover:text-[#bcd9be]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      <span className="text-gray-400 hover:text-[#bcd9be] font-semibold text-sm">Mark as done</span>
                    </>
                  )}
                </button>
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
        <TodoDetailPopup todo={todos[popupIdx]} open={popupIdx !== null} onClose={() => setPopupIdx(null)} />
      </div>
    </div>
  );
}
