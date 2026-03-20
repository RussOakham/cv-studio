import { z } from "zod";

export const linkSchema = z.object({
  /** Optional; preview shows `href` for copy/paste. */
  label: z.string().default(""),
  href: z.string(),
});

export const profileSectionSchema = z.object({
  kind: z.literal("profile"),
  id: z.string(),
  name: z.string(),
  tagline: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  links: z.array(linkSchema),
  photoUrl: z.string().optional(),
});

export const summarySectionSchema = z.object({
  kind: z.literal("summary"),
  id: z.string(),
  title: z.string(),
  bodyMarkdown: z.string(),
  printMarginTopMm: z.number().min(0).max(40).optional(),
  printMarginBottomMm: z.number().min(0).max(40).optional(),
  pageBreakBefore: z.boolean().optional(),
});

export const experienceRoleSchema = z.object({
  id: z.string(),
  title: z.string(),
  organization: z.string(),
  location: z.string(),
  start: z.string(),
  end: z.string().nullable(),
  bulletsMarkdown: z.array(z.string()),
  /** Extra space / print control (see inspector “Print spacing”) */
  printMarginTopMm: z.number().min(0).max(40).optional(),
  printMarginBottomMm: z.number().min(0).max(40).optional(),
  pageBreakBefore: z.boolean().optional(),
});

export const experienceSectionSchema = z.object({
  kind: z.literal("experience"),
  id: z.string(),
  title: z.string(),
  /** Continuation body (e.g. prior page) rendered after the section heading */
  leadInMarkdown: z.string().optional(),
  roles: z.array(experienceRoleSchema),
});

export const skillGroupSchema = z.object({
  label: z.string(),
  items: z.array(z.string()),
});

export const skillsSectionSchema = z.object({
  kind: z.literal("skills"),
  id: z.string(),
  title: z.string(),
  groups: z.array(skillGroupSchema),
  printMarginTopMm: z.number().min(0).max(40).optional(),
  printMarginBottomMm: z.number().min(0).max(40).optional(),
  pageBreakBefore: z.boolean().optional(),
});

export const educationEntrySchema = z.object({
  id: z.string(),
  institution: z.string(),
  location: z.string().optional(),
  start: z.string(),
  end: z.string().nullable(),
  credential: z.string(),
  bulletsMarkdown: z.array(z.string()).optional(),
  printMarginTopMm: z.number().min(0).max(40).optional(),
  printMarginBottomMm: z.number().min(0).max(40).optional(),
  pageBreakBefore: z.boolean().optional(),
});

export const educationSectionSchema = z.object({
  kind: z.literal("education"),
  id: z.string(),
  title: z.string(),
  entries: z.array(educationEntrySchema),
});

export const projectSectionSchema = z.object({
  kind: z.literal("project"),
  id: z.string(),
  title: z.string(),
  /** Full GitHub (or other) repository URL, shown in the CV preview */
  repositoryUrl: z.string().default(""),
  summaryMarkdown: z.string(),
  bulletsMarkdown: z.array(z.string()),
  printMarginTopMm: z.number().min(0).max(40).optional(),
  printMarginBottomMm: z.number().min(0).max(40).optional(),
  pageBreakBefore: z.boolean().optional(),
});

export const referencesSectionSchema = z.object({
  kind: z.literal("references"),
  id: z.string(),
  title: z.string(),
  body: z.string(),
  printMarginTopMm: z.number().min(0).max(40).optional(),
  printMarginBottomMm: z.number().min(0).max(40).optional(),
  pageBreakBefore: z.boolean().optional(),
});

export const cvSectionSchema = z.union([
  profileSectionSchema,
  summarySectionSchema,
  experienceSectionSchema,
  skillsSectionSchema,
  educationSectionSchema,
  projectSectionSchema,
  referencesSectionSchema,
]);

export const cvDocumentSchema = z.object({
  version: z.literal(1),
  sections: z.array(cvSectionSchema),
});

export type CvDocument = z.infer<typeof cvDocumentSchema>;
export type CvSection = z.infer<typeof cvSectionSchema>;
export type ProfileSection = z.infer<typeof profileSectionSchema>;
export type SummarySection = z.infer<typeof summarySectionSchema>;
export type ExperienceSection = z.infer<typeof experienceSectionSchema>;
export type ExperienceRole = z.infer<typeof experienceRoleSchema>;
export type SkillsSection = z.infer<typeof skillsSectionSchema>;
export type EducationSection = z.infer<typeof educationSectionSchema>;
export type EducationEntry = z.infer<typeof educationEntrySchema>;
export type ProjectSection = z.infer<typeof projectSectionSchema>;
export type ReferencesSection = z.infer<typeof referencesSectionSchema>;

export function parseCvDocument(data: unknown): CvDocument {
  return cvDocumentSchema.parse(data);
}
