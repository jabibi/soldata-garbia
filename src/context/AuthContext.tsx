import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { bootstrapFirstAdmin } from "@/lib/auth";

interface AuthContextValue {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({ user: null, isAdmin: false, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);

      if (!nextUser) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      let tokenResult = await nextUser.getIdTokenResult();
      if (!tokenResult.claims.admin) {
        try {
          const { granted } = await bootstrapFirstAdmin();
          if (granted) {
            tokenResult = await nextUser.getIdTokenResult(true);
          }
        } catch {
          // Si falla el bootstrap (p.ej. sin conexión), seguimos como no-admin.
        }
      }

      setIsAdmin(tokenResult.claims.admin === true);
      setLoading(false);
    });
  }, []);

  return <AuthContext.Provider value={{ user, isAdmin, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
