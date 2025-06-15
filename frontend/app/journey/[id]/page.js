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
      <div className="flex flex-col items-center p-8 gap-10">
        <h1 className="text-3xl font-bold mb-2">{journey.program.title} ({journey.program.level})</h1>
        <h2 className="text-xl font-semibold mb-2">{journey.university.name}</h2>
        <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-2xl flex flex-col gap-4">
          <div>
            <b>Application Procedure:</b>
            {requirements.application_procedure && requirements.application_procedure.includes("http") ? null : ` ${requirements.application_procedure || "-"}`}
            {requirements.application_procedure && requirements.application_procedure.includes("http") && (
              <>
                <br />
                <a
                  href={requirements.application_procedure}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 px-5 py-2 rounded-lg font-semibold transition bg-[#bcd9be] text-[#2e4052] hover:bg-[#a3c7a6] shadow"
                  style={{ fontFamily: 'Poppins', textDecoration: 'none' }}
                  aria-label="Open Application Link"
                >
                  Open Application Link
                </a>
              </>
            )}
          </div>
          <div>
            <b>Deadline:</b> {requirements.deadline || "-"}
          </div>
          <div>
            <b>Admission Requirements Roadmap:</b>
            <RoadmapStepper
              steps={requirements.admission_requirements || []}
              initialCompleted={journey.completed_steps || []}
              journeyId={journey.id}
              username={username}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
