import { type ReactNode, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthLoading, Authenticated, ConvexReactClient, Unauthenticated } from "convex/react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";

import { authClient } from "@/lib/auth-client";
import { CvLibraryPage } from "@/routes/CvLibraryPage";
import { EditorPage } from "@/routes/EditorPage";
import { AuthPage } from "@/routes/AuthPage";
import { ImportPage } from "@/routes/ImportPage";
import { PrintPage } from "@/routes/PrintPage";

import "./index.css";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

function ProtectedRoute({ children }: { children: ReactNode }) {
  return (
    <>
      <AuthLoading>
        <div className="p-6 text-sm text-muted-foreground">Loading…</div>
      </AuthLoading>
      <Unauthenticated>
        <Navigate to="/auth" replace />
      </Unauthenticated>
      <Authenticated>{children}</Authenticated>
    </>
  );
}

const router = createBrowserRouter([
  { path: "/auth", element: <AuthPage /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <CvLibraryPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/cv/:cvId",
    element: (
      <ProtectedRoute>
        <EditorPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/cv/:cvId/print",
    element: (
      <ProtectedRoute>
        <PrintPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/import",
    element: (
      <ProtectedRoute>
        <ImportPage />
      </ProtectedRoute>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      <RouterProvider router={router} />
    </ConvexBetterAuthProvider>
  </StrictMode>,
);
