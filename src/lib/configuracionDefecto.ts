import type { ConfiguracionCalculo, ConfiguracionTerritorio } from "./types";

/**
 * Copia de los valores por defecto de fábrica, usada para precargar el
 * editor de configuración antes de que exista el documento
 * `configuracion/parametros` en Firestore. Duplicado a mano de
 * `CONFIGURACION_DEFECTO` en `functions/src/domain/configuracion.ts` — ver
 * ese archivo (y `functions/src/domain/retencionIrpf.ts`) para las citas
 * legales completas de cada territorio.
 */

const TABLA_RETENCION_ARABA_BIZKAIA_GIPUZKOA_2026: ConfiguracionTerritorio["tablaRetencionIrpf"] = [
  { hasta: 20000.0, porcentajes: [0, 0, 0, 0, 0, 0, 0] },
  { hasta: 20510.0, porcentajes: [7, 5, 3, 0, 0, 0, 0] },
  { hasta: 21300.0, porcentajes: [8, 6, 4, 1, 0, 0, 0] },
  { hasta: 22150.0, porcentajes: [9, 7, 5, 2, 0, 0, 0] },
  { hasta: 23220.0, porcentajes: [10, 9, 7, 4, 0, 0, 0] },
  { hasta: 24050.0, porcentajes: [11, 10, 8, 5, 1, 0, 0] },
  { hasta: 25410.0, porcentajes: [12, 11, 9, 6, 3, 0, 0] },
  { hasta: 27440.0, porcentajes: [13, 12, 10, 7, 4, 0, 0] },
  { hasta: 29790.0, porcentajes: [14, 13, 11, 9, 6, 2, 0] },
  { hasta: 32610.0, porcentajes: [15, 14, 13, 10, 8, 4, 0] },
  { hasta: 36350.0, porcentajes: [16, 15, 14, 12, 9, 6, 0] },
  { hasta: 40670.0, porcentajes: [17, 16, 15, 13, 11, 8, 0] },
  { hasta: 44560.0, porcentajes: [18, 17, 16, 15, 13, 10, 2] },
  { hasta: 48060.0, porcentajes: [19, 18, 17, 16, 14, 12, 4] },
  { hasta: 52020.0, porcentajes: [20, 19, 18, 17, 15, 13, 7] },
  { hasta: 56780.0, porcentajes: [21, 20, 20, 18, 17, 15, 9] },
  { hasta: 61820.0, porcentajes: [22, 21, 21, 20, 18, 16, 11] },
  { hasta: 65710.0, porcentajes: [23, 22, 22, 21, 19, 18, 12] },
  { hasta: 70080.0, porcentajes: [24, 23, 23, 22, 21, 19, 14] },
  { hasta: 75020.0, porcentajes: [25, 25, 24, 23, 22, 20, 16] },
  { hasta: 80730.0, porcentajes: [26, 26, 25, 24, 23, 22, 17] },
  { hasta: 86770.0, porcentajes: [27, 27, 26, 25, 24, 23, 19] },
  { hasta: 92190.0, porcentajes: [28, 28, 27, 26, 25, 24, 21] },
  { hasta: 98350.0, porcentajes: [29, 29, 28, 27, 27, 25, 22] },
  { hasta: 105380.0, porcentajes: [30, 30, 29, 29, 28, 27, 23] },
  { hasta: 113180.0, porcentajes: [31, 31, 30, 30, 29, 28, 25] },
  { hasta: 122030.0, porcentajes: [32, 32, 31, 31, 30, 29, 26] },
  { hasta: 132200.0, porcentajes: [33, 33, 32, 32, 31, 30, 28] },
  { hasta: 144140.0, porcentajes: [34, 34, 33, 33, 32, 32, 29] },
  { hasta: 157300.0, porcentajes: [35, 35, 34, 34, 33, 33, 31] },
  { hasta: 172280.0, porcentajes: [36, 36, 36, 35, 35, 34, 32] },
  { hasta: 190410.0, porcentajes: [37, 37, 37, 36, 36, 35, 33] },
  { hasta: 212820.0, porcentajes: [38, 38, 38, 37, 37, 36, 35] },
  { hasta: 236060.0, porcentajes: [39, 39, 39, 38, 38, 37, 36] },
  { hasta: null, porcentajes: [40, 40, 40, 39, 39, 39, 37] },
];

const TABLA_MINORACION_ARABA_BIZKAIA_GIPUZKOA_2026: ConfiguracionTerritorio["tablaMinoracionDiscapacidad"] = [
  { hasta: 25410.0, a: 9, bc: 12 },
  { hasta: 32610.0, a: 7, bc: 12 },
  { hasta: 48060.0, a: 6, bc: 10 },
  { hasta: 56780.0, a: 5, bc: 10 },
  { hasta: 80730.0, a: 4, bc: 8 },
  { hasta: 122030.0, a: 3, bc: 6 },
  { hasta: 190410.0, a: 2, bc: 5 },
  { hasta: null, a: 1, bc: 3 },
];

