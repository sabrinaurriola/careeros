"use client";

import { useState } from "react";

export default function Home() {

  const [jobOffer, setJobOffer] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeJob = async () => {

    setLoading(true);

    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobOffer,
      }),
    });

    const data = await response.json();

    setResult(data.data);

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#f5f5f5] flex justify-center px-6 py-16">

      <div className="w-full max-w-5xl">

        <div className="mb-10">

          <h1 className="text-6xl font-bold text-red-700 mb-4">
            CareerOS
          </h1>

          <p className="text-gray-600 text-xl max-w-2xl leading-relaxed">
            Your AI-powered copilot for job applications, CV optimization,
            ATS analysis, and interview preparation.
          </p>

        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">

          <textarea
            className="w-full h-72 p-6 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 text-lg resize-none"
            placeholder="Paste a job offer here..."
            value={jobOffer}
            onChange={(e) => setJobOffer(e.target.value)}
          />

          <button
            onClick={analyzeJob}
            className="mt-6 bg-black hover:bg-gray-800 transition-all text-white px-8 py-4 rounded-2xl text-lg font-medium"
          >
            {loading ? "Analyzing..." : "Analyze Job Offer"}
          </button>

        </div>

        <div className="mt-10 bg-white rounded-3xl shadow-sm border border-gray-200 p-8">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-3xl font-bold text-gray-900">
              AI Analysis
            </h2>

            <div className="text-sm bg-red-100 text-red-700 px-4 py-2 rounded-full">
              AI Powered
            </div>

          </div>

          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">

            <pre className="whitespace-pre-wrap text-gray-700 leading-8 font-sans">
              {result || "Your AI analysis will appear here."}
            </pre>

          </div>

        </div>

      </div>

    </main>
  );
}
