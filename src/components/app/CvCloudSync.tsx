import { useEffect, useRef, useState } from "react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { defaultCvDocument } from "@/data/default-cv";
import { parseCvDocument } from "@/schema/cv-document";
import { defaultCvTheme, parseCvTheme } from "@/schema/cv-theme";
import { useCvStore } from "@/store/cv-store";

export function CvCloudSync({ cvId }: { cvId: string }) {
  const typedCvId = cvId as Id<"userCv">;
  const { isAuthenticated } = useConvexAuth();
  const document = useCvStore((s) => s.document);
  const theme = useCvStore((s) => s.theme);
  const setDocument = useCvStore((s) => s.setDocument);
  const setTheme = useCvStore((s) => s.setTheme);
  const [cloudHydrated, setCloudHydrated] = useState(false);
  const skipNextSaveRef = useRef(false);
  const remote = useQuery(api.cv.getCvById, isAuthenticated ? { cvId: typedCvId } : "skip");
  const updateCv = useMutation(api.cv.updateCv);

  useEffect(() => {
    setCloudHydrated(false);
    skipNextSaveRef.current = false;
  }, [cvId, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || remote === undefined || cloudHydrated) {
      return;
    }

    if (!remote) {
      setCloudHydrated(true);
      return;
    }

    try {
      skipNextSaveRef.current = true;
      setDocument(parseCvDocument(JSON.parse(remote.documentJson)));
      setTheme(parseCvTheme(JSON.parse(remote.themeJson)));
    } catch {
      skipNextSaveRef.current = true;
      setDocument(defaultCvDocument);
      setTheme(defaultCvTheme);
    } finally {
      setCloudHydrated(true);
    }
  }, [cloudHydrated, isAuthenticated, remote, setDocument, setTheme]);

  useEffect(() => {
    if (!isAuthenticated || !cloudHydrated) {
      return;
    }

    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }

    const handle = window.setTimeout(() => {
      void updateCv({
        cvId: typedCvId,
        documentJson: JSON.stringify(document),
        themeJson: JSON.stringify(theme),
      });
    }, 600);

    return () => window.clearTimeout(handle);
  }, [cloudHydrated, document, isAuthenticated, theme, typedCvId, updateCv]);

  return null;
}
