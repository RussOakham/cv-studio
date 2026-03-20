import { Navigate, useParams } from "react-router";
import { EditorShell } from "@/components/editor/EditorShell";
import { CvCloudSync } from "@/components/app/CvCloudSync";

export function EditorPage() {
  const { cvId } = useParams();
  if (!cvId) {
    return <Navigate to="/" replace />;
  }
  return (
    <>
      <CvCloudSync cvId={cvId} />
      <EditorShell />
    </>
  );
}
