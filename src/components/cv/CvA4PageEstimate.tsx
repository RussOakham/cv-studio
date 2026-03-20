import { cn } from "@/lib/utils";

import type { CvA4PreviewMetrics } from "@/components/cv/CvA4StackedSheets";

function formatContentHeights(m: CvA4PreviewMetrics): string {
  const raw = m.contentHeightPx / m.viewportHeightPx;
  if (!Number.isFinite(raw) || m.viewportHeightPx <= 0) {
    return "—";
  }
  return raw.toFixed(2);
}

export function CvA4PageEstimate({
  className,
  metrics,
}: {
  className?: string;
  metrics: CvA4PreviewMetrics | null;
}) {
  if (!metrics || metrics.viewportHeightPx <= 0) {
    return (
      <span
        className={cn(
          "inline-flex rounded-md border border-border bg-muted/40 px-2 py-0.5 text-xs text-muted-foreground",
          className,
        )}
      >
        …
      </span>
    );
  }

  const floatPages = metrics.contentHeightPx / metrics.viewportHeightPx;
  const over = floatPages > 2 + 1e-6;
  const ok = floatPages <= 2 + 1e-6;
  const sheets = metrics.sheetCount;

  return (
    <span
      className={cn(
        "inline-flex max-w-full flex-wrap items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium tabular-nums",
        over
          ? "border-destructive/50 bg-destructive/10 text-destructive"
          : ok
            ? "border-emerald-600/35 bg-emerald-600/10 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
            : "bg-muted/40 text-muted-foreground border-border",
        className,
      )}
      title="Sheet count matches the stacked preview; height ratio is content vs one printable viewport (12mm @page margins)."
    >
      <span>
        {sheets} sheet{sheets === 1 ? "" : "s"}
      </span>
      <span className="text-muted-foreground text-[0.7rem] font-normal">
        ({formatContentHeights(metrics)}× viewport)
      </span>
      {ok ? <span className="text-[0.7rem] font-normal opacity-90">≤2 heights</span> : null}
      {over ? <span className="text-[0.7rem] font-normal">typical CV ≤2 sheets</span> : null}
    </span>
  );
}
