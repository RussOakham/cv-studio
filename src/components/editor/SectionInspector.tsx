import { useCvStore } from "@/store/cv-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CvSection, ExperienceRole, ExperienceSection } from "@/schema/cv-document";
import type { PrintSpacing } from "@/lib/print-tuning";

function clampPrintMm(n: number): number {
  return Math.min(40, Math.max(0, n));
}

function PrintTuningFields({
  idPrefix,
  value,
  onPatch,
}: {
  idPrefix: string;
  value: PrintSpacing;
  onPatch: (patch: Partial<PrintSpacing>) => void;
}) {
  return (
    <div className="border-border space-y-2 border-t pt-3">
      <p className="text-muted-foreground text-xs font-medium">Print layout</p>
      <p className="text-muted-foreground text-[0.7rem] leading-snug">
        Extra spacing and page breaks apply in the stacked A4 preview and when printing. Use “Start
        on new page” to keep a block from splitting awkwardly (e.g. role title vs bullets).
      </p>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label htmlFor={`${idPrefix}-mt`} className="text-xs">
            Extra top (mm)
          </Label>
          <Input
            id={`${idPrefix}-mt`}
            type="number"
            min={0}
            max={40}
            step={0.5}
            placeholder="0"
            value={value.printMarginTopMm ?? ""}
            onChange={(e) => {
              const raw = e.target.value.trim();
              if (raw === "") {
                onPatch({ printMarginTopMm: undefined });
                return;
              }
              const n = Number(raw);
              if (!Number.isFinite(n)) {
                return;
              }
              onPatch({ printMarginTopMm: clampPrintMm(n) });
            }}
            className="h-8 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`${idPrefix}-mb`} className="text-xs">
            Extra bottom (mm)
          </Label>
          <Input
            id={`${idPrefix}-mb`}
            type="number"
            min={0}
            max={40}
            step={0.5}
            placeholder="0"
            value={value.printMarginBottomMm ?? ""}
            onChange={(e) => {
              const raw = e.target.value.trim();
              if (raw === "") {
                onPatch({ printMarginBottomMm: undefined });
                return;
              }
              const n = Number(raw);
              if (!Number.isFinite(n)) {
                return;
              }
              onPatch({ printMarginBottomMm: clampPrintMm(n) });
            }}
            className="h-8 text-xs"
          />
        </div>
      </div>
      <label className="flex cursor-pointer items-start gap-2 text-xs">
        <input
          type="checkbox"
          className="border-input text-primary mt-0.5 size-3.5 shrink-0 rounded"
          checked={!!value.pageBreakBefore}
          onChange={(e) => onPatch({ pageBreakBefore: e.target.checked ? true : undefined })}
        />
        <span>Start on a new page (print + preview)</span>
      </label>
    </div>
  );
}

function bulletsTextareaValue(items: string[]): string {
  return items.join("\n");
}

