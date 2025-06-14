"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored) setUsername(stored);
    // Get results from query param or sessionStorage
    const data = sessionStorage.getItem("searchResults");
    if (data) setResults(JSON.parse(data));
  }, []);

  const handleSelect = (idx) => {
    setSelected((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleCreateJourneys = async () => {
    setLoading(true);
    const journeys = selected.map((idx) => results[idx]);
    // Use the correct endpoint for adding journeys
    for (const journey of journeys) {
      await fetch(`http://localhost:8000/user/${username}/journeys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(journey),
      });
    }
    setLoading(false);
    router.push("/myjourneys");
  };

  return (
    <div style={{ background: "#f5f6fa", minHeight: "100vh" }}>
      <Navbar username={username} />
      <div className="flex flex-col items-center p-8 gap-10">
        <h1 className="text-3xl font-bold mb-4">Search Results</h1>
        <p className="text-base text-gray-700 mb-4 text-center max-w-xl" style={{ fontFamily: 'Poppins' }}>
          Please select the program(s) you plan to apply to, then click "Create New Journeys" to add them to your dashboard.
        </p>
        <div className="w-full max-w-2xl">
          {results.length === 0 && <div>No results found.</div>}
          <ul className="flex flex-col gap-4">
            {results.map((result, idx) => (
              <li key={idx} className={`border rounded p-4 bg-white shadow flex flex-col gap-2 ${selected.includes(idx) ? "border-[#bcd9be] bg-[#f0f7f4]" : ""}`}>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selected.includes(idx)}
                    onChange={() => handleSelect(idx)}
                  />
                  <span>
                    <b>{result.program.title}</b> ({result.program.level})<br />
                    {result.university.name}{result.university.country ? `, ${result.university.country}` : ""}
                  </span>
                </label>
                <div className="text-sm text-gray-700 mt-2">
                  <b>Admission Requirements:</b> {result.program.requirements.admission_requirements?.join(", ") || "-"}<br />
                  <b>Application Procedure:</b> {result.program.requirements.application_procedure || "-"}<br />
                  <b>Deadline:</b> {result.program.requirements.deadline || "-"}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <button
          className="px-6 py-3 rounded-lg font-semibold transition mt-6"
          style={{ backgroundColor: "#bcd9be", color: "#2e4052", fontFamily: "Poppins" }}
          onClick={handleCreateJourneys}
          disabled={selected.length === 0 || loading}
        >
          {loading ? "Creating..." : "Create New Journeys"}
        </button>
      </div>
    </div>
  );
}
