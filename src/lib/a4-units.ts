/** Converts CSS `mm` to px using the browser (CSS reference pixel rules). */
export function mmToPx(mm: number): number {
  const probe = document.createElement("div");
  probe.style.cssText = `position:absolute;left:-9999px;height:${mm}mm;visibility:hidden`;
  document.body.appendChild(probe);
  const px = probe.getBoundingClientRect().height;
  probe.remove();
  return px;
}

export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;
/** Matches `index.css` @page margin — inset for each stacked sheet preview */
export const A4_PAGE_MARGIN_MM = 12;
export const A4_SCREEN_SHEET_GAP_PX = 28;
