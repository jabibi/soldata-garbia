import { useState, type ReactNode } from "react";
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
  const { t } = useTranslation();

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
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
