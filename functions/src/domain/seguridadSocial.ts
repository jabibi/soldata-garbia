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

/** Tasas a cargo de la persona trabajadora, como fracciones (0.047 = 4,7%). */
export interface SeguridadSocialTasas {
  baseMaximaMensual: number;
  contingenciasComunes: number;
  desempleoIndefinido: number;
  desempleoTemporal: number;
  formacionProfesional: number;
  mei: number;
}

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
 *
 * `tasas` se recibe como parámetro (en vez de usar `SS_2026` directamente)
 * para que pueda venir de la configuración editable en Firestore; ver
 * `domain/configuracion.ts`.
 */
export function calcularCotizacionSSMensual(
  brutoMensual: number,
  tipoContrato: TipoContrato,
  tasas: SeguridadSocialTasas,
): ResultadoCotizacionSS {
  const baseCotizacionMensual = Math.min(brutoMensual, tasas.baseMaximaMensual);

  const tipoDesempleo = tipoContrato === "indefinido" ? tasas.desempleoIndefinido : tasas.desempleoTemporal;

  const contingenciasComunes = baseCotizacionMensual * tasas.contingenciasComunes;
  const desempleo = baseCotizacionMensual * tipoDesempleo;
  const formacionProfesional = baseCotizacionMensual * tasas.formacionProfesional;
  const mei = baseCotizacionMensual * tasas.mei;

  const importeMensual = contingenciasComunes + desempleo + formacionProfesional + mei;
  const tipoAplicado = tasas.contingenciasComunes + tipoDesempleo + tasas.formacionProfesional + tasas.mei;

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
