// This is a helper for the frontend to call the backend search API
export async function searchPrograms(university, degree, program) {
  const res = await fetch("http://localhost:8000/search_programs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ university, degree, program }),
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.programs || [];
}
