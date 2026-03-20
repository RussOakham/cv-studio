import type { CSSProperties, ReactNode } from "react";

import type { CvDocument } from "@/schema/cv-document";
import type { CvTheme } from "@/schema/cv-theme";
import { MarkdownBlock, MarkdownBulletList } from "@/components/cv/MarkdownBlock";
import type { PrintSpacing } from "@/lib/print-tuning";
import { printSpacingProps } from "@/lib/print-tuning";
import { cn } from "@/lib/utils";

function formatDateRange(start: string, end: string | null): string {
  if (end === null) {
    return `${start} – current`;
  }
  return `${start} – ${end}`;
}

function TimelineNode() {
  return (
    <div
      className="absolute top-1 z-[1] size-2.5 shrink-0 -translate-x-1/2 rounded-full border-2 border-[color:var(--cv-timeline)] bg-[var(--cv-surface)]"
      style={{ left: "calc(var(--cv-spine-x) - var(--cv-inner-pad-x))" }}
      aria-hidden
    />
  );
}

type TimelineSectionProps = {
  title: string;
  children: ReactNode;
  showTimelineNode?: boolean;
  printSpacing?: PrintSpacing;
};

function TimelineSection({
  title,
  children,
  showTimelineNode = true,
  printSpacing,
}: TimelineSectionProps) {
  const ps = printSpacingProps(printSpacing);
  return (
    <section className={cn("relative pb-4 print:pb-3", ps.className)} style={ps.style}>
      {showTimelineNode ? <TimelineNode /> : null}
      <h2 className="mb-1.5 text-[1rem] font-bold tracking-widest text-[color:var(--cv-fg)] uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

function renderSections(document: CvDocument) {
  return document.sections.map((section) => {
    if (section.kind === "profile") {
      return (
        <header key={section.id} className="mb-5 print:mb-4">
          <h1 className="text-2xl font-bold tracking-wide text-[color:var(--cv-fg)] uppercase sm:text-3xl">
            {section.name}
          </h1>
          {section.tagline ? (
            <p className="mt-0.5 text-sm leading-snug text-[color:var(--cv-muted)]">
              {section.tagline}
            </p>
          ) : null}
          <div className="mt-1.5 space-y-0 text-xs leading-snug text-[color:var(--cv-muted)]">
            {section.email ? <div>{section.email}</div> : null}
            {section.phone ? <div>{section.phone}</div> : null}
            {section.location ? <div>{section.location}</div> : null}
          </div>
          <div className="mt-1.5 flex flex-wrap items-baseline gap-x-1 gap-y-0.5 text-[0.7rem] leading-snug text-[color:var(--cv-muted)]">
            {section.links.map((l, idx) => (
              <span key={l.href} className="inline max-w-full">
                {idx > 0 ? <span className="px-1 text-[color:var(--cv-muted)]">|</span> : null}
                <a
                  href={l.href}
                  className="break-all text-[color:var(--cv-fg)] underline underline-offset-2 decoration-[color:var(--cv-timeline)] hover:opacity-90"
                  rel="noopener noreferrer"
                >
                  {l.href.trim()}
                </a>
              </span>
            ))}
          </div>
        </header>
      );
    }

    if (section.kind === "summary") {
      return (
        <TimelineSection key={section.id} title={section.title} printSpacing={section}>
          <MarkdownBlock markdown={section.bodyMarkdown} />
        </TimelineSection>
      );
    }

    if (section.kind === "experience") {
      return (
        <TimelineSection key={section.id} title={section.title}>
          {section.leadInMarkdown ? (
            <div className="mb-3 break-inside-avoid">
              <MarkdownBlock markdown={section.leadInMarkdown} />
            </div>
          ) : null}
          <div className="space-y-3">
            {section.roles.map((role) => {
              const rp = printSpacingProps(role);
              return (
                <article
                  key={role.id}
                  className={cn(
                    "cv-role-block break-inside-avoid print:break-inside-avoid",
                    rp.className,
                  )}
                  style={rp.style}
                >
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[0.875rem] font-bold leading-snug text-[color:var(--cv-fg)]">
                        {role.title}
                      </h3>
                      <p className="text-xs leading-snug text-[color:var(--cv-muted)]">
                        {role.organization}
                        {role.location ? ` – ${role.location}` : ""}
                      </p>
                    </div>

                    <p className="shrink-0 text-right text-xs italic text-[color:var(--cv-muted)]">
                      {formatDateRange(role.start, role.end)}
                    </p>
                  </div>
                  {role.bulletsMarkdown.length > 0 ? (
                    <MarkdownBulletList className="mt-1" items={role.bulletsMarkdown} />
                  ) : null}
                </article>
              );
            })}
          </div>
        </TimelineSection>
      );
    }

    if (section.kind === "skills") {
      return (
        <TimelineSection key={section.id} title={section.title} printSpacing={section}>
          <div className="grid grid-cols-1 gap-x-5 gap-y-1.5 text-xs leading-snug sm:grid-cols-2">
            {section.groups.map((g) => (
              <p key={g.label} className="break-inside-avoid text-[color:var(--cv-fg)]">
                <span className="font-semibold text-[color:var(--cv-fg)]">{g.label}:</span>{" "}
                <span>{g.items.join(", ")}</span>
              </p>
            ))}
          </div>
        </TimelineSection>
      );
    }

    if (section.kind === "education") {
      return (
        <TimelineSection key={section.id} title={section.title}>
          <div className="space-y-3">
            {section.entries.map((e) => {
              const ep = printSpacingProps(e);
              return (
                <article
                  key={e.id}
                  className={cn(
                    "cv-edu-block break-inside-avoid print:break-inside-avoid",
                    ep.className,
                  )}
                  style={ep.style}
                >
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                    <div>
                      <h3 className="text-[0.875rem] font-bold leading-snug">{e.institution}</h3>
                      {e.location ? (
                        <p className="text-xs text-[color:var(--cv-muted)]">{e.location}</p>
                      ) : null}
                      <p className="mt-0.5 text-xs font-semibold">{e.credential}</p>
                    </div>
                    <p className="shrink-0 text-right text-xs italic text-[color:var(--cv-muted)]">
                      {formatDateRange(e.start, e.end)}
                    </p>
                  </div>
                  {e.bulletsMarkdown && e.bulletsMarkdown.length > 0 ? (
                    <MarkdownBulletList className="mt-1" items={e.bulletsMarkdown} />
                  ) : null}
                </article>
              );
            })}
          </div>
        </TimelineSection>
      );
    }

    if (section.kind === "project") {
      const repoHref = (() => {
        const raw = section.repositoryUrl.trim();
        if (!raw) {
          return null;
        }
        return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
      })();
      return (
        <TimelineSection key={section.id} title={section.title} printSpacing={section}>
          <div className="cv-project-block break-inside-avoid space-y-2">
            {repoHref ? (
              <p className="text-[0.7rem] text-[color:var(--cv-muted)]">
                <a
                  href={repoHref}
                  className="font-mono text-[color:var(--cv-fg)] underline decoration-[color:var(--cv-timeline)] underline-offset-2"
                  rel="noopener noreferrer"
                >
                  {section.repositoryUrl.trim()}
                </a>
              </p>
            ) : null}
            <MarkdownBlock variant="prose-project" markdown={section.summaryMarkdown} />
            <MarkdownBulletList items={section.bulletsMarkdown} />
          </div>
        </TimelineSection>
      );
    }

    if (section.kind === "references") {
      return (
        <TimelineSection key={section.id} title={section.title} printSpacing={section}>
          <p className="text-xs leading-snug text-[color:var(--cv-muted)]">{section.body}</p>
        </TimelineSection>
      );
    }

    return null;
  });
}

export function TimelineMonoContent({
  document,
  theme,
  id,
  className,
  transparentRoot,
  innerPaddingMode,
}: {
  document: CvDocument;
  theme: CvTheme;
  id?: string;
  className?: string;
  /** Let parent sheet provide background (stacked preview). */
  transparentRoot?: boolean;
  innerPaddingMode: "a4" | "a4-stacked-inner" | "comfortable";
}) {
  const style = {
    "--cv-fg": theme.fg,
    "--cv-muted": theme.muted,
    "--cv-timeline": theme.timeline,
    "--cv-surface": theme.surface,
  } as CSSProperties;

  return (
    <div
      id={id}
      style={style}
      className={cn(
        "relative text-[color:var(--cv-fg)] antialiased",
        transparentRoot ? "bg-transparent" : "bg-[var(--cv-surface)]",
        className,
      )}
    >
      <div
        className={cn(
          "cv-timeline-inner relative mx-auto w-full [--cv-spine-x:15px] print:px-[12mm] print:py-0",
          innerPaddingMode === "a4" && "max-w-none [--cv-inner-pad-x:12mm] px-[12mm] py-[12mm]",
          innerPaddingMode === "a4-stacked-inner" &&
            "max-w-none [--cv-inner-pad-x:12mm] px-[12mm] py-0",
          innerPaddingMode === "comfortable" &&
            "max-w-4xl px-8 py-10 [--cv-inner-pad-x:2rem] print:[--cv-inner-pad-x:12mm]",
        )}
      >
        <div
          className="pointer-events-none absolute top-24 bottom-10 w-px bg-[color:var(--cv-timeline)] print:top-24"
          style={{ left: "var(--cv-spine-x)" }}
          aria-hidden
        />
        {renderSections(document)}
      </div>
    </div>
  );
}

export function TimelineMonoLayout({
  document,
  theme,
  showA4PageGuides = true,
}: {
  document: CvDocument;
  theme: CvTheme;
  showA4PageGuides?: boolean;
}) {
  return (
    <TimelineMonoContent
      id="cv-root"
      document={document}
      theme={theme}
      innerPaddingMode={showA4PageGuides ? "a4" : "comfortable"}
    />
  );
}
