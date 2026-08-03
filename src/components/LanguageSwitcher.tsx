import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function IkurrinaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 50 30" className={className} aria-hidden="true">
      <rect width="50" height="30" fill="#DA121A" />
      <polygon points="0,0 8,0 50,26 50,30 42,30 0,4" fill="#007A3D" />
      <polygon points="42,0 50,0 50,4 8,30 0,30 0,26" fill="#007A3D" />
      <rect x="0" y="12" width="50" height="6" fill="#FFFFFF" />
      <rect x="22" y="0" width="6" height="30" fill="#FFFFFF" />
    </svg>
  );
}

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const actual = i18n.language?.startsWith("eu") ? "eu" : "es";

  return (
    <div className="flex gap-1">
      <Button
        type="button"
        variant={actual === "es" ? "default" : "outline"}
        size="sm"
        className="px-3"
        onClick={() => i18n.changeLanguage("es")}
      >
        ES
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-label="Euskara"
        aria-pressed={actual === "eu"}
        onClick={() => i18n.changeLanguage("eu")}
        className="group relative w-9 overflow-hidden p-0"
      >
        <IkurrinaIcon className="absolute inset-0 size-full" />
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-0 transition-colors",
            actual === "eu" ? "bg-black/45" : "bg-transparent group-hover:bg-black/10",
          )}
        />
      </Button>
    </div>
  );
}
