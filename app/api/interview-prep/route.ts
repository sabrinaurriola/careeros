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
You are CareerOS, an AI assistant specialized in interview preparation.

Your task is to generate a concise interview preparation package based on the job offer and the user's resume.

IMPORTANT RULES:
- Never invent experience.
- Never create fake achievements.
- Use only the information provided.
- If something is missing, identify it as a preparation gap.
- Keep the output practical and concise.
- Respond only in English.

JOB OFFER:
${jobOffer}

RESUME:
${resume}

Return EXACTLY this structure:

## Interview Preparation Package

### 1. Interview Match Summary
Briefly explain how prepared the candidate appears for this role.

### 2. Top 5 Likely Interview Questions

1. Question:
Suggested Answer Framework:
- Context:
- Action:
- Result:

2. Question:
Suggested Answer Framework:
- Context:
- Action:
- Result:

3. Question:
Suggested Answer Framework:
- Context:
- Action:
- Result:

4. Question:
Suggested Answer Framework:
- Context:
- Action:
- Result:

5. Question:
Suggested Answer Framework:
- Context:
- Action:
- Result:

### 3. Potential Weaknesses
- weakness 1
- weakness 2
- weakness 3

### 4. Questions To Ask The Recruiter
- question 1
- question 2
- question 3

### 5. 30-Second Elevator Pitch
Write one concise pitch the candidate can use at the start of the interview.
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

## Interview Preparation Package

### 1. Interview Match Summary
The candidate appears to be a promising junior profile for an Automation / AI Ops role, especially if they clearly explain their practical project work, workflow logic, and motivation to build automation systems.

### 2. Top 5 Likely Interview Questions

1. Question:
Can you explain a workflow automation project you have built or are currently building?

Suggested Answer Framework:
- Context: Explain the manual process or problem.
- Action: Describe the tools, logic, and steps you used.
- Result: Explain what the system improved or what it is designed to improve.

2. Question:
How would you identify a process that should be automated?

Suggested Answer Framework:
- Context: Mention repetitive, time-consuming, or error-prone tasks.
- Action: Explain how you would map the process and define inputs, decisions, and outputs.
- Result: Show how automation can save time, reduce errors, or improve consistency.

3. Question:
Tell me about a technical problem you faced while building CareerOS.

Suggested Answer Framework:
- Context: Mention API integration, environment variables, routing, or quota errors.
- Action: Explain how you debugged the issue step by step.
- Result: Show that you kept the system working using fallback logic.

4. Question:
Why are you interested in automation and AI Ops?

Suggested Answer Framework:
- Context: Explain your interest in improving workflows and reducing manual work.
- Action: Connect your learning path to real project building.
- Result: Show that you want to build useful systems, not just use AI tools.

5. Question:
How do you make sure AI-generated outputs remain trustworthy?

Suggested Answer Framework:
- Context: Explain that AI can produce incomplete or inaccurate answers.
- Action: Mention constraints, structured prompts, review steps, and rules such as never inventing experience.
- Result: Show that you combine automation with human validation.

### 3. Potential Weaknesses
- Limited production experience with deployed automation systems.
- Missing measurable project impact metrics.
- Gemini API quota limitations may prevent live AI output during demos.

### 4. Questions To Ask The Recruiter
- What manual processes are currently slowing down the team?
- Which tools are already used for automation, CRM, or reporting?
- How would success be measured in this role during the first three months?

### 5. 30-Second Elevator Pitch
I am a junior Automation and AI Ops builder focused on creating practical workflow systems that combine AI, APIs, and structured logic. Through projects like CareerOS, I am learning to design tools that analyze information, reduce manual work, and support better decision-making. I am especially interested in roles where I can keep building real systems and improve operational efficiency.
      `,
    });

  }
}
