import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export function NavMenu() {
  const { t } = useTranslation();
  const { user, isAdmin } = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const items = [
    { to: "/", label: t("nav.inicio") },
    user && { to: "/history", label: t("nav.historial") },
    isAdmin && { to: "/settings", label: t("nav.configuracion") },
    isAdmin && { to: "/admin", label: t("nav.administracion") },
  ].filter((item): item is { to: string; label: string } => Boolean(item));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={<Button type="button" variant="ghost" size="icon" aria-label={t("nav.abrirMenu")} />}
      >
        <Menu className="size-5" />
      </PopoverTrigger>
      <PopoverContent align="start" className="min-w-40 p-1">
        <nav className="flex flex-col">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-md px-2 py-1.5 text-sm hover:bg-muted",
                pathname === item.to ? "text-foreground font-medium" : "text-muted-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </PopoverContent>
    </Popover>
  );
}
