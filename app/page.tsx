"use client";

import { useState } from "react";

type CoachingEntry = {
  question: string;
  answer: string;
  feedback: string;
};

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);

  const [jobOffer, setJobOffer] = useState("");
  const [resume, setResume] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const [jobAnalysis, setJobAnalysis] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  const [resumeOutput, setResumeOutput] = useState("");
  const [applicationOutput, setApplicationOutput] = useState("");
  const [interviewOutput, setInterviewOutput] = useState("");

  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [coachingHistory, setCoachingHistory] = useState<CoachingEntry[]>([]);
  const [coachingReport, setCoachingReport] = useState("");
  const currentQuestion = questions[currentQuestionIndex];


  const [loading, setLoading] = useState(false);
  const [coachQuestion, setCoachQuestion] = useState("");
  const [draftAnswer, setDraftAnswer] = useState("");
  const [coachFeedback, setCoachFeedback] = useState("");

  const [sessionToast, setSessionToast] = useState("");
  const [sessionRecordId, setSessionRecordId] = useState("");

  const startNewSession = () => {
    setCurrentStep(0);

    setJobOffer("");
    setResume("");
    setResumeFile(null);

    setJobAnalysis("");
    setResumeOutput("");
    setApplicationOutput("");
    setInterviewOutput("");

    setQuestions([]);
    setCurrentQuestionIndex(0);
    setCoachingHistory([]);
    setCoachingReport("");

    setCoachQuestion("");
    setDraftAnswer("");
    setCoachFeedback("");

    setSessionToast("");
    setSessionRecordId("");

    setCompanyName("");
    setJobTitle("");
  };


  const steps = [
    "Job Analysis",
    "Resume Optimizer",
    "Cover Letter & Email",
    "Interview Prep",
    "Interview Coach",
  ];

  const nextStepLabels = [
    "Resume Optimizer →",
    "Cover Letter & Email →",
    "Interview Prep →",
    "Interview Coach →",
    "Finish →",
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
    const identity = extractSessionIdentity(data.data);

    setCompanyName(identity.companyName);
    setJobTitle(identity.jobTitle);

    console.log("Company:", identity.companyName);
    console.log("Job Title:", identity.jobTitle);


    setLoading(false);
  };

  const extractSessionIdentity = (analysisText: string) => {
    const companyMatch = analysisText.match(/Company Name:\s*(.*)/i);
    const titleMatch = analysisText.match(/Job Title:\s*(.*)/i);

    return {
      companyName: companyMatch?.[1]?.trim() || "Unknown",
      jobTitle: titleMatch?.[1]?.trim() || "Unknown",
    };
  };

  const uploadResume = async () => {
    if (!resumeFile) return;

    const formData = new FormData();

    formData.append("file", resumeFile);

    const response = await fetch("/api/upload-resume", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.success && data.text) {
      setResume(data.text);
    }

    console.log(data);
  };

  const saveSession = async () => {
    console.log("Saving session payload:", {
      sessionId: "will be generated",
      appVersion: "V5.3",
      jobOffer,
      resumeText: resume,
      companyName,
      jobTitle,
      sessionStatus: "Resume Optimized",
      source: resumeFile ? "DOCX Upload" : "Manual Text",
    });

    const response = await fetch("/api/save-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId: `career-${Date.now()}`,
        appVersion: "V5.3",
        jobOffer,
        resumeText: resume,
        jobAnalysis,
        companyName,
        jobTitle,
        sessionStatus: "Resume Optimized",
        source: resumeFile ? "DOCX Upload" : "Manual Text",
      }),
    });

    return await response.json();
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
    const sessionData = await saveSession();

    console.log("Session saved:", sessionData);
    setSessionRecordId(sessionData.recordId);

    const shortSessionId = sessionData.recordId.slice(0, 8);

    setSessionToast(
      `✅ Career session #${shortSessionId} saved\n\nYour progress has been stored and is available in Session History.`
    );
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
    await fetch("/api/update-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recordId: sessionRecordId,
        fields: {
          "Session Status": "Cover Letter Generated",
          "Application Output": data.data,
        },
      }),
    });


    setLoading(false);
  };

  const generateInterviewPrep = async () => {
    setLoading(true);

    const response = await fetch("/api/interview-prep", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobOffer,
        resume,
      }),
    });

    const data = await response.json();

    setInterviewOutput(data.data);
    await fetch("/api/update-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recordId: sessionRecordId,
        fields: {
          "Session Status": "Interview Prep Generated",
          "Interview Prep Output": data.data,
        },
      }),
    });
    const extractedQuestions = extractInterviewQuestions(data.data);

    setQuestions(extractedQuestions);
    setCurrentQuestionIndex(0);

    setLoading(false);
  };

  const extractInterviewQuestions = (text: string) => {
    const matches = text.match(
      /\d+\.\sQuestion:\s*([\s\S]*?)\s*Suggested Answer Framework:/g
    );
    if (!matches) return [];
    return matches.map((match) => {
      const question = match
        .replace(/\d+\.\sQuestion:\s*/g, "")
        .replace("Suggested Answer Framework:", "")
        .trim();

      return question;
    });

  };


  const generateCoachFeedback = async () => {
    setLoading(true);

    const response = await fetch("/api/interview-coach", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: currentQuestion,
        draftAnswer,
        jobOffer,
        resume,
      }),
    });

    const data = await response.json();

    setCoachFeedback(data.data);
    setCoachingHistory((prev) => [
      ...prev,
      {
        question: currentQuestion,
        answer: draftAnswer,
        feedback: data.data,
      },
    ]);


    setLoading(false);
  };
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setDraftAnswer("");
      setCoachFeedback("");
    }

  };

  const generateFinalReport = async () => {
    const report = coachingHistory
      .map((entry, index) => {
        return `Question ${index + 1}: ${entry.question}

Your Answer:
${entry.answer}

AI Feedback:
${entry.feedback}`;
      })
      .join("\n\n---\n\n");

    setCoachingReport(report);
    await fetch("/api/update-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recordId: sessionRecordId,
        fields: {
          "Session Status": "Coaching Completed",
          "Coaching History": report,
        },
      }),
    });


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
                  className={`w-10 h-10 rounded-full border-4 transition-all ${currentStep === index
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

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Upload Resume (DOCX)
                </label>

                <input
                  type="file"
                  accept=".docx"
                  className="block w-full"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                      setResumeFile(file);
                    }
                  }}
                />

                {resumeFile && (
                  <p className="text-sm text-green-600 mt-2">
                    Selected file: {resumeFile.name}
                  </p>
                )}

                {resumeFile && (
                  <button
                    onClick={uploadResume}
                    className="mt-3 bg-black text-white px-5 py-3 rounded-xl font-medium"
                  >
                    Extract Resume Text
                  </button>
                )}



              </div>

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

                  {sessionToast && (
                    <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4">
                      <p className="whitespace-pre-line text-green-800">
                        {sessionToast}
                      </p>
                    </div>
                  )}


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
                Generate a personalized interview preparation package.
              </p>

              <button
                onClick={generateInterviewPrep}
                className="bg-black text-white px-8 py-4 rounded-2xl font-medium"
              >
                {loading ? "Generating..." : "Generate Interview Prep"}
              </button>

              {interviewOutput && (
                <>
                  <div className="mt-8 bg-gray-50 border border-gray-200 rounded-2xl p-6">
                    <h3 className="text-2xl font-bold mb-4">
                      Interview Preparation Package
                    </h3>

                    <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-7">
                      {interviewOutput}
                    </pre>
                  </div>

                  <div className="mt-8 border-t border-gray-200 pt-8">
                    <h3 className="text-2xl font-bold mb-4">
                      Ready for the next step?
                    </h3>

                    <p className="text-gray-700 leading-7 mb-6">
                      You know what you may be asked.
                      <br />
                      <br />
                      Now let&apos;s work on how you answer.
                      <br />
                      <br />
                      Simulate your interview, receive AI coaching, and build stronger
                      answers before speaking with a recruiter.
                    </p>

                    <button
                      onClick={() => setCurrentStep(4)}
                      className="bg-black text-white px-8 py-4 rounded-2xl font-medium"
                    >
                      Start Interview Coaching →
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h2 className="text-4xl font-bold mb-2">
                Step 5: Interview Coach
              </h2>

              <p className="text-gray-600 mb-8">
                Practice your interview answers and receive AI-powered coaching.
              </p>

              {!coachingReport && (
                <div className="space-y-6">
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </p>

                    <p className="text-xl font-semibold text-gray-900 leading-8">
                      {currentQuestion || "Generate Interview Prep first to load your questions."}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your Draft Answer
                    </label>

                    <textarea
                      value={draftAnswer}
                      onChange={(e) => setDraftAnswer(e.target.value)}
                      placeholder="Write your answer here..."
                      className="w-full border border-gray-300 rounded-2xl p-4 h-48"
                    />
                  </div>

                  <button
                    onClick={generateCoachFeedback}
                    className="bg-black text-white px-8 py-4 rounded-2xl font-medium"
                  >
                    {loading ? "Analyzing..." : "Get Feedback"}
                  </button>

                  {coachFeedback && currentQuestionIndex < questions.length - 1 && (
                    <button
                      onClick={goToNextQuestion}
                      className="bg-gray-100 text-gray-800 px-8 py-4 rounded-2xl font-medium border border-gray-300"
                    >
                      Next Question →
                    </button>
                  )}

                  {coachFeedback && currentQuestionIndex === questions.length - 1 && (
                    <button
                      onClick={generateFinalReport}
                      className="bg-green-600 text-white px-8 py-4 rounded-2xl font-medium"
                    >
                      Complete Coaching Session
                    </button>
                  )}

                  {coachFeedback && (
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                      <h3 className="text-2xl font-bold mb-4">
                        Coaching Feedback
                      </h3>

                      <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-7">
                        {coachFeedback}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {coachingReport && (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
                  <h3 className="text-3xl font-bold mb-4">
                    🎉 Session Completed
                  </h3>

                  <div className="mb-6 text-gray-700 leading-8">
                    <p>
                      <strong>Company:</strong> {companyName || "Unknown"}
                    </p>
                    <p>
                      <strong>Role:</strong> {jobTitle || "Unknown"}
                    </p>
                  </div>

                  <p className="text-gray-700 leading-8 mb-6">
                    Your application workflow has been completed and saved.
                  </p>

                  <div className="flex gap-4">
                    <button
                      onClick={() =>
                        alert(
                          "Session History is currently under development and will be available in a future CareerOS version."
                        )
                      }
                      className="bg-gray-100 text-gray-800 px-6 py-3 rounded-2xl font-medium hover:bg-gray-200"
                    >
                      View Session History
                    </button>

                    <button
                      onClick={startNewSession}
                      className="bg-black text-white px-6 py-3 rounded-2xl font-medium hover:bg-gray-800"
                    >
                      Start New Session
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-between mt-10 pt-8 border-t border-gray-200">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-2xl font-medium transition-all ${currentStep === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
            >
              Previous
            </button>

            {currentStep < 3 && (
              <button
                onClick={() =>
                  setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
                }
                className="px-6 py-3 rounded-2xl font-medium transition-all bg-black text-white hover:bg-gray-800"
              >
                {nextStepLabels[currentStep]}
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
