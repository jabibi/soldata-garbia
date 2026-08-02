import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const IDIOMAS = [
  { code: "es", label: "ES" },
  { code: "eu", label: "EU" },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const actual = i18n.language?.startsWith("eu") ? "eu" : "es";

  return (
    <div className="flex gap-1">
      {IDIOMAS.map((idioma) => (
        <Button
          key={idioma.code}
          type="button"
          variant={actual === idioma.code ? "default" : "outline"}
          size="sm"
          className={cn("px-3")}
          onClick={() => i18n.changeLanguage(idioma.code)}
        >
          {idioma.label}
        </Button>
      ))}
    </div>
  );
}
