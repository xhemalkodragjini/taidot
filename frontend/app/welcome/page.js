'use client';

import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";

const journeys = [
	{ university: "University of Helsinki", program: "Computer Science BSc" },
	{ university: "Aalto University", program: "Business Administration BA" },
	{ university: "Tampere University", program: "Mechanical Engineering BEng" },
	{ university: "University of Turku", program: "Psychology BSc" },
];

export default function Welcome() {
	const [username, setUsername] = useState("");

	useEffect(() => {
		const stored = localStorage.getItem("username");
		if (stored) setUsername(stored);
	}, []);

	return (
		<div style={{ background: "#f5f6fa", minHeight: "100vh" }}>
			<Navbar username={username} />
			<div className="flex flex-col items-center p-8 gap-10">
				<h1
					className="text-4xl font-bold"
					style={{ color: "#2e4052", fontFamily: "Montserrat" }}
				>
					Welcome to Taidot!
				</h1>
				<p
					className="text-lg text-center max-w-xl"
					style={{ color: "#2e4052", fontFamily: "Poppins" }}
				>
					You are now logged in. Explore your dashboard, manage your to-do list,
					and get the most out of Taidot.
				</p>
				<div className="flex flex-row gap-8 w-full max-w-5xl justify-center">
					{/* Journeys Box */}
					<div className="flex-1 bg-white rounded-2xl shadow-md p-8 flex flex-col min-h-[600px] justify-between border border-gray-300">
						<div className="flex flex-col gap-6 overflow-y-auto max-h-[500px] pr-2">
							<h2
								className="text-2xl font-bold mb-4 sticky top-0 bg-white z-10"
								style={{ color: "#2e4052", fontFamily: "Montserrat" }}
							>
								My Journeys
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{journeys.map((j, idx) => (
									<div
										key={idx}
										className="border-2 border-gray-300 bg-[#f8fafc] rounded-xl p-6 flex flex-col items-start shadow-sm transition hover:shadow-lg hover:border-[#bcd9be] cursor-pointer relative"
										style={{
											minHeight: "120px",
											boxShadow: "0 2px 8px 0 rgba(44,62,80,0.04)",
										}}
									>
										<div className="w-8 h-2 bg-[#bcd9be] rounded-t-md absolute -top-2 left-4" />
										<div
											className="font-semibold text-lg mb-1"
											style={{ color: "#2e4052", fontFamily: "Montserrat" }}
										>
											{j.university}
										</div>
										<div
											className="text-base text-gray-700"
											style={{ fontFamily: "Poppins" }}
										>
											{j.program}
										</div>
									</div>
								))}
							</div>
						</div>
						<button
							className="px-6 py-3 rounded-lg font-semibold transition self-center mt-6"
							style={{
								backgroundColor: "#bcd9be",
								color: "#2e4052",
								fontFamily: "Poppins",
							}}
						>
							Create New Journey
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
