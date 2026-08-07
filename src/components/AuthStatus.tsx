import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CircleUserRound, LogIn, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "@/lib/auth";
import { LoginForm } from "@/components/LoginForm";

export function AuthStatus() {
  const { t } = useTranslation();
  const { user, isAdmin, loading } = useAuth();
  const [open, setOpen] = useState(false);

  if (loading) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={user ? t("auth.cuenta") : t("auth.signin")}
          />
        }
      >
        {user ? <CircleUserRound className="size-5" /> : <LogIn className="size-5" />}
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4">
        {user ? (
          <div className="space-y-3">
            <p className="flex items-center gap-1.5 text-sm">
              <span className="text-muted-foreground">{user.email}</span>
              {isAdmin && (
                <span title={t("auth.admin")} className="inline-flex">
                  <ShieldCheck className="size-4 text-foreground" aria-label={t("auth.admin")} />
                </span>
              )}
            </p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => {
                setOpen(false);
                signOut();
              }}
            >
              {t("auth.signout")}
            </Button>
          </div>
        ) : (
          <LoginForm onSuccess={() => setOpen(false)} />
        )}
      </PopoverContent>
    </Popover>
  );
}
