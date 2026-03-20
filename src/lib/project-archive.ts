import { strFromU8, strToU8, unzipSync, zipSync } from "fflate";

import { parseCvDocument, type CvDocument } from "@/schema/cv-document";
import { parseCvTheme, type CvTheme } from "@/schema/cv-theme";

const DOC = "document.json";
const THEME = "theme.json";
const ASSETS_PREFIX = "assets/";

export function encodeProjectZip(document: CvDocument, theme: CvTheme): Blob {
  const files: Record<string, Uint8Array> = {
    [DOC]: strToU8(JSON.stringify(document, null, 2)),
    [THEME]: strToU8(JSON.stringify(theme, null, 2)),
  };
  const zipped = zipSync(files);
  return new Blob([zipped], { type: "application/zip" });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function decodeProjectZip(
  file: File,
): Promise<{ document: CvDocument; theme: CvTheme; assetNames: string[] }> {
  const buf = new Uint8Array(await file.arrayBuffer());
  const entries = unzipSync(buf);
  const docBytes = entries[DOC];
  const themeBytes = entries[THEME];
  if (!docBytes || !themeBytes) {
    throw new Error("ZIP must contain document.json and theme.json");
  }
  const document = parseCvDocument(JSON.parse(strFromU8(docBytes)));
  const theme = parseCvTheme(JSON.parse(strFromU8(themeBytes)));
  const assetNames = Object.keys(entries).filter(
    (k) => k.startsWith(ASSETS_PREFIX) && k.length > ASSETS_PREFIX.length,
  );
  return { document, theme, assetNames };
}
