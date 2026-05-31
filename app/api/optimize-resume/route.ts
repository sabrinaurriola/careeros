import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { jobOffer, resume } = body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const prompt = `
You are CareerOS, an AI assistant specialized in resume optimization.

Your task is to optimize the user's resume for the target job offer.

IMPORTANT RULES:
- Never invent experience.
- Never add fake skills, fake companies, fake degrees, or fake achievements.
- Only improve wording, positioning, structure, and relevance.
- If something is missing, clearly label it as a gap.
- Respond only in English.

Analyze:

JOB OFFER:
${jobOffer}

CURRENT RESUME:
${resume}

Return EXACTLY this structure:

## Resume Optimization

### 1. Resume Match Summary
Briefly explain how well the resume matches the job offer.

### 2. Strong Matches
- existing strength 1
- existing strength 2
- existing strength 3

### 3. Missing Keywords
- missing keyword 1
- missing keyword 2
- missing keyword 3

### 4. Suggested Improvements
- improvement 1
- improvement 2
- improvement 3

### 5. Stronger Bullet Points
Rewrite 3 to 5 resume bullet points based only on the user's existing experience.

### 6. Optimized Professional Summary
Write a short professional summary tailored to the role.

### 7. Integrity Check
Confirm that no experience was invented.
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

## Resume Optimization

### 1. Resume Match Summary
The profile shows strong potential for an Automation / AI Ops role, especially if it highlights workflow automation, AI tools, data handling, and process improvement.

### 2. Strong Matches
- Interest in automation and AI workflows
- Ability to structure processes and tools
- Portfolio project experience with CareerOS

### 3. Missing Keywords
- API integration
- Airtable
- Make
- Workflow automation
- Process optimization
- Prompt engineering

### 4. Suggested Improvements
- Add a technical skills section focused on automation tools.
- Reframe project experience using measurable outcomes.
- Highlight AI workflow logic and structured problem solving.

### 5. Stronger Bullet Points
- Built CareerOS, an AI-powered career copilot using Next.js, TypeScript, Tailwind CSS, and Gemini API.
- Designed a job analysis workflow that transforms job descriptions into structured career insights.
- Implemented API routes, environment variables, and fallback handling for AI service limitations.
- Created a modern SaaS-style interface to guide users through the job application process.

### 6. Optimized Professional Summary
Junior Automation / AI Ops builder developing practical AI-powered workflow systems with Next.js, APIs, and structured prompt engineering. Focused on building tools that improve productivity, reduce manual work, and support better decision-making.

### 7. Integrity Check
No experience was invented. Suggestions are based on existing project work and can be adapted to the user's real background.
      `,
    });
  }
}
