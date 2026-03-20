import { spawn, type ChildProcess } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

import { chromium, type Browser } from "playwright";

import { defaultCvDocument } from "../src/data/default-cv.ts";
import { defaultCvTheme } from "../src/schema/cv-theme.ts";

const PORT = 4180;
const OUT = "cv-studio.pdf";
const PREVIEW_MS = 4500;

function persistPayload(): string {
  return JSON.stringify({
    state: {
      document: defaultCvDocument,
      theme: defaultCvTheme,
      activeSectionId: null,
    },
    version: 0,
  });
}

function startPreview(): ChildProcess {
  return spawn("pnpm", ["exec", "vite", "preview", "--port", String(PORT), "--strictPort"], {
    shell: false,
    stdio: ["ignore", "pipe", "pipe"],
    cwd: process.cwd(),
  });
}

let preview: ChildProcess | null = null;
let browser: Browser | null = null;

try {
  preview = startPreview();
  await delay(PREVIEW_MS);

  browser = await chromium.launch();
  const page = await browser.newPage();
  const stored = persistPayload();
  await page.addInitScript((raw: string) => {
    localStorage.setItem("cv-studio", raw);
  }, stored);

  await page.goto(`http://127.0.0.1:${PORT}/print`, {
    waitUntil: "networkidle",
    timeout: 60_000,
  });
  await page.waitForSelector("#cv-root h1", { timeout: 15_000 });
  await page.pdf({
    path: OUT,
    format: "A4",
    printBackground: true,
    margin: { top: "10mm", bottom: "10mm", left: "10mm", right: "10mm" },
  });
  console.info(`Wrote ${OUT}`);
} finally {
  await browser?.close().catch(() => {});
  preview?.kill("SIGTERM");
}
