import { GradoDiscapacidad } from "./types";

/**
 * Tabla general de porcentajes de retención del IRPF sobre rendimientos del
 * trabajo, Territorio Histórico de Álava.
 *
 * Fuente: Decreto Foral 42/2025, de 23 de diciembre, del Consejo de Gobierno
 * Foral de Álava (BOTHA nº 147, 29-dic-2025, expediente 2025-03919), que
 * modifica el art. 84.1 del Reglamento del IRPF (Decreto Foral 40/2014).
 * Aplicable a las retribuciones percibidas desde el 1-1-2026.
 *
 * Cada fila: tramo de retribución anual íntegra (euros) y el porcentaje de
 * retención según el número de descendientes a cargo (columnas 0..5, y "más
 * de 5" en el índice 6).
 */
export interface TramoRetencion {
  desde: number;
  hasta: number; // Infinity para el último tramo
  porcentajes: [number, number, number, number, number, number, number];
}

export const TABLA_RETENCION_ALAVA_2026: TramoRetencion[] = [
  { desde: 0, hasta: 20000.0, porcentajes: [0, 0, 0, 0, 0, 0, 0] },
  { desde: 20000.01, hasta: 20510.0, porcentajes: [7, 5, 3, 0, 0, 0, 0] },
  { desde: 20510.01, hasta: 21300.0, porcentajes: [8, 6, 4, 1, 0, 0, 0] },
  { desde: 21300.01, hasta: 22150.0, porcentajes: [9, 7, 5, 2, 0, 0, 0] },
  { desde: 22150.01, hasta: 23220.0, porcentajes: [10, 9, 7, 4, 0, 0, 0] },
  { desde: 23220.01, hasta: 24050.0, porcentajes: [11, 10, 8, 5, 1, 0, 0] },
  { desde: 24050.01, hasta: 25410.0, porcentajes: [12, 11, 9, 6, 3, 0, 0] },
  { desde: 25410.01, hasta: 27440.0, porcentajes: [13, 12, 10, 7, 4, 0, 0] },
  { desde: 27440.01, hasta: 29790.0, porcentajes: [14, 13, 11, 9, 6, 2, 0] },
  { desde: 29790.01, hasta: 32610.0, porcentajes: [15, 14, 13, 10, 8, 4, 0] },
  { desde: 32610.01, hasta: 36350.0, porcentajes: [16, 15, 14, 12, 9, 6, 0] },
  { desde: 36350.01, hasta: 40670.0, porcentajes: [17, 16, 15, 13, 11, 8, 0] },
  { desde: 40670.01, hasta: 44560.0, porcentajes: [18, 17, 16, 15, 13, 10, 2] },
  { desde: 44560.01, hasta: 48060.0, porcentajes: [19, 18, 17, 16, 14, 12, 4] },
  { desde: 48060.01, hasta: 52020.0, porcentajes: [20, 19, 18, 17, 15, 13, 7] },
  { desde: 52020.01, hasta: 56780.0, porcentajes: [21, 20, 20, 18, 17, 15, 9] },
  { desde: 56780.01, hasta: 61820.0, porcentajes: [22, 21, 21, 20, 18, 16, 11] },
  { desde: 61820.01, hasta: 65710.0, porcentajes: [23, 22, 22, 21, 19, 18, 12] },
  { desde: 65710.01, hasta: 70080.0, porcentajes: [24, 23, 23, 22, 21, 19, 14] },
  { desde: 70080.01, hasta: 75020.0, porcentajes: [25, 25, 24, 23, 22, 20, 16] },
  { desde: 75020.01, hasta: 80730.0, porcentajes: [26, 26, 25, 24, 23, 22, 17] },
  { desde: 80730.01, hasta: 86770.0, porcentajes: [27, 27, 26, 25, 24, 23, 19] },
  { desde: 86770.01, hasta: 92190.0, porcentajes: [28, 28, 27, 26, 25, 24, 21] },
  { desde: 92190.01, hasta: 98350.0, porcentajes: [29, 29, 28, 27, 27, 25, 22] },
  { desde: 98350.01, hasta: 105380.0, porcentajes: [30, 30, 29, 29, 28, 27, 23] },
  { desde: 105380.01, hasta: 113180.0, porcentajes: [31, 31, 30, 30, 29, 28, 25] },
  { desde: 113180.01, hasta: 122030.0, porcentajes: [32, 32, 31, 31, 30, 29, 26] },
  { desde: 122030.01, hasta: 132200.0, porcentajes: [33, 33, 32, 32, 31, 30, 28] },
  { desde: 132200.01, hasta: 144140.0, porcentajes: [34, 34, 33, 33, 32, 32, 29] },
  { desde: 144140.01, hasta: 157300.0, porcentajes: [35, 35, 34, 34, 33, 33, 31] },
  { desde: 157300.01, hasta: 172280.0, porcentajes: [36, 36, 36, 35, 35, 34, 32] },
  { desde: 172280.01, hasta: 190410.0, porcentajes: [37, 37, 37, 36, 36, 35, 33] },
  { desde: 190410.01, hasta: 212820.0, porcentajes: [38, 38, 38, 37, 37, 36, 35] },
  { desde: 212820.01, hasta: 236060.0, porcentajes: [39, 39, 39, 38, 38, 37, 36] },
  { desde: 236060.01, hasta: Infinity, porcentajes: [40, 40, 40, 39, 39, 39, 37] },
];

