import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { question, draftAnswer, jobOffer, resume } = body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const prompt = `
You are CareerOS, an AI interview coach.

Your task is to evaluate the candidate's draft answer for a specific interview question.

IMPORTANT RULES:
- Never invent experience.
- Never add fake achievements.
- Use only the job offer, resume, question, and draft answer provided.
- Be direct, practical, and supportive.
- Respond only in English.

JOB OFFER:
${jobOffer}

RESUME:
${resume}

INTERVIEW QUESTION:
${question}

CANDIDATE DRAFT ANSWER:
${draftAnswer}

Return EXACTLY this structure:

## Interview Coaching Feedback

### 1. Score
Give a score from 1 to 10.

### 2. Strengths
- strength 1
- strength 2
- strength 3

### 3. Areas To Improve
- improvement 1
- improvement 2
- improvement 3

### 4. Coaching Tips
- tip 1
- tip 2
- tip 3

### 5. Best Answer
Rewrite an improved answer based only on the candidate's real background and the provided resume.
`;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    return NextResponse.json({
      success: true,
      data: response,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json({
      success: true,
      data: `
DEMO MODE — Gemini quota unavailable.

## Interview Coaching Feedback

### 1. Score
7/10

### 2. Strengths
- The answer shows motivation and interest in automation.
- It connects the candidate's learning path with practical project work.
- It mentions CareerOS as a relevant example.

### 3. Areas To Improve
- Add more structure using Context → Action → Result.
- Mention specific tools such as Next.js, APIs, or workflow logic.
- Include a concrete result or learning outcome.

### 4. Coaching Tips
- Start by explaining the problem you were solving.
- Clearly describe your role and actions.
- End with the impact, result, or what you learned.

### 5. Best Answer
One project I have been building is CareerOS, an AI-powered career copilot designed to support job seekers through the application process. The problem I wanted to solve was that candidates often spend a lot of time analyzing job offers, adapting their resume, writing cover letters, and preparing interviews manually.

To build it, I used Next.js, TypeScript, Tailwind CSS, API routes, and Gemini API. I structured the application as a guided workflow with modules for job analysis, resume optimization, cover letter generation, interview preparation, and interview coaching. I also implemented fallback handling so the app remains usable even when the AI provider has quota limitations.

This project helped me understand how to design AI workflows, connect frontend and backend logic, structure prompts, handle API errors, and think like an Automation / AI Ops builder.
      `,
    });

  }
}