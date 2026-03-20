import { useState } from "react";
import { Navigate } from "react-router";
import { useConvexAuth } from "convex/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export function AuthPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [socialSubmitting, setSocialSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Checking session…</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="bg-muted/20 flex min-h-dvh items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isSignUp ? "Create account" : "Sign in"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isSignUp ? (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button
            type="button"
            className="w-full"
            disabled={submitting || socialSubmitting}
            onClick={async () => {
              setSubmitting(true);
              setError(null);
              try {
                if (isSignUp) {
                  const result = await authClient.signUp.email({
                    email,
                    password,
                    name: name.trim() || "User",
                  });
                  if (result.error) {
                    setError(result.error.message ?? "Sign up failed");
                  }
                } else {
                  const result = await authClient.signIn.email({
                    email,
                    password,
                  });
                  if (result.error) {
                    setError(result.error.message ?? "Sign in failed");
                  }
                }
              } catch (e) {
                setError(e instanceof Error ? e.message : "Authentication failed");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {submitting ? "Working…" : isSignUp ? "Create account" : "Sign in"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={submitting || socialSubmitting}
            onClick={async () => {
              setSocialSubmitting(true);
              setError(null);
              try {
                const result = await authClient.signIn.social({
                  provider: "github",
                  callbackURL: "/",
                });
                if (result.error) {
                  setError(result.error.message ?? "GitHub sign in failed");
                }
              } catch (e) {
                setError(e instanceof Error ? e.message : "GitHub sign in failed");
              } finally {
                setSocialSubmitting(false);
              }
            }}
          >
            {socialSubmitting ? "Redirecting…" : "Continue with GitHub"}
          </Button>
          <p className="text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
            <button
              type="button"
              className="text-primary underline underline-offset-4"
              onClick={() => {
                setError(null);
                setIsSignUp((v) => !v);
              }}
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