const TABLA_RETENCION_NAFARROA_2026: ConfiguracionTerritorio["tablaRetencionIrpf"] = [
  { hasta: 17000.0, porcentajes: [0, 0, 0, 0, 0, 0, 0] },
  { hasta: 18500.0, porcentajes: [2, 1, 0, 0, 0, 0, 0] },
  { hasta: 19750.0, porcentajes: [4, 3, 2, 0, 0, 0, 0] },
  { hasta: 21250.0, porcentajes: [6, 5, 4, 2, 0, 0, 0] },
  { hasta: 23250.0, porcentajes: [8.5, 7.5, 6.5, 4.5, 2.5, 0, 0] },
  { hasta: 25250.0, porcentajes: [11, 10, 9, 7, 5, 2.5, 0] },
  { hasta: 27500.0, porcentajes: [13.3, 12, 11.3, 8.5, 7.5, 5.5, 3.4] },
  { hasta: 30250.0, porcentajes: [14.6, 13.3, 12.6, 9.9, 9.2, 7.8, 5.8] },
  { hasta: 32250.0, porcentajes: [15.8, 14.5, 13.7, 12.4, 10.7, 8.9, 7.9] },
  { hasta: 35750.0, porcentajes: [17, 16, 15, 13.6, 12.5, 10.8, 10] },
  { hasta: 41250.0, porcentajes: [18.1, 17.1, 16.5, 14.7, 14.0, 13.3, 12.2] },
  { hasta: 48000.0, porcentajes: [20.0, 19.0, 18.3, 16.9, 16.2, 15.5, 13.7] },
  { hasta: 55000.0, porcentajes: [22.1, 21.5, 20.9, 18.9, 18.3, 17.7, 16.6] },
  { hasta: 62000.0, porcentajes: [24.1, 23.5, 23.0, 22.0, 21.5, 20.9, 19.8] },
  { hasta: 69250.0, porcentajes: [26.1, 25.5, 24.5, 24.0, 23.5, 22.9, 21.9] },
  { hasta: 75250.0, porcentajes: [28.3, 27.7, 27.0, 26.6, 25.5, 25.0, 24.4] },
  { hasta: 82250.0, porcentajes: [29.6, 29.2, 28.3, 27.3, 27.2, 26.2, 26.1] },
  { hasta: 94750.0, porcentajes: [30.8, 30.5, 30.0, 29.4, 29.0, 28.3, 27.7] },
  { hasta: 107250.0, porcentajes: [32.2, 31.7, 31.2, 30.8, 30.4, 30.0, 29.5] },
  { hasta: 120000.0, porcentajes: [33.5, 33.0, 32.6, 32.3, 32.0, 31.5, 31.0] },
  { hasta: 132750.0, porcentajes: [35.1, 34.8, 34.6, 34.0, 33.5, 32.9, 32.4] },
  { hasta: 146000.0, porcentajes: [36.2, 36.0, 35.8, 35.0, 34.5, 33.9, 33.4] },
  { hasta: 200000.0, porcentajes: [38.0, 37.5, 37.0, 36.5, 35.5, 34.9, 34.4] },
  { hasta: 280000.0, porcentajes: [40.0, 39.8, 39.4, 39.0, 38.5, 38.0, 37.5] },
  { hasta: 350000.0, porcentajes: [42.0, 41.5, 41.2, 40.8, 40.0, 39.5, 39.0] },
  { hasta: null, porcentajes: [43.0, 42.9, 42.8, 42.5, 41.5, 41.0, 40.5] },
];

const TABLA_MINORACION_NAFARROA_2026: ConfiguracionTerritorio["tablaMinoracionDiscapacidad"] = [
  { hasta: 23250.0, a: 5, bc: 15 },
  { hasta: 41250.0, a: 3, bc: 15 },
  { hasta: 94750.0, a: 2, bc: 8 },
  { hasta: null, a: 2, bc: 5 },
];

export const CONFIGURACION_DEFECTO: ConfiguracionCalculo = {
  territorios: {
    araba: {
      tablaRetencionIrpf: TABLA_RETENCION_ARABA_BIZKAIA_GIPUZKOA_2026,
      tablaMinoracionDiscapacidad: TABLA_MINORACION_ARABA_BIZKAIA_GIPUZKOA_2026,
    },
    bizkaia: {
      tablaRetencionIrpf: TABLA_RETENCION_ARABA_BIZKAIA_GIPUZKOA_2026,
      tablaMinoracionDiscapacidad: TABLA_MINORACION_ARABA_BIZKAIA_GIPUZKOA_2026,
    },
    gipuzkoa: {
      tablaRetencionIrpf: TABLA_RETENCION_ARABA_BIZKAIA_GIPUZKOA_2026,
      tablaMinoracionDiscapacidad: TABLA_MINORACION_ARABA_BIZKAIA_GIPUZKOA_2026,
    },
    nafarroa: {
      tablaRetencionIrpf: TABLA_RETENCION_NAFARROA_2026,
      tablaMinoracionDiscapacidad: TABLA_MINORACION_NAFARROA_2026,
    },
  },
  seguridadSocial: {
    baseMaximaMensual: 5101.2,
    contingenciasComunes: 4.7,
    desempleoIndefinido: 1.55,
    desempleoTemporal: 1.6,
    formacionProfesional: 0.1,
    mei: 0.15,
  },
};
