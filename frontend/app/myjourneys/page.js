"use client";

import Navbar from "../components/Navbar";
import JourneyModal from "../components/JourneyModal";
import { useEffect, useState } from "react";
import { searchPrograms } from "../components/searchPrograms";

export default function MyJourneys() {
	const [showModal, setShowModal] = useState(false);
	const [form, setForm] = useState({
		university: "",
		degree: "",
		program: "",
	});
	const [searchResults, setSearchResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [username, setUsername] = useState("");
	const [journeys, setJourneys] = useState([]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleCreate = async (e) => {
		e && e.preventDefault();
		setLoading(true);
		setSearchResults([]);
		const results = await searchPrograms(form.university, form.degree, form.program);
		setSearchResults(results);
		setLoading(false);
		sessionStorage.setItem("searchResults", JSON.stringify(results));
		window.location.href = "/searchresults";
	};

	const handleSelectProgram = (selected) => {
		setShowModal(false);
		setForm({ university: "", degree: "", program: "" });
		setSearchResults([]);
	};

	useEffect(() => {
		const stored = localStorage.getItem("username");
		if (stored) {
			setUsername(stored);
			fetch(`http://localhost:8000/user/${stored}/journeys`)
				.then((res) => res.json())
				.then((data) => setJourneys(data));
		}
	}, []);

	return (
		<div style={{ background: "#f5f6fa", minHeight: "100vh" }}>
			<Navbar username={username} />
			<div className="flex flex-col items-center p-8 gap-10">
				<h1 className="text-4xl font-bold" style={{ color: "#2e4052", fontFamily: "Montserrat" }}>
					Welcome to Taidot!
				</h1>
				<p className="text-lg text-center max-w-xl" style={{ color: "#2e4052", fontFamily: "Poppins" }}>
					You are now logged in. Explore your dashboard, manage your to-do list, and get the most out of Taidot.
				</p>
				<div className="flex flex-row gap-8 w-full max-w-5xl justify-center">
					<div className="flex-1 bg-white rounded-2xl shadow-md p-8 flex flex-col min-h-[600px] justify-between border border-gray-300">
						<div className="flex flex-col gap-6 overflow-y-auto max-h-[500px] pr-2">
							<h2 className="text-2xl font-bold mb-4 sticky top-0 bg-white z-10" style={{ color: "#2e4052", fontFamily: "Montserrat" }}>
								My Journeys
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{Array.isArray(journeys) && journeys.length === 0 && <div>No journeys found.</div>}
								{Array.isArray(journeys) && journeys.map((journey, idx) => (
									<div
										key={idx}
										className="border-2 border-gray-300 bg-[#f8fafc] rounded-xl p-6 flex flex-col items-start shadow-sm transition hover:shadow-lg hover:border-[#bcd9be] cursor-pointer relative"
										style={{ minHeight: "120px", boxShadow: "0 2px 8px 0 rgba(44,62,80,0.04)" }}
									>
										<div className="w-8 h-2 bg-[#bcd9be] rounded-t-md absolute -top-2 left-4" />
										<div className="font-semibold text-lg mb-1" style={{ color: "#2e4052", fontFamily: "Montserrat" }}>
											{journey.program.title}
										</div>
										<div className="text-base text-gray-700" style={{ fontFamily: "Poppins" }}>
											{journey.university.name}
										</div>
									</div>
								))}
							</div>
						</div>
						<button
							className="px-6 py-3 rounded-lg font-semibold transition self-center mt-6"
							style={{ backgroundColor: "#bcd9be", color: "#2e4052", fontFamily: "Poppins" }}
							onClick={() => setShowModal(true)}
						>
							Search new Journey
						</button>
					</div>
				</div>
				<JourneyModal
					show={showModal}
					onClose={() => {
						setShowModal(false);
						setSearchResults([]);
						setLoading(false);
					}}
					onSubmit={handleCreate}
					form={form}
					onChange={handleInputChange}
					searchResults={searchResults}
					onSelectProgram={handleSelectProgram}
					loading={loading}
				/>
			</div>
		</div>
	);
}
