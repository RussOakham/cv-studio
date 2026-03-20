/**
 * Stack preview pagination that approximates print `break-inside: avoid` on blocks styled in
 * `index.css` (`.cv-role-block`, `.cv-edu-block`, `.cv-project-block`).
 */

export type VerticalSpan = { top: number; bottom: number };

const AVOID_SELECTOR = "article.cv-role-block, article.cv-edu-block, .cv-project-block";

function verticalSpanInContainer(el: HTMLElement, container: HTMLElement): VerticalSpan {
  const er = el.getBoundingClientRect();
  const cr = container.getBoundingClientRect();
  const top = er.top - cr.top + container.scrollTop;
  return { top, bottom: top + er.height };
}

/** Unbreakable blocks that fit within one printable viewport (taller blocks are left to the engine). */
export function collectAvoidBreakSpans(
  root: HTMLElement,
  container: HTMLElement,
  maxPageHeight: number,
): VerticalSpan[] {
  const nodes = root.querySelectorAll(AVOID_SELECTOR);
  const out: VerticalSpan[] = [];
  const maxH = maxPageHeight + 0.5;
  nodes.forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    const span = verticalSpanInContainer(node, container);
    if (span.bottom > span.top && span.bottom - span.top <= maxH) {
      out.push(span);
    }
  });
  return out;
}

const EPS = 0.5;

/** Y offsets (px) for each sheet's top edge in continuous content coordinates. */
export function computePageStarts(
  contentHeight: number,
  pageHeight: number,
  blocks: VerticalSpan[],
): number[] {
  if (
    !Number.isFinite(contentHeight) ||
    contentHeight <= 0 ||
    !Number.isFinite(pageHeight) ||
    pageHeight <= 0
  ) {
    return [0];
  }

  const pageStarts: number[] = [0];
  let start = 0;

  while (start < contentHeight - EPS) {
    let end = Math.min(start + pageHeight, contentHeight);

    while (true) {
      const straddlers = blocks.filter(
        (b) => b.bottom - b.top <= pageHeight + 1 && b.top < end - EPS && b.bottom > end + EPS,
      );
      if (straddlers.length === 0) {
        break;
      }
      const nextEnd = Math.min(...straddlers.map((b) => b.top));
      if (nextEnd <= start + EPS) {
        end = Math.min(start + pageHeight, contentHeight);
        break;
      }
      end = nextEnd;
    }

    if (end >= contentHeight - EPS) {
      break;
    }
    start = end;
    pageStarts.push(start);
  }

  return pageStarts;
}
