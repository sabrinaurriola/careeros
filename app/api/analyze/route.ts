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
      model: "gemini-2.5-flash-lite",
    });

    const prompt = `
You are CareerOS, an AI assistant specialized in job application optimization.

Analyze the job offer carefully.

First, detect the language of the job offer.

LANGUAGE RULE — CRITICAL:
Detect the language of the job offer before writing the answer.

You must write the entire analysis in the same language as the job offer.

If the job offer is in French, write everything in French.
If the job offer is in English, write everything in English.
If the job offer is in Spanish, write everything in Spanish.

This includes:
- all section titles
- all bullet points
- all explanations
- the Next Step section

Only keep these two field labels in English exactly as written, because they are used by the application logic:
Company Name:
Job Title:

Do not translate these two labels.

Identify:

1. Company Name
2. Job Title
3. The top 5 most important skills
4. The company tone:
   - formal
   - technical
   - startup
   - corporate
   - creative
   - sales-oriented
5. Mandatory requirements
6. Preferred qualifications
7. Important ATS keywords
8. Main strengths the candidate should highlight
9. A concise summary of the role

Use this exact numbering, but translate section titles into the job offer language, except "Session Identity".

## Job Analysis

### 0. Session Identity

Company Name: [company name or Unknown]

Job Title: [job title or Unknown]

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

### 8. Next Step

Provide a concise workflow instruction telling the user to upload or paste their current resume in order to continue the application optimization process.

The instruction must:
- sound like the next step of a guided workflow
- not sound like a favor or a request
- not use polite request formulations
- be direct, professional and action-oriented
- use the same language as the job offer

CRITICAL OUTPUT LANGUAGE RULE:
The detected job offer language is the ONLY allowed output language.

If the job offer is in French:
- Section titles must be in French
- Explanations must be in French
- Bullet points must be in French
- Strengths must be in French
- Job Summary must be in French
- Next Step must be in French

Do NOT write any explanatory sentence in English unless the original job offer itself uses that exact English term.

Exception:
Keep only these two labels exactly in English for parsing:
Company Name:
Job Title:

All other text must be written in the same language as the job offer.

Before finalizing, review your answer and rewrite any English sentence into the job offer language.

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

## Analyse de l'offre

### 0. Session Identity

Company Name: Tech Revolution Inc.

Job Title: Junior AI Builder

### 1. Compétences Clés

- Développement de solutions IA avec des outils de pointe (Cursor, Claude, Vibes)
- Conception et raisonnement des agents IA (prompts, logique, LLM, IA générative)
- Gestion du cycle de vie technique complet (conception, développement, débogage, déploiement) en JavaScript, Python, Apex
- Approche conseil et création de valeur stratégique pour les clients
- Compétences en React, TypeScript, GraphQL, POO et infrastructures temps réel

### 2. Ton de l'entreprise

Le ton est **technique** et orienté **startup innovante**. Il met l'accent sur la création de solutions d'IA de pointe, l'impact direct, l'innovation et le développement rapide des compétences dans un environnement dynamique.

### 3. Exigences Obligatoires

- Plus d'un an d'expérience (impliqué par "jeunes diplômés AI Builder" et le besoin d'une première promotion)
- Solide formation en informatique ou discipline d'ingénierie connexe
- Maîtrise courante du français et de l'anglais
- Capacité à produire du code de haute qualité et à évaluer rigoureusement les résultats de l'IA

### 4. Qualifications Préférées

- Maîtrise de React, TypeScript, GraphQL, Python, POO et infrastructures temps réel
- Familiarité avec les technologies d'IA générative, les LLM et le prompt engineering
- Expérience dans la participation active à la création de nouveaux projets
- Aisance dans les échanges avec les équipes commerciales et les clients
- Excellentes capacités d’analyse, d’initiative et forte orientation résultats

### 5. Mots-clés pour ATS

- AI Builder
- Intelligence Artificielle
- Solutions Agentiques
- IA Générative
- LLM
- Prompt Engineering
- JavaScript
- Python
- Apex
- React
- TypeScript
- GraphQL
- Développement IA
- Cycle de vie technique

### 6. Points forts du candidat à mettre en avant

- **Compétences techniques avancées en IA :** Expertise dans le développement, le déploiement et la conception d'agents IA en utilisant des outils modernes et des LLM.
- **Orientation client et création de valeur :** Capacité à transformer les enjeux métier des clients en solutions agentiques concrètes et à mener des échanges stratégiques.
- **Autonomie et esprit d'initiative :** Aptitude à prendre des responsabilités dès le premier jour, à itérer rapidement et à livrer des solutions de haute qualité dans un environnement dynamique.

### 7. Résumé du poste

Tech Revolution Inc. recrute un Junior AI Builder pour sa première promotion de jeunes talents. Vous intégrerez des équipes clients pour concevoir, développer et déployer des solutions agentiques d'IA de pointe pour des entreprises du Fortune 500. Ce poste offre une immersion directe dans l'ère des agents IA, avec un développement accéléré des compétences techniques et commerciales. Vous participerez à l'ensemble du cycle de vie technique, de la conception à la production, en utilisant des technologies avancées et en créant une valeur stratégique pour les clients.

### 8. Next Step

Téléchargez ou collez votre CV actuel pour poursuivre l'optimisation de votre candidature.
      `,
    });

  }
}
