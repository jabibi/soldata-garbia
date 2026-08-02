import { CalculoNominaInput, CalculoNominaResultado } from "./types";
import { calcularTipoRetencionAlava } from "./retencionAlava";
import { calcularCotizacionSSMensual } from "./seguridadSocial";

/**
 * Calcula el desglose de nómina bruto -> neto para el Territorio Histórico
 * de Álava.
 *
 * Simplificación asumida (igual que la mayoría de calculadoras de sueldo
 * neto públicas, p.ej. la del Santander): el bruto anual se divide a partes
 * iguales entre el número de pagas, y tanto el tipo de retención del IRPF
 * como la cotización a la Seguridad Social se aplican por igual a cada
 * pago (ordinario o paga extra). En una nómina real la Seguridad Social se
 * calcula paga a paga con su propio tope mensual, lo que puede introducir
 * pequeñas diferencias si las pagas extra se cobran de forma no uniforme.
 */
export function calcularNomina(input: CalculoNominaInput): CalculoNominaResultado {
  const { salarioBrutoAnual, numeroPagas, numeroDescendientes, tipoContrato, gradoDiscapacidad } = input;

  const salarioBrutoMensual = salarioBrutoAnual / numeroPagas;

  const retencion = calcularTipoRetencionAlava(salarioBrutoAnual, numeroDescendientes, gradoDiscapacidad);
  const irpfImporteMensual = salarioBrutoMensual * (retencion.tipoAplicado / 100);
  const irpfImporteAnual = irpfImporteMensual * numeroPagas;

  const ss = calcularCotizacionSSMensual(salarioBrutoMensual, tipoContrato);
  const ssImporteAnual = ss.importeMensual * numeroPagas;

  const salarioNetoMensual = salarioBrutoMensual - irpfImporteMensual - ss.importeMensual;
  const salarioNetoAnual = salarioNetoMensual * numeroPagas;

  return {
    salarioBrutoAnual,
    salarioBrutoMensual,
    numeroPagas,
    retencionIrpf: {
      tipoAplicado: retencion.tipoAplicado,
      tipoTablaGeneral: retencion.tipoTablaGeneral,
      puntosMinoracionDiscapacidad: retencion.puntosMinoracionDiscapacidad,
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
