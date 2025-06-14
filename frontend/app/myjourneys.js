import Navbar from "../components/Navbar";

export default function MyJourneys() {
  // This will be filled in after backend and model changes
  return (
    <div style={{ background: "#f5f6fa", minHeight: "100vh" }}>
      <Navbar />
      <div className="flex flex-col items-center p-8 gap-10">
        <h1 className="text-4xl font-bold" style={{ color: "#2e4052", fontFamily: "Montserrat" }}>
          My Journeys
        </h1>
        {/* List of journeys will go here */}
      </div>
    </div>
  );
}
