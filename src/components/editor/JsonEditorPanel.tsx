import { useEffect, useState } from "react";
import { useCvStore } from "@/store/cv-store";
import { parseCvDocument } from "@/schema/cv-document";
import { parseCvTheme } from "@/schema/cv-theme";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function JsonEditorPanel() {
  const document = useCvStore((s) => s.document);
  const theme = useCvStore((s) => s.theme);
  const setDocument = useCvStore((s) => s.setDocument);
  const setTheme = useCvStore((s) => s.setTheme);
  const setActiveSectionId = useCvStore((s) => s.setActiveSectionId);

  const [documentDraft, setDocumentDraft] = useState(() => JSON.stringify(document, null, 2));
  const [themeDraft, setThemeDraft] = useState(() => JSON.stringify(theme, null, 2));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDocumentDraft(JSON.stringify(document, null, 2));
  }, [document]);

  useEffect(() => {
    setThemeDraft(JSON.stringify(theme, null, 2));
  }, [theme]);

  return (
    <div className="h-full min-h-0 overflow-auto p-4">
      <div className="space-y-4">
        <p className="text-muted-foreground text-xs leading-relaxed">
          Edit the CV as raw JSON and apply when valid. Data is validated with Zod before being
          committed to state.
        </p>

        <div className="space-y-2">
          <Label htmlFor="cv-json-document">Document JSON</Label>
          <Textarea
            id="cv-json-document"
            value={documentDraft}
            onChange={(e) => setDocumentDraft(e.target.value)}
            rows={18}
            className="font-mono text-xs"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cv-json-theme">Theme JSON</Label>
          <Textarea
            id="cv-json-theme"
            value={themeDraft}
            onChange={(e) => setThemeDraft(e.target.value)}
            rows={8}
            className="font-mono text-xs"
          />
        </div>

        {error ? <p className="text-destructive text-xs whitespace-pre-wrap">{error}</p> : null}

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            onClick={() => {
              setError(null);
              try {
                const parsedDocument = parseCvDocument(JSON.parse(documentDraft));
                const parsedTheme = parseCvTheme(JSON.parse(themeDraft));
                setDocument(parsedDocument);
                setTheme(parsedTheme);
                setActiveSectionId(parsedDocument.sections[0]?.id ?? null);
              } catch (e) {
                setError(e instanceof Error ? e.message : "Invalid JSON");
              }
            }}
          >
            Apply JSON
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              setError(null);
              setDocumentDraft(JSON.stringify(document, null, 2));
              setThemeDraft(JSON.stringify(theme, null, 2));
            }}
          >
            Reset from current
          </Button>
        </div>
      </div>
    </div>
  );
}
