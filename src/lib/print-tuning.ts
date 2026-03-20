import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

export type PrintSpacing = {
  printMarginTopMm?: number;
  printMarginBottomMm?: number;
  pageBreakBefore?: boolean;
};

export function printSpacingClassName(spacing: PrintSpacing | undefined): string | undefined {
  return spacing?.pageBreakBefore ? "cv-print-break-before" : undefined;
}

export function printSpacingStyle(spacing: PrintSpacing | undefined): CSSProperties | undefined {
  if (!spacing) {
    return undefined;
  }
  const style: CSSProperties = {};
  if (spacing.printMarginTopMm != null && spacing.printMarginTopMm > 0) {
    style.marginTop = `${spacing.printMarginTopMm}mm`;
  }
  if (spacing.printMarginBottomMm != null && spacing.printMarginBottomMm > 0) {
    style.marginBottom = `${spacing.printMarginBottomMm}mm`;
  }
  return Object.keys(style).length > 0 ? style : undefined;
}

export function printSpacingProps(spacing: PrintSpacing | undefined): {
  className?: string;
  style?: CSSProperties;
} {
  return {
    className: printSpacingClassName(spacing),
    style: printSpacingStyle(spacing),
  };
}

export function mergePrintClasses(base: string, spacing: PrintSpacing | undefined): string {
  return cn(base, printSpacingClassName(spacing));
}
