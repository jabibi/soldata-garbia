import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function EspanaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 50 30" className={className} aria-hidden="true">
      <rect width="50" height="30" fill="#AA151B" />
      <rect y="7.5" width="50" height="15" fill="#F1BF00" />
    </svg>
  );
}

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

function GaliciaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 50 30" className={className} aria-hidden="true">
      <rect width="50" height="30" fill="#FFFFFF" />
      <line x1="0" y1="30" x2="50" y2="0" stroke="#0090C8" strokeWidth="9" />
    </svg>
  );
}

function SenyeraIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 50 30" className={className} aria-hidden="true">
      <rect width="50" height="30" fill="#FCDD09" />
      <rect y="3.33" width="50" height="3.33" fill="#DA121A" />
      <rect y="10" width="50" height="3.33" fill="#DA121A" />
      <rect y="16.67" width="50" height="3.33" fill="#DA121A" />
      <rect y="23.33" width="50" height="3.33" fill="#DA121A" />
    </svg>
  );
}

const IDIOMAS = [
  { codigo: "es", nombre: "Español", Bandera: EspanaIcon },
  { codigo: "eu", nombre: "Euskara", Bandera: IkurrinaIcon },
  { codigo: "gl", nombre: "Galego", Bandera: GaliciaIcon },
  { codigo: "ca", nombre: "Català", Bandera: SenyeraIcon },
] as const;

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const actual = IDIOMAS.find((idioma) => idioma.codigo === i18n.language)?.codigo ?? "es";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={<Button type="button" variant="ghost" size="icon" aria-label={t("nav.idioma")} />}
      >
        <Languages className="size-5" />
      </PopoverTrigger>
      <PopoverContent align="end" className="min-w-40 p-1">
        <div className="flex flex-col">
          {IDIOMAS.map(({ codigo, nombre, Bandera }) => (
            <button
              key={codigo}
              type="button"
              aria-pressed={actual === codigo}
              onClick={() => {
                i18n.changeLanguage(codigo);
                setOpen(false);
              }}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted",
                actual === codigo ? "text-foreground font-medium" : "text-muted-foreground",
              )}
            >
              <Bandera className="size-4 shrink-0 overflow-hidden rounded-sm" />
              {nombre}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
