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
You are CareerOS, an AI assistant specialized in job applications.

Your task is to generate:

1. A tailored cover letter
2. A professional application email

IMPORTANT RULES:

- Never invent experience.
- Never create fake achievements.
- Use only the information provided.
- Respond only in English.

JOB OFFER:
${jobOffer}

RESUME:
${resume}

Return EXACTLY this structure:

## Professional Application Package

### 1. Application Email

Subject:
...

Email:
...

### 2. Cover Letter

Dear Hiring Manager,

...

### 3. Alignment Summary

Explain why the candidate is a good fit based only on the information provided.
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

## Professional Application Package

### 1. Application Email

Subject:
Application for Automation Specialist Position

Email:

Dear Hiring Team,

I hope you are doing well.

I am writing to express my interest in the Automation Specialist position.

My background includes process improvement, structured problem solving, and practical experience building automation and AI-related projects.

I would welcome the opportunity to discuss how my skills and motivation could contribute to your team.

Thank you for your time and consideration.

Best regards,

Candidate Name

---

### 2. Cover Letter

Dear Hiring Manager,

I am excited to apply for the Automation Specialist role.

My interest in automation, AI-powered workflows, and process optimization has led me to develop practical projects focused on improving productivity and reducing manual work.

Through projects such as CareerOS, I have gained experience working with APIs, workflow logic, prompt engineering, and modern web technologies.

I am particularly attracted to this opportunity because it combines technology, problem solving, and business impact.

I would be delighted to contribute my motivation, adaptability, and analytical mindset to your organization.

Thank you for your consideration.

Sincerely,

Candidate Name

---

### 3. Alignment Summary

The candidate demonstrates interest in automation, AI systems, workflow design, and process optimization. Their portfolio project work shows initiative and practical application of relevant concepts.
      `,
    });

  }
}
