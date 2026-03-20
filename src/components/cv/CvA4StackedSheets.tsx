import { type CSSProperties, useLayoutEffect, useMemo, useRef, useState } from "react";

import type { CvDocument } from "@/schema/cv-document";
import type { CvTheme } from "@/schema/cv-theme";
import { TimelineMonoContent } from "@/components/cv/presets/TimelineMonoLayout";
import {
  A4_HEIGHT_MM,
  A4_PAGE_MARGIN_MM,
  A4_SCREEN_SHEET_GAP_PX,
  A4_WIDTH_MM,
  mmToPx,
} from "@/lib/a4-units";
import { collectAvoidBreakSpans, computePageStarts } from "@/lib/a4-pagination";
import { cn } from "@/lib/utils";

export type CvA4PreviewMetrics = {
  /** Full physical sheet height (297mm). */
  sheetHeightPx: number;
  /** Vertical stride per page: inner viewport after top/bottom margin inset. */
  viewportHeightPx: number;
  contentHeightPx: number;
  sheetCount: number;
};

export function CvA4StackedSheets({
  document,
  theme,
  className,
  onMetrics,
}: {
  document: CvDocument;
  theme: CvTheme;
  className?: string;
  onMetrics?: (m: CvA4PreviewMetrics) => void;
}) {
  const measureRef = useRef<HTMLDivElement | null>(null);
  const onMetricsRef = useRef(onMetrics);
  onMetricsRef.current = onMetrics;
  const { sheetHeightPx, sheetPadPx, viewportHeightPx } = useMemo(() => {
    const sh = mmToPx(A4_HEIGHT_MM);
    const pad = mmToPx(A4_PAGE_MARGIN_MM);
    return { sheetHeightPx: sh, sheetPadPx: pad, viewportHeightPx: Math.max(1, sh - 2 * pad) };
  }, []);
  const [{ pageStarts, contentHeightPx }, setPagination] = useState<{
    pageStarts: number[];
    contentHeightPx: number;
  }>({ pageStarts: [0], contentHeightPx: 0 });

  useLayoutEffect(() => {
    const el = measureRef.current;
    const update = () => {
      if (!el) {
        return;
      }
      const h = el.scrollHeight;
      const avoidSpans = collectAvoidBreakSpans(el, el, viewportHeightPx);
      const starts = computePageStarts(h, viewportHeightPx, avoidSpans);
      setPagination({ pageStarts: starts, contentHeightPx: h });
      onMetricsRef.current?.({
        sheetHeightPx,
        viewportHeightPx,
        contentHeightPx: h,
        sheetCount: starts.length,
      });
    };

    update();
    const ro = new ResizeObserver(update);
    if (el) {
      ro.observe(el);
    }
    return () => ro.disconnect();
  }, [document, theme, sheetHeightPx, viewportHeightPx]);

  const style = {
    "--cv-surface": theme.surface,
  } as CSSProperties;

  return (
    <div
      className={cn("print:hidden", "bg-muted/55 rounded-lg py-8 px-3 sm:px-6", className)}
      style={style}
    >
      {/* Off-screen measure — same box model as each sheet (paper width + inset padding) */}
      <div
        className="pointer-events-none fixed top-0 left-[-9999px] box-border max-w-[210mm] overflow-visible opacity-0"
        style={{
          width: mmToPx(A4_WIDTH_MM),
          padding: sheetPadPx,
          boxSizing: "border-box",
        }}
        aria-hidden
      >
        <div ref={measureRef}>
          <TimelineMonoContent
            document={document}
            theme={theme}
            transparentRoot
            innerPaddingMode="a4-stacked-inner"
          />
        </div>
      </div>

      <div className="flex flex-col items-center" style={{ gap: A4_SCREEN_SHEET_GAP_PX }}>
        {pageStarts.map((pageTop, i) => {
          const sliceEnd =
            i + 1 < pageStarts.length
              ? pageStarts[i + 1]!
              : contentHeightPx > 0
                ? contentHeightPx
                : pageTop + viewportHeightPx;
          const sliceHeight = Math.min(viewportHeightPx, Math.max(0, sliceEnd - pageTop));
          return (
            <div key={`${pageTop}-${i}`} className="w-full max-w-[210mm]">
              <p className="print:hidden mb-1.5 text-[11px] font-medium tracking-tight text-muted-foreground">
                Page {i + 1}
              </p>
              <div
                className={cn(
                  "cv-a4-sheet w-full overflow-hidden rounded-sm border border-border/70",
                  "bg-[var(--cv-surface)] box-border",
                )}
                style={{
                  height: sheetHeightPx,
                  padding: sheetPadPx,
                  boxSizing: "border-box",
                }}
              >
                <div className="flex h-full min-h-0 w-full flex-col overflow-hidden">
                  <div className="shrink-0 overflow-hidden" style={{ height: sliceHeight }}>
                    <div style={{ marginTop: -pageTop }}>
                      <TimelineMonoContent
                        document={document}
                        theme={theme}
                        transparentRoot
                        innerPaddingMode="a4-stacked-inner"
                      />
                    </div>
                  </div>
                  {sliceHeight < viewportHeightPx ? (
                    <div className="bg-[var(--cv-surface)] min-h-0 flex-1" aria-hidden />
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
