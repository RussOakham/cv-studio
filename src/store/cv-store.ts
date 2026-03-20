import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { defaultCvDocument } from "@/data/default-cv";
import {
  parseCvDocument,
  type CvDocument,
  type CvSection,
  type ExperienceRole,
  type SkillGroup,
} from "@/schema/cv-document";
import { defaultCvTheme, type CvTheme } from "@/schema/cv-theme";

export type CvStore = {
  document: CvDocument;
  theme: CvTheme;
  activeSectionId: string | null;
  setDocument: (document: CvDocument) => void;
  setTheme: (theme: CvTheme) => void;
  setActiveSectionId: (id: string | null) => void;
  replaceSection: (id: string, section: CvSection) => void;
  updateExperienceRole: (sectionId: string, roleId: string, patch: Partial<ExperienceRole>) => void;
  setSkillGroups: (sectionId: string, groups: SkillGroup[]) => void;
};

export const useCvStore = create<CvStore>()(
  persist(
    (set, get) => ({
      document: defaultCvDocument,
      theme: defaultCvTheme,
      activeSectionId: defaultCvDocument.sections[0]?.id ?? null,
      setDocument: (document) => set({ document }),
      setTheme: (theme) => set({ theme }),
      setActiveSectionId: (activeSectionId) => set({ activeSectionId }),
      replaceSection: (id, section) =>
        set({
          document: {
            ...get().document,
            sections: get().document.sections.map((s) => (s.id === id ? section : s)),
          },
        }),
      updateExperienceRole: (sectionId, roleId, patch) => {
        const doc = get().document;
        set({
          document: {
            ...doc,
            sections: doc.sections.map((s) => {
              if (s.id !== sectionId || s.kind !== "experience") {
                return s;
              }
              return {
                ...s,
                roles: s.roles.map((r) => (r.id === roleId ? { ...r, ...patch } : r)),
              };
            }),
          },
        });
      },
      setSkillGroups: (sectionId, groups) => {
        const doc = get().document;
        set({
          document: {
            ...doc,
            sections: doc.sections.map((s) => {
              if (s.id !== sectionId || s.kind !== "skills") {
                return s;
              }
              return { ...s, groups };
            }),
          },
        });
      },
    }),
    {
      name: "cv-studio",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        document: s.document,
        theme: s.theme,
        activeSectionId: s.activeSectionId,
      }),
      merge: (persisted, current) => {
        const p = persisted as Partial<CvStore> | undefined;
        const merged: CvStore = { ...current, ...p };
        try {
          merged.document = parseCvDocument(merged.document);
        } catch {
          merged.document = defaultCvDocument;
        }
        return merged;
      },
    },
  ),
);
