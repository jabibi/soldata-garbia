import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InfoTooltip } from "@/components/InfoTooltip";
import { cn } from "@/lib/utils";
import { localeIntl } from "@/lib/locale";
import type { CalculoNominaResultado } from "@/lib/types";

interface ResultCardProps {
  resultado: CalculoNominaResultado;
}

function EtiquetaConTooltip({ texto, explicacion }: { texto: string; explicacion: string }) {
  return (
    <InfoTooltip content={explicacion} className="underline decoration-dotted underline-offset-2">
      {texto}
    </InfoTooltip>
  );
}

export function ResultCard({ resultado }: ResultCardProps) {
  const { t, i18n } = useTranslation();
  const [ssDesplegada, setSsDesplegada] = useState(false);
  const { retencionIrpf, seguridadSocial } = resultado;

  const locale = localeIntl(i18n.language);
  const formatoEuro = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
    useGrouping: "always",
  });
  const formatoPorcentaje = new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 2,
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("result.cardTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-muted-foreground text-sm">{t("result.netoMensual")}</p>
              <p className="text-3xl font-semibold text-foreground">
                {formatoEuro.format(resultado.salarioNetoMensual)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">{t("result.netoAnual")}</p>
              <p className="text-3xl font-semibold text-foreground">
                {formatoEuro.format(resultado.salarioNetoAnual)}
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-muted-foreground text-sm">
                <EtiquetaConTooltip
                  texto={t("result.retencionIrpf")}
                  explicacion={t("result.retencionIrpfTooltip")}
                />
              </p>
              <p className="text-xl font-medium">
                {formatoPorcentaje.format(retencionIrpf.tipoAplicado / 100)}
              </p>
              {!retencionIrpf.manual && retencionIrpf.puntosMinoracionDiscapacidad > 0 && (
                <p className="text-muted-foreground text-xs">
                  {t("result.minoracionNota", {
                    tabla: retencionIrpf.tipoTablaGeneral,
                    puntos: retencionIrpf.puntosMinoracionDiscapacidad,
                  })}
                </p>
              )}
              {resultado.porcentajeJornada < 100 && (
                <p className="text-muted-foreground text-xs">
                  {t("result.jornadaNota", { porcentaje: resultado.porcentajeJornada })}
                </p>
              )}
            </div>
            <div>
              <p className="text-muted-foreground text-sm">{t("result.seguridadSocial")}</p>
              <p className="text-xl font-medium">
                {formatoPorcentaje.format(seguridadSocial.tipoAplicado / 100)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("result.desgloseTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("result.concepto")}</TableHead>
                <TableHead className="text-right">{t("result.mensual")}</TableHead>
                <TableHead className="text-right">{t("result.anual")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{t("result.salarioBruto")}</TableCell>
                <TableCell className="text-right">{formatoEuro.format(resultado.salarioBrutoMensual)}</TableCell>
                <TableCell className="text-right">{formatoEuro.format(resultado.salarioBrutoAnual)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <EtiquetaConTooltip
                    texto={t("result.retencionIrpf")}
                    explicacion={t("result.retencionIrpfTooltip")}
                  />
                </TableCell>
                <TableCell className="text-right text-destructive">
                  −{formatoEuro.format(retencionIrpf.importeMensual)}
                </TableCell>
                <TableCell className="text-right text-destructive">
                  −{formatoEuro.format(retencionIrpf.importeAnual)}
                </TableCell>
              </TableRow>
              <TableRow
                role="button"
                tabIndex={0}
                aria-expanded={ssDesplegada}
                className="cursor-pointer select-none hover:bg-muted/50"
                onClick={() => setSsDesplegada((v) => !v)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSsDesplegada((v) => !v);
                  }
                }}
              >
                <TableCell className="pt-4 font-medium">
                  <span className="inline-flex items-center gap-1">
                    <ChevronRight
                      className={cn("size-4 transition-transform", ssDesplegada && "rotate-90")}
                    />
                    {t("result.seguridadSocial")}
                  </span>
                </TableCell>
                <TableCell className="pt-4 text-right text-destructive">
                  {!ssDesplegada && `−${formatoEuro.format(seguridadSocial.importeMensual)}`}
                </TableCell>
                <TableCell className="pt-4 text-right text-destructive">
                  {!ssDesplegada && `−${formatoEuro.format(seguridadSocial.importeAnual)}`}
                </TableCell>
              </TableRow>
              {ssDesplegada && (
                <>
                  <TableRow>
                    <TableCell className="pl-4">
                      —{" "}
                      <EtiquetaConTooltip
                        texto={t("result.ssContingenciasComunes")}
                        explicacion={t("result.ssContingenciasComunesTooltip")}
                      />
                    </TableCell>
                    <TableCell className="text-right text-destructive">
                      −{formatoEuro.format(seguridadSocial.desglose.contingenciasComunes)}
                    </TableCell>
                    <TableCell className="text-right text-destructive">
                      −{formatoEuro.format(seguridadSocial.desglose.contingenciasComunes * resultado.numeroPagas)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-4">— {t("result.ssDesempleo")}</TableCell>
                    <TableCell className="text-right text-destructive">
                      −{formatoEuro.format(seguridadSocial.desglose.desempleo)}
                    </TableCell>
                    <TableCell className="text-right text-destructive">
                      −{formatoEuro.format(seguridadSocial.desglose.desempleo * resultado.numeroPagas)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-4">— {t("result.ssFormacionProfesional")}</TableCell>
                    <TableCell className="text-right text-destructive">
                      −{formatoEuro.format(seguridadSocial.desglose.formacionProfesional)}
                    </TableCell>
                    <TableCell className="text-right text-destructive">
                      −{formatoEuro.format(seguridadSocial.desglose.formacionProfesional * resultado.numeroPagas)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-4">
                      — <EtiquetaConTooltip texto={t("result.ssMei")} explicacion={t("result.ssMeiTooltip")} />
                    </TableCell>
                    <TableCell className="text-right text-destructive">
                      −{formatoEuro.format(seguridadSocial.desglose.mei)}
                    </TableCell>
                    <TableCell className="text-right text-destructive">
                      −{formatoEuro.format(seguridadSocial.desglose.mei * resultado.numeroPagas)}
                    </TableCell>
                  </TableRow>
                </>
              )}
              <TableRow className="font-semibold">
                <TableCell>{t("result.salarioNeto")}</TableCell>
                <TableCell className="text-right">{formatoEuro.format(resultado.salarioNetoMensual)}</TableCell>
                <TableCell className="text-right">{formatoEuro.format(resultado.salarioNetoAnual)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <p className="text-muted-foreground text-xs">{t("result.disclaimer")}</p>
      {resultado.territorio === "estado" && (
        <p className="text-muted-foreground text-xs">{t("result.disclaimerEstado")}</p>
      )}
    </div>
  );
}
