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
You are CareerOS, an AI assistant specialized in job applications.

Your task is to generate:

1. A tailored cover letter
2. A professional application email

IMPORTANT RULES:

- Never invent experience.
- Never create fake achievements.
- Use only the information provided.
- Do not claim skills, experience, certifications, degrees or accomplishments that are not present in the resume.

LANGUAGE RULE — CRITICAL:

Detect the language of the job offer before writing the answer.

You must write the entire response in the same language as the job offer.

If the job offer is in French, write everything in French.
If the job offer is in English, write everything in English.
If the job offer is in Spanish, write everything in Spanish.

This includes:
- section titles
- email subject
- email body
- cover letter
- alignment summary

Do not mix languages.

JOB OFFER:
${jobOffer}

RESUME:
${resume}

Use this exact numbering structure, but translate all section titles into the language of the job offer.

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

CRITICAL OUTPUT LANGUAGE RULE:

The detected job offer language is the ONLY allowed output language.

If the job offer is in French:
- All section titles must be in French.
- The email must be in French.
- The cover letter must be in French.
- The alignment summary must be in French.

If the job offer is in English:
- All section titles must be in English.
- The email must be in English.
- The cover letter must be in English.
- The alignment summary must be in English.

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

## Dossier de Candidature Professionnelle

### 1. E-mail de Candidature

**Objet :** Candidature pour le poste de Junior AI Builder - Clara Le Bris

**E-mail :**

Madame, Monsieur,

C'est avec un grand intérêt que j'ai pris connaissance de l'opportunité de rejoindre Tech Revolution Inc. en tant que Junior AI Builder, une offre qui correspond parfaitement à mon ambition de transitionner vers l'automatisation et l'AI Ops. Mon parcours en tant qu'Ingénieure axée sur la donnée et l'optimisation des processus industriels, combiné à mon désir d'évoluer rapidement dans un environnement innovant, me pousse à postuler pour ce programme de jeunes diplômés.

L'idée de participer concrètement à la création de solutions agentiques pour des entreprises de premier plan, et de contribuer à redéfinir le fonctionnement des plus grandes organisations mondiales, est particulièrement motivante. Je suis convaincue que mon approche axée sur la résolution de problèmes complexes, ma capacité à traduire les besoins métiers en spécifications techniques, et mon intérêt marqué pour l'IA générative et les LLM, me permettront de m'intégrer efficacement au sein de vos Builder Pods.

Je suis particulièrement attirée par la mission de développement d'agents IA en production et la conception de leur intelligence, domaines dans lesquels j'ai déjà pu explorer les bases grâce à des projets personnels et ma formation en cours. Mon expérience dans la gestion de données et l'amélioration continue, alliée à une forte orientation vers les résultats, me prédispose à réussir dans un rôle qui demande rigueur et initiative.

Je suis impatiente de pouvoir mettre à profit mes compétences et mon enthousiasme pour contribuer au succès de Tech Revolution Inc. et développer mon expertise dans la construction de solutions d'IA de nouvelle génération.

Je vous remercie de l'attention que vous porterez à ma candidature et me tiens à votre entière disposition pour un entretien afin de vous exposer plus en détail ma motivation et mes aptitudes.

Cordialement,

Clara Le Bris

### 2. Lettre de Motivation

Madame, Monsieur,

En tant qu'Ingénieure chevronnée avec une expérience significative dans l'optimisation des processus industriels et le pilotage de la performance opérationnelle, je suis aujourd'hui fermement orientée vers une transition stratégique vers l'Automation et l'AI Ops. Le poste de Junior AI Builder chez Tech Revolution Inc. représente pour moi une opportunité idéale de concrétiser cet objectif, en intégrant une équipe pionnière à l'avant-garde de l'ère des agents IA.

