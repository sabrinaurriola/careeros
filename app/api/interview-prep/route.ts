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
      model: "gemini-2.5-flash-lite",
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

LANGUAGE RULE — CRITICAL:

Detect the language of the job offer before writing the answer.

You must write the entire response in the same language as the job offer.

If the job offer is in French, write everything in French.
If the job offer is in English, write everything in English.
If the job offer is in Spanish, write everything in Spanish.

Do not mix languages.

IMPORTANT TECHNICAL RULE:

The application extracts interview questions automatically.

Therefore, you MUST keep the following labels EXACTLY in English:

Question:
Suggested Answer Framework:
Context:
Action:
Result:

Do NOT translate these labels.

Everything else must be written in the same language as the job offer.

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
[write the question in the job offer language]

Suggested Answer Framework:
- Context:
- Action:
- Result:

2. Question:
[write the question in the job offer language]

Suggested Answer Framework:
- Context:
- Action:
- Result:

3. Question:
[write the question in the job offer language]

Suggested Answer Framework:
- Context:
- Action:
- Result:

4. Question:
[write the question in the job offer language]

Suggested Answer Framework:
- Context:
- Action:
- Result:

5. Question:
[write the question in the job offer language]

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

CRITICAL OUTPUT LANGUAGE RULE:

The detected job offer language is the ONLY allowed output language.

If the job offer is in French:
- Interview Match Summary must be in French.
- Interview questions must be in French.
- Potential Weaknesses must be in French.
- Questions To Ask The Recruiter must be in French.
- Elevator Pitch must be in French.

If the job offer is in English:
- Interview Match Summary must be in English.
- Interview questions must be in English.
- Potential Weaknesses must be in English.
- Questions To Ask The Recruiter must be in English.
- Elevator Pitch must be in English.

Keep ONLY these labels in English:

Question:
Suggested Answer Framework:
Context:
Action:
Result:

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

## Dossier de Préparation à l'Entretien

### 1. Résumé de la Correspondance avec l'Entretien
Clara présente un profil solide pour ce poste, avec une expérience en ingénierie, gestion de projet, optimisation des processus et transition vers l'IA et l'automatisation.

### 2. 5 Questions Probables à l'Entretien

1. Question:
Parlez-moi de votre projet CareerOS. Quel a été votre rôle et quelles technologies clés avez-vous utilisées ?

Suggested Answer Framework:
- Context: Présenter brièvement le problème que CareerOS vise à résoudre.
- Action: Expliquer votre contribution au produit, à l'architecture, aux workflows IA et à l'amélioration de l'expérience utilisateur.
- Result: Montrer que le projet est un MVP fonctionnel en amélioration continue.

2. Question:
Comment votre expérience en optimisation de processus industriels vous aide-t-elle à concevoir des solutions IA utiles pour les équipes métiers ?

Suggested Answer Framework:
- Context: Rappeler votre expérience en amélioration continue, KPI et performance opérationnelle.
- Action: Expliquer comment vous transformez un problème métier en workflow structuré.
- Result: Montrer votre capacité à livrer des solutions mesurables et orientées impact.

3. Question:
Comment comptez-vous renforcer rapidement vos compétences techniques en Python, JavaScript, APIs et automatisation ?

Suggested Answer Framework:
- Context: Reconnaître les compétences déjà acquises et les axes de progression.
- Action: Mentionner votre formation actuelle, vos projets CareerOS et vos pratiques de build.
- Result: Montrer votre capacité d'apprentissage rapide et votre orientation exécution.

4. Question:
Comment collaborez-vous avec des équipes commerciales, produit ou opérationnelles pour comprendre leurs besoins ?

Suggested Answer Framework:
- Context: Expliquer vos expériences de collaboration avec des équipes transverses.
- Action: Décrire votre méthode pour clarifier les besoins, prioriser et transformer les attentes en solutions.
- Result: Montrer votre capacité à faire le lien entre métier et technique.

5. Question:
Comment évaluez-vous la qualité d'une solution générée ou assistée par l'IA ?

Suggested Answer Framework:
- Context: Expliquer votre approche rigoureuse issue de l'ingénierie et de l'analyse de données.
- Action: Décrire vos critères de validation : cohérence, exactitude, utilité métier, limites et risques.
- Result: Montrer que vous savez utiliser l'IA sans perdre le contrôle qualité.

### 3. Faiblesses Potentielles
- Niveau technique encore en développement sur certains langages.
- Besoin de consolider l'expérience directe sur des projets IA en production.
- Nécessité de démontrer une montée en compétence rapide sur les outils attendus.

### 4. Questions à Poser au Recruteur
- Quels types de projets IA l'équipe priorise-t-elle actuellement ?
- Comment mesurez-vous l'impact des solutions d'automatisation déployées ?
- Quel accompagnement est prévu pour accélérer la montée en compétence technique ?

### 5. Pitch d'Ascenseur de 30 Secondes
Je suis Clara, ingénieure en transition vers l'Automation et l'AI Ops, avec une forte expérience en optimisation de processus, gestion de projet et analyse de données. Je construis actuellement CareerOS, un produit IA orienté candidature, pour démontrer ma capacité à transformer un besoin utilisateur en système fonctionnel, structuré et mesurable.
`,
    });

  }
}
