import React, { useState, useEffect } from "react";

export default function RoadmapStepper({ steps, initialCompleted = [], journeyId, username }) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setCompleted(initialCompleted);
  }, [initialCompleted]);

  const handleToggle = async (idx) => {
    const newCompleted = completed.includes(idx)
      ? completed.filter((i) => i !== idx)
      : [...completed, idx];
    setCompleted(newCompleted);
    setSaving(true);
    // Save to backend
    if (journeyId && username) {
      await fetch(`http://localhost:8000/user/${username}/journeys/${journeyId}/completed_steps`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCompleted),
      });
    }
    setSaving(false);
  };

  return (
    <div className="flex flex-col gap-4 mt-4 items-center">
      <div className="flex flex-col items-center gap-0 relative max-h-96 overflow-y-auto w-full" style={{ minWidth: 220 }}>
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <button
              onClick={() => handleToggle(idx)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition font-medium shadow-sm text-sm z-10 w-full justify-start
                ${completed.includes(idx)
                  ? "bg-[#bcd9be] text-[#2e4052] border-[#bcd9be] line-through"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-[#f0f7f4]"}
              `}
              style={{ minWidth: 180 }}
              aria-pressed={completed.includes(idx)}
              disabled={saving}
            >
              <span>{step}</span>
              {completed.includes(idx) && (
                <span aria-label="Done" title="Done">✔️</span>
              )}
            </button>
            {idx < steps.length - 1 && (
              <span
                className="w-1 h-8 bg-gray-300 mx-auto z-0"
                style={{ display: 'block' }}
                aria-hidden="true"
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="text-xs text-gray-500 mt-2">Click a step to mark as done/undone.</div>
      {saving && <div className="text-xs text-blue-500 mt-1">Saving...</div>}
    </div>
  );
}
