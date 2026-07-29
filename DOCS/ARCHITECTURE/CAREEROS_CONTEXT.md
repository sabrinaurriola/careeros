# CareerOS Context

## Product Vision

CareerOS is an AI-powered career copilot that helps candidates improve their job application process through analysis, optimization, preparation, and coaching.

---

## Technology Stack

- Next.js
- TypeScript
- Tailwind CSS
- Gemini API
- GitHub
- Vercel

---

## Current Status

### Production

- Public URL deployed on Vercel
- GitHub repository connected
- Automatic deployment enabled

### Features Completed

#### Step 1 — Job Analysis

- ATS keywords
- Skills extraction
- Responsibilities
- Candidate profile

#### Step 2 — Resume Optimizer

- Resume match analysis
- Missing keywords
- Resume improvements
- Professional summary

#### Step 3 — Cover Letter & Email

- Cover letter generation
- Application email generation
- Alignment summary

#### Step 4 — Interview Prep

- Interview questions
- Interview preparation package
- Elevator pitch
- Recruiter questions

#### Step 5 — Interview Coach

- Question input
- Draft answer input
- AI feedback
- Score
- Strengths
- Areas to improve
- Coaching tips
- Best answer

---

## Current Architecture

### Frontend

app/page.tsx

### API Routes

- /api/analyze
- /api/optimize-resume
- /api/generate-application
- /api/interview-prep
- /api/interview-coach

### Main State Variables

- currentStep
- jobOffer
- resume
- jobAnalysis
- resumeOutput
- applicationOutput
- interviewOutput
- coachQuestion
- draftAnswer
- coachFeedback
- loading

---

## Current Version

### V4.4

Completed:

- Previous / Next Navigation
- Interview Coach Placeholder
- Interview Prep CTA
- Interview Coach API
- Interview Coach Feedback Engine

---

## Next Development

### V4.5

Guided Interview Coaching

Goals:

- Automatically reuse Interview Prep questions
- Question 1 of 5
- Next Question button
- Coaching history
- Interview coaching report

---

## Roadmap

### V5 — Input Intelligence

- Resume PDF Upload
- Job URL Import
- Automatic text extraction

### V6 — Professional Outputs

- Resume PDF Export
- Cover Letter PDF Export
- Interview Prep PDF Export
- Coaching Report PDF Export

### V7 — User Accounts

- Login
- Signup
- Dashboard
- Saved sessions

### V8 — SaaS Foundation

- User profiles
- Usage limits
- Subscription plans
- Stripe integration
- Analytics

---

## Important

The goal is not only to build the product but also to learn product architecture, automation workflows, APIs, and AI-powered systems.

Development should be explained step by step.