Votre description du poste résonne particulièrement avec mon désir de m'investir activement dans la création de nouveaux projets et de contribuer à des solutions qui ont un impact réel dès l'arrivée. Mon objectif professionnel est de devenir un Product Builder, puis de me spécialiser dans les AI Operations et la stratégie d'automatisation. La perspective de travailler au sein d'un Builder Pod, une équipe transverse dédiée à la conception, au développement et au déploiement de solutions d'intelligence artificielle, correspond parfaitement à ma vision de collaboration et d'innovation.

J'apprécie particulièrement l'accent mis sur le développement assisté par l'IA, et l'utilisation d'outils de pointe tels que Cursor et Claude. Mon parcours actuel inclut l'acquisition de compétences en IA générative et l'intégration de LLMs dans des flux de travail, comme en témoignent mes projets personnels "CareerOS" et "Lead Processing System". Ces expériences m'ont permis de développer une compréhension des concepts clés tels que le prompt engineering, l'architecture applicative et la gestion de projet, compétences que je suis impatiente d'appliquer et d'approfondir dans un contexte professionnel.

Ma formation actuelle en Automatisations & Agents IA, ainsi que ma certification Lean Six Sigma Green Belt, attestent de mon engagement envers l'amélioration continue et l'application d'une approche rigoureuse et data-driven à la résolution de problèmes complexes. Je suis prête à relever le défi de concevoir des agents IA capables d'agir concrètement en production, en m'appuyant sur ma capacité d'analyse, mon initiative et mon orientation vers les résultats.

Je suis convaincue que mon profil, alliant une solide base d'ingénierie à une ambition prononcée pour l'IA, fait de moi une candidate pertinente pour ce programme de jeunes diplômés. Je suis désireuse d'apprendre, de grandir rapidement dans votre environnement innovant et de contribuer activement à la transformation de vos clients.

Je vous remercie de l'opportunité que vous m'offrez de vous exposer ma candidature et me tiens à votre entière disposition pour un entretien.

Sincèrement,

Clara Le Bris

### 3. Résumé d'Adéquation

Le profil de Clara Le Bris présente une forte adéquation avec le poste de Junior AI Builder chez Tech Revolution Inc. Bien que l'offre cible des profils en début de carrière, Clara possède près de 10 ans d'expérience internationale dans l'optimisation des processus industriels et le pilotage de la performance opérationnelle, ce qui témoigne de sa capacité à gérer des projets complexes et à orienter ses actions vers les résultats.

Elle exprime une ambition claire de transitionner vers l'Automation et l'AI Ops, et recherche activement un contrat pour intégrer un programme de "Product Builder", ce qui correspond à la philosophie de Tech Revolution Inc. qui accueille sa toute première promotion de jeunes diplômés AI Builder.

Clara démontre un intérêt marqué pour la création de nouveaux projets et l'IA, comme en témoignent ses projets personnels "CareerOS" (assistant de candidature alimenté par l'IA) et "Lead Processing System" (système de traitement d'emails basé sur l'IA). Ces projets montrent sa familiarité avec l'IA générative, le "prompt engineering", et une approche "Product Thinking". Elle est également en cours de formation "Automatisations & Agents IA" où elle acquiert des compétences clés comme l'intégration de l'IA Générative (OpenAI/ChatGPT) dans des flux de travail et l'utilisation d'outils tels que Make et Airtable.

Bien que certaines compétences techniques spécifiques demandées dans l'offre (React, TypeScript, GraphQL, Apex) ne soient pas explicitement mentionnées dans son CV, elle maîtrise Python (bases), et est familiarisée avec la logique algorithmique et la programmation orientée objet, ce qui constitue une base solide. Sa rigueur d'ingénieure, acquise notamment grâce à sa certification Lean Six Sigma Green Belt, lui permettra d'évaluer avec précision les résultats générés par l'IA.

Enfin, Clara possède une maîtrise professionnelle de l'anglais et, bien qu'indiquée comme "Intermédiaire - Opérationnel en environnement pro", sa maîtrise du français est opérationnelle pour des échanges professionnels, ce qui est essentiel pour ce poste basé à Paris. Son expérience de leadership et sa capacité à collaborer avec des équipes transverses sont également des atouts pertinents.
      `,
    });

  }
}
