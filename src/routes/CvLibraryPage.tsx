import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQuery } from "convex/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { defaultCvDocument } from "@/data/default-cv";
import { defaultCvTheme } from "@/schema/cv-theme";
import { api } from "../../convex/_generated/api";

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString();
}

export function CvLibraryPage() {
  const navigate = useNavigate();
  const rows = useQuery(api.cv.listMyCvs, {});
  const createCv = useMutation(api.cv.createCv);
  const deleteCv = useMutation(api.cv.deleteCv);
  const renameCv = useMutation(api.cv.renameCv);
  const [renamingCvId, setRenamingCvId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");

  return (
    <div className="bg-muted/20 min-h-dvh p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-4">
        <header className="bg-card flex items-center justify-between rounded-lg border p-4">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Your CVs</h1>
            <p className="text-muted-foreground text-sm">Create, edit, and manage CVs in Convex.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={async () => {
                const cvId = await createCv({
                  name: "New CV",
                  documentJson: JSON.stringify(defaultCvDocument),
                  themeJson: JSON.stringify(defaultCvTheme),
                });
                void navigate(`/cv/${cvId}`);
              }}
            >
              New CV
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void authClient.signOut();
              }}
            >
              Sign out
            </Button>
          </div>
        </header>

        {rows === undefined ? (
          <p className="text-muted-foreground p-4 text-sm">Loading CVs…</p>
        ) : rows.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              No CVs yet. Click <span className="font-medium text-foreground">New CV</span> to
              create one from your default template.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {rows.map((row) => (
              <Card key={row._id}>
                <CardHeader className="pb-2">
                  {renamingCvId === row._id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        className="h-8"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={async () => {
                          const trimmed = draftName.trim();
                          if (!trimmed) {
                            return;
                          }
                          await renameCv({ cvId: row._id, name: trimmed });
                          setRenamingCvId(null);
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setRenamingCvId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <CardTitle className="text-base">{row.name}</CardTitle>
                  )}
                </CardHeader>
                <CardContent className="flex items-center justify-between gap-3 text-sm">
                  <p className="text-muted-foreground">
                    Updated {formatDate(row.updatedAt)} · Created {formatDate(row.createdAt)}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => void navigate(`/cv/${row._id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setRenamingCvId(row._id);
                        setDraftName(row.name);
                      }}
                    >
                      Rename
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        await deleteCv({ cvId: row._id });
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
