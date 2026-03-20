import { useCallback, useState } from "react";

import type { CvDocument } from "@/schema/cv-document";
import type { CvTheme } from "@/schema/cv-theme";
import type { CvA4PreviewMetrics } from "@/components/cv/CvA4StackedSheets";
import { CvA4PageEstimate } from "@/components/cv/CvA4PageEstimate";
import { CvA4StackedSheets } from "@/components/cv/CvA4StackedSheets";
import { TimelineMonoLayout } from "@/components/cv/presets/TimelineMonoLayout";
import { cn } from "@/lib/utils";

export function CvPreview({
  document,
  theme,
  className,
  showA4PageGuides = true,
}: {
  document: CvDocument;
  theme: CvTheme;
  className?: string;
  /** Screen-only A4 stacked sheets + page estimate. Single-column when false. */
  showA4PageGuides?: boolean;
}) {
  const [metrics, setMetrics] = useState<CvA4PreviewMetrics | null>(null);
  const onMetrics = useCallback((m: CvA4PreviewMetrics) => setMetrics(m), []);

  return (
    <div className={cn("relative", className)}>
      {showA4PageGuides ? (
        <>
          <div className="print:hidden mb-3 flex justify-end">
            <CvA4PageEstimate metrics={metrics} />
          </div>
          <CvA4StackedSheets document={document} theme={theme} onMetrics={onMetrics} />
          {/* Print / PDF: one continuous flow — not displayed on screen (no double layout). */}
          <div className="hidden print:block">
            <TimelineMonoLayout document={document} theme={theme} showA4PageGuides />
          </div>
        </>
      ) : (
        <TimelineMonoLayout document={document} theme={theme} showA4PageGuides={false} />
      )}
    </div>
  );
}
