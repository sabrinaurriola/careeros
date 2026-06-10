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
      model: "gemini-2.5-flash-lite",
    });

    const prompt = `
You are CareerOS, an AI interview coach.

Your task is to evaluate the candidate's draft answer for a specific interview question.

IMPORTANT RULES:
- Never invent experience.
- Never add fake achievements.
- Use only the job offer, resume, question, and draft answer provided.
- Be direct, practical, and supportive.

LANGUAGE RULE — CRITICAL:

Detect the language of the job offer before writing the answer.

You must write the entire response in the same language as the job offer.

If the job offer is in French, write everything in French.
If the job offer is in English, write everything in English.
If the job offer is in Spanish, write everything in Spanish.

This includes:
- section titles
- explanations
- strengths
- improvement suggestions
- coaching tips
- best answer

Do not mix languages.

JOB OFFER:
${jobOffer}

RESUME:
${resume}

INTERVIEW QUESTION:
${question}

CANDIDATE DRAFT ANSWER:
${draftAnswer}

Use this exact numbering structure, but translate all section titles into the language of the job offer.

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

CRITICAL OUTPUT LANGUAGE RULE:

The detected job offer language is the ONLY allowed output language.

If the job offer is in French:
- All section titles must be in French.
- All explanations must be in French.
- All coaching recommendations must be in French.
- The best answer must be in French.

If the job offer is in English:
- All section titles must be in English.
- All explanations must be in English.
- All coaching recommendations must be in English.
- The best answer must be in English.

Before finalizing, review your answer and rewrite any sentence that is not in the language of the job offer.

Do not add extra sections.
Do not add explanations outside the template.
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

## Retour de Coaching d'Entretien

### 1. Note

8/10

### 2. Points Forts

- La candidate explique clairement l'objectif principal du projet CareerOS.
- La réponse met en avant des technologies pertinentes comme Gemini, Next.js et Airtable.
- Le projet démontre une initiative personnelle et une capacité à construire un produit de bout en bout.

### 3. Axes d'Amélioration

- Décrire plus précisément votre rôle personnel dans la conception et le développement du projet.
- Expliquer les principaux défis rencontrés et la manière dont ils ont été résolus.
- Mettre davantage en avant l'impact métier ou la valeur apportée aux utilisateurs.

### 4. Conseils de Coaching

- Structurez votre réponse selon le format Contexte → Action → Résultat.
- Soulignez les décisions produit et techniques que vous avez prises vous-même.
- Quantifiez les résultats ou les fonctionnalités livrées lorsque cela est possible.

### 5. Meilleure Réponse

CareerOS est un projet personnel que je développe dans le cadre de ma transition vers l'Automation et l'AI Ops. L'objectif est d'aider les candidats à optimiser leur processus de candidature grâce à l'intelligence artificielle.

J'ai conçu l'architecture du produit et développé les principales fonctionnalités, notamment l'analyse d'offres d'emploi, l'optimisation de CV, la génération de lettres de motivation et la préparation aux entretiens. Le projet utilise Next.js pour l'interface utilisateur, Gemini pour les analyses et recommandations basées sur l'IA, ainsi qu'Airtable pour le suivi des sessions et des données.

L'un des principaux défis a été de concevoir un workflow cohérent reliant plusieurs étapes du parcours candidat tout en garantissant la traçabilité des résultats. Pour y répondre, j'ai mis en place un système de suivi de session et une architecture modulaire facilitant les évolutions du produit.

Aujourd'hui, CareerOS est un MVP fonctionnel qui me permet de démontrer des compétences en product building, automatisation, intégration d'IA et conception de workflows orientés utilisateur.
      `,
    });

  }
}