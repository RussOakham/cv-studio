import { type CSSProperties, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { useConvexAuth } from "convex/react";
import { useCvStore } from "@/store/cv-store";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { CvPreview } from "@/components/cv/CvPreview";
import { SectionOutline } from "@/components/editor/SectionOutline";
import { SectionInspector } from "@/components/editor/SectionInspector";
import { JsonEditorPanel } from "@/components/editor/JsonEditorPanel";
import { ThemeSheet } from "@/components/editor/ThemeSheet";
import { ProjectMenu } from "@/components/editor/ProjectMenu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";

export function EditorShell() {
  const { cvId } = useParams();
  const { isAuthenticated } = useConvexAuth();
  const document = useCvStore((s) => s.document);
  const theme = useCvStore((s) => s.theme);
  const activeSectionId = useCvStore((s) => s.activeSectionId);
  const setActiveSectionId = useCvStore((s) => s.setActiveSectionId);
  const [mobileOutlineOpen, setMobileOutlineOpen] = useState(false);
  const [mobileInspectorOpen, setMobileInspectorOpen] = useState(false);
  const [editMode, setEditMode] = useState<"form" | "json">("form");
  const [rightPaneWidth, setRightPaneWidth] = useState(520);
  const resizeStartXRef = useRef(0);
  const resizeStartWidthRef = useRef(520);
  const resizingRef = useRef(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!resizingRef.current) {
        return;
      }
      const delta = resizeStartXRef.current - e.clientX;
      const next = resizeStartWidthRef.current + delta;
      const clamped = Math.min(860, Math.max(360, next));
      setRightPaneWidth(clamped);
    };
    const onMouseUp = () => {
      resizingRef.current = false;
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <header className="print:hidden bg-card flex shrink-0 items-center justify-between gap-4 border-b px-4 py-2">
        <div className="flex min-w-0 items-center gap-3">
          <h1 className="truncate text-sm font-semibold tracking-tight">CV Studio</h1>
          <ProjectMenu />
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <div className="hidden items-center gap-1 rounded-lg border p-1 lg:flex">
            <Button
              type="button"
              size="sm"
              variant={editMode === "form" ? "secondary" : "ghost"}
              onClick={() => setEditMode("form")}
            >
              Form
            </Button>
            <Button
              type="button"
              size="sm"
              variant={editMode === "json" ? "secondary" : "ghost"}
              onClick={() => setEditMode("json")}
            >
              JSON
            </Button>
          </div>
          <ThemeSheet />
          <Link
            to={cvId ? `/cv/${cvId}/print` : "/"}
            className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
          >
            Print / PDF
          </Link>
          <Link to="/" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            My CVs
          </Link>
          {isAuthenticated ? (
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => {
                void authClient.signOut();
              }}
            >
              Sign out
            </Button>
          ) : null}
        </div>
      </header>
      <div className="print:hidden bg-card grid shrink-0 grid-cols-2 gap-2 border-b px-2 py-2 lg:hidden">
        <Sheet open={mobileOutlineOpen} onOpenChange={setMobileOutlineOpen}>
          <SheetTrigger className="w-full">
            <Button type="button" variant="outline" size="sm" className="w-full shadow-none">
              Sections
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="flex h-full max-h-dvh w-full flex-col gap-0 p-0 sm:max-w-sm"
          >
            <SheetHeader className="bg-card shrink-0 border-b">
              <SheetTitle>Sections</SheetTitle>
            </SheetHeader>
            <div className="min-h-0 flex-1">
              <SectionOutline
                sections={document.sections}
                activeId={activeSectionId}
                onSelect={(id) => {
                  setActiveSectionId(id);
                  setMobileOutlineOpen(false);
                }}
              />
            </div>
          </SheetContent>
        </Sheet>
        <Sheet open={mobileInspectorOpen} onOpenChange={setMobileInspectorOpen}>
          <SheetTrigger className="w-full">
            <Button type="button" variant="outline" size="sm" className="w-full shadow-none">
              {editMode === "json" ? "Edit JSON" : "Edit section"}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="flex h-full max-h-dvh w-full flex-col gap-0 p-0 sm:max-w-sm"
          >
            <SheetHeader className="bg-card shrink-0 border-b">
              <SheetTitle>{editMode === "json" ? "JSON Editor" : "Inspector"}</SheetTitle>
            </SheetHeader>
            <div className="min-h-0 flex-1 overflow-hidden">
              {editMode === "json" ? <JsonEditorPanel /> : <SectionInspector />}
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div
        className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[220px_1fr_8px_var(--right-pane-width)]"
        style={
          {
            "--right-pane-width": `${rightPaneWidth}px`,
          } as CSSProperties
        }
      >
        <aside className="print:hidden bg-card hidden h-full min-h-0 border-b lg:block lg:border-r lg:border-b-0">
          <SectionOutline
            sections={document.sections}
            activeId={activeSectionId}
            onSelect={setActiveSectionId}
          />
        </aside>
        <main className="bg-muted/20 min-h-0 overflow-auto">
          <div className="mx-auto max-w-[960px] p-4 md:p-6">
            <Card className="overflow-visible border shadow-sm">
              <CvPreview document={document} theme={theme} />
            </Card>
          </div>
        </main>
        <div
          className="print:hidden bg-border/70 hover:bg-border hidden cursor-col-resize transition-colors lg:block"
          onMouseDown={(e) => {
            resizingRef.current = true;
            resizeStartXRef.current = e.clientX;
            resizeStartWidthRef.current = rightPaneWidth;
          }}
          role="separator"
          aria-label="Resize editor side panel"
          aria-orientation="vertical"
        />
        <aside className="print:hidden bg-card hidden h-full min-h-0 border-t lg:block lg:border-t-0 lg:border-l">
          {editMode === "json" ? <JsonEditorPanel /> : <SectionInspector />}
        </aside>
      </div>
    </div>
  );
}
