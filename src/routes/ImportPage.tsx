import { useState } from "react";
import { Link } from "react-router";
import * as pdfjs from "pdfjs-dist";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

async function extractPdfText(file: File): Promise<string> {
  const data = new Uint8Array(await file.arrayBuffer());
  const doc = await pdfjs.getDocument({ data }).promise;
  const parts: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const line = content.items
      .map((item) => {
        if (item && typeof item === "object" && "str" in item) {
          return String((item as { str: string }).str);
        }
        return "";
      })
      .filter(Boolean)
      .join(" ");
    parts.push(`--- Page ${i} ---\n${line}`);
  }
  return parts.join("\n\n");
}

export function ImportPage() {
  const [text, setText] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="bg-background mx-auto max-w-3xl p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-lg font-semibold">Import PDF (preview)</h1>
        <Link to="/" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          Back to editor
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Extract text</CardTitle>
          <p className="text-muted-foreground text-sm">
            Text is extracted for reference. Map content into sections manually or refine this flow
            later—structured import is not lossless for layout.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              disabled={busy}
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "application/pdf";
                input.onchange = () => {
                  const file = input.files?.[0];
                  if (!file) {
                    return;
                  }
                  setBusy(true);
                  setError(null);
                  void extractPdfText(file)
                    .then(setText)
                    .catch((e) => {
                      setError(e instanceof Error ? e.message : "PDF read failed");
                    })
                    .finally(() => setBusy(false));
                };
                input.click();
              }}
            >
              {busy ? "Reading…" : "Choose PDF…"}
            </Button>
          </div>
          {error ? (
            <p className="text-destructive text-sm" role="alert">
              {error}
            </p>
          ) : null}
          {text !== null ? (
            <div className="space-y-2">
              <Label htmlFor="extracted">Extracted text</Label>
              <Textarea
                id="extracted"
                className="font-mono text-xs"
                readOnly
                rows={18}
                value={text}
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={async () => {
                  await navigator.clipboard.writeText(text);
                }}
              >
                Copy to clipboard
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
