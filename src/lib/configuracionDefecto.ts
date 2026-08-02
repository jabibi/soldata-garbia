import type { ConfiguracionCalculo } from "./types";

/**
 * Copia de los valores por defecto de fábrica (Decreto Foral 42/2025 /
 * Orden PJC/297/2026), usada para precargar el editor de configuración
 * antes de que exista el documento `configuracion/parametros` en Firestore.
 * Duplicado a mano de `CONFIGURACION_DEFECTO` en
 * `functions/src/domain/configuracion.ts`.
 */
export const CONFIGURACION_DEFECTO: ConfiguracionCalculo = {
  tablaRetencionIrpf: [
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
  ],
  tablaMinoracionDiscapacidad: [
    { hasta: 25410.0, a: 9, bc: 12 },
    { hasta: 32610.0, a: 7, bc: 12 },
    { hasta: 48060.0, a: 6, bc: 10 },
    { hasta: 56780.0, a: 5, bc: 10 },
    { hasta: 80730.0, a: 4, bc: 8 },
    { hasta: 122030.0, a: 3, bc: 6 },
    { hasta: 190410.0, a: 2, bc: 5 },
    { hasta: null, a: 1, bc: 3 },
  ],
  seguridadSocial: {
    baseMaximaMensual: 5101.2,
    contingenciasComunes: 4.7,
    desempleoIndefinido: 1.55,
    desempleoTemporal: 1.6,
    formacionProfesional: 0.1,
    mei: 0.15,
  },
};
