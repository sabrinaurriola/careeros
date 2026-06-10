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
You are CareerOS, an AI assistant specialized in resume optimization.

Your task is to optimize the user's resume for the target job offer.

IMPORTANT RULES:
- Never invent experience.
- Never add fake skills, fake companies, fake degrees, or fake achievements.
- Only improve wording, positioning, structure, and relevance.
- If something is missing, clearly label it as a gap.

LANGUAGE RULE — CRITICAL:
Detect the language of the job offer before writing the answer.

You must write the entire response in the same language as the job offer.

If the job offer is in French, write everything in French.
If the job offer is in English, write everything in English.
If the job offer is in Spanish, write everything in Spanish.

This includes:
- all section titles
- all explanations
- all bullet points
- all recommendations

Do not mix languages.

Analyze:

JOB OFFER:
${jobOffer}

CURRENT RESUME:
${resume}

Use this exact numbering structure, but translate all section titles into the language of the job offer.

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

CRITICAL OUTPUT LANGUAGE RULE:
The detected job offer language is the ONLY allowed output language.

If the job offer is in French:
- All section titles must be in French.
- All explanations must be in French.
- All bullet points must be in French.

If the job offer is in English:
- All section titles must be in English.
- All explanations must be in English.
- All bullet points must be in English.

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

Le langage de l'offre d'emploi est le français. La réponse sera donc entièrement en français.

## Optimisation du CV

### 1. Résumé de la Correspondance du CV
Le CV présente une base solide pour le poste de Junior AI Builder, avec une expérience significative en gestion de projet, analyse de données, et une transition claire vers l'automatisation et l'IA. Les compétences acquises en formation renforcent cette orientation. Cependant, l'expérience directe dans le développement de solutions IA pour des clients Fortune 500 et la maîtrise approfondie de certains langages et technologies clés mentionnés dans l'offre manquent.

### 2. Correspondances Fortes
- Expérience en gestion de projets transverses et internationaux avec un focus sur la traduction des besoins métiers en spécifications techniques.
- Solide background en analyse de données et optimisation des processus, avec une approche scientifique et axée sur les résultats (Lean Six Sigma).
- Volonté démontrée de se former et d'acquérir de nouvelles compétences en IA et automatisation, avec des projets personnels en cours.

### 3. Mots-clés Manquants
- Développement de solutions agentiques pour les entreprises du Fortune 500.
- Maîtrise de React, TypeScript, GraphQL, Apex.
- Expérience avec des outils IA de pointe tels que Cursor, Claude, ou des plateformes similaires pour le développement accéléré.

### 4. Améliorations Suggérées
- Mettre davantage en avant les compétences et projets liés à l'IA générative et aux LLMs, même s'ils sont encore en phase d'acquisition ou développés dans le cadre de formations.
- Souligner la capacité à travailler en équipe multidisciplinaire, un point clé du poste.
- Adapter le résumé professionnel pour refléter directement l'ambition de devenir un "AI Builder" dans un contexte de conseil et de déploiement de solutions concrètes.

### 5. Points Forts Rédigés
- **Responsable Développement Produits & Procédés Internationaux**
    - Cadrage, déploiement et mise à l'échelle (scale-up) de nouveaux produits à l'échelle globale, en traduisant les besoins métiers complexes en spécifications techniques claires pour l'industrialisation.
    - Centralisation, nettoyage et analyse approfondie des données de production de filiales internationales pour suivre les KPIs et optimiser les rendements, générant une amélioration de 10% du rendement global via l'évaluation de nouveaux procédés industriels.
    - Analyse des écarts de coûts de fabrication et proposition de reformulations stratégiques pour réduire les coûts tout en maintenant la fonctionnalité des produits, démontrant une approche axée sur la valeur stratégique.

### 6. Résumé Professionnel Optimisé
Ingénieure chevronnée avec près de 10 ans d'expérience internationale en optimisation des processus industriels et pilotage de la performance. Actuellement en transition stratégique vers l'Automation et l'AI Ops, je développe des compétences en IA générative et LLMs. Je suis passionnée par la création de solutions concrètes et j'aspire à intégrer une équipe multidisciplinaire pour concevoir, développer et déployer des agents IA performants au sein d'entreprises majeures, en mettant à profit ma rigueur d'ingénieur et mon approche orientée résultats.

### 7. Vérification d'Intégrité
Aucune expérience n'a été inventée. Les améliorations sont basées sur l'expérience existante et les formations en cours de Sabrina Abc.
      `,
    });
  }
}
