import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export function NavMenu() {
  const { t } = useTranslation();
  const { user, isAdmin } = useAuth();
  const { pathname } = useLocation();

  const items = [
    user && { to: "/history", label: t("nav.historial") },
    isAdmin && { to: "/settings", label: t("nav.configuracion") },
    isAdmin && { to: "/admin", label: t("nav.administracion") },
  ].filter((item): item is { to: string; label: string } => Boolean(item));

  if (items.length === 0) return null;

  return (
    <nav className="flex items-center gap-4 text-sm">
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={cn(
            "hover:underline",
            pathname === item.to ? "text-foreground font-medium" : "text-muted-foreground",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
