import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

type MarkdownBlockProps = {
  markdown: string;
  className?: string;
  /** Use Tailwind Typography prose (e.g. featured project) */
  variant?: "cv-tight" | "prose-project";
};

export function MarkdownBlock({ markdown, className, variant = "cv-tight" }: MarkdownBlockProps) {
  const base =
    variant === "prose-project"
      ? "prose prose-sm max-w-none text-[color:var(--cv-fg)] leading-snug [&_p]:my-1 [&_p]:text-sm [&_strong]:font-semibold [&_ul]:my-1 [&_li]:my-0"
      : "space-y-1 text-[0.9rem] leading-snug text-[color:var(--cv-fg)] [&_ul]:mt-0.5 [&_ul]:list-disc [&_ul]:space-y-0 [&_ul]:pl-4 [&_p]:m-0 [&_strong]:font-semibold";

  return (
    <div className={cn(base, className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
}

export function MarkdownBulletList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul
      className={cn(
        "mt-1 list-disc space-y-0 pl-4 text-[0.9rem] leading-snug text-[color:var(--cv-fg)] [&_li]:py-0",
        className,
      )}
    >
      {items.map((md) => (
        <li key={md} className="[&_strong]:font-semibold">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <span>{children}</span>,
            }}
          >
            {md}
          </ReactMarkdown>
        </li>
      ))}
    </ul>
  );
}
