import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { CalculoNominaInput, GradoDiscapacidad, TipoContrato } from "@/lib/types";

const OPCIONES_DESCENDIENTES = [0, 1, 2, 3, 4, 5, 6];
const OPCIONES_DISCAPACIDAD: GradoDiscapacidad[] = [
  "ninguno",
  "33_65_sin_movilidad",
  "33_65_con_movilidad",
  "65_o_mas",
];

const LABEL_KEY_DISCAPACIDAD: Record<GradoDiscapacidad, string> = {
  ninguno: "form.discapacidadNinguno",
  "33_65_sin_movilidad": "form.discapacidad33_65_sinMovilidad",
  "33_65_con_movilidad": "form.discapacidad33_65_conMovilidad",
  "65_o_mas": "form.discapacidad65OMas",
};

interface CalculatorFormProps {
  onSubmit: (input: CalculoNominaInput) => void;
  loading: boolean;
}

export function CalculatorForm({ onSubmit, loading }: CalculatorFormProps) {
  const { t } = useTranslation();
  const [salarioBrutoAnual, setSalarioBrutoAnual] = useState("30000");
  const [numeroPagas, setNumeroPagas] = useState<"12" | "14">("14");
  const [numeroDescendientes, setNumeroDescendientes] = useState("0");
  const [tipoContrato, setTipoContrato] = useState<TipoContrato>("indefinido");
  const [gradoDiscapacidad, setGradoDiscapacidad] = useState<GradoDiscapacidad>("ninguno");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const bruto = Number(salarioBrutoAnual);
    if (!Number.isFinite(bruto) || bruto <= 0) return;

    onSubmit({
      salarioBrutoAnual: bruto,
      numeroPagas: Number(numeroPagas) as 12 | 14,
      numeroDescendientes: Number(numeroDescendientes),
      tipoContrato,
      gradoDiscapacidad,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("form.cardTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="salarioBrutoAnual">{t("form.salarioBrutoAnual")}</Label>
            <Input
              id="salarioBrutoAnual"
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              value={salarioBrutoAnual}
              onChange={(e) => setSalarioBrutoAnual(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>{t("form.numeroPagas")}</Label>
            <RadioGroup
              className="grid-cols-2"
              value={numeroPagas}
              onValueChange={(v) => setNumeroPagas(v as "12" | "14")}
            >
              <label className="flex items-center gap-2 text-sm">
                <RadioGroupItem value="12" /> {t("form.pagas12")}
              </label>
              <label className="flex items-center gap-2 text-sm">
                <RadioGroupItem value="14" /> {t("form.pagas14")}
              </label>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>{t("form.numeroDescendientes")}</Label>
            <Select
              items={OPCIONES_DESCENDIENTES.map((n) => ({
                value: String(n),
                label: n === 6 ? t("form.masDeCinco") : String(n),
              }))}
              value={numeroDescendientes}
              onValueChange={(v) => setNumeroDescendientes(v as string)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OPCIONES_DESCENDIENTES.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n === 6 ? t("form.masDeCinco") : n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("form.tipoContrato")}</Label>
            <RadioGroup
              className="grid-cols-2"
              value={tipoContrato}
              onValueChange={(v) => setTipoContrato(v as TipoContrato)}
            >
              <label className="flex items-center gap-2 text-sm">
                <RadioGroupItem value="indefinido" /> {t("form.indefinido")}
              </label>
              <label className="flex items-center gap-2 text-sm">
                <RadioGroupItem value="temporal" /> {t("form.temporal")}
              </label>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>{t("form.gradoDiscapacidad")}</Label>
            <Select
              items={OPCIONES_DISCAPACIDAD.map((value) => ({
                value,
                label: t(LABEL_KEY_DISCAPACIDAD[value]),
              }))}
              value={gradoDiscapacidad}
              onValueChange={(v) => setGradoDiscapacidad(v as GradoDiscapacidad)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OPCIONES_DISCAPACIDAD.map((value) => (
                  <SelectItem key={value} value={value}>
                    {t(LABEL_KEY_DISCAPACIDAD[value])}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("form.submitting") : t("form.submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
