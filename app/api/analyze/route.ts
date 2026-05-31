import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const { jobOffer } = body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const prompt = `
You are CareerOS, an AI assistant specialized in job application optimization.

Analyze the job offer carefully.

Identify:

1. The top 5 most important skills
2. The company tone:
   - formal
   - technical
   - startup
   - corporate
   - creative
   - sales-oriented
3. Mandatory requirements
4. Preferred qualifications
5. Important ATS keywords
6. Main strengths the candidate should highlight
7. A concise summary of the role

IMPORTANT:
Respond ONLY in English.

Use EXACTLY this structure:

## Job Analysis

### 1. Key Skills
- skill 1
- skill 2
- skill 3
- skill 4
- skill 5

### 2. Company Tone
Short explanation.

### 3. Mandatory Requirements
- requirement 1
- requirement 2
- requirement 3

### 4. Preferred Qualifications
- qualification 1
- qualification 2
- qualification 3

### 5. ATS Keywords
- keyword 1
- keyword 2
- keyword 3

### 6. Candidate Strengths to Highlight
- strength 1
- strength 2
- strength 3

### 7. Job Summary
4-6 concise lines.

### 8. Next Step
Ask the user to upload or paste their current resume in order to generate an optimized version tailored to this role.

Job Offer:
${jobOffer}
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

Key Skills:
- Automation
- AI workflows
- APIs
- Process optimization
- Dashboards
- Make
- Airtable
- Python
- Prompt engineering

Responsibilities:
- Design AI-powered workflows
- Connect APIs and business tools
- Optimize operational processes
- Build reporting dashboards

Important ATS Keywords:
automation, AI workflows, API integration, Make, Airtable, Python, dashboards, process optimization

Ideal Candidate Profile:
A junior Automation / AI Ops profile able to connect tools, structure workflows, and use AI to improve business processes.
      `,
    });

  }
}
