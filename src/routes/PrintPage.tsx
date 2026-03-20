import { Link, useParams } from "react-router";
import { CvCloudSync } from "@/components/app/CvCloudSync";
import { useCvStore } from "@/store/cv-store";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CvPreview } from "@/components/cv/CvPreview";

export function PrintPage() {
  const { cvId } = useParams();
  const document = useCvStore((s) => s.document);
  const theme = useCvStore((s) => s.theme);

  return (
    <div className="bg-background min-h-dvh">
      {cvId ? <CvCloudSync cvId={cvId} /> : null}
      <div className="print:hidden bg-card flex justify-end border-b px-4 py-2">
        <Link
          to={cvId ? `/cv/${cvId}` : "/"}
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          Back to editor
        </Link>
      </div>
      <CvPreview document={document} theme={theme} />
    </div>
  );
}
