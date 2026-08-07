import { useEffect, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import { CalculatorForm } from "@/components/CalculatorForm";
import { ResultCard } from "@/components/ResultCard";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { AuthStatus } from "@/components/AuthStatus";
import { NavMenu } from "@/components/NavMenu";
import { HistorialList } from "@/components/HistorialList";
import { AdminPanel } from "@/components/AdminPanel";
import { ConfiguracionPanel } from "@/components/ConfiguracionPanel";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { calcularNomina } from "@/lib/api";
import type { CalculoNominaInput, CalculoNominaResultado } from "@/lib/types";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.135.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function SoloConectado({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/" replace />;
}

function SoloAdmin({ children }: { children: ReactNode }) {
  const { isAdmin, loading } = useAuth();
  if (loading) return null;
  return isAdmin ? children : <Navigate to="/" replace />;
}

function Calculadora() {
  const { t } = useTranslation();
  const [resultado, setResultado] = useState<CalculoNominaResultado | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(input: CalculoNominaInput) {
    setLoading(true);
    setError(null);
    try {
      const r = await calcularNomina(input);
      setResultado(r);
    } catch (e) {
      console.error(e);
      setError(t("errors.calculo"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <CalculatorForm onSubmit={handleSubmit} loading={loading} />
      {error && <p className="text-destructive text-sm">{error}</p>}
      {resultado && <ResultCard resultado={resultado} />}
    </>
  );
}

function App() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.title = `${t("app.title")} — ${t("app.subtitle")}`;
  }, [t, i18n.language]);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-svh bg-background text-foreground">
          <div className="sticky top-0 z-40 border-b bg-background">
            <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
              <NavMenu />
              <div className="flex items-center gap-3">
                <LanguageSwitcher />
                <AuthStatus />
              </div>
            </div>
          </div>

          <div className="border-b">
            <Link to="/" className="mx-auto block max-w-3xl px-4 py-6">
              <h1 className="text-2xl font-semibold">{t("app.title")}</h1>
              <p className="text-muted-foreground text-sm">{t("app.subtitle")}</p>
            </Link>
          </div>

          <main className="mx-auto max-w-3xl space-y-6 px-4 py-8">
            <Routes>
              <Route path="/" element={<Calculadora />} />
              <Route
                path="/history"
                element={
                  <SoloConectado>
                    <HistorialList />
                  </SoloConectado>
                }
              />
              <Route
                path="/settings"
                element={
                  <SoloAdmin>
                    <ConfiguracionPanel />
                  </SoloAdmin>
                }
              />
              <Route
                path="/admin"
                element={
                  <SoloAdmin>
                    <AdminPanel />
                  </SoloAdmin>
                }
              />
            </Routes>
          </main>

          <footer className="border-t">
            <div className="mx-auto flex max-w-3xl justify-center px-4 py-6">
              <a
                href="https://github.com/jabibi/soldata-garbia"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="text-muted-foreground hover:text-foreground"
              >
                <GithubIcon className="size-5" />
              </a>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