/**
 * Escala de puntos de minoración para personas trabajadoras activas con
 * discapacidad (art. 84.4 Reglamento IRPF, según redacción DF 42/2025).
 * "a" = grado 33%-65% sin movilidad reducida.
 * "bc" = grado 33%-65% con movilidad reducida, o grado >= 65%.
 */
export interface TramoMinoracionDiscapacidad {
  desde: number;
  hasta: number;
  a: number;
  bc: number;
}

export const TABLA_MINORACION_DISCAPACIDAD_2026: TramoMinoracionDiscapacidad[] = [
  { desde: 0, hasta: 25410.0, a: 9, bc: 12 },
  { desde: 25410.01, hasta: 32610.0, a: 7, bc: 12 },
  { desde: 32610.01, hasta: 48060.0, a: 6, bc: 10 },
  { desde: 48060.01, hasta: 56780.0, a: 5, bc: 10 },
  { desde: 56780.01, hasta: 80730.0, a: 4, bc: 8 },
  { desde: 80730.01, hasta: 122030.0, a: 3, bc: 6 },
  { desde: 122030.01, hasta: 190410.0, a: 2, bc: 5 },
  { desde: 190410.01, hasta: Infinity, a: 1, bc: 3 },
];

function indiceColumnaDescendientes(numeroDescendientes: number): number {
  const n = Math.max(0, Math.floor(numeroDescendientes));
  return Math.min(n, 6);
}

function buscarTramo<T extends { desde: number; hasta: number }>(
  tabla: T[],
  importe: number,
): T {
  const tramo = tabla.find((t) => importe >= t.desde && importe <= t.hasta);
  // El último tramo cubre hasta Infinity, así que siempre hay coincidencia
  // para importes >= 0.
  return tramo ?? tabla[tabla.length - 1];
}

function puntosMinoracionDiscapacidad(
  gradoDiscapacidad: GradoDiscapacidad,
  rendimientoAnual: number,
  tablaMinoracion: TramoMinoracionDiscapacidad[],
): number {
  if (gradoDiscapacidad === "ninguno") return 0;
  const tramo = buscarTramo(tablaMinoracion, rendimientoAnual);
  return gradoDiscapacidad === "33_65_sin_movilidad" ? tramo.a : tramo.bc;
}

export interface ResultadoTipoRetencion {
  tipoTablaGeneral: number;
  puntosMinoracionDiscapacidad: number;
  tipoAplicado: number;
}

/**
 * Calcula el tipo de retención del IRPF aplicable en Álava para un
 * rendimiento anual del trabajo dado, según la tabla general de porcentajes
 * y, si procede, la minoración por discapacidad de la persona trabajadora
 * activa. El tipo aplicado nunca es inferior a 0.
 *
 * `tablaRetencion`/`tablaMinoracion` se reciben como parámetro (en vez de
 * usar las constantes de este módulo directamente) para que puedan venir de
 * la configuración editable en Firestore; ver `domain/configuracion.ts`.
 */
export function calcularTipoRetencionAlava(
  rendimientoAnual: number,
  numeroDescendientes: number,
  gradoDiscapacidad: GradoDiscapacidad,
  tablaRetencion: TramoRetencion[],
  tablaMinoracion: TramoMinoracionDiscapacidad[],
): ResultadoTipoRetencion {
  const columna = indiceColumnaDescendientes(numeroDescendientes);
  const tramo = buscarTramo(tablaRetencion, rendimientoAnual);
  const tipoTablaGeneral = tramo.porcentajes[columna];
  const puntos = puntosMinoracionDiscapacidad(gradoDiscapacidad, rendimientoAnual, tablaMinoracion);
  const tipoAplicado = Math.max(0, tipoTablaGeneral - puntos);
  return {
    tipoTablaGeneral,
    puntosMinoracionDiscapacidad: puntos,
    tipoAplicado,
  };
}
