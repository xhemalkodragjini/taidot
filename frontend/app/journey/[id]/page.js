"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import RoadmapStepper from "../../components/RoadmapStepper";

export default function JourneyDetail() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [journey, setJourney] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored) setUsername(stored);
    if (id && stored) {
      fetch(`http://localhost:8000/user/${stored}/journeys`)
        .then((res) => res.json())
        .then((data) => {
          const found = Array.isArray(data) ? data.find(j => j.id?.toString() === id) : null;
          setJourney(found || null);
        });
    }
  }, [id]);

  if (!journey) return (
    <div style={{ background: "#f5f6fa", minHeight: "100vh" }}>
      <Navbar username={username} />
      <div className="flex flex-col items-center p-8 gap-10">
        <h1 className="text-2xl font-bold">Journey Not Found</h1>
      </div>
    </div>
  );

  const requirements = journey.program.requirements;
  return (
    <div style={{ background: "#f5f6fa", minHeight: "100vh" }}>
      <Navbar username={username} />
      <div className="flex flex-col items-center p-8 gap-8">
        <button
          onClick={() => router.back()}
          className="self-start mb-4 px-4 py-2 rounded-lg bg-[#ffc857] text-[#2e4052] font-semibold hover:bg-[#ffd77a] transition shadow"
          aria-label="Go Back"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-[#2e4052]" style={{ fontFamily: 'Poppins', letterSpacing: '0.01em' }}>{journey.program.title} ({journey.program.level})</h1>
        <h2 className="text-base font-semibold flex items-center mb-10 justify-center gap-2 text-[#3a5a40]" style={{ fontFamily: 'Poppins', letterSpacing: '0.02em' }}>
          <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-[#3a5a40]' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 14l9-5-9-5-9 5 9 5zm0 7v-6m0 0l-9-5m9 5l9-5' /></svg>
          <span className="tracking-wide" style={{ fontWeight: 500 }}>{journey.university.name}</span>
        </h2>
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl flex flex-col gap-8 relative min-h-[700px] border border-[#e0e7ef]">
          <div className="flex flex-col items-center">
            <b className="text-xl text-[#3a5a40] tracking-wide" style={{ fontFamily: 'Poppins', letterSpacing: '0.03em' }}>Admission Requirements Roadmap</b>
          </div>
          <div>
            <RoadmapStepper
              steps={requirements.admission_requirements || []}
              initialCompleted={journey.completed_steps || []}
              journeyId={journey.id}
              username={username}
            />
          </div>
          <div className="flex-1" />
          <div className="flex items-center justify-between w-full absolute left-0 right-0 bottom-6 px-8">
            <div className="flex items-center gap-2 text-base font-semibold text-[#2e4052] bg-[#eaf4ea] px-4 py-2 rounded-lg shadow-sm border border-[#bcd9be]">
              <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-[#3a5a40]' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' /></svg>
              <span><b>Deadline:</b> {requirements.deadline || "-"}</span>
            </div>
            {requirements.application_procedure && requirements.application_procedure.includes("http") && (
              <a
                href={requirements.application_procedure}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg font-semibold transition bg-[#ffc857] text-[#2e4052] hover:bg-[#ffd77a] shadow-md border border-[#e0e7ef] text-base tracking-wide"
                style={{ fontFamily: 'Poppins', textDecoration: 'none', boxShadow: '0 2px 8px 0 #ffc85733' }}
                aria-label="Application Link"
              >
                <span className="flex items-center gap-2">
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14 3h7v7m0 0L10 21l-7-7 11-11z' /></svg>
                  Application Link
                </span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