function parseBullets(raw: string): string[] {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function ExperienceFields({
  exp,
  replaceSection,
  updateExperienceRole,
}: {
  exp: ExperienceSection;
  replaceSection: (id: string, section: CvSection) => void;
  updateExperienceRole: (sectionId: string, roleId: string, patch: Partial<ExperienceRole>) => void;
}) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="exp-title">Section title</Label>
        <Input
          id="exp-title"
          value={exp.title}
          onChange={(e) => {
            replaceSection(exp.id, {
              ...exp,
              title: e.target.value,
            });
          }}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="exp-lead">Lead-in (markdown)</Label>
        <Textarea
          id="exp-lead"
          value={exp.leadInMarkdown ?? ""}
          onChange={(e) => {
            replaceSection(exp.id, {
              ...exp,
              leadInMarkdown: e.target.value || undefined,
            });
          }}
          rows={8}
          className="font-mono text-sm"
        />
      </div>
      <div className="space-y-3 border-border border-t pt-3">
        <p className="font-medium text-sm">Roles</p>
        {exp.roles.map((role) => (
          <div key={role.id} className="bg-muted/40 space-y-2 rounded-lg p-3">
            <Input
              placeholder="Title"
              value={role.title}
              onChange={(e) => {
                updateExperienceRole(exp.id, role.id, {
                  title: e.target.value,
                });
              }}
            />
            <div className="grid gap-2 sm:grid-cols-2">
              <Input
                placeholder="Organization"
                value={role.organization}
                onChange={(e) => {
                  updateExperienceRole(exp.id, role.id, {
                    organization: e.target.value,
                  });
                }}
              />
              <Input
                placeholder="Location"
                value={role.location}
                onChange={(e) => {
                  updateExperienceRole(exp.id, role.id, {
                    location: e.target.value,
                  });
                }}
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Input
                placeholder="Start MM/YYYY"
                value={role.start}
                onChange={(e) => {
                  updateExperienceRole(exp.id, role.id, {
                    start: e.target.value,
                  });
                }}
              />
              <Input
                placeholder="End MM/YYYY or empty = current"
                value={role.end ?? ""}
                onChange={(e) => {
                  const v = e.target.value.trim();
                  updateExperienceRole(exp.id, role.id, {
                    end: v === "" ? null : v,
                  });
                }}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Bullets (one markdown line each)</Label>
              <Textarea
                value={bulletsTextareaValue(role.bulletsMarkdown)}
                onChange={(e) => {
                  updateExperienceRole(exp.id, role.id, {
                    bulletsMarkdown: parseBullets(e.target.value),
                  });
                }}
                rows={6}
                className="font-mono text-xs"
              />
            </div>
            <PrintTuningFields
              idPrefix={`role-${role.id}`}
              value={role}
              onPatch={(patch) => updateExperienceRole(exp.id, role.id, patch)}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export function SectionInspector() {
  const document = useCvStore((s) => s.document);
  const activeSectionId = useCvStore((s) => s.activeSectionId);
  const replaceSection = useCvStore((s) => s.replaceSection);
  const updateExperienceRole = useCvStore((s) => s.updateExperienceRole);
  const setSkillGroups = useCvStore((s) => s.setSkillGroups);

  const section = document.sections.find((s) => s.id === activeSectionId);

  if (!section) {
    return <p className="text-muted-foreground p-4 text-sm">Select a section in the outline.</p>;
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-4">
        {section.kind === "profile" ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={section.name}
                onChange={(e) => {
                  replaceSection(section.id, {
                    ...section,
                    name: e.target.value,
                  });
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={section.tagline ?? ""}
                onChange={(e) => {
                  replaceSection(section.id, {
                    ...section,
                    tagline: e.target.value || undefined,
                  });
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={section.email ?? ""}
                onChange={(e) => {
                  replaceSection(section.id, {
                    ...section,
                    email: e.target.value || undefined,
                  });
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={section.phone ?? ""}
                onChange={(e) => {
                  replaceSection(section.id, {
                    ...section,
                    phone: e.target.value || undefined,
                  });
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={section.location ?? ""}
                onChange={(e) => {
                  replaceSection(section.id, {
                    ...section,
                    location: e.target.value || undefined,
                  });
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Links (URL per line, or label | url — preview shows full URLs)</Label>
              <Textarea
                value={section.links
                  .map((l) => (l.label ? `${l.label}|${l.href}` : l.href))
                  .join("\n")}
                onChange={(e) => {
                  const links = e.target.value
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean)
                    .map((line) => {
                      const pipe = line.indexOf("|");
                      if (pipe === -1) {
                        return { label: "", href: line };
                      }
                      return {
                        label: line.slice(0, pipe).trim(),
                        href: line.slice(pipe + 1).trim(),
                      };
                    })
                    .filter((l) => l.href.length > 0);
                  replaceSection(section.id, { ...section, links });
                }}
                rows={4}
                className="font-mono text-xs"
              />
            </div>
          </>
        ) : null}

        {section.kind === "summary" ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="sum-title">Section title</Label>
              <Input
                id="sum-title"
                value={section.title}
                onChange={(e) => {
                  replaceSection(section.id, {
                    ...section,
                    title: e.target.value,
                  });
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sum-body">Summary (markdown)</Label>
              <Textarea
                id="sum-body"
                value={section.bodyMarkdown}
                onChange={(e) => {
                  replaceSection(section.id, {
                    ...section,
                    bodyMarkdown: e.target.value,
                  });
                }}
                rows={12}
                className="font-mono text-sm"
              />
            </div>
            <PrintTuningFields
              idPrefix={`sum-${section.id}`}
              value={section}
              onPatch={(patch) => replaceSection(section.id, { ...section, ...patch })}
            />
          </>
        ) : null}

        {section.kind === "experience" ? (
          <ExperienceFields
            exp={section}
            replaceSection={replaceSection}
            updateExperienceRole={updateExperienceRole}
          />
        ) : null}

        {section.kind === "skills" ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="skills-title">Section title</Label>
              <Input
                id="skills-title"
                value={section.title}
                onChange={(e) => {
                  replaceSection(section.id, {
                    ...section,
                    title: e.target.value,
                  });
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Groups (label: comma-separated items, one group per line)</Label>
              <Textarea
                value={section.groups.map((g) => `${g.label}: ${g.items.join(", ")}`).join("\n")}
                onChange={(e) => {
                  const groups = e.target.value
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean)
                    .map((line) => {
                      const idx = line.indexOf(":");
                      if (idx === -1) {
                        return { label: line, items: [] as string[] };
                      }
                      const label = line.slice(0, idx).trim();
                      const items = line
                        .slice(idx + 1)
                        .split(",")
                        .map((x) => x.trim())
                        .filter(Boolean);
                      return { label, items };
                    });
                  setSkillGroups(section.id, groups);
                }}
                rows={12}
                className="font-mono text-xs"
              />
            </div>
            <PrintTuningFields
              idPrefix={`skills-${section.id}`}
              value={section}
              onPatch={(patch) => replaceSection(section.id, { ...section, ...patch })}
            />
          </>
        ) : null}

        {section.kind === "education" ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="edu-title">Section title</Label>
              <Input
                id="edu-title"
                value={section.title}
                onChange={(e) => {
                  replaceSection(section.id, {
                    ...section,
                    title: e.target.value,
                  });
                }}
              />
            </div>
            {section.entries.map((e) => (
              <div key={e.id} className="bg-muted/40 space-y-2 rounded-lg p-3">
                <Input
                  placeholder="Institution"
                  value={e.institution}
                  onChange={(ev) => {
                    const entries = section.entries.map((x) =>
                      x.id === e.id ? { ...x, institution: ev.target.value } : x,
                    );
                    replaceSection(section.id, { ...section, entries });
                  }}
                />
                <Input
                  placeholder="Location"
                  value={e.location ?? ""}
                  onChange={(ev) => {
                    const entries = section.entries.map((x) =>
                      x.id === e.id
                        ? {
                            ...x,
                            location: ev.target.value || undefined,
                          }
                        : x,
                    );
                    replaceSection(section.id, { ...section, entries });
                  }}
                />
                <Input
                  placeholder="Credential"
                  value={e.credential}
                  onChange={(ev) => {
                    const entries = section.entries.map((x) =>
                      x.id === e.id ? { ...x, credential: ev.target.value } : x,
                    );
                    replaceSection(section.id, { ...section, entries });
                  }}
                />
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input
                    placeholder="Start"
                    value={e.start}
                    onChange={(ev) => {
                      const entries = section.entries.map((x) =>
                        x.id === e.id ? { ...x, start: ev.target.value } : x,
                      );
                      replaceSection(section.id, { ...section, entries });
                    }}
                  />
                  <Input
                    placeholder="End"
                    value={e.end ?? ""}
                    onChange={(ev) => {
                      const v = ev.target.value.trim();
                      const entries = section.entries.map((x) =>
                        x.id === e.id ? { ...x, end: v === "" ? null : v } : x,
                      );
                      replaceSection(section.id, { ...section, entries });
                    }}
                  />
                </div>
                <Textarea
                  placeholder="Bullets (one per line, optional)"
                  value={bulletsTextareaValue(e.bulletsMarkdown ?? [])}
                  onChange={(ev) => {
                    const entries = section.entries.map((x) =>
                      x.id === e.id
                        ? {
                            ...x,
                            bulletsMarkdown: parseBullets(ev.target.value),
                          }
                        : x,
                    );
                    replaceSection(section.id, { ...section, entries });
                  }}
                  rows={5}
                  className="font-mono text-xs"
                />
                <PrintTuningFields
                  idPrefix={`edu-${e.id}`}
                  value={e}
                  onPatch={(patch) => {
                    const entries = section.entries.map((x) =>
                      x.id === e.id ? { ...x, ...patch } : x,
                    );
                    replaceSection(section.id, { ...section, entries });
                  }}
                />
              </div>
            ))}
          </>
        ) : null}

        {section.kind === "project" ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="proj-title">Title</Label>
              <Input
                id="proj-title"
                value={section.title}
                onChange={(e) => {
                  replaceSection(section.id, {
                    ...section,
                    title: e.target.value,
                  });
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="proj-repo">GitHub repository URL</Label>
              <Input
                id="proj-repo"
                type="url"
                inputMode="url"
                placeholder="https://github.com/username/repo"
                value={section.repositoryUrl}
                onChange={(e) => {
                  replaceSection(section.id, {
                    ...section,
                    repositoryUrl: e.target.value,
                  });
                }}
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="proj-sum">Summary (markdown)</Label>
              <Textarea
                id="proj-sum"
                value={section.summaryMarkdown}
                onChange={(e) => {
                  replaceSection(section.id, {
                    ...section,
                    summaryMarkdown: e.target.value,
                  });
                }}
                rows={6}
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="proj-bullets">Bullets (one markdown line each)</Label>
              <Textarea
                id="proj-bullets"
                value={bulletsTextareaValue(section.bulletsMarkdown)}
                onChange={(e) => {
                  replaceSection(section.id, {
                    ...section,
                    bulletsMarkdown: parseBullets(e.target.value),
                  });
                }}
                rows={10}
                className="font-mono text-xs"
              />
            </div>
            <PrintTuningFields
              idPrefix={`proj-${section.id}`}
              value={section}
              onPatch={(patch) => replaceSection(section.id, { ...section, ...patch })}
            />
          </>
        ) : null}

        {section.kind === "references" ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="ref-title">Section title</Label>
              <Input
                id="ref-title"
                value={section.title}
                onChange={(e) => {
                  replaceSection(section.id, {
                    ...section,
                    title: e.target.value,
                  });
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ref-body">Body</Label>
              <Textarea
                id="ref-body"
                value={section.body}
                onChange={(e) => {
                  replaceSection(section.id, {
                    ...section,
                    body: e.target.value,
                  });
                }}
                rows={4}
              />
            </div>
            <PrintTuningFields
              idPrefix={`ref-${section.id}`}
              value={section}
              onPatch={(patch) => replaceSection(section.id, { ...section, ...patch })}
            />
          </>
        ) : null}
      </div>
    </ScrollArea>
  );
}
