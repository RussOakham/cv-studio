import { useCvStore } from "@/store/cv-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function ThemeSheet() {
  const theme = useCvStore((s) => s.theme);
  const setTheme = useCvStore((s) => s.setTheme);

  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="outline" size="sm" type="button">
          Theme
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>CV theme tokens</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {(
            [
              ["fg", "Foreground"],
              ["muted", "Muted text"],
              ["timeline", "Timeline"],
              ["surface", "Surface"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={`cv-${key}`}>{label}</Label>
              <div className="flex gap-2">
                <Input
                  id={`cv-${key}`}
                  type="color"
                  className="h-10 w-14 cursor-pointer px-1"
                  value={
                    theme[key].startsWith("#") && theme[key].length === 7 ? theme[key] : "#000000"
                  }
                  onChange={(e) => {
                    setTheme({ ...theme, [key]: e.target.value });
                  }}
                />
                <Input
                  value={theme[key]}
                  onChange={(e) => {
                    setTheme({ ...theme, [key]: e.target.value });
                  }}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
