import { CalculoNominaInput, CalculoNominaResultado, TerritorioConTabla } from "./types";
import { calcularTipoRetencion, TramoRetencion, TramoMinoracionDiscapacidad } from "./retencionIrpf";
import { calcularTipoRetencionEstado } from "./retencionEstado";
import { calcularCotizacionSSMensual, SeguridadSocialTasas } from "./seguridadSocial";

/** Tablas de retención IRPF y minoración por discapacidad ya resueltas de un territorio foral. */
export interface ConfiguracionTerritorioResuelta {
  tablaRetencionIrpf: TramoRetencion[];
  tablaMinoracionDiscapacidad: TramoMinoracionDiscapacidad[];
}

/**
 * Configuración de cálculo ya resuelta a la forma interna que usan las
 * funciones de dominio (tramos con `hasta: Infinity` en vez de `null`, tasas
 * de Seguridad Social como fracciones). Se obtiene a partir de
 * `ConfiguracionCalculo` (la forma serializable en Firestore) mediante
 * `resolverConfiguracion`, ver `domain/configuracion.ts`. Solo cubre los
 * territorios forales con tabla; "estado" se calcula aparte con un algoritmo.
 */
export interface ConfiguracionResuelta {
  territorios: Record<TerritorioConTabla, ConfiguracionTerritorioResuelta>;
  seguridadSocial: SeguridadSocialTasas;
}

/**
 * Calcula el desglose de nómina bruto -> neto para el territorio elegido.
 *
 * Simplificación asumida (igual que la mayoría de calculadoras de sueldo
 * neto públicas, p.ej. la del Santander): el bruto anual se divide a partes
 * iguales entre el número de pagas, y tanto el tipo de retención del IRPF
 * como la cotización a la Seguridad Social se aplican por igual a cada
 * pago (ordinario o paga extra). En una nómina real la Seguridad Social se
 * calcula paga a paga con su propio tope mensual, lo que puede introducir
 * pequeñas diferencias si las pagas extra se cobran de forma no uniforme.
 *
 * `salarioBrutoAnual` se entiende siempre a jornada completa; `porcentajeJornada`
 * (100 = jornada completa) reduce el salario realmente percibido. Cuando la
 * reducción de jornada dura todo el año (el caso típico de una reducción por
 * cuidado de hijos), la retribución anual prevista a efectos de Hacienda ya
 * es la reducida — por eso el *tipo* de retención (tabla foral o fórmula de
 * "estado") también se calcula sobre el salario real, no sobre el de jornada
 * completa: no aplica aquí la "elevación al año" del art. 82.2 RIRPF, que está
 * pensada para cuando el período retribuido no cubre el año natural completo
 * (p. ej. un contrato de unos pocos meses), no para una intensidad reducida
 * durante todo el año.
 */
export function calcularNomina(
  input: CalculoNominaInput,
  configuracion: ConfiguracionResuelta,
): CalculoNominaResultado {
  const {
    salarioBrutoAnual,
    numeroPagas,
    numeroDescendientes,
    tipoContrato,
    gradoDiscapacidad,
    territorio,
    irpfPorcentajeManual,
    porcentajeJornada,
  } = input;

  const salarioBrutoAnualReal = salarioBrutoAnual * (porcentajeJornada / 100);
  const salarioBrutoMensualReal = salarioBrutoAnualReal / numeroPagas;

  const ss = calcularCotizacionSSMensual(salarioBrutoMensualReal, tipoContrato, configuracion.seguridadSocial);
  const ssImporteAnual = ss.importeMensual * numeroPagas;

  let tipoTablaGeneral: number;
  let puntosMinoracionDiscapacidad: number;
  let tipoBase: number;

  if (territorio === "estado") {
    tipoBase = calcularTipoRetencionEstado(
      salarioBrutoAnualReal,
      numeroDescendientes,
      gradoDiscapacidad,
      ssImporteAnual,
    );
    tipoTablaGeneral = tipoBase;
    puntosMinoracionDiscapacidad = 0;
  } else {
    const tablasTerritorio = configuracion.territorios[territorio];
    const retencion = calcularTipoRetencion(
      salarioBrutoAnualReal,
      numeroDescendientes,
      gradoDiscapacidad,
      tablasTerritorio.tablaRetencionIrpf,
      tablasTerritorio.tablaMinoracionDiscapacidad,
    );
    tipoTablaGeneral = retencion.tipoTablaGeneral;
    puntosMinoracionDiscapacidad = retencion.puntosMinoracionDiscapacidad;
    tipoBase = retencion.tipoAplicado;
  }

  const tipoAplicado = irpfPorcentajeManual ?? tipoBase;
  const irpfImporteMensual = salarioBrutoMensualReal * (tipoAplicado / 100);
  const irpfImporteAnual = irpfImporteMensual * numeroPagas;

  const salarioNetoMensual = salarioBrutoMensualReal - irpfImporteMensual - ss.importeMensual;
  const salarioNetoAnual = salarioNetoMensual * numeroPagas;

  return {
    salarioBrutoAnual: salarioBrutoAnualReal,
    salarioBrutoMensual: salarioBrutoMensualReal,
    numeroPagas,
    territorio,
    porcentajeJornada,
    retencionIrpf: {
      tipoAplicado,
      tipoTablaGeneral,
      puntosMinoracionDiscapacidad,
      manual: irpfPorcentajeManual !== null,
      importeMensual: irpfImporteMensual,
      importeAnual: irpfImporteAnual,
    },
    seguridadSocial: {
      tipoAplicado: ss.tipoAplicado,
      baseCotizacionMensual: ss.baseCotizacionMensual,
      importeMensual: ss.importeMensual,
      importeAnual: ssImporteAnual,
      desglose: ss.desglose,
    },
    salarioNetoMensual,
    salarioNetoAnual,
  };
}
