import { parseCvDocument, type CvDocument } from "@/schema/cv-document";

const raw: CvDocument = {
  version: 1,
  sections: [
    {
      kind: "profile",
      id: "sec-profile",
      name: "Alex Morgan",
      tagline: "Software Developer",
      email: "alex.morgan@example.com",
      phone: "+44 7000 000000",
      location: "London, United Kingdom",
      links: [
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/alex-morgan-dev",
        },
        { label: "GitHub", href: "https://github.com/alexmorgan-dev" },
      ],
    },
    {
      kind: "summary",
      id: "sec-summary",
      title: "Professional Summary",
      bodyMarkdown:
        "Software developer with expertise in ReactJS, NextJS, Node.js, and TypeScript, focused on building scalable web applications and backend systems. Skilled in utilizing AWS cloud services and AI integration tools to create innovative solutions. Experienced in API development, automated testing, CI/CD pipelines, and infrastructure as code with Terraform. Committed to enhancing development workflows and ensuring efficient deployment processes.",
    },
    {
      kind: "experience",
      id: "sec-experience",
      title: "Work History",
      leadInMarkdown: ``,
      roles: [
        {
          id: "role-senior-and",
          title: "Senior Product Developer",
          organization: "Northbridge Labs",
          location: "London, UK",
          start: "06/2025",
          end: null,
          bulletsMarkdown: [
            "Led technical teams for B2B SaaS and fintech clients.",
            "Mentored junior/mid-level developers.",
            "Drove technical planning and architecture for scalable solutions.",
            "Owned delivery processes and high-quality completion of projects.",
            "Implemented DevOps (CI/CD in GitHub/GitLab) and automated testing.",
            "Architected full-stack TypeScript apps (React, Node.js, Express.js).",
            "Designed AWS solutions (Cognito, serverless).",
            "Integrated AI/ML capabilities (OpenAI API, vector databases).",
          ],
        },
        {
          id: "role-product-and",
          title: "Product Developer",
          organization: "Northbridge Labs",
          location: "London, UK",
          start: "06/2022",
          end: "06/2025",
          bulletsMarkdown: [
            "Built type-safe APIs (OpenAPI) with auto-generated TypeScript clients.",
            "Taught soft skills and workshops; won **mentor of the year** twice.",
            "Led technical discovery and translated requirements into Jira tickets/specs.",
            "Collaborated with cross-functional stakeholders and partner teams.",
            "Earned promotion to Senior Product Developer.",
          ],
        },
        {
          id: "role-zone",
          title: "Frontend Developer / Graduate Programmer",
          organization: "Brightside Digital",
          location: "Manchester, UK",
          start: "08/2021",
          end: "05/2022",
          bulletsMarkdown: [
            "Developed reusable UI components using Vue.js.",
            "Integrated server-side logic with .NET Razor templates.",
            "Collaborated in Agile environments with well-documented code.",
          ],
        },
        {
          id: "role-upugo",
          title: "Operations Manager",
          organization: "Opal Group",
          location: "Manchester",
          start: "01/2020",
          end: "11/2020",
          bulletsMarkdown: [
            "Analyzed performance metrics for operations management.",
            "Liaised with stakeholders for decision-making.",
          ],
        },
        {
          id: "role-tsb-loan",
          title: "Loan Forecast and Insight Assistant Finance Manager",
          organization: "Regional Finance Co.",
          location: "Manchester",
          start: "03/2018",
          end: "12/2019",
          bulletsMarkdown: [
            "Managed a large retail lending portfolio: loan pricing, profitability vs risk analysis, and monthly forecasting with scenario modelling.",
          ],
        },
        {
          id: "role-tsb-cost",
          title: "Cost Insight Analyst",
          organization: "Regional Finance Co.",
          location: "Manchester",
          start: "08/2016",
          end: "03/2018",
          bulletsMarkdown: [
            "Cost / management accounting: SAP ledger, accruals, period close; cost insight packs and monthly / quarterly finance forums with stakeholders.",
          ],
        },
      ],
    },
    {
      kind: "skills",
      id: "sec-skills",
      title: "Skills",
      groups: [
        {
          label: "Languages",
          items: ["TypeScript", "JavaScript", "Python", "SQL", "YAML", "jQuery"],
        },
        {
          label: "Frontend",
          items: ["React", "Next.js", "Vue.js", "HTML5", "CSS3", "Tailwind CSS"],
        },
        {
          label: "Backend",
          items: [
            "Node.js",
            "Express.js",
            "PostgreSQL",
            "MongoDB",
            "Python (Django/Flask)",
            "REST",
            "GraphQL",
          ],
        },
        {
          label: "Cloud & DevOps",
          items: [
            "AWS (Cognito, Lambda, S3)",
            "CI/CD Pipelines",
            "Infrastructure as Code",
            "GitHub Actions",
          ],
        },
        {
          label: "AI/ML",
          items: ["OpenAI API integration", "Vector Databases"],
        },
      ],
    },
    {
      kind: "education",
      id: "sec-education",
      title: "Education",
      entries: [
        {
          id: "edu-code-institute",
          institution: "City Tech Academy",
          location: "Online",
          start: "11/2020",
          end: "07/2021",
          credential: "Diploma: Software Development (L5), Online",
          bulletsMarkdown: [
            "Full-stack software development diploma with practical project delivery and peer review.",
            "Technologies covered: HTML, CSS, JavaScript, Python, SQL, MongoDB, PostgreSQL, Flask, Django, jQuery, Heroku, GitHub, Agile Development, Django REST Framework.",
          ],
        },
        {
          id: "edu-plymouth",
          institution: "University of Northchester",
          location: "Northchester, UK",
          start: "09/2009",
          end: "09/2012",
          credential: "BA: BA(Hons) Accounting and Finance - 2:1",
        },
      ],
    },
    {
      kind: "project",
      id: "sec-project",
      title: "Featured Project",
      repositoryUrl: "",
      summaryMarkdown:
        "Enterprise-grade, full-stack AI application demonstrating modern development practices and production-ready architecture. Built as a personal project to showcase advanced technical skills and best practices.",
      bulletsMarkdown: [
        "Monorepo architecture using pnpm workspaces and Turbo for efficient builds and development",
        "**Type-safe full-stack application:** React (Vite) frontend with Express.js API, auto-generated TypeScript clients",
        "**AI/ML Integration:** OpenAI API with streaming responses, PostgreSQL + pgvector for semantic search and embeddings",
        "**Cloud Infrastructure:** Pulumi for Infrastructure as Code, AWS Cognito for authentication, Redis for caching.",
        "**Production-Ready:** Comprehensive error handling (Go-style patterns), monitoring, logging, and security best practices",
        "**Developer Experience:** Complete documentation (ADRs, guides, API references), automated testing with Vitest, CI/CD pipelines",
      ],
    },
    {
      kind: "references",
      id: "sec-references",
      title: "References",
      body: "References available upon request.",
    },
  ],
};

/** Validated default document (seed + Playwright export) */
export const defaultCvDocument: CvDocument = parseCvDocument(raw);
