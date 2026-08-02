import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CalculatorForm } from "@/components/CalculatorForm";
import { ResultCard } from "@/components/ResultCard";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { AuthStatus } from "@/components/AuthStatus";
import { HistorialList } from "@/components/HistorialList";
import { AdminPanel } from "@/components/AdminPanel";
import { ConfiguracionPanel } from "@/components/ConfiguracionPanel";
import { AuthProvider } from "@/context/AuthContext";
import { calcularNomina } from "@/lib/api";
import type { CalculoNominaInput, CalculoNominaResultado } from "@/lib/types";

function App() {
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
    <AuthProvider>
      <div className="min-h-svh bg-background text-foreground">
        <header className="border-b">
          <div className="mx-auto flex max-w-3xl items-start justify-between px-4 py-6">
            <div>
              <h1 className="text-2xl font-semibold">{t("app.title")}</h1>
              <p className="text-muted-foreground text-sm">{t("app.subtitle")}</p>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <AuthStatus />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-3xl space-y-6 px-4 py-8">
          <CalculatorForm onSubmit={handleSubmit} loading={loading} />
          {error && <p className="text-destructive text-sm">{error}</p>}
          {resultado && <ResultCard resultado={resultado} />}
          <HistorialList />
          <AdminPanel />
          <ConfiguracionPanel />
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
