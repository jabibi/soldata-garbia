import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "@/lib/auth";
import { LoginForm } from "@/components/LoginForm";

export function AuthStatus() {
  const { t } = useTranslation();
  const { user, isAdmin, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  if (loading) return null;

  if (user) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <span className="text-muted-foreground">
          {user.email}
          {isAdmin && <span className="text-foreground font-medium"> · {t("auth.admin")}</span>}
        </span>
        <Button type="button" size="sm" variant="outline" onClick={() => signOut()}>
          {t("auth.signout")}
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <Button type="button" size="sm" onClick={() => setShowLogin((v) => !v)}>
        {t("auth.signin")}
      </Button>
      {showLogin && (
        <div className="absolute right-0 z-10 mt-2">
          <LoginForm onSuccess={() => setShowLogin(false)} />
        </div>
      )}
    </div>
  );
}
