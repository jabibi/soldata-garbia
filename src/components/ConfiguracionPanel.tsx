import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { doc, onSnapshot } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/firebase";
import { actualizarConfiguracionCalculo } from "@/lib/config";
import { CONFIGURACION_DEFECTO } from "@/lib/configuracionDefecto";
import { useAuth } from "@/context/AuthContext";
import type {
  ConfiguracionCalculo,
  SeguridadSocialConfig,
  TramoMinoracionDoc,
  TramoRetencionDoc,
} from "@/lib/types";

const COLUMNAS_DESCENDIENTES = [0, 1, 2, 3, 4, 5] as const;

function numeroSeguro(valor: string): number {
  const n = Number(valor);
  return Number.isFinite(n) ? n : 0;
}

function actualizarEnIndice<T>(lista: T[], indice: number, siguiente: T): T[] {
  return lista.map((item, i) => (i === indice ? siguiente : item));
}

export function ConfiguracionPanel() {
  const { t } = useTranslation();
  const { isAdmin } = useAuth();
  const [configuracion, setConfiguracion] = useState<ConfiguracionCalculo>(CONFIGURACION_DEFECTO);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guardadoOk, setGuardadoOk] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;

    return onSnapshot(doc(db, "configuracion", "parametros"), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setConfiguracion({
          tablaRetencionIrpf: data.tablaRetencionIrpf,
          tablaMinoracionDiscapacidad: data.tablaMinoracionDiscapacidad,
          seguridadSocial: data.seguridadSocial,
        });
      } else {
        setConfiguracion(CONFIGURACION_DEFECTO);
      }
    });
  }, [isAdmin]);

  if (!isAdmin) return null;

  function actualizarSS(campo: keyof SeguridadSocialConfig, valor: string) {
    setConfiguracion((c) => ({ ...c, seguridadSocial: { ...c.seguridadSocial, [campo]: numeroSeguro(valor) } }));
  }

  function actualizarTramoIrpf(indice: number, siguiente: TramoRetencionDoc) {
    setConfiguracion((c) => ({
      ...c,
      tablaRetencionIrpf: actualizarEnIndice(c.tablaRetencionIrpf, indice, siguiente),
    }));
  }

  function actualizarPorcentajeIrpf(indice: number, columna: number, valor: string) {
    const tramo = configuracion.tablaRetencionIrpf[indice];
    const porcentajes = [...tramo.porcentajes] as TramoRetencionDoc["porcentajes"];
    porcentajes[columna] = numeroSeguro(valor);
    actualizarTramoIrpf(indice, { ...tramo, porcentajes });
  }

  function agregarTramoIrpf() {
    setConfiguracion((c) => {
      const tabla = c.tablaRetencionIrpf;
      const anterior = tabla.length >= 2 ? tabla[tabla.length - 2].hasta ?? 0 : 0;
      const nuevoTramo: TramoRetencionDoc = { hasta: anterior + 1000, porcentajes: [0, 0, 0, 0, 0, 0, 0] };
      return { ...c, tablaRetencionIrpf: [...tabla.slice(0, -1), nuevoTramo, tabla[tabla.length - 1]] };
    });
  }

  function eliminarTramoIrpf(indice: number) {
    setConfiguracion((c) => ({
      ...c,
      tablaRetencionIrpf: c.tablaRetencionIrpf.filter((_, i) => i !== indice),
    }));
  }

  function actualizarTramoMinoracion(indice: number, siguiente: TramoMinoracionDoc) {
    setConfiguracion((c) => ({
      ...c,
      tablaMinoracionDiscapacidad: actualizarEnIndice(c.tablaMinoracionDiscapacidad, indice, siguiente),
    }));
  }

  function agregarTramoMinoracion() {
    setConfiguracion((c) => {
      const tabla = c.tablaMinoracionDiscapacidad;
      const anterior = tabla.length >= 2 ? tabla[tabla.length - 2].hasta ?? 0 : 0;
      const nuevoTramo: TramoMinoracionDoc = { hasta: anterior + 1000, a: 0, bc: 0 };
      return { ...c, tablaMinoracionDiscapacidad: [...tabla.slice(0, -1), nuevoTramo, tabla[tabla.length - 1]] };
    });
  }

  function eliminarTramoMinoracion(indice: number) {
    setConfiguracion((c) => ({
      ...c,
      tablaMinoracionDiscapacidad: c.tablaMinoracionDiscapacidad.filter((_, i) => i !== indice),
    }));
  }

  function restaurarPorDefecto() {
    setConfiguracion(CONFIGURACION_DEFECTO);
    setGuardadoOk(false);
    setError(null);
  }

  async function guardar() {
    setGuardando(true);
    setError(null);
    setGuardadoOk(false);
    try {
      await actualizarConfiguracionCalculo(configuracion);
      setGuardadoOk(true);
    } catch (e) {
      console.error(e);
      setError(t("configuracion.error"));
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("configuracion.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <section className="space-y-3">
          <h3 className="text-sm font-medium">{t("configuracion.ssTitle")}</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <Label htmlFor="ssBaseMaxima">{t("configuracion.ssBaseMaxima")}</Label>
              <Input
                id="ssBaseMaxima"
                type="number"
                value={configuracion.seguridadSocial.baseMaximaMensual}
                onChange={(e) => actualizarSS("baseMaximaMensual", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ssContingenciasComunes">{t("configuracion.ssContingenciasComunes")}</Label>
              <Input
                id="ssContingenciasComunes"
                type="number"
                value={configuracion.seguridadSocial.contingenciasComunes}
                onChange={(e) => actualizarSS("contingenciasComunes", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ssDesempleoIndefinido">{t("configuracion.ssDesempleoIndefinido")}</Label>
              <Input
                id="ssDesempleoIndefinido"
                type="number"
                value={configuracion.seguridadSocial.desempleoIndefinido}
                onChange={(e) => actualizarSS("desempleoIndefinido", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ssDesempleoTemporal">{t("configuracion.ssDesempleoTemporal")}</Label>
              <Input
                id="ssDesempleoTemporal"
                type="number"
                value={configuracion.seguridadSocial.desempleoTemporal}
                onChange={(e) => actualizarSS("desempleoTemporal", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ssFormacionProfesional">{t("configuracion.ssFormacionProfesional")}</Label>
              <Input
                id="ssFormacionProfesional"
                type="number"
                value={configuracion.seguridadSocial.formacionProfesional}
                onChange={(e) => actualizarSS("formacionProfesional", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ssMei">{t("configuracion.ssMei")}</Label>
              <Input
                id="ssMei"
                type="number"
                value={configuracion.seguridadSocial.mei}
                onChange={(e) => actualizarSS("mei", e.target.value)}
              />
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-3">
          <h3 className="text-sm font-medium">{t("configuracion.irpfTitle")}</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("configuracion.irpfHasta")}</TableHead>
                {COLUMNAS_DESCENDIENTES.map((n) => (
                  <TableHead key={n} className="text-right">
                    {n}
                  </TableHead>
                ))}
                <TableHead className="text-right">{t("form.masDeCinco")}</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {configuracion.tablaRetencionIrpf.map((tramo, indice) => {
                const esUltimo = indice === configuracion.tablaRetencionIrpf.length - 1;
                return (
                  <TableRow key={indice}>
                    <TableCell>
                      {esUltimo ? (
                        <span className="text-muted-foreground text-xs">{t("configuracion.sinLimite")}</span>
                      ) : (
                        <Input
                          type="number"
                          className="w-28"
                          value={tramo.hasta ?? ""}
                          onChange={(e) => actualizarTramoIrpf(indice, { ...tramo, hasta: numeroSeguro(e.target.value) })}
                        />
                      )}
                    </TableCell>
                    {tramo.porcentajes.map((valor, columna) => (
                      <TableCell key={columna}>
                        <Input
                          type="number"
                          className="w-16"
                          value={valor}
                          onChange={(e) => actualizarPorcentajeIrpf(indice, columna, e.target.value)}
                        />
                      </TableCell>
                    ))}
                    <TableCell>
                      {!esUltimo && (
                        <Button type="button" size="sm" variant="outline" onClick={() => eliminarTramoIrpf(indice)}>
                          {t("configuracion.eliminarTramo")}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Button type="button" size="sm" variant="outline" onClick={agregarTramoIrpf}>
            {t("configuracion.agregarTramo")}
          </Button>
        </section>

        <Separator />

        <section className="space-y-3">
          <h3 className="text-sm font-medium">{t("configuracion.minoracionTitle")}</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("configuracion.irpfHasta")}</TableHead>
                <TableHead className="text-right">{t("configuracion.minoracionPuntosA")}</TableHead>
                <TableHead className="text-right">{t("configuracion.minoracionPuntosBc")}</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {configuracion.tablaMinoracionDiscapacidad.map((tramo, indice) => {
                const esUltimo = indice === configuracion.tablaMinoracionDiscapacidad.length - 1;
                return (
                  <TableRow key={indice}>
                    <TableCell>
                      {esUltimo ? (
                        <span className="text-muted-foreground text-xs">{t("configuracion.sinLimite")}</span>
                      ) : (
                        <Input
                          type="number"
                          className="w-28"
                          value={tramo.hasta ?? ""}
                          onChange={(e) =>
                            actualizarTramoMinoracion(indice, { ...tramo, hasta: numeroSeguro(e.target.value) })
                          }
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        className="w-20"
                        value={tramo.a}
                        onChange={(e) => actualizarTramoMinoracion(indice, { ...tramo, a: numeroSeguro(e.target.value) })}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        className="w-20"
                        value={tramo.bc}
                        onChange={(e) => actualizarTramoMinoracion(indice, { ...tramo, bc: numeroSeguro(e.target.value) })}
                      />
                    </TableCell>
                    <TableCell>
                      {!esUltimo && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => eliminarTramoMinoracion(indice)}
                        >
                          {t("configuracion.eliminarTramo")}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Button type="button" size="sm" variant="outline" onClick={agregarTramoMinoracion}>
            {t("configuracion.agregarTramo")}
          </Button>
        </section>

        {error && <p className="text-destructive text-sm">{error}</p>}
        {guardadoOk && <p className="text-sm text-muted-foreground">{t("configuracion.guardadoOk")}</p>}

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={restaurarPorDefecto} disabled={guardando}>
            {t("configuracion.restaurar")}
          </Button>
          <Button type="button" onClick={guardar} disabled={guardando}>
            {guardando ? t("configuracion.guardando") : t("configuracion.guardar")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
