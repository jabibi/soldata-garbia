import { TipoContrato } from "./types";

/**
 * Tipos de cotización a la Seguridad Social (Régimen General, cuenta ajena,
 * contrato ordinario) vigentes desde el 1-1-2026.
 *
 * Fuente: Orden PJC/297/2026, de 30 de marzo, por la que se desarrollan las
 * normas legales de cotización a la Seguridad Social, desempleo, protección
 * por cese de actividad, FOGASA y formación profesional para 2026
 * (BOE núm. 79, 31-3-2026).
 */
export const SS_2026 = {
  baseMaximaMensual: 5101.2, // art. 2.1
  contingenciasComunes: {
    trabajador: 0.047, // 4,70%
  },
  desempleo: {
    indefinido: { trabajador: 0.0155 }, // 1,55% — art. 33.2.a).1º
    temporal: { trabajador: 0.016 }, // 1,60% — art. 33.2.a).2º
  },
  formacionProfesional: {
    trabajador: 0.001, // 0,10%
  },
  mei: {
    trabajador: 0.0015, // 0,15% — Mecanismo de Equidad Intergeneracional
  },
};

export interface ResultadoCotizacionSS {
  baseCotizacionMensual: number;
  tipoAplicado: number;
  importeMensual: number;
  desglose: {
    contingenciasComunes: number;
    desempleo: number;
    formacionProfesional: number;
    mei: number;
  };
}

/**
 * Calcula la cotización a la Seguridad Social a cargo de la persona
 * trabajadora sobre una retribución bruta mensual (nómina ordinaria o paga
 * extra), aplicando el tope máximo de cotización mensual.
 */
export function calcularCotizacionSSMensual(
  brutoMensual: number,
  tipoContrato: TipoContrato,
): ResultadoCotizacionSS {
  const baseCotizacionMensual = Math.min(brutoMensual, SS_2026.baseMaximaMensual);

  const tipoDesempleo =
    tipoContrato === "indefinido"
      ? SS_2026.desempleo.indefinido.trabajador
      : SS_2026.desempleo.temporal.trabajador;

  const contingenciasComunes = baseCotizacionMensual * SS_2026.contingenciasComunes.trabajador;
  const desempleo = baseCotizacionMensual * tipoDesempleo;
  const formacionProfesional = baseCotizacionMensual * SS_2026.formacionProfesional.trabajador;
  const mei = baseCotizacionMensual * SS_2026.mei.trabajador;

  const importeMensual = contingenciasComunes + desempleo + formacionProfesional + mei;
  const tipoAplicado =
    SS_2026.contingenciasComunes.trabajador + tipoDesempleo + SS_2026.formacionProfesional.trabajador + SS_2026.mei.trabajador;

  return {
    baseCotizacionMensual,
    tipoAplicado: tipoAplicado * 100,
    importeMensual,
    desglose: {
      contingenciasComunes,
      desempleo,
      formacionProfesional,
      mei,
    },
  };
}
