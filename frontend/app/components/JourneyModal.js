import React, { useState } from "react";

export default function JourneyModal({ show, onClose, onSubmit, form, onChange, searchResults, onSelectProgram, loading }) {
	if (!show) return null;
	return (
		<div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0,0,0,0.15)", backdropFilter: "blur(12px)" }}>
			<div className="bg-white rounded-xl p-8 shadow-lg w-full max-w-md">
				<h3 className="text-xl font-bold mb-4" style={{ color: "#2e4052", fontFamily: "Montserrat" }}>
					Search for your New Journey
				</h3>
				<div className="flex flex-col gap-6">
					<label className="font-semibold">University</label>
					<p className="text-sm text-gray-500 mb-0.5">Which university are you interested in?</p>
					<input name="university" value={form.university} onChange={onChange} className="border rounded p-2" placeholder="Enter university name" />

					<label className="font-semibold">Degree Level</label>
					<p className="text-sm text-gray-500 mb-0.5">What level of degree are you considering?</p>
					<input name="degree" value={form.degree} onChange={onChange} className="border rounded p-2" placeholder="e.g. Bachelor, Master, etc." />

					<label className="font-semibold">Program</label>
					<p className="text-sm text-gray-500 mb-0.5">Which area or field would you like to study?</p>
					<input name="program" value={form.program} onChange={onChange} className="border rounded p-2" placeholder="e.g. Computer Science" />
				</div>
				<div className="flex justify-end gap-2 mt-6">
					<button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 text-gray-700">Cancel</button>
					<button onClick={onSubmit} className="px-4 py-2 rounded bg-[#bcd9be] text-[#2e4052] font-semibold">Search</button>
				</div>
			
				{searchResults && searchResults.length > 0 && (
					<div className="mt-6">
						<h4 className="font-semibold mb-2">Select a program you're interested in:</h4>
						<ul className="flex flex-col gap-2">
							{searchResults.map((result, idx) => (
								<li key={idx}>
									<button onClick={() => onSelectProgram(result)} className="w-full text-left px-3 py-2 rounded border border-gray-300 hover:bg-[#f0f7f4]">
										{typeof result === 'object' && result.university && result.program ? (
											<>
												<div><b>{result.program.title}</b> ({result.program.level})</div>
												<div>{result.university.name}{result.university.country ? `, ${result.university.country}` : ''}</div>
											</>
										) : (
											String(result)
										)}
									</button>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
}
