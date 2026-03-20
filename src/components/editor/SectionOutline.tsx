import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CvSection } from "@/schema/cv-document";

const kindLabel: Record<CvSection["kind"], string> = {
  profile: "Profile",
  summary: "Summary",
  experience: "Experience",
  skills: "Skills",
  education: "Education",
  project: "Project",
  references: "References",
};

export function SectionOutline({
  sections,
  activeId,
  onSelect,
}: {
  sections: CvSection[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <ScrollArea className="h-full">
      <nav className="flex flex-col gap-0.5 p-2">
        {sections.map((s) => (
          <Button
            key={s.id}
            type="button"
            variant={activeId === s.id ? "secondary" : "ghost"}
            className={cn("h-auto w-full justify-start py-2 text-left")}
            onClick={() => {
              onSelect(s.id);
            }}
          >
            <span className="block text-xs font-medium text-muted-foreground">
              {kindLabel[s.kind]}
            </span>
            <span className="block truncate text-sm">
              {s.kind === "profile" ? s.name : "title" in s ? s.title : s.id}
            </span>
          </Button>
        ))}
      </nav>
    </ScrollArea>
  );
}
