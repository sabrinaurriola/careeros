"use client";

import { useState } from "react";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);

  const [jobOffer, setJobOffer] = useState("");
  const [resume, setResume] = useState("");

  const [jobAnalysis, setJobAnalysis] = useState("");
  const [resumeOutput, setResumeOutput] = useState("");
  const [applicationOutput, setApplicationOutput] = useState("");

  const [loading, setLoading] = useState(false);

  const steps = [
    "Job Analysis",
    "Resume Optimizer",
    "Cover Letter & Email",
    "Interview Prep",
    "Professional Photo",
  ];

  const analyzeJob = async () => {
    setLoading(true);

    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jobOffer }),
    });

    const data = await response.json();
    setJobAnalysis(data.data);
    setLoading(false);
  };

  const optimizeResume = async () => {
    setLoading(true);

    const response = await fetch("/api/optimize-resume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jobOffer, resume }),
    });

    const data = await response.json();
    setResumeOutput(data.data);
    setLoading(false);
  };

  const generateApplication = async () => {
    setLoading(true);

    const response = await fetch("/api/generate-application", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jobOffer, resume }),
    });

    const data = await response.json();
    setApplicationOutput(data.data);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10 flex justify-center">
      <div className="w-full max-w-6xl">
        <section className="text-center mb-12">
          <h1 className="text-6xl font-bold text-red-500 mb-4">
            CareerOS
          </h1>
          <p className="text-gray-300 text-xl">
            Your AI-powered career copilot for a stronger job application.
          </p>
        </section>

        <section className="mb-12">
          <div className="flex items-start justify-between gap-4">
            {steps.map((step, index) => (
              <div key={step} className="flex flex-col items-center w-full">
                <button
                  onClick={() => setCurrentStep(index)}
                  className={`w-10 h-10 rounded-full border-4 transition-all ${
                    currentStep === index
                      ? "bg-red-500 border-red-300"
                      : "bg-white border-gray-300"
                  }`}
                />
                <p className="mt-3 text-sm text-gray-300 text-center">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white text-black rounded-3xl p-10 shadow-xl">
          {currentStep === 0 && (
            <div>
              <h2 className="text-4xl font-bold mb-2">
                Step 1: Job Analysis
              </h2>
              <p className="text-gray-600 mb-8">
                Paste the job description so CareerOS can identify key skills,
                ATS keywords, company tone, and hiring priorities.
              </p>

              <textarea
                className="w-full h-72 p-6 rounded-2xl border border-gray-300 text-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
                placeholder="Paste the full job description here..."
                value={jobOffer}
                onChange={(e) => setJobOffer(e.target.value)}
              />

              <button
                onClick={analyzeJob}
                className="mt-6 bg-black text-white px-8 py-4 rounded-2xl font-medium"
              >
                {loading ? "Analyzing..." : "Analyze Job Offer"}
              </button>

              {jobAnalysis && (
                <div className="mt-8 bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-2xl font-bold mb-4">AI Analysis</h3>
                  <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-7">
                    {jobAnalysis}
                  </pre>
                </div>
              )}
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <h2 className="text-4xl font-bold mb-2">
                Step 2: Resume Optimizer
              </h2>
              <p className="text-gray-600 mb-8">
                Paste your resume so CareerOS can suggest improvements without
                inventing experience.
              </p>

              <textarea
                className="w-full h-56 p-6 rounded-2xl border border-gray-300 text-lg resize-none mb-6 focus:outline-none focus:ring-2 focus:ring-red-400"
                placeholder="Paste your current resume or professional profile here..."
                value={resume}
                onChange={(e) => setResume(e.target.value)}
              />

              <button
                onClick={optimizeResume}
                className="bg-black text-white px-8 py-4 rounded-2xl font-medium"
              >
                {loading ? "Optimizing..." : "Optimize Resume"}
              </button>

              {resumeOutput && (
                <div className="mt-8 bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-2xl font-bold mb-4">
                    Resume Optimization
                  </h3>
                  <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-7">
                    {resumeOutput}
                  </pre>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-4xl font-bold mb-2">
                Step 3: Cover Letter & Email
              </h2>
              <p className="text-gray-600 mb-8">
                Generate a tailored cover letter and professional application
                email based on the job offer and resume.
              </p>

              <button
                onClick={generateApplication}
                className="bg-black text-white px-8 py-4 rounded-2xl font-medium"
              >
                {loading ? "Generating..." : "Generate Application"}
              </button>

              {applicationOutput && (
                <div className="mt-8 bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-2xl font-bold mb-4">
                    Application Output
                  </h3>
                  <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-7">
                    {applicationOutput}
                  </pre>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-4xl font-bold mb-2">
                Step 4: Interview Prep
              </h2>
              <p className="text-gray-600 mb-8">
                Coming soon: prepare interview questions and suggested answers
                based on the target role.
              </p>

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                <p className="text-gray-700">
                  This module will generate likely interview questions,
                  suggested answers, and key points to prepare before the
                  interview.
                </p>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h2 className="text-4xl font-bold mb-2">
                Step 5: Professional Photo
              </h2>
              <p className="text-gray-600 mb-8">
                Coming soon: improve your professional image with
                role-specific LinkedIn profile photo recommendations.
              </p>

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                <p className="text-gray-700">
                  This module will generate professional photo recommendations
                  and AI image prompts aligned with your target role and company
                  tone.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
