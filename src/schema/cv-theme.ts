import { z } from "zod";

export const cvThemeSchema = z.object({
  fg: z.string(),
  muted: z.string(),
  timeline: z.string(),
  surface: z.string(),
});

export type CvTheme = z.infer<typeof cvThemeSchema>;

export const defaultCvTheme: CvTheme = {
  fg: "#0a0a0a",
  muted: "#525252",
  timeline: "#a3a3a3",
  surface: "#ffffff",
};

export function parseCvTheme(data: unknown): CvTheme {
  return cvThemeSchema.parse(data);
}
